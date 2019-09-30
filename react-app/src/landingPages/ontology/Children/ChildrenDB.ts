import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../lib/DB';
import { OntologyTerm, OntologyReference, GOOntologyTerm } from '../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel from '../lib/model';

export type ParentsDBStateNone = DBStateNone;
export type ParentsDBStateLoading = DBStateLoading;
export type ParentsDBStateError = DBStateError;
export interface ParentsDBStateLoaded extends DBStateLoaded {
    terms: Array<OntologyTerm>;
}

export type ParentsDBState = ParentsDBStateNone | ParentsDBStateLoading | ParentsDBStateLoaded | ParentsDBStateError;

export interface ParentsDBProps extends DBProps<ParentsDBState> {
    token: string;
    config: AppConfig;
}

export default class ParentsDB extends DB<ParentsDBState> {
    props: ParentsDBProps;
    constructor(props: ParentsDBProps) {
        super(props);
        this.props = props;
    }

    async getChildrenTerms(termRef: OntologyReference) {
        this.set((state: ParentsDBState) => {
            return {
                ...state,
                status: DBStatus.LOADING
            };
        });

        const client = new OntologyModel({
            token: this.props.token,
            url: this.props.config.services.ServiceWizard.url
        });

        try {

            const { terms } = await client.getChildren({
                ref: termRef
            });

            terms.sort((a: GOOntologyTerm, b: GOOntologyTerm) => {
                return a.name.localeCompare(b.name);
            });

            this.set((state: ParentsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    terms: terms
                }
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: ParentsDBState) => {
                return {
                    ...state,
                    status: DBStatus.ERROR,
                    error: ex.message
                };
            });
        }
    }

}