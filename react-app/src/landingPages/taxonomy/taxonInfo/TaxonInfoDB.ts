import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../lib/DB';
import { AppConfig } from '@kbase/ui-components';
import { Taxon, TaxonomyReference } from '../../../types/taxonomy';
import { TaxonomyModel } from '../lib/model';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';

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
    taxonomyAPIConfig: DynamicServiceConfig;
    constructor(props: TaxonInfoDBProps) {
        super(props);
        this.token = props.token;
        this.serviceWizardURL = props.config.services.ServiceWizard.url;
        this.taxonomyAPIConfig = props.config.dynamicServices.TaxonomyAPI;
    }
    // Remember, pages are 1 based; offset is 0 based.
    async fetchTaxon(taxonRef: TaxonomyReference) {
        try {
            this.set((state: TaxonInfoDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const client = new TaxonomyModel({
                token: this.token,
                url: this.serviceWizardURL,
                taxonomyAPIConfig: this.taxonomyAPIConfig
            });

            const taxon = await client.getTaxon(taxonRef);
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
                    error: {
                        code: 'not-found',
                        source: 'TaxonInfoDB.fetchTaxon',
                        message: ex.message,
                    }
                };
            });
        }
    }
}
