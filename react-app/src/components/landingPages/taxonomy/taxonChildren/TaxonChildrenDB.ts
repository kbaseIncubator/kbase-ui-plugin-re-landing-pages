import DB, {
    DBProps,
    DBStatus,
    DBStateNone,
    DBStateLoading,
    DBStateLoaded,
    DBStateError,
    DBStateReLoading
} from '../lib/DB';
import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import { Taxon } from '../redux/store';
import { TaxonomyModel } from '../lib/model';

export type TaxonDBStateNone = DBStateNone;
export type TaxonDBStateLoading = DBStateLoading;
export type TaxonDBStateError = DBStateError;

export interface TaxonDBStateLoaded extends DBStateLoaded {
    taxa: Array<Taxon>;
    total: number;
    page: number;
    pageSize: number;
}

export interface TaxonDBStateReLoading extends DBStateReLoading {
    taxa: Array<Taxon>;
    total: number;
    page: number;
    pageSize: number;
}

export type TaxonDBState =
    | TaxonDBStateNone
    | TaxonDBStateLoading
    | TaxonDBStateLoaded
    | TaxonDBStateReLoading
    | TaxonDBStateError;

export interface TaxonDBProps extends DBProps<TaxonDBState> {
    token: string;
    config: AppConfig;
}

export default class TaxonDB extends DB<TaxonDBState> {
    token: string;
    serviceWizardURL: string;
    constructor(props: TaxonDBProps) {
        super(props);
        this.token = props.token;
        this.serviceWizardURL = props.config.services.ServiceWizard.url;
    }
    // Remember, pages are 1 based; offset is 0 based.
    // async fetchTaxa(taxonID: TaxonID, page: number, pageSize: number) {
    //     try {
    //         this.set((state: TaxonDBState) => {
    //             return {
    //                 ...state,
    //                 status: DBStatus.LOADING
    //             };
    //         });

    //         const client = new TaxonomyModel({
    //             token: this.token,
    //             url: this.serviceWizardURL
    //         });

    //         const offset = (page - 1) * pageSize;
    //         const limit = pageSize;

    //         const [taxa, totalCount] = await client.getChildren(taxonID, {
    //             offset,
    //             limit
    //         });
    //         this.set((state: TaxonDBState) => {
    //             return {
    //                 ...state,
    //                 status: DBStatus.LOADED,
    //                 taxa,
    //                 total: totalCount,
    //                 page,
    //                 pageSize
    //             };
    //         });
    //     } catch (ex) {
    //         console.error('ERROR', ex);
    //         this.set((state: TaxonDBState) => {
    //             return {
    //                 status: DBStatus.ERROR,
    //                 message: ex.message
    //             };
    //         });
    //     }
    // }

    async fetchChildren({
        taxonID,
        page,
        pageSize,
        searchTerm
    }: {
        taxonID: string;
        page: number;
        pageSize: number;
        searchTerm: string;
    }) {
        try {
            this.set((state: TaxonDBState) => {
                if (state.status === DBStatus.LOADED) {
                    return {
                        ...state,
                        status: DBStatus.RELOADING
                    };
                } else {
                    return {
                        ...state,
                        status: DBStatus.LOADING
                    };
                }
            });

            const client = new TaxonomyModel({
                token: this.token,
                url: this.serviceWizardURL
            });

            const offset = (page - 1) * pageSize;
            const limit = pageSize;

            const [taxa, totalCount] = await client.getChildren(taxonID, {
                offset,
                limit,
                searchTerm
            });
            this.set((state: TaxonDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    taxa,
                    total: totalCount,
                    page,
                    pageSize
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
