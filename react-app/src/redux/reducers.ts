import { Action, Reducer } from 'redux';
import { baseReducer } from '@kbase/ui-lib';
import { BaseStoreState } from '@kbase/ui-lib';
import { StoreState } from './store';
import { AppActions, NavigateSuccess } from './actions';

function navigateSuccess(state: StoreState, action: NavigateSuccess): StoreState {
    // console.log('sick of the success?', action);
    return {
        ...state,
        // view: {
        //     status: ViewStatus.LOADED,
        //     relationEngineID: action.relationEngineID,
        //     relationEngineNodeType: action.relationEngineNodeType,
        //     viewType: action.viewType,
        //     currentView: action.view
        // }
        navigation: action.navigation,
        trigger: Date.now()
    };
}

// function navigateStart(state: StoreState, action: NavigateStart): StoreState {
//     return {
//         ...state,
//         view: {
//             status: ViewStatus.LOADING
//         }
//     };
// }

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    const baseState = baseReducer(state as BaseStoreState, action);
    if (baseState) {
        return baseState as StoreState;
    }
    if (!state) {
        return state;
    }
    switch (action.type) {
        // case AppActions.NAVIGATE_START:
        //     return navigateStart(state, action as NavigateStart);
        case AppActions.NAVIGATE_SUCCESS:
            return navigateSuccess(state, action as NavigateSuccess);
    }
    return state;
};

export default reducer;
