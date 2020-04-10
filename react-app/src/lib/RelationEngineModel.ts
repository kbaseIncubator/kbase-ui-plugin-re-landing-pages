
import {
    RelationEngineDataSource, RelationEngineCategory, RelationEngineID,
    RelationEngineDataSourceId, RelationEngineReference
} from "../types/core";
import RelationEngineAPIClient, { DataSource } from "./RelationEngineAPIClient";
import { stringToRelationEngineCategory, stringToRelationEngineRef } from "../types/transform";

// TODO: yuck, fix this!
// export interface NodeInfo {
//     type: RelationEngineNodeType;
//     objectClass: ObjectClass;
//     namespace: TaxonomyNamespace;
//     created: number;
//     version: string;
// }

export type DataSourcesInfo = Array<RelationEngineDataSource>;

export interface DataSourceInfo {
    category: RelationEngineCategory;
    source: RelationEngineDataSource;
    data_url: string;
    home_url: string;
    logo_url: string;
    title: string;
}

function dataSourceToRelationEngineDataSource(dataSourceString: DataSource): RelationEngineDataSource {
    switch (dataSourceString) {
        case 'ncbi_taxonomy':
            return RelationEngineDataSource.NCBI;
        case 'gtdb':
            return RelationEngineDataSource.GTDB;
        case 'rdp_taxonomy':
            return RelationEngineDataSource.RDP;
        case 'go_ontology':
            return RelationEngineDataSource.GO;
        case 'envo_ontology':
            return RelationEngineDataSource.ENVO;
    }
}

function stringToDataSource(dataSourceString: string): RelationEngineDataSource {
    switch (dataSourceString) {
        case 'ncbi_taxonomy':
            return RelationEngineDataSource.NCBI;
        case 'gtdb':
            return RelationEngineDataSource.GTDB;
        case 'rdp_taxonomy':
            return RelationEngineDataSource.RDP;
        case 'go_ontology':
            return RelationEngineDataSource.GO;
        case 'envo_ontology':
            return RelationEngineDataSource.ENVO;
        default:
            throw new Error(`Not a valid data source string: ${dataSourceString}`);
    }
}

function namespaceToDataSource(dataSourceString: string): RelationEngineDataSourceId {
    switch (dataSourceString) {
        case 'ncbi_taxonomy':
            return 'ncbi_taxonomy';
        case 'gtdb':
            return 'gtdb';
        case 'rdp_taxonomy':
            return 'rdp_taxonomy';
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
        default:
            throw new Error(`Not a valid data source string: ${dataSourceString}`);
    }
}


export interface RelationEngineIDInfo {
    ref: RelationEngineReference;
    dataSourceInfo: DataSourceInfo;
}

export class RelationEngineModel {
    relationEngineClient: RelationEngineAPIClient;
    constructor({ token, url, timeout }: { token: string; url: string; timeout: number; }) {
        this.relationEngineClient = new RelationEngineAPIClient({ token, url, timeout });
    }

    async getDataSources(): Promise<DataSourcesInfo> {
        const result = await this.relationEngineClient.data_sources();
        return result.data_sources.map((dataSource) => {
            return dataSourceToRelationEngineDataSource(dataSource);
        });
    }

    async getDataSource(dataSource: RelationEngineDataSourceId): Promise<DataSourceInfo> {
        const {
            data_source: {
                category, name, data_url, home_url, logo_url, title
            }
        } = await this.relationEngineClient.data_source(dataSource);
        return {
            category: stringToRelationEngineCategory(category),
            source: stringToDataSource(name),
            data_url,
            home_url,
            logo_url,
            title
        };
    }

    async getIdInfo(relationEngineId: RelationEngineID): Promise<RelationEngineIDInfo> {
        console.log('what?', relationEngineId);
        const [namespaceString, id, timestampString] = relationEngineId.split('/');

        const dataSource = namespaceToDataSource(namespaceString);

        const dataSourceInfo = await this.getDataSource(dataSource);

        // let timestamp: number;
        // if (typeof timestampString === 'undefined') {
        //     timestamp = Date.now();
        // } else {
        //     timestamp = parseInt(timestampString, 10);
        // }

        const ref = stringToRelationEngineRef(relationEngineId, dataSourceInfo.category);
        console.log('ref is ', ref);

        // const category = dataSourceInfo.category;
        // switch (category) {
        //     case RelationEngineCategory.ONTOLOGY:
        //         switch (dataSource) {
        //             case RelationEngineDataSource.GO:
        //                 return { category, dataSource, id, timestamp };
        //             case RelationEngineDataSource.ENVO:
        //                 return { category, dataSource, id, timestamp };
        //             default:
        //                 throw new Error('Invalid data source for ontology');
        //         }
        //     case RelationEngineCategory.TAXONOMY:
        //         switch (dataSource) {
        //             case core.RelationEngineDataSource.NCBI:
        //                 return { category, dataSource, id, timestamp };
        //             case core.RelationEngineDataSource.GTDB:
        //                 return { category, dataSource, id, timestamp };
        //             case core.RelationEngineDataSource.RDP:
        //                 return { category, dataSource, id, timestamp };
        //             default:
        //                 throw new Error('Invalid data source for taxonomy');
        //         }
        // }



        // const ref: RelationEngineReference = {
        //     category: dataSourceInfo.category,
        //     dataSource: dataSourceInfo.source,
        //     id,
        //     timestamp
        // };

        return {
            ref,
            dataSourceInfo
        };
    }

    // async getNodeInfo(relationEngineID: RelationEngineID): Promise<NodeInfo> {
    //     const [result] = await this.relationEngineClient.getNodeInfo(relationEngineID);

    //     switch (result.type) {
    //         case 'taxon':
    //             return {
    //                 type: RelationEngineNodeType.TAXON,
    //                 created: result.created,
    //                 version: result.version,
    //                 source: (() => {
    //                     switch (result.source) {
    //                         case 'ncbi':
    //                             return TaxonomySource.NCBI;
    //                         case 'gtdb':
    //                             return TaxonomySource.GTDB;
    //                     }
    //                 })()
    //             };
    //         case 'ontology':
    //             return {
    //                 type: RelationEngineNodeType.ONTOLOGY_TERM,
    //                 created: result.created,
    //                 version: result.version,
    //                 source: (() => {
    //                     switch (result.source) {
    //                         case 'go':
    //                             return OntologySource.GO;
    //                     }
    //                 })()
    //             };
    //     }
    // }
}
