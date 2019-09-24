import { DynamicServiceClient } from "@kbase/ui-lib";

export interface GetParentsParams {
    ns: string;
    id: string;
    ts: number;
}

export interface GetParentsResult {

}

export interface GetTermParams {
    ns: string;
    id: string;
    ts: number;
}

export interface GetTermResult {

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
        const [result] = await this.callFunc<[GetParentsParams], [GetParentsResult]>('get_term', [
            params
        ]);
        return result;
    }

    async getChildren({ ns, id, ts }: { ns: string, id: string, ts: number }): Promise<GetParentsResult> {
        const params: GetParentsParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetParentsParams], [GetParentsResult]>('get_children', [
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