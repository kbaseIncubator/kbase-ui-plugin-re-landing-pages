

import { OntologyReference, OntologyNamespace } from './ontology';
import { TaxonomyReference, TaxonomyNamespace } from './taxonomy';

export type RelationEngineID = string;

export type RelationEngineTimestamp = number;

export enum RelationEngineCategory {
    TAXONOMY,
    ONTOLOGY
}

export enum RelationEngineDataSource {
    ENVO = 'ENVO',
    GO = 'GO',
    GTDB = 'GTDB',
    NCBI = 'NCBI',
    RDP = 'RDP'
}

export interface RelationEngineReferenceG<CategoryType extends RelationEngineCategory, DataSourceType extends RelationEngineDataSource> {
    category: CategoryType;
    dataSource: DataSourceType;
    id: string;
    timestamp: number;
}

// export type OntologyReference =
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO> |
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.ENVO>;

// export type TaxonomyReference =
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>;

export type RelationEngineReference = OntologyReference | TaxonomyReference;

export type RelationEngineNamespace = OntologyNamespace | TaxonomyNamespace;



// export type RelationEngineReference =
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO> |
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.ENVO> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>

export type RelationEngineDataSourceId =
    'ncbi_taxonomy' |
    'gtdb' |
    'rdp_taxonomy' |
    'go_ontology' |
    'envo_ontology';