import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { StoreState, RelationEngineID, NavigationSome, View } from '../store';
import { ViewType } from '../store/view';
import RelationEngineAPIClient from '../../lib/RelationEngineAPIClient';
import { RelationEngineCollection } from '../../types';
import { stringToTaxonomyNamespace } from '../../types/taxonomy';
import { stringToOntologyNamespace } from '../../types/ontology';
// import * as uiLib from '@kbase/ui-lib';

export enum AppActions {
    NAVIGATE = 'kbase-ui-plugin-landing-pages/navigate',
    NAVIGATE_START = 'kbase-ui-plugin-landing-pages/navigate/start',
    NAVIGATE_SUCCESS = 'kbase-ui-plugin-landing-pages/navigate/success',
    NAVIGATE_ERROR = 'kbase-ui-plugin-landing-pages/navigate/error'
}

export interface Navigate extends Action<AppActions.NAVIGATE> {
    type: AppActions.NAVIGATE;
    relationEngineID: RelationEngineID;
}

export interface NavigateStart extends Action<AppActions.NAVIGATE_START> {
    type: AppActions.NAVIGATE_START;
}

export interface NavigateSuccess extends Action<AppActions.NAVIGATE_SUCCESS> {
    type: AppActions.NAVIGATE_SUCCESS;
    navigation: NavigationSome;
}

export interface NavigateError extends Action<AppActions.NAVIGATE_ERROR> {
    type: AppActions.NAVIGATE_ERROR;
    message: string;
}

export function navigateStart(): NavigateStart {
    return {
        type: AppActions.NAVIGATE_START
    };
}

export function navigateError(message: string): NavigateError {
    return {
        type: AppActions.NAVIGATE_ERROR,
        message
    }
}

export function navigateSuccess(
    navigation: NavigationSome
): NavigateSuccess {
    return {
        type: AppActions.NAVIGATE_SUCCESS,
        navigation
    };
}

export function navigate(relationEngineID: RelationEngineID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(navigateStart());

        const {
            auth: { userAuthorization },
            app: {
                config: {
                    services: {
                        ServiceWizard: { url }
                    }
                }
            }
        } = getState();

        if (!userAuthorization) {
            return;
        }

        const reClient = new RelationEngineAPIClient({
            url,
            token: userAuthorization.token
        });

        try {
            const [nodeInfo] = await reClient.getNodeInfo(relationEngineID);
            switch (nodeInfo.collection) {
                case 'taxonomy':
                    // TODO: add source info here, or let the taxonomy landing page do
                    // it by itself? I think it is better to do it after the first dispatch
                    // here, because then the landing page can fold it into its type system,
                    // rather than requiring the top level to do that. E.g. source->enum.
                    dispatch(navigateSuccess({
                        type: ViewType.TAXONOMY,
                        ref: {
                            collection: RelationEngineCollection.TAXONOMY,
                            namespace: stringToTaxonomyNamespace(nodeInfo.namespace),
                            id: nodeInfo.id,
                            timestamp: nodeInfo.timestamp
                        }
                    }));
                    // const x = {
                    //     type: ViewType.TAXONOMY,
                    //     ref: {
                    //         collection: RelationEngineCollection.TAXONOMY,
                    //         namespace: stringToTaxonomyNamespace(nodeInfo.namespace),
                    //         id: nodeInfo.id,
                    //         timestamp: nodeInfo.timestamp
                    //     }
                    // };
                    break;
                case 'ontology':
                    dispatch(navigateSuccess({
                        type: ViewType.ONTOLOGY,
                        ref: {
                            collection: RelationEngineCollection.ONTOLOGY,
                            namespace: stringToOntologyNamespace(nodeInfo.namespace),
                            id: nodeInfo.id,
                            timestamp: nodeInfo.timestamp
                        }
                    }));
                    break;
            }
        } catch (ex) {
            console.error('ERROR', ex);
            dispatch(navigateError(ex.message));
        }

    };
}

export function view(view: View) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {


        // determine which view should be invoked

        // issue the store update accordingly

        // the view should be invoked by the ... dispatcher?

    };
}
