import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { StoreState, RelationEngineID, NavigationSome, ViewType } from './store';
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
    // relationEngineID: RelationEngineID;
    // relationEngineNodeType: RelationEngineNodeType;
    // viewType: ViewType;
    // view: LandingPageView;
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

export function navigateSuccess(
    navigation: NavigationSome
    // viewType: ViewType,
    // relationEngineID: RelationEngineID
    // relationEngineNodeType: RelationEngineNodeType,

    // view: LandingPageView
): NavigateSuccess {
    return {
        type: AppActions.NAVIGATE_SUCCESS,
        navigation
        // relationEngineID,
        // relationEngineNodeType,
        // viewType
        // view
    };
}

export function navigate(relationEngineID: RelationEngineID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(navigateStart());

        // TODO: when there is an api call "get_node_info" we can replace the
        // node type determination code below.

        // window.location.hash;

        // We know, for now, that the node id is <collection/id>
        const [collection, id] = relationEngineID.split(':');
        // console.log('in navigate...', relationEngineID);
        switch (collection) {
            case 'ncbi_taxon':
                // const view: TaxonomyView = {
                //     status: ViewStatus.NONE
                // };
                dispatch(navigateSuccess({ type: ViewType.TAXONOMY, relationEngineID: [collection, id].join('/') }));
            // dispatch(uiLib.navigate({ view: 'taxonomy', params: { relationEngineID } }));
        }
    };
}
