import OntologyAPIClient, { Term } from './OntologyAPIClient';
import { OntologyReference, OntologyNamespace, OntologyTerm, OntologySource, GOOntologyTerm } from '../../../types/ontology';
import { RelationEngineCollection } from '../../../types';

export interface GetTermParams {
    ref: OntologyReference
}

export interface GetTermResult {
    term: OntologyTerm;
}

export function ontologyNamespaceToString(namespace: OntologyNamespace): string {
    switch (namespace) {
        case OntologyNamespace.GO:
            return 'go_ontology';
    }
}

export function stringToOntologyNamespace(ns: string): OntologyNamespace {
    switch (ns) {
        case 'go_ontology':
            return OntologyNamespace.GO
        default:
            throw new Error('Unknown ontology namespace: ' + ns);
    }
}

export function rawTermToTerm(term: Term, ts: number): OntologyTerm {
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
                comment: term.comments,
                definition: term.def.val,
                goID: term.id,
                isObsolete: false, // ignored for now, 
                name: term.name,
                synonyms: {
                    exact: [],
                    narrow: [],
                    broad: [],
                    related: []
                }, // TODO:
            };
            return temp;
    }


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

    async getTerm({ ref }: GetTermParams): Promise<GetTermResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url
        });

        const result = await client.getTerm({
            ns: ontologyNamespaceToString(ref.namespace),
            id: ref.id,
            ts: ref.timestamp
        })

        return {
            term: rawTermToTerm(result.term, result.ts)
        };

    }
}