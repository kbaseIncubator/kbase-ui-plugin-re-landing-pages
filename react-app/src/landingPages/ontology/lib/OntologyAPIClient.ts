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
        xrefs: Array<XRef>;
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

// aka relation
/*
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
*/
export type EdgeType = 'is_a' | 'part_of' | 'has_part' | 'regulates' | 'positively_regulates' |
    'negatively_regulates' | 'occurs_in' | 'ends_during' | 'happens_during';

export interface TermEdge {
    id: string;
    type: EdgeType;
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
    results: Array<TermNode>;
    ts: number;
    ns: string;
    // ignore the stats
}

export interface GetRelatedObjectsParams {
    ns: Namespace;
    id: string;
    ts: number;
}

export interface GetRelatedObjectsResult {

}

export interface GetHierarchicalAncestorsParams {
    ns: Namespace;
    id: string;
    ts: number;
    offset: number;
    limit: number;
}

export interface GetHierarchicalAncestorsResult {
    results: Array<RelatedTerm>;
    ns: Namespace;
    ts: number;
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

    async getHierarchicalAncestors({ ns, id, ts }: { ns: Namespace, id: string, ts: number }): Promise<GetHierarchicalAncestorsResult> {
        const params: GetHierarchicalAncestorsParams = {
            ns, id, ts, offset: 0, limit: 1000
        };
        const [result] = await this.callFunc<[GetHierarchicalAncestorsParams], [GetHierarchicalAncestorsResult]>('get_hierarchical_ancestors', [
            params
        ]);
        return result;
    }
}