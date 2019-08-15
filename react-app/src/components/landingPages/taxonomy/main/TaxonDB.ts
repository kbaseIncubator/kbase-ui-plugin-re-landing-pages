import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../lib/DB';
import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import { Taxon, TaxonID } from '../redux/store';
import { TaxonomyModel } from '../lib/model';

export type TaxonDBStateNone = DBStateNone;
export type TaxonDBStateLoading = DBStateLoading;
export type TaxonDBStateError = DBStateError;

export interface TaxonDBStateLoaded extends DBStateLoaded {
    targetTaxon: Taxon;
    selectedTaxon: Taxon;
}

export type TaxonDBState = TaxonDBStateNone | TaxonDBStateLoading | TaxonDBStateLoaded | TaxonDBStateError;

export interface TaxonDBProps extends DBProps<TaxonDBState> {
    token: string;
    config: AppConfig;
}

// TODO: make props part of generic
export default class TaxonDB extends DB<TaxonDBState> {
    props: TaxonDBProps;
    constructor(props: TaxonDBProps) {
        super(props);
        this.props = props;
    }
    async getTargetTaxon(taxonID: TaxonID) {
        try {
            this.set((state: TaxonDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const client = new TaxonomyModel({
                token: this.props.token,
                url: this.props.config.services.ServiceWizard.url
            });

            const taxon = await client.getTaxon(taxonID);
            this.set((state: TaxonDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    targetTaxon: taxon,
                    selectedTaxon: taxon
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: TaxonDBState) => {
                return {
                    status: DBStatus.ERROR,
                    message: ex.message
                };
            });
        }
    }

    async getSelectedTaxon(taxonID: TaxonID) {
        try {
            // this.set((state: TaxonDBState) => {
            //     return {
            //         ...state,
            //         status: DBStatus.LOADING
            //     };
            // });

            const client = new TaxonomyModel({
                token: this.props.token,
                url: this.props.config.services.ServiceWizard.url
            });

            const taxon = await client.getTaxon(taxonID);
            this.set((state: TaxonDBState) => {
                return {
                    ...state,
                    selectedTaxon: taxon
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: TaxonDBState) => {
                return {
                    status: DBStatus.ERROR,
                    message: ex.message
                };
            });
        }
    }
}
