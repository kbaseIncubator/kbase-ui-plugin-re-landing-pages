import React from 'react';

import { SourceInfo } from '../SourceInfo';
import LineageNavigator from '../LineageNavigator';
import TaxonSummary from '../TaxonSummary';
import { Taxon, TaxonID } from '../redux/store';
import { Row, Col } from 'antd';
import TaxonInfo from '../taxonInfo/TaxonInfo';

export interface TaxonomyProps {
    // lineage: Array<Taxon>;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
    setTitle: (title: string) => void;
}

interface TaxonomyState {}

export default class Taxonomy extends React.Component<TaxonomyProps, TaxonomyState> {
    renderTaxonInfo() {
        if (!this.props.selectedTaxon) {
            return <div>No taxon selected</div>;
        }
        return <TaxonInfo taxon={this.props.selectedTaxon} />;
        // return 'disabled';
    }

    componentDidMount() {
        this.props.setTitle('Taxonomy Landing Page for "' + this.props.targetTaxon.name + '"');
    }

    render() {
        return (
            <div className="Col scrollable">
                <div className="Col-auto" style={{ backgroundColor: 'rgba(200, 200, 200, 0.3' }}>
                    <Row>
                        <Col span={12}>
                            <TaxonSummary taxon={this.props.targetTaxon} />
                        </Col>
                        <Col span={12}>
                            <SourceInfo />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">
                    <div className="Col scrollable" style={{ flex: '0 0 20em' }}>
                        <LineageNavigator
                            selectedTaxon={this.props.selectedTaxon}
                            // lineage={this.props.lineage}
                            selectTaxonID={this.props.selectTaxonID}
                            targetTaxon={this.props.targetTaxon}
                            navigateToTaxonID={this.props.navigateToTaxonID}
                        />
                    </div>

                    <div className="Col scrollable" style={{ marginLeft: '10px' }}>
                        {this.renderTaxonInfo()}
                    </div>
                </div>
            </div>
        );
    }
}
