import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../lib/DB';
import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import { Taxon, TaxonID } from '../redux/store';
import { TaxonomyModel } from '../lib/model';

export type TaxonInfoDBStateNone = DBStateNone;
export type TaxonInfoDBStateLoading = DBStateLoading;
export type TaxonInfoDBStateError = DBStateError;

export interface TaxonInfoDBStateLoaded extends DBStateLoaded {
    taxon: Taxon;
}

export type TaxonInfoDBState =
    | TaxonInfoDBStateNone
    | TaxonInfoDBStateLoading
    | TaxonInfoDBStateLoaded
    | TaxonInfoDBStateError;

export interface TaxonInfoDBProps extends DBProps<TaxonInfoDBState> {
    token: string;
    config: AppConfig;
}

export default class TaxonInfoDB extends DB<TaxonInfoDBState> {
    token: string;
    serviceWizardURL: string;
    constructor(props: TaxonInfoDBProps) {
        super(props);
        this.token = props.token;
        this.serviceWizardURL = props.config.services.ServiceWizard.url;
    }
    // Remember, pages are 1 based; offset is 0 based.
    async fetchTaxon(taxonID: TaxonID) {
        try {
            this.set((state: TaxonInfoDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const client = new TaxonomyModel({
                token: this.token,
                url: this.serviceWizardURL
            });

            const taxon = await client.getTaxon(taxonID);
            this.set((state: TaxonInfoDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    taxon
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: TaxonInfoDBState) => {
                return {
                    status: DBStatus.ERROR,
                    message: ex.message
                };
            });
        }
    }
}
