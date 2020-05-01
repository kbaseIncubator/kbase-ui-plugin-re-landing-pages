import React from 'react';
import { RootState } from '@kbase/ui-components';
import {
    RelationEngineID,
    Navigation,
    NavigationSome
} from '../../redux/store';
import { ViewType } from '../../redux/store/view';
import Taxonomy from '../../landingPages/taxonomy';
import OntologyView from '../../landingPages/ontology';
import { Alert } from 'antd';

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    navigation: Navigation;
    trigger: number;
    navigate: (relationEngineID: RelationEngineID) => void;
}

interface DispatcherState { }

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
                return '';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderNavigationNone() {
        const message = <div>
            <p>
                This navigation not supported
            </p>
            <p>
                {this.props.navigation.type}
            </p>
        </div>;
        return <Alert type="error" message={message} />;
    }

    renderNavigationSome(navigation: NavigationSome) {
        // This is currently how we dispatch to the type-specific
        // landing page.
        switch (navigation.type) {
            case ViewType.TAXONOMY:
                return <Taxonomy taxonRef={navigation.ref} dataSource={navigation.dataSource} />;
            case ViewType.ONTOLOGY:
                return <OntologyView termRef={navigation.ref} dataSource={navigation.dataSource} />;
            default:
                // TODO: make real error display.
                console.error('Unhandled navigation', navigation);
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

    parseHash(hash: string): { path: Array<string>; params: { relationEngineID: string; }; } {
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
            // Navigate on change of the hash
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
            });

            // First time here, we also want to navigate based on the
            // hash, or if empty (the default when a dev session starts)
            // use some default interesting taxon id.
            const hash = window.location.hash;
            if (hash) {
                const {
                    params: { relationEngineID }
                } = this.parseHash(hash);
                this.props.navigate(relationEngineID);
            } else {
                // TODO: remove?
                // #review/ontology/go/GO:0007610
                // this.props.navigate('ncbi_taxonomy/562');
                this.props.navigate('go_ontology/GO:0007610');
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
