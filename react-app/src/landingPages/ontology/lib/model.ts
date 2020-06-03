import OntologyAPIClient, { TermNode, RelatedTerm, EdgeType, Namespace } from './OntologyAPIClient';
import { OntologyReference, OntologyNamespace, OntologyTerm, OntologySource, GOOntologyTerm, OntologyRelatedTerm, OntologyRelation, stringToOntologyNamespace, ENVOOntologyTerm } from '../../../types/ontology';
import { RelationEngineCategory, RelationEngineDataSource } from '../../../types/core';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';

const REQUEST_TIMEOUT = 30000;

export interface GetTermParams {
    ref: OntologyReference;
}

export interface GetTermResult {
    term: OntologyTerm;
}

export interface GetTermsParams {
    refs: Array<OntologyReference>;
}

export interface GetTermsResult {
    terms: Array<OntologyTerm>;
}

export interface GetParentsParams {
    ref: OntologyReference;
}

// TODO: this should be a "related term", although maybe the relation 
// collapses out with ontology - are they all is_a at least for parents, children?
export interface GetParentsResult {
    terms: Array<OntologyRelatedTerm>;
}

export interface GetChildrenParams {
    ref: OntologyReference;
}

// TODO: this should be a "related term", although maybe the relation 
// collapses out with ontology - are they all is_a at least for parents, children?
export interface GetChildrenResult {
    terms: Array<OntologyRelatedTerm>;
}

export interface GetAncestorGraphParams {
    ref: OntologyReference;
}

export interface GetRelatedFeaturesParams {
    ref: OntologyReference;
    offset: number;
    limit: number;
}

export interface WorkspaceObjectReference {
    workspaceID: number;
    objectID: number;
    version: number;
}

export interface RelatedFeature {
    objectName: string;
    featureID: string;
    relatedAt: number;
    objectRef: WorkspaceObjectReference;
}

export interface GetRelatedFeaturesResult {
    features: Array<RelatedFeature>;
}

export type NodeID = string;

export interface TermsGraphNode {
    term: OntologyTerm;
    isRoot: boolean;
    id: NodeID;
}

export interface TermsGraphRelation {
    relation: OntologyRelation;
    from: NodeID;
    to: NodeID;
}

export interface TermsGraph {
    terms: Array<TermsGraphNode>;
    relations: Array<TermsGraphRelation>;
}

export interface GetAncestorGraphResult {
    termsGraph: TermsGraph;
}

export function termNodeToTerm(term: TermNode, ns: string, ts: number): OntologyTerm {
    const namespace = stringToOntologyNamespace(ns || 'envo_ontology');

    switch (namespace) {
        case 'go_ontology':
            const goTerm: GOOntologyTerm = {
                type: OntologySource.GO,
                ref: {
                    category: RelationEngineCategory.ONTOLOGY,
                    dataSource: RelationEngineDataSource.GO, // TODO: stringToOntologyNamespace(term.ns),
                    id: term.id,
                    timestamp: ts
                },
                namespace: ns,
                comments: term.comments,
                definition: term.def ? term.def.val : 'n/a',
                goID: term.id,
                isObsolete: false, // ignored for now, 
                name: term.name,
                synonyms: {
                    exact: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasExactSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    narrow: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasNarrowSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    broad: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasBroadSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    related: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasRelatedSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                }, // TODO:
            };
            return goTerm;
        case 'envo_ontology':
            const envoTerm: ENVOOntologyTerm = {
                type: OntologySource.ENVO,
                ref: {
                    category: RelationEngineCategory.ONTOLOGY,
                    dataSource: RelationEngineDataSource.ENVO, // TODO: stringToOntologyNamespace(term.ns),
                    id: term.id,
                    timestamp: ts
                },
                namespace: 'envo_ontology',
                comments: term.comments,
                definition: term.def ? term.def.val : 'n/a',
                envoID: term.id,
                isObsolete: false, // ignored for now, 
                name: term.name
                // synonyms: {
                //     exact: term.synonyms.filter((synonym) => {
                //         return synonym.pred === 'hasExactSynonym';
                //     }).map((synonym) => {
                //         return synonym.val;
                //     }),
                //     narrow: term.synonyms.filter((synonym) => {
                //         return synonym.pred === 'hasNarrowSynonym';
                //     }).map((synonym) => {
                //         return synonym.val;
                //     }),
                //     broad: term.synonyms.filter((synonym) => {
                //         return synonym.pred === 'hasBroadSynonym';
                //     }).map((synonym) => {
                //         return synonym.val;
                //     }),
                //     related: term.synonyms.filter((synonym) => {
                //         return synonym.pred === 'hasRelatedSynonym';
                //     }).map((synonym) => {
                //         return synonym.val;
                //     }),
                // }, // TODO:
            };
            return envoTerm;
        default:
            throw new Error('Ontology namespace not yet supported: ' + namespace);
    }
}

/*
  IS_A = 'OntologyRelation$is_a',
    PART_OF = 'OntologyRelation$part_of',
    HAS_PART = 'OntologyRelation$has_part',
    REGULATES = 'OntologyRelation$regulates',
    POSITIVELY_REGULATES = 'OntologyRelation$positivelyRegulates',
    NEGATIVELY_REGULATES = 'OntologyRelation$negativelyRegulates',
    OCCURS_IN = 'OntologyRelation$occursIn',
    ENDS_DURING = 'OntologyRelation$endsDuring',
    HAPPENS_DURING = 'OntologyRelation$happensDuring'
*/

export function stringToTermRelation(relationString: EdgeType): OntologyRelation {
    switch (relationString) {
        case 'is_a':
            return OntologyRelation.IS_A;
        case 'part_of':
            return OntologyRelation.PART_OF;
        case 'has_part':
            return OntologyRelation.HAS_PART;
        case 'regulates':
            return OntologyRelation.REGULATES;
        case 'positively_regulates':
            return OntologyRelation.POSITIVELY_REGULATES;
        case 'negatively_regulates':
            return OntologyRelation.NEGATIVELY_REGULATES;
        case 'occurs_in':
            return OntologyRelation.OCCURS_IN;
        case 'ends_during':
            return OntologyRelation.ENDS_DURING;
        case 'happens_during':
            return OntologyRelation.HAPPENS_DURING;
        case 'derives_from':
            return OntologyRelation.DERIVES_FROM;
        case 'has_output':
            return OntologyRelation.HAS_OUTPUT;
        case 'has_input':
            return OntologyRelation.HAS_INPUT;
        case 'input_of':
            return OntologyRelation.INPUT_OF;
        case 'output_of':
            return OntologyRelation.OUTPUT_OF;
        case 'determines':
            return OntologyRelation.DETERMINES;
        case 'surrounded_by':
            return OntologyRelation.SURROUNDED_BY;
        case 'has_quality':
            return OntologyRelation.HAS_QUALITY;
        case 'adjacent_to':
            return OntologyRelation.ADJACENT_TO;
        case 'overlaps':
            return OntologyRelation.OVERLAPS;
        case 'composed_primarily_of':
            return OntologyRelation.COMPOSED_PRIMARILY_OF;

        default:
            throw new Error('Unknown relation: ' + relationString);
    }
}

export function relationToString(relation: OntologyRelation): EdgeType {
    switch (relation) {
        case OntologyRelation.IS_A:
            return 'is_a';
        case OntologyRelation.PART_OF:
            return 'part_of';
        case OntologyRelation.HAS_PART:
            return 'has_part';
        case OntologyRelation.REGULATES:
            return 'regulates';
        case OntologyRelation.POSITIVELY_REGULATES:
            return 'positively_regulates';
        case OntologyRelation.NEGATIVELY_REGULATES:
            return 'negatively_regulates';
        case OntologyRelation.OCCURS_IN:
            return 'occurs_in';
        case OntologyRelation.ENDS_DURING:
            return 'ends_during';
        case OntologyRelation.HAPPENS_DURING:
            return 'happens_during';
        case OntologyRelation.DERIVES_FROM:
            return 'derives_from';
        case OntologyRelation.HAS_OUTPUT:
            return 'has_output';
        case OntologyRelation.HAS_INPUT:
            return 'has_input';
        case OntologyRelation.OUTPUT_OF:
            return 'output_of';
        case OntologyRelation.INPUT_OF:
            return 'input_of';
        case OntologyRelation.DETERMINES:
            return 'determines';
        case OntologyRelation.SURROUNDED_BY:
            return 'surrounded_by';
        case OntologyRelation.HAS_QUALITY:
            return 'has_quality';
        case OntologyRelation.ADJACENT_TO:
            return 'adjacent_to';
        case OntologyRelation.OVERLAPS:
            return 'overlaps';
        case OntologyRelation.COMPOSED_PRIMARILY_OF:
            return 'composed_primarily_of';
    }
}

export function relatedTermToTerm(relatedTerm: RelatedTerm, namespace: Namespace, ts: number): OntologyRelatedTerm {
    const term = termNodeToTerm(relatedTerm.term, namespace, ts);
    const relation = stringToTermRelation(relatedTerm.edge.type);
    return {
        term, relation
    };
}

export function ontologyReferenceToNamespace(ref: OntologyReference): OntologyNamespace {
    switch (ref.category) {
        case RelationEngineCategory.ONTOLOGY:
            switch (ref.dataSource) {
                case RelationEngineDataSource.GO:
                    return 'go_ontology';
                case RelationEngineDataSource.ENVO:
                    return 'envo_ontology';
            }
    }
}

export interface OntologyModelParams {
    token: string;
    url: string;
    ontologyAPIConfig: DynamicServiceConfig;
}

export default class OntologyModel {
    ontologyClient: OntologyAPIClient;
    token: string;
    url: string;
    ontologyAPIConfig: DynamicServiceConfig;
    constructor({ token, url, ontologyAPIConfig }: OntologyModelParams) {
        this.token = token;
        this.url = url;
        this.ontologyAPIConfig = ontologyAPIConfig;
        this.ontologyClient = new OntologyAPIClient({
            token,
            url,
            timeout: REQUEST_TIMEOUT,
            version: ontologyAPIConfig.version
        });
    }

    // async getTerms({ refs }: GetTermsParams): Promise<GetTermsResult> {
    //     const client = new OntologyAPIClient({
    //         token: this.token,
    //         url: this.url
    //     });

    //     if (refs.length === 0) {
    //         return { terms: [] };
    //     }

    //     const ns = ontologyNamespaceToString(refs[0].namespace);
    //     const ids = refs.map(({ id }))

    //     const result = await client.getTerms({
    //         ns,
    //         ids: [ref.id],
    //         ts: ref.timestamp
    //     })

    //     return {
    //         term: rawTermToTerm(result.term, result.ts)
    //     };

    // }

    async getTerm({ ref }: { ref: OntologyReference; }): Promise<GetTermResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const namespace = ontologyReferenceToNamespace(ref);

        const result = await client.getTerms({
            ns: namespace,
            ids: [ref.id],
            ts: ref.timestamp || Date.now()
        });

        return {
            term: termNodeToTerm(result.results[0], namespace, result.ts)
        };
    }

    async getParents({ ref }: GetParentsParams): Promise<GetParentsResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const namespace = ontologyReferenceToNamespace(ref);

        const result = await client.getParents({
            ns: namespace,
            id: ref.id,
            ts: ref.timestamp || Date.now()
        });

        return {
            terms: result.results.map((item) => {
                return relatedTermToTerm(item, namespace, result.ts);
            })
        };
    }

    async getChildren({ ref }: GetChildrenParams): Promise<GetChildrenResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const namespace = ontologyReferenceToNamespace(ref);

        const result = await client.getChildren({
            ns: namespace,
            id: ref.id,
            ts: ref.timestamp || Date.now()
        });

        return {
            terms: result.results.map((item) => {
                return relatedTermToTerm(item, namespace, result.ts);
            })
        };
    }

    async getRelatedFeatures({ ref, offset, limit }: GetRelatedFeaturesParams): Promise<GetRelatedFeaturesResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const result = await client.getAssociatedWSObjects({
            ns: ontologyReferenceToNamespace(ref),
            id: ref.id,
            ts: ref.timestamp || Date.now(),
            offset, limit
        });

        // const features: Array<RelatedFeature> = result.results.reduce((features, genomeWithFeatures) => {
        //     genomeWithFeatures.features.forEach((feature) => {
        //         features.push({
        //             featureID: feature.feature_id,
        //             relatedAt: feature.updated_at,
        //             objectName: genomeWithFeatures.ws_obj.name,
        //             objectRef: {
        //                 workspaceID: genomeWithFeatures.ws_obj.workspace_id,
        //                 objectID: genomeWithFeatures.ws_obj.object_id,
        //                 version: genomeWithFeatures.ws_obj.version
        //             }
        //         });
        //     })
        //     return features;
        // }, []: Array<RelatedFeature>);


        const features: Array<RelatedFeature> = [];
        result.results.forEach((genomeWithFeatures) => {
            genomeWithFeatures.features.forEach((feature) => {
                features.push({
                    featureID: feature.feature_id,
                    relatedAt: feature.updated_at,
                    objectName: genomeWithFeatures.ws_obj.name,
                    objectRef: {
                        workspaceID: genomeWithFeatures.ws_obj.workspace_id,
                        objectID: genomeWithFeatures.ws_obj.object_id,
                        version: genomeWithFeatures.ws_obj.version
                    }
                });
            });
        });

        return {
            features
        };
    }

    async getAncestorGraph({ ref }: GetAncestorGraphParams): Promise<GetAncestorGraphResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const result = await client.getHierarchicalAncestors({
            ns: ontologyReferenceToNamespace(ref),
            id: ref.id,
            ts: ref.timestamp || Date.now(),
            // TODO: should these be params? We can't support paging for the ancestor graph,
            // and it should never be too large, so probably remove from the upstream api??
            offset: 0,
            limit: 1000
        });

        const relations: Array<TermsGraphRelation> = [];
        result.results.forEach((item) => {
            const relation = stringToTermRelation(item.edge.type);
            if (relations.some((r) => {
                return r.from === item.edge.from &&
                    r.to === item.edge.to &&
                    r.relation === relation;
            })) {
                return;
            }
            relations.push({
                relation,
                from: item.edge.from,
                to: item.edge.to
            });
        });
        const relationsMap = relations.reduce((m, r) => {
            let nodes = m.get(r.from);
            if (!nodes) {
                nodes = [];
            }
            nodes.push(r);
            m.set(r.from, nodes);
            return m;
        }, new Map<string, Array<TermsGraphRelation>>());

        const terms = new Map<string, TermsGraphNode>();
        result.results.forEach((item) => {
            if (!terms.has(item.term.id)) {
                const term = termNodeToTerm(item.term, ontologyReferenceToNamespace(ref), result.ts);
                let isRoot = false;
                const nodes = relationsMap.get(term.ref.id);
                if (!nodes) {
                    isRoot = true;
                }

                terms.set(item.term.id, {
                    id: term.ref.id,
                    term, isRoot
                });
            }
        });

        return {
            termsGraph: {
                terms: Array.from(terms.values()),
                relations
            }
        };
    }
}