import React from 'react';
import { RootState } from '@kbase/ui-lib/lib/redux/root/store';
import {
    RelationEngineViewLoading,
    RelationEngineViewLoaded,
    RelationEngineViewError,
    RelationEngineID,
    RelationEngineNodeType,
    Navigation,
    ViewType,
    NavigationSome
} from '../../redux/store';
import Loading from '../Loading';
import { Alert } from 'antd';
import Taxonomy from '../landingPages/taxonomy';

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    // view: RelationEngineView;
    navigation: Navigation;
    trigger: number;
    navigate: (relationEngineID: RelationEngineID) => void;
}

interface DispatcherState {}

export class Dispatcher extends React.Component<DispatcherProps, DispatcherState> {
    renderUnauthorized() {
        return <div>Sorry, not authorized. Please log in first.</div>;
    }

    renderRootState() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return '';
            case RootState.HOSTED:
                return '';
            case RootState.DEVELOP:
                return 'develop';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderNavigationNone() {
        return <div>none</div>;
    }

    renderNavigationLoading(view: RelationEngineViewLoading) {
        return <Loading message="Loading view..." />;
    }

    renderNavigationLoaded(view: RelationEngineViewLoaded) {
        // This is currently how we dispatch to the type-specific
        // landing page.
        switch (view.relationEngineNodeType) {
            case RelationEngineNodeType.TAXON:
                return <Taxonomy taxonID={view.relationEngineID} />;
        }
    }

    renderNavigationError(view: RelationEngineViewError) {
        return <Alert type="error" message={`View Error: ${view.message}`} />;
    }

    renderNavigationSome(navigation: NavigationSome) {
        // This is currently how we dispatch to the type-specific
        // landing page.
        switch (navigation.type) {
            case ViewType.TAXONOMY:
                return <Taxonomy taxonID={navigation.relationEngineID} />;
        }
    }

    renderNavigation() {
        switch (this.props.navigation.type) {
            case ViewType.NONE:
                return this.renderNavigationNone();
            default:
                return this.renderNavigationSome(this.props.navigation);
            // case ViewStatus.LOADING:
            //     return this.renderNavigationLoading(this.props.view);
            // case ViewStatus.LOADED:
            //     return this.renderNavigationLoaded(this.props.view);
            // case ViewStatus.ERROR:
            //     return this.renderNavigationError(this.props.view);
        }
    }

    parseHash(hash: string): { path: Array<string>; params: { relationEngineID: string } } {
        const hashRe = /^#(.*?)\/(.*)$/;
        const m = hashRe.exec(hash);

        if (!m) {
            throw new Error('Invalid path');
        }

        // Just for now...
        // TODO: for real

        const [, path, relationEngineID] = m;

        return {
            path: [path],
            params: { relationEngineID }
        };
    }

    componentDidMount() {
        if (this.props.rootState === RootState.DEVELOP) {
            window.addEventListener('hashchange', (ev: HashChangeEvent) => {
                const url = new URL(ev.newURL);
                const hash = url.hash;
                if (!hash) {
                    throw new Error('no hash!');
                }
                const {
                    params: { relationEngineID }
                } = this.parseHash(hash);
                this.props.navigate(relationEngineID);
                // console.log('hash?', hash);
            });
            const hash = window.location.hash;
            // console.log('hash?', hash);
            if (hash) {
                const {
                    params: { relationEngineID }
                } = this.parseHash(hash);
                // console.log('nav to ', relationEngineID);
                this.props.navigate(relationEngineID);
            } else {
                // TODO: remove?
                this.props.navigate('ncbi_taxon:562');
            }
        }
    }

    render() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return (
            <div className="Col scrollable">
                <div className="Row-auto">{this.renderRootState()}</div>
                <div className="Row  scrollable">{this.renderNavigation()}</div>
            </div>
        );
    }
}
