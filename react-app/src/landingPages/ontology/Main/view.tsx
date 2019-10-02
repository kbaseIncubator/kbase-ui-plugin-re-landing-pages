import React from 'react';
import { OntologyReference, OntologyTerm } from '../../../types/ontology';
import './style.css';
import Detail from '../Detail';
import { Row, Col } from 'antd';
import SourceInfo from './SourceInfo';
import TermSummary from './TermSummary';

export interface Props {
    // termRef: OntologyReference;
    targetTerm: OntologyTerm;
    selectedTerm: OntologyTerm;
    selectTerm: (termRef: OntologyReference) => void;
    navigate: (termRef: OntologyReference) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class OntologyView extends React.Component<Props, State> {
    componentDidMount() {
        this.props.setTitle(`Ontology Landing Page for "${this.props.targetTerm.name}" (${this.props.targetTerm.goID})`);
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
                            <SourceInfo />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">

                    <div className="Col scrollable" >
                        <Detail term={this.props.selectedTerm} />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderLayout();
    }
}
