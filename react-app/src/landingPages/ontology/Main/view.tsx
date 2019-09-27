import React from 'react';
import { OntologyReference, GOOntologyTerm, OntologySource, OntologyNamespace, OntologyTerm } from '../../../types/ontology';
import './style.css';
import Nav from '../Nav';
import Detail from '../Detail';
import { RelationEngineCollection } from '../../../types';
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

    renderLayout() {
        // FAKE IT FOR NOW
        const term: GOOntologyTerm = {
            type: OntologySource.GO,
            // relation: OntologyRelation.IS_A,
            ref: {
                collection: RelationEngineCollection.ONTOLOGY,
                namespace: OntologyNamespace.GO,
                id: 'GO:0046294',
                timestamp: Date.now()
            },
            // id: 'go_ontology/GO:0046294',
            goID: 'GO:0046294',
            name: 'formaldehyde catabolic process',
            definition: 'The chemical reactions and pathways resulting in the breakdown of formaldehyde (methanal, H2C=O), the simplest aldehyde. Source: GOC:ai',
            comment: [],
            namespace: 'biological_process',
            isObsolete: false,
            synonyms: {
                exact: [
                    'formaldehyde breakdown',
                    'formaldehyde catabolism',
                    'formaldehyde degradation',
                    'methanal catabolic process',
                    'methanal catabolism'
                ],
                narrow: [],
                broad: [],
                related: []
            }
        }
        return (
            <div className="Col scrollable Taxonomy">
                <div className="Col-auto Ontology-summary-section">
                    <Row>
                        <Col span={12}>
                            <TermSummary term={term} />
                        </Col>
                        <Col span={12}>
                            <SourceInfo />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">
                    <div className="Col scrollable" style={{ flex: '0 0 20em' }}>
                        <Nav />
                    </div>

                    <div className="Col scrollable" style={{ marginLeft: '10px' }}>
                        <Detail term={term} />
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.props.setTitle('ONTOLOGY LANDING PAGE');
    }

    render() {
        return this.renderLayout();
    }
}
