import React from 'react';
import LineageDB, { LineageDBStateLoaded } from './LineageDB';
import { DBStatus, DBStateError } from '../lib/DB';

import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import Lineage from './Lineage';
import { TaxonID } from '../redux/store';
import { Icon, Alert } from 'antd';

export interface Props {
    token: string;
    config: AppConfig;
    taxonID: TaxonID;
    selectedTaxonID: TaxonID;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
}

interface State {}

export default class Data extends React.Component<Props, State> {
    db: LineageDB;
    constructor(props: Props) {
        super(props);
        this.db = new LineageDB({
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

    renderLoading() {
        return <Icon type="loading" />;
    }

    renderError(db: DBStateError) {
        return <Alert type="error" message={db.message} />;
    }

    renderLoaded(db: LineageDBStateLoaded) {
        return (
            <Lineage
                lineage={db.lineage}
                selectedTaxonID={this.props.selectedTaxonID}
                selectTaxonID={this.props.selectTaxonID}
                navigateToTaxonID={this.props.navigateToTaxonID}
            />
        );
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.getLineage(this.props.taxonID);
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
        }
    }
}
