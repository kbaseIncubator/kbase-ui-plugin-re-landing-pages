import { BaseStoreState, makeBaseStoreState } from '@kbase/ui-lib';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

import { TaxonomyStoreState } from '../components/landingPages/taxonomy/redux/store';

export enum ViewType {
    NONE,
    TAXONOMY,
    ONTOLOGY
}

export type RelationEngineID = string;
export enum RelationEngineNodeType {
    TAXON,
    ONTOLOGY_TERM
}

export enum ViewStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface RelationEngineViewBase {
    status: ViewStatus;
}

export interface RelationEngineViewNone {
    status: ViewStatus.NONE;
}

export interface RelationEngineViewLoading {
    status: ViewStatus.LOADING;
}

export interface RelationEngineViewLoaded {
    status: ViewStatus.LOADED;
    relationEngineID: RelationEngineID;
    relationEngineNodeType: RelationEngineNodeType;
    viewType: ViewType;
    currentView: LandingPageView;
}

export interface RelationEngineViewError {
    status: ViewStatus.ERROR;
    message: string;
}

export type RelationEngineView =
    | RelationEngineViewNone
    | RelationEngineViewLoading
    | RelationEngineViewLoaded
    | RelationEngineViewError;

export interface LandingPageStoreState {}

// VIEW STATE

export interface ViewStateNone<T> {
    status: ViewStatus.NONE;
}

export interface ViewStateLoading<T> {
    status: ViewStatus.LOADING;
    type: T;
}

export interface ViewStateError<T> {
    status: ViewStatus.ERROR;
    error: string;
    type: T;
}

export interface ViewStateLoaded<T, S> {
    status: ViewStatus.LOADED;
    type: T;
    state: S;
}
export type ViewState<T, S> = ViewStateNone<T> | ViewStateLoading<T> | ViewStateLoaded<T, S> | ViewStateError<T>;

export type TaxonomyView = ViewState<ViewType.TAXONOMY, TaxonomyStoreState>;

export interface NavigationBase {
    type: ViewType;
    relationEngineID: RelationEngineID;
}

export interface NavigationNone {
    type: ViewType.NONE;
}

export interface NavigationTaxonomy {
    type: ViewType.TAXONOMY;
    relationEngineID: RelationEngineID;
}

export type NavigationSome = NavigationTaxonomy;
export type Navigation = NavigationNone | NavigationSome;

// export interface ViewState<T, S> {
//     type: T;
//     state: S;
// }

export type LandingPageView = TaxonomyView;

// STORE STATE type definition
export interface StoreState extends BaseStoreState {
    // viewer: TaxonView | null;
    // view: RelationEngineView;
    navigation: Navigation;
    trigger: number;
}

// Store Construction
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    return {
        ...baseStoreState,
        // viewer: null,
        navigation: {
            type: ViewType.NONE
        },
        trigger: 0
    };
}

export function createReduxStore() {
    return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}
