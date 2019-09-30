import { BaseStoreState, makeBaseStoreState } from '@kbase/ui-components';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

import { TaxonomyStoreState } from '../../landingPages/taxonomy/redux/store';
import { TaxonReference } from '../../types/taxonomy';
import { OntologyReference } from '../../types/ontology';
import OntologyView from '../../landingPages/ontology/Main/view';

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

export interface LandingPageStoreState { }

// VIEW STATES
/*
 Sync view state
 Primarily for top level views which don't have an async load operation.
*/

export enum SyncViewStatus {
    NONE,
    LOADED,
    ERROR
}

export interface SyncViewStateNone<T> {
    status: SyncViewStatus.NONE;
}

export interface SyncViewStateError<T> {
    status: SyncViewStatus.ERROR;
    error: string;
    type: T;
}

export interface SyncViewStateLoaded<T, S> {
    status: SyncViewStatus.LOADED;
    type: T;
    state: S;
}
export type SyncViewState<T, S> = SyncViewStateNone<T> | SyncViewStateLoaded<T, S> | SyncViewStateError<T>;

/*
Async view state
For any component which requires loading.
*/

export enum AsyncViewStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface AsyncViewStateNone<T> {
    status: AsyncViewStatus.NONE;
    type: T;
}

export interface AsyncViewStateLoading<T> {
    status: AsyncViewStatus.LOADING;
    type: T;
}

export interface AsyncViewStateError<T> {
    status: AsyncViewStatus.ERROR;
    error: string;
    type: T;
}

export interface AsyncViewStateLoaded<T, S> {
    status: AsyncViewStatus.LOADED;
    type: T;
    state: S;
}
export type AsyncViewState<T, S> = AsyncViewStateNone<T> | AsyncViewStateLoading<T> | AsyncViewStateLoaded<T, S> | AsyncViewStateError<T>;


// And the specific landing page views

export type TaxonomyView = SyncViewState<ViewType.TAXONOMY, TaxonomyStoreState>;

export interface NavigationBase {
    type: ViewType;
    relationEngineID: RelationEngineID;
}

export interface NavigationNone {
    type: ViewType.NONE;
}

export interface NavigationTaxonomy {
    type: ViewType.TAXONOMY;
    ref: TaxonReference
    // namespace: string;
    // id: string;
    // timestamp?: number
    // relationEngineID: RelationEngineID;
}

export interface NavigationOntology {
    type: ViewType.ONTOLOGY;
    ref: OntologyReference
    // namespace: string;
    // id: string;
    // timestamp?: number
    // relationEngineID: RelationEngineID;
}

export type NavigationSome = NavigationTaxonomy | NavigationOntology;
export type Navigation = NavigationNone | NavigationSome;

// export interface ViewState<T, S> {
//     type: T;
//     state: S;
// }

export type LandingPageView = TaxonomyView;

// OKAY, back to REDUX

// export interface TaxonomyView {

// }

// export interface OntologyView {

// }

export type View = TaxonomyView | OntologyView | null;


// STORE STATE type definition
export interface StoreState extends BaseStoreState {
    // viewer: TaxonView | null;
    // view: RelationEngineView;
    navigation: Navigation;
    trigger: number;
    view: View
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
        trigger: 0,
        view: null
    };
}

export function createReduxStore() {
    return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}
