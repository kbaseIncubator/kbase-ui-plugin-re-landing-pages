import { DynamicServiceClient, DynamicServiceClientParams } from '@kbase/ui-lib';

interface TaxonomyAPIParams extends DynamicServiceClientParams {}

type TaxonID = string;

interface GetAncestorsParams {
    id: TaxonID;
}

interface GetDescendentsParams {
    id: TaxonID;
}

interface GetTaxonParams {
    id: TaxonID;
}

// interface GetTaxonResultSuccess {
//     count: true;
//     taxon: Taxon;
// }

// interface GetTaxonResultNotFound {
//     found: false;
// }

// type GetTaxonResult = GetTaxonResultSuccess | GetTaxonResultNotFound;

interface TaxonAlias {
    canonical: Array<string>;
    category: string;
    name: string;
}

interface TaxonResult {
    NCBI_taxon_id: number;
    _id: string;
    _key: string;
    _rev: string;
    aliases: Array<TaxonAlias>;
    canonical_scientific_name: Array<string>;
    gencode: string;
    rank: string;
    scientific_name: string;
}

interface GetTaxonResult {
    count: number;
    cursor_id: number | null;
    has_more: false;
    stats: {
        executionTime: number;
        filtered: number;
        httpRequests: number;
        scannedFull: number;
        scannedIndex: number;
        writesExecuted: number;
        writesIgnored: number;
    };
    results: Array<TaxonResult>;
}

interface GetLineageResult {
    stats: {
        executionTime: number;
        filtered: number;
        httpRequests: number;
        scannedFull: number;
        scannedIndex: number;
        writesExecuted: number;
        writesIgnored: number;
    };
    results: Array<TaxonResult>;
}

interface GetChildrenResult {
    stats: {
        executionTime: number;
        filtered: number;
        httpRequests: number;
        scannedFull: number;
        scannedIndex: number;
        writesExecuted: number;
        writesIgnored: number;
    };
    results: Array<TaxonResult>;
    total_count: number;
}
export interface Stats {
    executionTime: number;
    filtered: number;
    httpRequests: number;
    scannedFull: number;
    scannedIndex: number;
    writesExecuted: number;
    writesIgnored: number;
}
export interface GetAssociatedWorkspaceObjectsResultResult {
    edge: {
        _id: string;
        assigned_by: string;
        updated_at: number;
    };
    taxon: {
        _id: string;
        rank: string;
        scientific_name: string;
        updated_at: number;
    };
}

export interface GetAssociatedWorkspaceObjectsResult {
    results: Array<GetAssociatedWorkspaceObjectsResultResult>;
    stats: Stats;
}

export default class TaxonomyAPIClient extends DynamicServiceClient {
    static module: string = 'taxonomy_re_api';

    async getLineage(taxonID: TaxonID): Promise<GetLineageResult> {
        const [result] = await this.callFunc<[GetLineageResult]>('get_lineage', [
            {
                id: taxonID
            }
        ]);
        return result;
    }

    async getChildren({
        taxonID,
        offset,
        limit,
        searchTerm
    }: {
        taxonID: TaxonID;
        offset: number;
        limit: number;
        searchTerm: string;
    }): Promise<GetChildrenResult> {
        const [result] = await this.callFunc<[GetChildrenResult]>('get_children', [
            {
                id: taxonID,
                offset,
                limit,
                search_text: searchTerm
            }
        ]);
        return result;
    }

    async getTaxon(taxonID: TaxonID): Promise<GetTaxonResult> {
        const [result] = await this.callFunc<[GetTaxonResult]>('get_taxon', [
            {
                id: taxonID
            }
        ]);
        return result;
    }

    async getAssociatedWorkspaceObjects(
        taxon_id: TaxonID,
        offset: number,
        limit: number
    ): Promise<GetAssociatedWorkspaceObjectsResult> {
        const [result] = await this.callFunc<[GetAssociatedWorkspaceObjectsResult]>('get_associated_ws_objects', [
            {
                taxon_id,
                limit,
                offset
            }
        ]);
        return result;
    }
}
