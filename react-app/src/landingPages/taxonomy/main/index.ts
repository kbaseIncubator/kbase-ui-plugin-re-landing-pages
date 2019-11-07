import { AppConfig, sendTitle } from '@kbase/ui-components';
import { StoreState } from '../../../redux/store';
import DataComponent from './data';
import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { navigate } from '../../../redux/actions';
import { TaxonomyReference } from '../../../types/taxonomy';
import { relationEngineReferenceToNamespace } from '../../../types/transform';

export interface OwnProps { }

export interface StateProps {
    token: string;
    config: AppConfig;
}

export interface DispatchProps {
    navigate: (ref: TaxonomyReference) => void;
    setTitle: (title: string) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        app: { config }
    } = state;
    if (!userAuthorization) {
        throw new Error('Invalid state - no user authorization');
    }
    return {
        token: userAuthorization.token,
        config
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, props: OwnProps): DispatchProps {
    return {
        navigate: (ref: TaxonomyReference) => {
            const relationEngineID = [
                relationEngineReferenceToNamespace(ref),
                ref.id,
                String(ref.timestamp)
            ].join('/');
            dispatch(navigate(relationEngineID) as any);
        },
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(DataComponent);
