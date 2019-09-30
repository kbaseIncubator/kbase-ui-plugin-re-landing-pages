import { DynamicServiceClient } from "@kbase/ui-lib";

export interface GetParentsParams {
    ns: Namespace;
    id: string;
    ts: number;
}

export type Namespace = 'go';

export interface GetParentsResult {
    results: Array<RelatedTerm>;
    ns: Namespace;
    ts: number;
}

export interface GetChildrenParams {
    ns: Namespace;
    id: string;
    ts: number;
}

export interface GetChildrenResult {
    results: Array<RelatedTerm>;
    ns: Namespace;
    ts: number;
}

export interface Synonym {
    pred: string;
    val: string;
    xrefs: Array<XRef>
}

export interface XRef {
    val: string;
}

// export interface Termx {
//     ns: string;
//     id: string;
//     ts: number;
//     name: string;
//     scientific_name: string;
//     relation: string;
//     synonyms: Array<Synonym>;
//     goID?: string;
//     commnent: string;
//     definition: string;
// }

// doesn't include the underscore fields
// TODO: the api should not return any underscore
// fields.
export interface TermNode {
    namespace: string;
    id: string;
    alt_ids: Array<string>;
    name: string;
    comments: Array<string>;
    def: {
        val: string;
        xrefs: Array<string>;
    };
    created: number;
    expired: number;
    subsets: Array<string>;
    synonyms: Array<Synonym>;
    type: string;
    xrefs: Array<XRef>;

    first_version: string;
    last_version: string;
    release_created: number;
    release_expired: number;
}

export interface TermEdge {
    id: string;
    type: string;
    created: number;
    expired: number;
    first_version: string;
    last_version: string;
    from: string;
    to: string;
    release_created: number;
    release_expired: number;
}


export interface RelatedTerm {
    term: TermNode;
    edge: TermEdge;
}

// export interface TermBrief {
//     ns: Namespace;
//     id: string;
//     ts: number;
//     name: string;
//     scientific_name: string;
//     relation: string;
// }

export type TermBrief = TermNode;

export interface GetTermsParams {
    ids: Array<string>;
    ts: number;
    ns: Namespace;
}

export interface GetTermsResult {
    results: Array<TermNode>,
    ts: number
    // ignore the stats
}

export interface GetRelatedObjectsParams {
    ns: Namespace;
    id: string;
    ts: number;
}

export interface GetRelatedObjectsResult {

}

export default class OntologyAPIClient extends DynamicServiceClient {
    static module: string = 'OntologyAPI';

    async getParents({ ns, id, ts }: { ns: Namespace, id: string, ts: number }): Promise<GetParentsResult> {
        const params: GetParentsParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetParentsParams], [GetParentsResult]>('get_parents', [
            params
        ]);
        return result;
    }

    async getTerms({ ns, ids, ts }: GetTermsParams): Promise<GetTermsResult> {
        const params: GetTermsParams = {
            ns, ids, ts
        }
        const [result] = await this.callFunc<[GetTermsParams], [GetTermsResult]>('get_terms', [
            params
        ]);
        return result;
    }

    async getChildren({ ns, id, ts }: { ns: Namespace, id: string, ts: number }): Promise<GetChildrenResult> {
        const params: GetChildrenParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetChildrenParams], [GetChildrenResult]>('get_children', [
            params
        ]);
        return result;
    }

    async getRelatedObjects({ ns, id, ts }: { ns: Namespace, id: string, ts: number }): Promise<GetRelatedObjectsResult> {
        const params: GetRelatedObjectsParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetRelatedObjectsParams], [GetRelatedObjectsResult]>('get_children', [
            params
        ]);
        return result;
    }
}