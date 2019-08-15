import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../lib/DB';
import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import { TaxonomyModel, LinkedObject } from '../lib/model';

export type LinkedDataDBStateNone = DBStateNone;
export type LinkedDataDBStateLoading = DBStateLoading;
export type LinkedDataDBStateError = DBStateError;

export interface LinkedDataDBStateLoaded extends DBStateLoaded {
    linkedObjects: Array<LinkedObject>;
    page: number;
    pageSize: number;
}

export type LinkedDataDBState =
    | LinkedDataDBStateNone
    | LinkedDataDBStateLoading
    | LinkedDataDBStateLoaded
    | LinkedDataDBStateError;

export interface LinkedDataDBProps extends DBProps<LinkedDataDBState> {
    token: string;
    config: AppConfig;
}

export default class LinkedDataDB extends DB<LinkedDataDBState> {
    token: string;
    serviceWizardURL: string;
    constructor(props: LinkedDataDBProps) {
        super(props);
        this.token = props.token;
        this.serviceWizardURL = props.config.services.ServiceWizard.url;
    }

    async fetchLinkedObjects({ taxonID, page, pageSize }: { taxonID: string; page: number; pageSize: number }) {
        try {
            this.set((state: LinkedDataDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const client = new TaxonomyModel({
                token: this.token,
                url: this.serviceWizardURL
            });

            const offset = (page - 1) * pageSize;
            const limit = pageSize;

            const linkedObjects = await client.getLinkedObjects(taxonID, {
                offset,
                limit
            });
            this.set((state: LinkedDataDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    linkedObjects,
                    page,
                    pageSize
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: LinkedDataDBState) => {
                return {
                    status: DBStatus.ERROR,
                    message: ex.message
                };
            });
        }
    }
}
