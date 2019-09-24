import React from 'react';

import { SourceInfo } from '../SourceInfo';
import LineageNavigator from '../LineageNavigator';
import TaxonSummary from '../TaxonSummary';
import { Taxon, TaxonReference } from '../../../types/taxonomy';
import { Row, Col } from 'antd';
import TaxonInfo from '../taxonInfo/TaxonInfo';
import './Taxonomy.css';

export interface TaxonomyProps {
    // lineage: Array<Taxon>;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
    selectTaxonRef: (taxonRef: TaxonReference) => void;
    navigateToTaxonREf: (taxonRef: TaxonReference) => void;
    setTitle: (title: string) => void;
}

interface TaxonomyState { }

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
            <div className="Col scrollable Taxonomy">
                <div className="Col-auto Taxonomy-summary-section">
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
                            selectTaxonRef={this.props.selectTaxonRef}
                            targetTaxon={this.props.targetTaxon}
                            navigateToTaxonRef={this.props.navigateToTaxonREf}
                        />
                    </div>

                    <div className="Col scrollable" style={{ marginLeft: '10px' }}>
                        {this.renderTaxonInfo()}
                    </div>
                </div>
            </div>
        );
    }

    renderx() {
        return (
            <div className="Col scrollable Taxonomy">
                <div className="Col-auto Taxonomy-summary-section">
                    <Row>
                        <Col span={12}>
                            summary
                        </Col>
                        <Col span={12}>
                            source info
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">
                    omitted
                </div>
            </div>
        );
    }
}
