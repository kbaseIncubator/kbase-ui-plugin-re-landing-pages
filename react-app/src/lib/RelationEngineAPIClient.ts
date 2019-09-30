import { RelationEngineID } from '../redux/store';
import { DynamicServiceClient } from '@kbase/ui-lib';

// A collection is a top level division of the re data model
export type Collection = 'taxonomy' | 'ontology';

// export type TaxonSource = 'ncbi' | 'gtdb';
// export type OntologySource = 'go';

export interface GetNodeInfoResultBase {
    collection: Collection;
    // source: string;
    created: number;
    expired: number;
    timestamp: number;
}

export interface GetNodeInfoResultTaxon extends GetNodeInfoResultBase {
    collection: 'taxonomy';
    // source: TaxonSource;
    namespace: string;
    id: string;
}

export interface GetNodeInfoResultOntology extends GetNodeInfoResultBase {
    collection: 'ontology';
    // source: OntologySource;
    namespace: string;
    id: string;
}

export type GetNodeInfoResult = GetNodeInfoResultTaxon | GetNodeInfoResultOntology;

// export interface GetNodeInfoResult<T, S> {
//     type: NodeType;
//     created: number;
//     source: TaxonSource | OntologySource;
//     version: string;
// }

export default class RelationEngineAPIClient extends DynamicServiceClient {
    static module: string = 'relation_engine_api';
    async getNodeInfo(relationEngineID: RelationEngineID): Promise<[GetNodeInfoResult]> {
        const classRe = /^(.*?)\/(.*)$/;
        const taxonomyRe = /^([^/]+)\/([^/]+)(?:\/([^/]+))?$/;
        const ontologyRe = /^([^/]+)\/([^/]+)(?:\/([^/]+))?$/;
        return new Promise<[GetNodeInfoResult]>((resolve, reject) => {
            let m = classRe.exec(relationEngineID);
            if (!m) {
                reject(new Error('Invalid relation engine ID ' + relationEngineID));
                return;
            }
            const [, collection, rest] = m;
            // const [collection] = relationEngineID.split('/');
            switch (collection) {
                case 'taxonomy': (() => {
                    m = taxonomyRe.exec(rest);
                    if (!m) {
                        reject(new Error('Taxonomy ref is '));
                        return;
                    }
                    if (m.length !== 4) {
                        reject(new Error('Invalid relation engine id "' + relationEngineID + '"'));
                    }
                    const [, namespace, id, timestampString] = m;
                    let timestamp: number;
                    if (!timestampString) {
                        timestamp = Date.now();
                    } else {
                        timestamp = parseInt(timestampString, 10);
                    }

                    switch (namespace) {
                        case 'ncbi_taxonomy':
                            resolve([
                                {
                                    collection: 'taxonomy',
                                    namespace: namespace,
                                    id: id,
                                    timestamp,
                                    created: Date.now(),
                                    expired: new Date(2055, 5, 5).getTime()
                                }
                            ]);
                            return;
                        default:
                            reject(new Error('Unrecognized taxonomy namespace "' + namespace + '"'));
                            return;
                    }
                })();
                    break;
                case 'ontology':
                    m = ontologyRe.exec(rest);
                    if (!m) {
                        reject(new Error('Taxonomy ref is '));
                        return;
                    }
                    const [, namespace, id, timestampString] = m;
                    let timestamp: number;
                    if (timestampString) {
                        timestamp = parseInt(timestampString);
                    } else {
                        timestamp = Date.now();
                    }
                    switch (namespace) {
                        case 'go':
                            resolve([
                                {
                                    collection: 'ontology',
                                    namespace,
                                    id,
                                    timestamp,
                                    created: Date.now(),
                                    expired: new Date(2055, 5, 5).getTime()
                                }
                            ]);
                            return;
                        default:
                            reject(new Error('Ontology namespace not found "' + namespace + '"'));
                            return;
                    }
                default:
                    reject(new Error(`Collection ${collection} does not resolve to a type`));
            }
        });
    }
}
