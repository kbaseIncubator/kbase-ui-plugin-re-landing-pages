import React from 'react';
import TaxonDB, { TaxonDBStateLoaded } from './TaxonDB';
import { DBStatus, DBStateError } from '../lib/DB';

import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import Taxonomy from './Taxonomy';
import { TaxonID } from '../redux/store';
import { Icon, Alert } from 'antd';

export interface Props {
    token: string;
    config: AppConfig;
    taxonID: TaxonID;
    navigate: (taxonID: TaxonID) => void;
    setTitle: (title: string) => void;
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

    selectTaxon(taxonID: TaxonID) {
        return this.db.getSelectedTaxon(taxonID);
    }

    navigateToTaxon(taxonID: TaxonID) {
        return this.props.navigate(taxonID);
    }

    renderLoading() {
        return <Icon type="loading" />;
    }

    renderError(db: DBStateError) {
        return <Alert type="error" message={db.message} />;
    }

    renderLoaded(db: TaxonDBStateLoaded) {
        return (
            <Taxonomy
                targetTaxon={db.targetTaxon}
                selectedTaxon={db.selectedTaxon}
                selectTaxonID={this.selectTaxon.bind(this)}
                navigateToTaxonID={this.navigateToTaxon.bind(this)}
                setTitle={this.props.setTitle}
            />
        );
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.getTargetTaxon(this.props.taxonID);
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                if (this.props.taxonID !== db.targetTaxon.id) {
                    this.db.getTargetTaxon(this.props.taxonID);
                    return this.renderLoaded(db);
                } else {
                    return this.renderLoaded(db);
                }
        }
    }
}
