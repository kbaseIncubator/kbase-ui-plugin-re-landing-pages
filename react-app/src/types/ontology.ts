import { RelationEngineDataSource, RelationEngineCategory, RelationEngineReferenceG } from "./core";

// Ontology Term Reference

// export enum OntologyNamespace {
//     GO
// }

export function stringToOntologyNamespace(namespace: string): OntologyNamespace {
    switch (namespace) {
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
        default:
            throw new Error('Ontology namespace not supported: ' + namespace);
    }
}

export function ontologyNamespaceToString(namespace: OntologyNamespace): string {
    switch (namespace) {
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
    }
}


// export interface OntologyReferenceBase extends RelationEngineReferenceBase {
//     category: RelationEngineCategory.ONTOLOGY;
// }

// export interface OntologyReferenceGO extends OntologyReferenceBase {
//     dataSource: RelationEngineDataSource.GO;
// }

// export interface OntologyReferenceENVO extends OntologyReferenceBase {
//     dataSource: RelationEngineDataSource.ENVO;
// }

// export type OntologyReference = OntologyReferenceGO | OntologyReferenceENVO

export type OntologyNamespace =
    'envo_ontology' |
    'go_ontology';

export type OntologyReference =
    RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO> |
    RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.ENVO>;


// export type OntologyID = string;

export enum OntologySource {
    GO,
    ENVO
}
export enum OntologyRelation {
    IS_A = 'OntologyRelation$is_a',
    PART_OF = 'OntologyRelation$part_of',
    HAS_PART = 'OntologyRelation$has_part',
    REGULATES = 'OntologyRelation$regulates',
    POSITIVELY_REGULATES = 'OntologyRelation$positivelyRegulates',
    NEGATIVELY_REGULATES = 'OntologyRelation$negativelyRegulates',
    OCCURS_IN = 'OntologyRelation$occursIn',
    ENDS_DURING = 'OntologyRelation$endsDuring',
    HAPPENS_DURING = 'OntologyRelation$happensDuring',
    DERIVES_FROM = 'OntologyRelation$DerivesFrom',
    HAS_OUTPUT = 'OntologyRelation$HasOutput',
    HAS_INPUT = 'OngolotyRelation$HasInput',
    OUTPUT_OF = 'OntologyRelation$OutputOf',
    INPUT_OF = 'OntologyRelation$InputOf',
    DETERMINES = 'OntologyRelation$Determines',
    SURROUNDED_BY = 'OntologyRelation$SurroundedBy',
    HAS_QUALITY = 'OntologyRelation$HasQuality'
}

// Brief term - for list displays

export interface OntologyTermBriefBase {
    ref: OntologyReference;
    name: string;
}

export interface GOOntologyTermBrief extends OntologyTermBriefBase {
    ref: RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO>;
    goID: string;
}

export type OntologyTermBrief = GOOntologyTermBrief;

export type OntologyRelatedTermBrief = {
    relation: OntologyRelation,
    term: OntologyTermBrief;
};

export interface OntologyTermRelatedBrief extends OntologyTermBrief {
    relation: OntologyRelation;
}

// Term - the full term info for detail

export interface OntologyTermBase {
    ref: OntologyReference;
    name: string;
    comments: Array<string>;
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
    namespace: string;
}

export interface ENVOOntologyTerm extends OntologyTermBase {
    type: OntologySource.ENVO;
    // synonyms: EnvoSynonyms;
    envoID: string;
    namespace: string;
}

export type OntologyTerm = GOOntologyTerm | ENVOOntologyTerm;

// export interface OntologyTermRelated extends OntologyTerm {
//     related: OntologyRelation;
// }

export interface OntologyRelatedTerm {
    relation: OntologyRelation,
    term: OntologyTerm;
}

export interface OntologyRelatedTerms {
    term: OntologyTerm,
    terms: Array<OntologyRelatedTerm>;
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