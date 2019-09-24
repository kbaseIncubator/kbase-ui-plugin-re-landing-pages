import OntologyAPIClient from './OntologyAPIClient';

export class OntologyModel {
    ontologyClient: OntologyAPIClient;
    constructor({ token, url }: { token: string; url: string }) {
        this.ontologyClient = new OntologyAPIClient({ token, url });
    }
}