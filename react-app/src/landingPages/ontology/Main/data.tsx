import React from 'react';
import OntologyDB, { OntologyDBStateLoaded } from './OntologyDB';
import { DBStatus, DBStateError } from '../../../lib/DB';
import { AppConfig } from '@kbase/ui-components';
import View from './view';
import { Icon } from 'antd';
import ErrorView from '../../../components/ErrorView';
import { OntologyReference } from '../../../types/ontology';
import { DataSourceInfo } from '../../../lib/RelationEngineModel';

export interface Props {
    token: string;
    config: AppConfig;
    termRef: OntologyReference;

    dataSource: DataSourceInfo;
    // taxonID: TaxonID;
    navigate: (termRef: OntologyReference) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: OntologyDB;
    currentlyNavigatedOntologyRef: OntologyReference | null;
    constructor(props: Props) {
        super(props);
        this.db = new OntologyDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                status: DBStatus.NONE
            },
            token: props.token,
            config: props.config
        });
        this.currentlyNavigatedOntologyRef = null;
    }

    selectTerm(termRef: OntologyReference) {
        return this.db.setSelectedTerm(termRef);
    }

    navigateToTerm(termRef: OntologyReference) {
        return this.props.navigate(termRef);
    }

    renderLoading() {
        return <Icon type="loading" />;
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

    renderLoaded(db: OntologyDBStateLoaded) {
        return (
            <View
                targetTerm={db.targetTerm}
                selectedTerm={db.selectedTerm}
                selectTerm={this.selectTerm.bind(this)}
                navigate={this.navigateToTerm.bind(this)}
                dataSource={this.props.dataSource}
                setTitle={this.props.setTitle}
            />
        );
    }

    componentDidMount() {
        this.db.getTargetTerm(this.props.termRef);
    }

    componentDidUpdate(previousProps: Props) {
        if (previousProps.termRef.id !== this.props.termRef.id ||
            previousProps.termRef.timestamp !== this.props.termRef.timestamp) {
            this.db.getTargetTerm(this.props.termRef);
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
