import React from 'react';

import { SourceInfo } from '../SourceInfo';
import { Lineage } from '../Lineage';
import TaxonSummary from '../TaxonSummary';
import { Taxon, TaxonID } from '../redux/store';
import { Row, Col } from 'antd';

export interface MainProps {
    selectedTaxon: Taxon | null;
    targetTaxon: Taxon;
    selectTaxonID: (selectedTaxonID: TaxonID) => void;
    // navigateToTaxonID: (taxonID: TaxonID) => void;
    navigate: (id: TaxonID) => void;
}

interface MainState {}

export default class Taxonomy extends React.Component<MainProps, MainState> {
    renderTaxonInfo() {
        if (!this.props.selectedTaxon) {
            return <div>No taxon selected</div>;
        }
        // return <TaxonInfo taxon={this.props.selectedTaxon} />;
        return 'disabled';
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
                        <Lineage
                            selectedTaxon={this.props.selectedTaxon}
                            // lineage={this.props.lineage}
                            selectTaxonID={this.props.selectTaxonID}
                            targetTaxon={this.props.targetTaxon}
                            navigateToTaxonID={this.props.navigate}
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
