import React from 'react';
import { OntologyReference, OntologyTerm, OntologySource } from '../../../types/ontology';
import './style.css';
import Detail from '../Detail';
import { Row, Col } from 'antd';
import SourceInfo from './SourceInfo';
import TermSummary from './TermSummary';
import { DataSourceInfo } from '../../../lib/RelationEngineModel';

export interface Props {
    // termRef: OntologyReference;
    targetTerm: OntologyTerm;
    selectedTerm: OntologyTerm;
    dataSource: DataSourceInfo;
    selectTerm: (termRef: OntologyReference) => void;
    navigate: (termRef: OntologyReference) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class OntologyView extends React.Component<Props, State> {
    renderOwnId() {
        switch (this.props.targetTerm.type) {
            case OntologySource.GO:
                return this.props.targetTerm.goID;
            case OntologySource.ENVO:
                return this.props.targetTerm.envoID;
        }
    }
    componentDidMount() {
        this.props.setTitle(`Ontology Landing Page for "${this.props.targetTerm.name}" (${this.renderOwnId()})`);
    }

    renderLayout() {
        return (
            <div className="Col scrollable Taxonomy">
                <div className="Col-auto Ontology-summary-section">
                    <Row>
                        <Col span={12}>
                            <TermSummary term={this.props.targetTerm} />
                        </Col>
                        <Col span={12}>
                            <SourceInfo dataSource={this.props.dataSource} />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">

                    <div className="Col scrollable" >
                        <Detail term={this.props.selectedTerm} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderLayout();
    }
}
