import React from 'react';
import TaxonDB from './TaxonChildrenDB';
import { DBStatus } from '../lib/DB';

import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import TaxonChildren from './TaxonChildren';
import { TaxonID } from '../redux/store';

export interface Props {
    token: string;
    config: AppConfig;
    taxonID: TaxonID;
    selectedTaxonID: TaxonID | null;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
}

interface State {}

export default class Data extends React.Component<Props, State> {
    db: TaxonDB;
    constructor(props: Props) {
        super(props);
        this.db = new TaxonDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                status: DBStatus.NONE
            },
            token: props.token,
            config: props.config
        });
    }

    fetchChildren(taxonID: TaxonID, page: number, pageSize: number, searchTerm: string) {
        return this.db.fetchChildren({ taxonID, page, pageSize, searchTerm });
    }

    render() {
        return (
            <TaxonChildren
                db={this.db.get()}
                taxonID={this.props.taxonID}
                selectedTaxonID={this.props.selectedTaxonID}
                selectTaxonID={this.props.selectTaxonID}
                navigateToTaxonID={this.props.navigateToTaxonID}
                fetchChildren={this.fetchChildren.bind(this)}
            />
        );
    }
}
