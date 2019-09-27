import { DynamicServiceClient } from "@kbase/ui-lib";

export interface GetParentsParams {
    ns: string;
    id: string;
    ts: number;
}

export interface GetParentsResult {
    terms: Array<TermBrief>
}

export interface GetChildrenParams {
    ns: string;
    id: string;
    ts: number;
}

export interface GetChildrenResult {
    terms: Array<TermBrief>
}

export interface GetTermParams {
    ns: string;
    id: string;
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
export interface Term {
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

export interface TermBrief {
    ns: string;
    id: string;
    ts: number;
    name: string;
    scientific_name: string;
    relation: string;
}

export interface GetTermResult {
    term: Term,
    ts: number
    // ignore the stats
}

export interface GetRelatedObjectsParams {
    ns: string;
    id: string;
    ts: number;
}

export interface GetRelatedObjectsResult {

}

export default class OntologyAPIClient extends DynamicServiceClient {
    static module: string = 'ontology_re_api';

    async getParents({ ns, id, ts }: { ns: string, id: string, ts: number }): Promise<GetParentsResult> {
        const params: GetParentsParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetParentsParams], [GetParentsResult]>('get_parents', [
            params
        ]);
        return result;
    }

    async getTerm({ ns, id, ts }: { ns: string, id: string, ts: number }): Promise<GetTermResult> {
        const params: GetTermParams = {
            ns, id, ts
        }
        const [result] = await this.callFunc<[GetTermParams], [GetTermResult]>('get_term', [
            params
        ]);
        return result;
    }

    async getChildren({ ns, id, ts }: { ns: string, id: string, ts: number }): Promise<GetChildrenResult> {
        const params: GetChildrenParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetChildrenParams], [GetChildrenResult]>('get_children', [
            params
        ]);
        return result;
    }

    async getRelatedObjects({ ns, id, ts }: { ns: string, id: string, ts: number }): Promise<GetRelatedObjectsResult> {
        const params: GetRelatedObjectsParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetRelatedObjectsParams], [GetRelatedObjectsResult]>('get_children', [
            params
        ]);
        return result;
    }
}