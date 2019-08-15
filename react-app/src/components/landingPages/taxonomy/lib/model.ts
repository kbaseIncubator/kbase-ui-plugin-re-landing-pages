import { TaxonID, Taxon, TaxonomySource, NCBITaxon } from '../redux/store';
import TaxonAPIClient from './TaxonAPIClient';

// const INITIAL_BATCH_SIZE = 100;
// const BATCH_SIZE = 1000;
// const TOTAL_LIMIT = 10000;
// const PARALLELISM = 2;

export interface GetChildrenOptions {
    offset: number;
    limit: number;
    searchTerm: string;
}

export interface LinkedObject {
    linkedAt: number;
    workspaceID: number;
    objectID: number;
    version: number;
}

export interface GetLinkedObjectsOptions {
    offset: number;
    limit: number;
}

export class TaxonomyModel {
    taxonomyClient: TaxonAPIClient;
    constructor({ token, url }: { token: string; url: string }) {
        this.taxonomyClient = new TaxonAPIClient({ token, url });
    }

    async getLineage(taxonID: TaxonID): Promise<Array<Taxon>> {
        const result = await this.taxonomyClient.getLineage(taxonID);
        // TODO: should be conditional based on the source of the taxonomy??
        const taxons: Array<NCBITaxon> = result.results.map((taxonResult) => {
            let isBiological: boolean;
            if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                isBiological = false;
            } else {
                isBiological = true;
            }
            return {
                type: TaxonomySource.NCBI,
                id: taxonResult._id,
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
        return taxons;
    }

    async getChildren(taxonID: TaxonID, options: GetChildrenOptions): Promise<[Array<Taxon>, number]> {
        const result = await this.taxonomyClient.getChildren({
            taxonID,
            offset: options.offset,
            limit: options.limit,
            searchTerm: options.searchTerm
        });

        const taxa = result.results.map((taxonResult) => {
            let isBiological: boolean;
            if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                isBiological = false;
            } else {
                isBiological = true;
            }
            return {
                type: TaxonomySource.NCBI,
                id: taxonResult._id,
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
        return [taxa, result.total_count];
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

    async getTaxon(taxonID: TaxonID): Promise<Taxon> {
        const result = await this.taxonomyClient.getTaxon(taxonID);

        if (!result.count) {
            throw new Error('Taxon not found');
        }
        const taxonResult = result.results[0];
        let isBiological: boolean;
        if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
            isBiological = false;
        } else {
            isBiological = true;
        }
        const taxon: Taxon = {
            type: TaxonomySource.NCBI,
            id: taxonResult._id,
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
        return taxon;
    }

    async getLinkedObjects(taxonID: TaxonID, options: GetLinkedObjectsOptions): Promise<Array<LinkedObject>> {
        const result = await this.taxonomyClient.getAssociatedWorkspaceObjects(taxonID, options.offset, options.limit);

        console.log('LINKED DATA', result, options);

        return [
            {
                linkedAt: 0,
                objectID: 0,
                workspaceID: 0,
                version: 0
            }
        ];
    }
}
