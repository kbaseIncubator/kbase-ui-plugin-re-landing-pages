import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../lib/DB';
import { OntologyTerm, OntologyReference } from '../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel from '../lib/model';

export type OntologyDBStateNone = DBStateNone;
export type OntologyDBStateLoading = DBStateLoading;
export type OntologyDBStateError = DBStateError;
export interface OntologyDBStateLoaded extends DBStateLoaded {
    targetTerm: OntologyTerm;
    selectedTerm: OntologyTerm;
}

export type OntologyDBState = OntologyDBStateNone | OntologyDBStateLoading | OntologyDBStateLoaded | OntologyDBStateError;

export interface OntologyDBProps extends DBProps<OntologyDBState> {
    token: string;
    config: AppConfig;
}

export default class OntologyDB extends DB<OntologyDBState> {
    props: OntologyDBProps;
    constructor(props: OntologyDBProps) {
        super(props);
        this.props = props;
    }

    async getTargetTerm(termRef: OntologyReference) {
        this.set((state: OntologyDBState) => {
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

            const { term } = await client.getTerm({
                ref: termRef
            });

            this.set((state: OntologyDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    targetTerm: term,
                    selectedTerm: term
                }
            });
        } catch (ex) {
            this.set((state: OntologyDBState) => {
                return {
                    ...state,
                    status: DBStatus.ERROR,
                    error: ex.message
                };
            });
        }
    }

    getSelectedTerm(termRef: OntologyReference) {
        this.set((state: OntologyDBState) => {
            return {
                ...state,
                status: DBStatus.LOADING
            };
        });

        // const client = new OntologyModel({
        //     token: this.props.token,
        //     url: this.props.config.services.ServiceWizard.url
        // })
    }
}