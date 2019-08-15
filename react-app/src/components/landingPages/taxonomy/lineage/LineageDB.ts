import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../lib/DB';
import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import { Taxon, TaxonID } from '../redux/store';
import { TaxonomyModel } from '../lib/model';

export type LineageDBStateNone = DBStateNone;
export type LineageDBStateLoading = DBStateLoading;
export type LineageDBStateError = DBStateError;

export interface LineageDBStateLoaded extends DBStateLoaded {
    lineage: Array<Taxon>;
}

export type LineageDBState = LineageDBStateNone | LineageDBStateLoading | LineageDBStateLoaded | LineageDBStateError;

export interface LineageDBProps extends DBProps<LineageDBState> {
    token: string;
    config: AppConfig;
}

// TODO: make props part of generic
export default class LineageDB extends DB<LineageDBState> {
    props: LineageDBProps;
    constructor(props: LineageDBProps) {
        super(props);
        this.props = props;
    }
    async getLineage(taxonID: TaxonID) {
        try {
            this.set((state: LineageDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const client = new TaxonomyModel({
                token: this.props.token,
                url: this.props.config.services.ServiceWizard.url
            });

            const lineage = await client.getLineage(taxonID);
            this.set((state: LineageDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    lineage
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: LineageDBState) => {
                return {
                    status: DBStatus.ERROR,
                    message: ex.message
                };
            });
        }
    }
}
