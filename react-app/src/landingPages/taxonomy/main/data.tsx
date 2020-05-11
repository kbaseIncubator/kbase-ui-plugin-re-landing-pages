import React from 'react';
import TaxonDB, { TaxonDBStateLoaded } from './TaxonDB';
import { DBStatus, DBStateError } from '../../../lib/DB';
import { AppConfig } from '@kbase/ui-components';
import Taxonomy from './Taxonomy';
import { TaxonomyReference } from '../../../types/taxonomy';
import ErrorView from '../../../components/ErrorView';
import { DataSourceInfo } from '../../../lib/RelationEngineModel';
import { Spin } from 'antd';

export interface Props {
    token: string;
    config: AppConfig;
    taxonRef: TaxonomyReference;
    dataSource: DataSourceInfo;
    // taxonID: TaxonID;
    navigate: (taxonRef: TaxonomyReference) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: TaxonDB;
    currentlyNavigatedTaxonRef: TaxonomyReference | null;
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
        this.currentlyNavigatedTaxonRef = null;
    }

    selectTaxon(taxonRef: TaxonomyReference) {
        return this.db.getSelectedTaxon(taxonRef);
    }

    navigateToTaxon(taxonRef: TaxonomyReference) {
        return this.props.navigate(taxonRef);
    }

    renderLoading() {
        return <Spin />;
    }

    renderError(db: DBStateError) {
        // NB this is rendered raw in the container, which is a flex row.
        return (
            <div className="Col">
                <div style={{ width: '50%', margin: '20px auto 0 auto' }}>
                    <ErrorView error={db.error} />
                </div>
            </div>
        );
    }

    renderLoaded(db: TaxonDBStateLoaded) {
        return (
            <Taxonomy
                targetTaxon={db.targetTaxon}
                selectedTaxon={db.selectedTaxon}
                selectTaxonRef={this.selectTaxon.bind(this)}
                navigateToTaxonREf={this.navigateToTaxon.bind(this)}
                dataSource={this.props.dataSource}
                setTitle={this.props.setTitle}
            />
        );
    }

    componentDidMount() {
        this.db.getTargetTaxon(this.props.taxonRef);
    }

    componentDidUpdate(previousProps: Props) {
        if (previousProps.taxonRef.id !== this.props.taxonRef.id ||
            previousProps.taxonRef.timestamp !== this.props.taxonRef.timestamp) {
            this.db.getTargetTaxon(this.props.taxonRef);
        }
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                // this.db.getTargetTaxon(this.props.taxonID);
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
            // if (this.props.taxonID !== db.targetTaxon.id) {
            //     this.db.getTargetTaxon(this.props.taxonID);
            //     return this.renderLoaded(db);
            // } else {
            //     return this.renderLoaded(db);
            // }
        }
    }
}
