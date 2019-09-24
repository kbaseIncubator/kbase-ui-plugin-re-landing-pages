import React from 'react';
import { OntologyReference, GOOntologyTerm, OntologySource, OntologyRelation, OntologyNamespace } from '../../../types/ontology';
import './style.css';
import Nav from '../Nav';
import Detail from '../Detail';
import { RelationEngineCollection } from '../../../types';
import { RelationEngineID } from '../../../redux/store';

export interface Props {
    termRef: OntologyReference;
    navigate: (relationEngineID: RelationEngineID) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class OntologyView extends React.Component<Props, State> {

    renderLayout() {
        // FAKE IT FOR NOW
        const term: GOOntologyTerm = {
            type: OntologySource.GO,
            relation: OntologyRelation.IS_A,
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
            comment: null,
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
            <React.Fragment>
                <div className="Col OntologyLandingPage-navCol" key="left">
                    <Nav />
                </div>
                <div className="Col OntologyLandingPage-detailCol" key="right">
                    <Detail term={term} />
                </div>
            </React.Fragment>
        )
    }


    render() {
        return this.renderLayout();
    }

    componentDidMount() {
        this.props.setTitle('ONTOLOGY LANDING PAGE');
    }
}
