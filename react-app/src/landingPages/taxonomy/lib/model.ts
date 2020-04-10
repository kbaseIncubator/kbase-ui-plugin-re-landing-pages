import { TaxonomyReference, Taxon, NCBITaxon, GTDBTaxon } from '../../../types/taxonomy';
import TaxonAPIClient from './TaxonAPIClient';
import { relationEngineReferenceToNamespace } from '../../../types/transform';
import { RelationEngineCategory, RelationEngineDataSource, } from '../../../types/core';

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

export class TaxonomyModel {
    taxonomyClient: TaxonAPIClient;
    constructor({ token, url }: { token: string; url: string; }) {
        this.taxonomyClient = new TaxonAPIClient({ token, url, timeout: REQUEST_TIMEOUT });
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

                    // TODO: remove when name -> scientific_name for gtdb taxonomy
                    const x = (taxonResult as unknown) as any;
                    const name = x['name'] as string;

                    // console.log('gtdb taxon is', name, taxonResult);

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
                        name,
                        // name: taxonResult.scientific_name,
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
                    // TODO: remove when name -> scientific_name for gtdb taxonomy
                    const x = (taxonResult as unknown) as any;
                    const name = x['name'] as string;
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
                        name,
                        // name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological
                    };
                });
                return [gtdbTaxa, result.total_count];
            default:
                throw new Error('Not a supported taxonomy data source');
        }


    }

    // async getChildrenx(taxonID: TaxonID, options: GetChildrenOptions): Promise<[Array<Taxon>, number, number]> {
    //     // Loop over results until done!
    //     // Get the first batch. In the majority of cases, this will be it.

    //     const getBatch = async (batch: number, batchSize: number): Promise<[Array<Taxon>, number]> => {
    //         const offset = batch * batchSize;
    //         const result = await this.taxonomyClient.getChildren({
    //             taxonID,
    //             offset,
    //             limit: batchSize
    //         });

    //         const taxa = result.results.map((taxonResult) => {
    //             let isBiological: boolean;
    //             if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
    //                 isBiological = false;
    //             } else {
    //                 isBiological = true;
    //             }
    //             return {
    //                 type: TaxonomySource.NCBI,
    //                 id: taxonResult._id,
    //                 name: taxonResult.scientific_name,
    //                 rank: taxonResult.rank,
    //                 ncbiID: taxonResult.NCBI_taxon_id,
    //                 geneticCode: parseInt(taxonResult.gencode),
    //                 aliases: taxonResult.aliases.map(({ name, category }) => {
    //                     return {
    //                         name,
    //                         category
    //                     };
    //                 }),
    //                 isBiological
    //             };
    //         });
    //         return [taxa, result.total_count];
    //     };

    //     const [taxa, totalCount] = await getBatch(0, INITIAL_BATCH_SIZE);

    //     if (totalCount <= taxa.length) {
    //         return [taxa, totalCount, totalCount];
    //     }

    //     // Here we cap the total results requested to TOTAL_LIMIT
    //     let totalLimit = Math.min(totalCount, TOTAL_LIMIT);

    //     // How many batches do we need to fetch?
    //     const totalBatchCount = Math.ceil((totalLimit - INITIAL_BATCH_SIZE) / BATCH_SIZE);

    //     // In order to avoid overwhelming the service, we need to limit the
    //     // # of concurrent requests.
    //     const iterations = Math.ceil(totalBatchCount / PARALLELISM);

    //     console.log('BATCHES', totalBatchCount, iterations);

    //     let result = taxa;

    //     console.log('taxa', taxa);

    //     for (let iter = 0; iter < iterations; iter += 1) {
    //         const pendingBatches: Array<Promise<[Array<Taxon>, number]>> = [];

    //         const batchCount = Math.min(PARALLELISM, totalBatchCount - iter * PARALLELISM);

    //         console.log(`iter ${iter}`);

    //         for (let batch = 0; batch < batchCount; batch += 1) {
    //             const offset = iter * PARALLELISM + batch;
    //             const batchSize = Math.min(BATCH_SIZE, totalLimit - offset * BATCH_SIZE);
    //             console.log('BATCH SIZE', batchSize, iter, batch, totalLimit - offset * BATCH_SIZE);
    //             pendingBatches.push(getBatch(offset, batchSize));
    //             // const [nextResult] = await getBatch(i);
    //             // console.log('adding another batch', nextResult);
    //             // result = result.concat(nextResult);
    //         }

    //         const batches = await Promise.all(pendingBatches);

    //         result = result.concat.apply(
    //             result,
    //             batches.map(([taxa, count]) => {
    //                 return taxa;
    //             })
    //         );
    //     }

    //     return [result, totalCount, totalLimit];
    // }

    async getTaxon(taxonRef: TaxonomyReference): Promise<Taxon> {
        const {
            id, timestamp
        } = taxonRef;

        const result = await this.taxonomyClient.getTaxon({
            ns: relationEngineReferenceToNamespace(taxonRef),
            id,
            ts: timestamp
        });

        // if (!result.count) {
        //     throw new Error(`Taxon not found`);
        // }
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
                    // TODO: remove when name -> scientific_name for gtdb taxonomy
                    const x = (taxonResult as unknown) as any;
                    const name = x['name'] as string;
                    const gtdbTaxon: GTDBTaxon = {
                        ref: {
                            category: RelationEngineCategory.TAXONOMY,
                            dataSource: RelationEngineDataSource.GTDB,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name,
                        // name: taxonResult.scientific_name,
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
