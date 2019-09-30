import OntologyAPIClient, { Namespace, TermNode, RelatedTerm } from './OntologyAPIClient';
import { OntologyReference, OntologyNamespace, OntologyTerm, OntologySource, GOOntologyTerm } from '../../../types/ontology';
import { RelationEngineCollection } from '../../../types';

export interface GetTermParams {
    ref: OntologyReference
}

export interface GetTermResult {
    term: OntologyTerm;
}

export interface GetTermsParams {
    refs: Array<OntologyReference>
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
    terms: Array<OntologyTerm>
}

export interface GetChildrenParams {
    ref: OntologyReference;
}

// TODO: this should be a "related term", although maybe the relation 
// collapses out with ontology - are they all is_a at least for parents, children?
export interface GetChildrenResult {
    terms: Array<OntologyTerm>
}

export function ontologyNamespaceToString(namespace: OntologyNamespace): Namespace {
    switch (namespace) {
        case OntologyNamespace.GO:
            return 'go';
    }
}

export function stringToOntologyNamespace(ns: Namespace): OntologyNamespace {
    switch (ns) {
        case 'go':
            return OntologyNamespace.GO
        default:
            throw new Error('Unknown ontology namespace: ' + ns);
    }
}

export function termNodeToTerm(term: TermNode, ts: number): OntologyTerm {
    const namespace = stringToOntologyNamespace('go');
    switch (namespace) {
        case OntologyNamespace.GO:
            const temp: GOOntologyTerm = {
                type: OntologySource.GO,
                ref: {
                    collection: RelationEngineCollection.ONTOLOGY,
                    namespace: OntologyNamespace.GO, // TODO: stringToOntologyNamespace(term.ns),
                    id: term.id,
                    timestamp: ts
                },
                namespace: term.namespace,
                comments: term.comments,
                definition: term.def.val,
                goID: term.id,
                isObsolete: false, // ignored for now, 
                name: term.name,
                synonyms: {
                    exact: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasExactSynonym'
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    narrow: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasNarrowSynonym'
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    broad: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasBroadSynonym'
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    related: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasRelatedSynonym'
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                }, // TODO:
            };
            return temp;
    }
}

export function relatedTermToTerm(relatedTerm: RelatedTerm, ts: number): OntologyTerm {
    return termNodeToTerm(relatedTerm.term, ts);
}

export default class OntologyModel {
    ontologyClient: OntologyAPIClient;
    token: string;
    url: string;
    constructor({ token, url }: { token: string; url: string }) {
        this.token = token;
        this.url = url;
        this.ontologyClient = new OntologyAPIClient({ token, url });
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

    async getTerm({ ref }: GetTermParams): Promise<GetTermResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url
        });

        const result = await client.getTerms({
            ns: ontologyNamespaceToString(ref.namespace),
            ids: [ref.id],
            ts: ref.timestamp || Date.now()
        });

        return {
            term: termNodeToTerm(result.results[0], result.ts)
        };
    }

    async getParents({ ref }: GetParentsParams): Promise<GetParentsResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url
        });

        const result = await client.getParents({
            ns: ontologyNamespaceToString(ref.namespace),
            id: ref.id,
            ts: ref.timestamp || Date.now()
        });

        return {
            terms: result.results.map((item) => {
                return relatedTermToTerm(item, result.ts);
            })
        };
    }

    async getChildren({ ref }: GetChildrenParams): Promise<GetChildrenResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url
        });

        const result = await client.getChildren({
            ns: ontologyNamespaceToString(ref.namespace),
            id: ref.id,
            ts: ref.timestamp || Date.now()
        });

        return {
            terms: result.results.map((item) => {
                return relatedTermToTerm(item, result.ts);
            })
        };
    }
}