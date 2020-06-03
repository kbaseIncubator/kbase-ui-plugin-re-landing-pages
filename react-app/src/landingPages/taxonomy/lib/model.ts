import { TaxonomyReference, Taxon, NCBITaxon, GTDBTaxon } from '../../../types/taxonomy';
import TaxonomyAPIClient from './TaxonomyAPIClient';
import { relationEngineReferenceToNamespace } from '../../../types/transform';
import { RelationEngineCategory, RelationEngineDataSource, } from '../../../types/core';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';

// const INITIAL_BATCH_SIZE = 100;
// const BATCH_SIZE = 1000;
// const TOTAL_LIMIT = 10000;
// const PARALLELISM = 2;

export interface GetChildrenOptions {
    offset: number;
    limit: number;
    searchTerm: string;
}

export interface WorkspaceObjectType {
    module: string;
    name: string;
    majorVersion: number;
    minorVersion: number;
}

export enum WorkspaceType {
    UNKNOWN,
    NARRATIVE,
    REFDATA
}

export interface LinkedObject {
    linkedAt: number;
    workspaceID: number;
    objectID: number;
    version: number;
    objectName: string;
    workspaceUpdatedAt: number;
    createdAt: number;
    type: WorkspaceObjectType;
    workspaceType: WorkspaceType;
    title: string;
}

export interface GetLinkedObjectsOptions {
    offset: number;
    limit: number;
}

export interface GetLinkedObjectsResult {
    linkedObjects: Array<LinkedObject>;
    totalCount: number;
}

const REQUEST_TIMEOUT = 30000;

export interface TaxonomyModelParams {
    token: string;
    url: string;
    taxonomyAPIConfig: DynamicServiceConfig;
}

export class TaxonomyModel {
    taxonomyClient: TaxonomyAPIClient;
    constructor({ token, url, taxonomyAPIConfig }: TaxonomyModelParams) {
        this.taxonomyClient = new TaxonomyAPIClient({
            token,
            url,
            timeout: REQUEST_TIMEOUT,
            version: taxonomyAPIConfig.version
        });
    }

    async getLineage(taxonRef: TaxonomyReference): Promise<Array<Taxon>> {
        const {
            id, timestamp
        } = taxonRef;
        const result = await this.taxonomyClient.getLineage({
            ns: relationEngineReferenceToNamespace(taxonRef),
            id,
            ts: timestamp
        });
        // TODO: should be conditional based on the source of the taxonomy??

        switch (taxonRef.dataSource) {
            case RelationEngineDataSource.NCBI:
                const ncbiTaxons: Array<NCBITaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;
                    if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                        isBiological = false;
                    } else {
                        isBiological = true;
                    }
                    return {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.NCBI,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        ncbiID: taxonResult.NCBI_taxon_id,
                        geneticCode: parseInt(taxonResult.gencode),
                        aliases: taxonResult.aliases.map(({ name, category }) => {
                            return {
                                name,
                                category
                            };
                        }),
                        isBiological
                    };
                });
                return ncbiTaxons;
            case RelationEngineDataSource.GTDB:
                const gtdbTaxons: Array<GTDBTaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;

                    // if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                    //     isBiological = false;
                    // } else {
                    //     isBiological = true;
                    // }
                    isBiological = true;
                    return {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.GTDB,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological
                    };
                });
                return gtdbTaxons;
            default:
                throw new Error('Not a supported taxonomy data source');
        }
    }

    async getChildren(taxonRef: TaxonomyReference, options: GetChildrenOptions): Promise<[Array<Taxon>, number]> {
        const {
            id, timestamp
        } = taxonRef;

        const result = await this.taxonomyClient.getChildren({
            ns: relationEngineReferenceToNamespace(taxonRef),
            id,
            ts: timestamp,
            offset: options.offset,
            limit: options.limit,
            searchTerm: options.searchTerm
        });

        switch (taxonRef.dataSource) {
            case RelationEngineDataSource.NCBI:
                const ncbiTaxa: Array<NCBITaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;
                    if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                        isBiological = false;
                    } else {
                        isBiological = true;
                    }
                    return {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.NCBI,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        ncbiID: taxonResult.NCBI_taxon_id,
                        geneticCode: parseInt(taxonResult.gencode),
                        aliases: taxonResult.aliases.map(({ name, category }) => {
                            return {
                                name,
                                category
                            };
                        }),
                        isBiological
                    };
                });
                return [ncbiTaxa, result.total_count];
            case RelationEngineDataSource.GTDB:
                const gtdbTaxa: Array<GTDBTaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean = true;
                    // if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                    //     isBiological = false;
                    // } else {
                    //     isBiological = true;
                    // }
                    return {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.GTDB,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological
                    };
                });
                return [gtdbTaxa, result.total_count];
            default:
                throw new Error('Not a supported taxonomy data source');
        }
    }

    async getTaxon(taxonRef: TaxonomyReference): Promise<Taxon> {
        const {
            id, timestamp
        } = taxonRef;

        const result = await this.taxonomyClient.getTaxon({
            ns: relationEngineReferenceToNamespace(taxonRef),
            id,
            ts: timestamp
        });

        const taxonResult = result.results[0];

        // TODO: here and above, we need to determine the namespace enum value by 
        // comparing the string coming in...
        switch (taxonRef.dataSource) {
            case RelationEngineDataSource.NCBI:
                return (() => {
                    let isBiological: boolean;
                    if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                        isBiological = false;
                    } else {
                        isBiological = true;
                    }
                    const ncbiTaxon: NCBITaxon = {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.NCBI,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        ncbiID: taxonResult.NCBI_taxon_id,
                        geneticCode: parseInt(taxonResult.gencode),
                        aliases: taxonResult.aliases.map(({ name, category }) => {
                            return {
                                name,
                                category
                            };
                        }),
                        isBiological
                    };
                    return ncbiTaxon;
                })();
            case RelationEngineDataSource.GTDB:
                return (() => {
                    const isBiological = true;
                    const gtdbTaxon: GTDBTaxon = {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.GTDB,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological
                    };
                    return gtdbTaxon;
                })();

            default:
                throw new Error('Unsupported taxonomy data source');
        }

    }

    async getLinkedObjects(taxonRef: TaxonomyReference, options: GetLinkedObjectsOptions): Promise<GetLinkedObjectsResult> {
        const params = {
            ns: relationEngineReferenceToNamespace(taxonRef),
            id: taxonRef.id,
            ts: taxonRef.timestamp,
            offset: options.offset,
            limit: options.limit
        };
        const result = await this.taxonomyClient.getAssociatedWorkspaceObjects(params);

        const linkedObjects = result.results.map((result) => {
            let workspaceType: WorkspaceType;
            let title: string;
            if (result.ws_obj.workspace.narr_name) {
                workspaceType = WorkspaceType.NARRATIVE;
                title = result.ws_obj.workspace.narr_name;
            } else if (result.ws_obj.workspace.refdata_source) {
                workspaceType = WorkspaceType.REFDATA;
                title = result.ws_obj.workspace.refdata_source + ' Reference Data';
            } else {
                workspaceType = WorkspaceType.UNKNOWN;
                title = 'Unknown Workspace Type';
            }
            return {
                linkedAt: result.edge.updated_at,
                objectID: result.ws_obj.object_id,
                workspaceID: result.ws_obj.workspace_id,
                version: result.ws_obj.version,
                objectName: result.ws_obj.name,
                createdAt: result.ws_obj.epoch,
                workspaceUpdatedAt: result.ws_obj.updated_at,
                type: {
                    module: result.ws_obj.type.module_name,
                    name: result.ws_obj.type.type_name,
                    majorVersion: result.ws_obj.type.maj_ver,
                    minorVersion: result.ws_obj.type.min_ver
                },
                workspaceType,
                title
            };
        });
        return {
            linkedObjects,
            totalCount: result.total_count
        };
    }
}
