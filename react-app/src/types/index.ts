// import { OntologySource } from './ontology';
// import { TaxonomySource } from './taxonomy';

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

interface JSONArray extends Array<JSONValue> { };

interface JSONObject {
    [x: string]: JSONValue
}

export interface UIError {
    code: string;
    source: string;
    message: string;
    data?: JSONValue;
}

export class UIException extends Error {
    code: string;
    source: string;
    message: string;
    data?: JSONValue;
    constructor({ message, code, source, data }: { message: string, code: string, source: string, data?: JSONValue }) {
        super(message);
        this.code = code;
        this.source = source;
        this.message = message;
        this.data = data;
    }
}

// export type NodeSource = TaxonomySource | OntologySource;

export enum ObjectClass {
    TAXONOMY,
    ONTOLOGY
}

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

export enum RelationEngineCollection {
    TAXONOMY,
    ONTOLOGY
}

export function relationEngineCollectionToString(collection: RelationEngineCollection): string {
    switch (collection) {
        case RelationEngineCollection.TAXONOMY:
            return 'taxonomy';
        case RelationEngineCollection.ONTOLOGY:
            return 'ontology';
    }
}

export function stringToRelationEngineCollection(collection: string): RelationEngineCollection {
    switch (collection) {
        case 'taxonomy':
            return RelationEngineCollection.TAXONOMY;
        case 'ontology':
            return RelationEngineCollection.ONTOLOGY;
        default:
            throw new Error('Unrecognized relation engine collection name "' + collection + '"');

    }
}

// export enum RelationEngineNamespace {
// }

export type RelationEngineNamespace = any;

export type RelationEngineID = string;

export type RelationEngineTimestamp = number;


export interface RelationEngineReference {
    collection: RelationEngineCollection,
    namespace: RelationEngineNamespace,
    id: RelationEngineID;
    timestamp: RelationEngineTimestamp;
}