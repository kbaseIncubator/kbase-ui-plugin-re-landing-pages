import { RelationEngineReference, RelationEngineCollection } from ".";

// Ontology Term Reference

export enum OntologyNamespace {
    GO
}

export function stringToOntologyNamespace(namespace: string): OntologyNamespace {
    switch (namespace) {
        case 'go_ontology':
            return OntologyNamespace.GO;
        default:
            throw new Error('Ontology namespace not supported: ' + namespace);
    }
}

export function ontologyNamespaceToString(namespace: OntologyNamespace): string {
    switch (namespace) {
        case OntologyNamespace.GO:
            return 'go_ontology';
    }
}


export interface OntologyReferenceBase extends RelationEngineReference {
    collection: RelationEngineCollection.ONTOLOGY,
    namespace: OntologyNamespace;
}

export interface OntologyReferenceGO extends OntologyReferenceBase {
    namespace: OntologyNamespace.GO;
}

export type OntologyReference = OntologyReferenceGO


// export type OntologyID = string;

export enum OntologySource {
    GO
}
export enum OntologyRelation {
    IS_A = 'OntologyRelation$is_a',
    PART_OF = 'OntologyRelation$part_of'
}

// Brief term - for list displays

export interface OntologyTermBriefBase {
    // type: OntologySource;
    ref: OntologyReference;
    // id: OntologyID;
    name: string;
    // relation: OntologyRelation
}

export interface GOOntologyTermBrief extends OntologyTermBriefBase {
    // type: OntologySource.GO
    ref: OntologyReferenceGO
    goID: string;
}

export type OntologyTermBrief = GOOntologyTermBrief;

export type OntologyRelatedTermBrief = {
    relation: OntologyRelation,
    term: OntologyTermBrief
}

export interface OntologyTermRelatedBrief extends OntologyTermBrief {
    relation: OntologyRelation
}

// Term - the full term info for detail

export interface OntologyTermBase {
    ref: OntologyReference;
    // type: OntologySource;
    // id: OntologyID;
    name: string;
    relation: OntologyRelation;
    namespace: string;
    comment: string | null;
    definition: string;
    isObsolete: boolean;
}

export enum GOSynonymScope {
    EXACT,
    NARROW,
    BROAD,
    RELATED
}

export type Synonym = string;

// export interface GOSynonym {
//     name: string;
//     scope: GOSynonymScope;
// }

export interface GOSynonyms {
    exact: Array<Synonym>;
    narrow: Array<Synonym>;
    broad: Array<Synonym>;
    related: Array<Synonym>;
}

export interface GOOntologyTerm extends OntologyTermBase {
    type: OntologySource.GO;
    synonyms: GOSynonyms;
    goID: string;
}

export type OntologyTerm = GOOntologyTerm;

export interface OntologyTermRelated extends OntologyTerm {
    related: OntologyRelation
}

export interface OntologyRelatedTerm {
    relation: OntologyRelation,
    term: OntologyTerm
}

/* Linked Objects */

export interface WorkspaceType {
    module: string;
    name: string;
}
export type WorkspaceID = number;
export type ObjectID = number;
export type ObjectVersion = number;
export interface WorkspaceObjectReference {
    workspaceID: WorkspaceID;
    id: ObjectID;
    version: ObjectVersion;
}

export interface LinkedObject {
    object: WorkspaceObjectReference;
    type: WorkspaceType,
    scientificName: string;
    feature: string;
}