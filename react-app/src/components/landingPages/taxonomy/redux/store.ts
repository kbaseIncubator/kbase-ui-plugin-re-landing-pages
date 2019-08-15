export type TaxonID = string;

/**
 *
 */
export interface TaxonBase {
    name: string;
    id: string;
    rank: string;
    isBiological: boolean;
}

export enum TaxonomySource {
    NCBI,
    GTDB
}

export interface TaxonAlias {
    category: string;
    name: string;
}

export interface NCBITaxon extends TaxonBase {
    type: TaxonomySource.NCBI;
    ncbiID: number;
    geneticCode: number;
    aliases: Array<TaxonAlias>;
}

export interface GTDBTaxon extends TaxonBase {
    type: TaxonomySource.GTDB;
}

export type Taxon = NCBITaxon | GTDBTaxon;

export enum LoadingStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface NoneState {
    status: LoadingStatus.NONE;
}

export interface LoadingState {
    status: LoadingStatus.LOADING;
}

export interface ErrorState {
    status: LoadingStatus.ERROR;
    message: string;
}

export interface LoadedState {
    status: LoadingStatus.LOADED;
}

export interface MainLoadedState extends LoadedState {
    selectedTaxonID: TaxonID;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
}

export type MainState = NoneState | LoadingState | ErrorState | MainLoadedState;

type State = NoneState | LoadedState | LoadingState | ErrorState;

export interface TaxonomyStoreState {
    taxonomy: {
        main: MainState;
    };
}

// export function makeInitialStoreState(): TaxonomyStoreState {
//     return {
//         taxonomy: {
//             main: {
//                 state: {
//                     status: LoadingStatus.NONE
//                 }
//             }
//         }
//     };
// }

// export function createReduxStore() {
//     return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
// }
