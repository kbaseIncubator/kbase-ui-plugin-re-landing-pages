import { RelationEngineReference, RelationEngineDataSource, RelationEngineCategory, RelationEngineReferenceG } from "./core";

// export enum TaxonomyNamespace {
//     NCBI,
//     GTDB
// }

// // export type TaxonomyNamespace = 'ncbi_taxonomy' | 'gtdb_taxonomy';

// export function taxonomyNamespaceToString(namespace: TaxonomyNamespace): string {
//     switch (namespace) {
//         case TaxonomyNamespace.NCBI:
//             return 'ncbi_taxonomy';
//         case TaxonomyNamespace.GTDB:
//             return 'gtdb';
//     }
// }

// export function stringToTaxonomyNamespace(namespace: string): TaxonomyNamespace {
//     switch (namespace) {
//         case 'ncbi_taxonomy':
//             return TaxonomyNamespace.NCBI;
//         case 'gtdb_taxonomy':
//             return TaxonomyNamespace.GTDB;
//         default:
//             throw new Error('Unrecognized namespace "' + namespace + '"');
//     }
// }

// export interface TaxonomyReferenceBase extends RelationEngineReferenceBase {
//     category: RelationEngineCategory.TAXONOMY,
//     // dataSource: RelationEngineDataSource.TAXONOMY;
// }

// export interface TaxonomyReferenceNCBI extends TaxonomyReferenceBase {
//     dataSource: RelationEngineDataSource.NCBI;
// }

// export interface TaxonomyReferenceGTDB extends TaxonomyReferenceBase {
//     dataSource: RelationEngineDataSource.GTDB;
// }

// export interface TaxonomyReferenceRDP extends TaxonomyReferenceBase {
//     dataSource: RelationEngineDataSource.RDP;
// }

// export type TaxonomyReference = TaxonomyReferenceNCBI | TaxonomyReferenceGTDB | TaxonomyReferenceRDP;

export type TaxonomyNamespace =
    'gtdb' |
    'ncbi_taxonomy' |
    'rdp_taxonomy';

export type TaxonomyReference =
    RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI> |
    RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB> |
    RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>;

export interface TaxonAlias {
    category: string;
    name: string;
}

export interface TaxonBase {
    ref: TaxonomyReference,
    name: string;
    rank: string;
    isBiological: boolean;
}


export interface NCBITaxon extends TaxonBase {
    ref: RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI>;
    ncbiID: number;
    geneticCode: number;
    aliases: Array<TaxonAlias>;
}

export interface GTDBTaxon extends TaxonBase {
    ref: RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB>;
}

export interface RDPTaxon extends TaxonBase {
    ref: RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>;
}

export type Taxon = NCBITaxon | GTDBTaxon | RDPTaxon;


