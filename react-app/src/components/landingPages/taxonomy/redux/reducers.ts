import { TaxonomyStoreState, LoadingStatus } from './store';
import { Action, Reducer } from 'redux';
import { TaxonomyActionType, Load, LoadStart, LoadSuccess } from './actions';
import {
    StoreState,
    ViewStatus,
    RelationEngineView,
    RelationEngineNodeType,
    ViewType,
    TaxonomyView
} from '../../../../redux/store';
import { makeBaseStoreState } from '@kbase/ui-lib';

// function loadStart(state: StoreState, action: LoadStart) {
//     return {
//         ...state,
//         views: {
//             taxonomy: {
//                 main: {
//                     status: LoadingStatus.LOADING
//                 }
//             }
//         }
//     };
// }

// function loadSuccess(state: StoreState, action: LoadSuccess): StoreState {
//     const { view } = state;

//     // Narrow the type down to the taxonomy.
//     // TODO: best way to handle failure for type narrowing?
//     //       should never trigger...

//     if (view.status !== ViewStatus.LOADED) {
//         return state;
//     }

//     const type = view.relationEngineNodeType;

//     if (type !== RelationEngineNodeType.TAXON) {
//         return state;
//     }

//     if (view.viewType !== ViewType.TAXONOMY) {
//         return state;
//     }

//     const taxonomyState: TaxonomyStoreState = {
//         taxonomy: {
//             main: {
//                 status: LoadingStatus.LOADED,
//                 targetTaxon: action.targetTaxon,
//                 selectedTaxon: action.selectedTaxon,
//                 selectedTaxonID: action.selectedTaxonID
//             }
//         }
//     };

//     const taxonomyView: TaxonomyView = {
//         status: ViewStatus.LOADED,
//         type: ViewType.TAXONOMY,
//         state: taxonomyState
//     };

//     return {
//         ...state,
//         view: {
//             ...view,
//             currentView: taxonomyView
//             // currentView: {
//             //     status:
//             //     taxonomy: {
//             //         LoadingStatus:
//             //         main: {
//             //             status: LoadingStatus.LOADED,
//             //             taxon: action.targetTaxon
//             //         }
//             //     }
//             // }
//         }
//     };
// }

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    if (typeof state === 'undefined') {
        return state;
    }
    // switch (action.type) {
    //     case TaxonomyActionType.LOAD_START:
    //         return loadStart(state, action as LoadStart);
    //     case TaxonomyActionType.LOAD_SUCCESS:
    //         return loadSuccess(state, action as LoadSuccess);
    // }

    return state;
};

export default reducer;
