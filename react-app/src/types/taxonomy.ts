import { RelationEngineReference, RelationEngineCollection } from ".";

export enum TaxonomyNamespace {
    NCBI,
    GTDB
}

export function taxonomyNamespaceToString(namespace: TaxonomyNamespace) {
    switch (namespace) {
        case TaxonomyNamespace.NCBI:
            return 'ncbi_taxonomy';
        case TaxonomyNamespace.GTDB:
            return 'gtdb';
    }
}

export function stringToTaxonomyNamespace(namespace: string) {
    switch (namespace) {
        case 'ncbi_taxonomy':
            return TaxonomyNamespace.NCBI;
        case 'gtdb':
            return TaxonomyNamespace.GTDB;
        default:
            throw new Error('Unrecognized namespace "' + namespace + '"');
    }
}

export interface TaxonReferenceBase extends RelationEngineReference {
    collection: RelationEngineCollection.TAXONOMY,
    namespace: TaxonomyNamespace;
}

export interface TaxonReferenceNCBI extends TaxonReferenceBase {
    namespace: TaxonomyNamespace.NCBI;
}

export interface TaxonReferenceGTDB extends TaxonReferenceBase {
    namespace: TaxonomyNamespace.GTDB;
}

export type TaxonReference = TaxonReferenceNCBI | TaxonReferenceGTDB;


export interface TaxonAlias {
    category: string;
    name: string;
}

export interface TaxonBase {
    ref: TaxonReference,
    name: string;
    rank: string;
    isBiological: boolean;
}


export interface NCBITaxon extends TaxonBase {
    ref: TaxonReferenceNCBI;
    ncbiID: number;
    geneticCode: number;
    aliases: Array<TaxonAlias>;
}

export interface GTDBTaxon extends TaxonBase {
    ref: TaxonReferenceGTDB;
}

export type Taxon = NCBITaxon | GTDBTaxon;


