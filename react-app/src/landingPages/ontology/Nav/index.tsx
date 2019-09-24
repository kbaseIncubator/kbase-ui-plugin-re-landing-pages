import React from 'react';
import './style.css';
import OntologyItem from '../OntologyItem';
import { OntologyTermBrief, OntologyRelation, OntologyReference, OntologyTermRelatedBrief, OntologyNamespace } from '../../../types/ontology';
import Children from '../Children';
import Parents from '../Parents';
import { RelationEngineCollection } from '../../../types';

export interface NavProps {
}

interface NavState {
}

export default class Nav extends React.Component<NavProps, NavState> {
    selectTermRef(termRef: OntologyReference) {
        console.log('selecting', termRef);
    }
    navigateToTermRef(termRef: OntologyReference) {
        console.log('navigating to ', termRef);
    }

    render() {
        const timestamp = Date.now();
        const term: OntologyTermBrief = {
            ref: {
                collection: RelationEngineCollection.ONTOLOGY,
                namespace: OntologyNamespace.GO,
                id: 'GO:0046294',
                timestamp
            },
            // type: OntologySource.GO,
            name: 'aldehyde catabolic process',
            goID: 'GO:0046294'
        }
        const children: Array<OntologyTermRelatedBrief> = [
            {
                ref: {
                    collection: RelationEngineCollection.ONTOLOGY,
                    namespace: OntologyNamespace.GO,
                    id: 'GO:0043276',
                    timestamp
                },
                relation: OntologyRelation.IS_A,
                // id: 'go_ontology/GO:0043276',
                name: 'anoikis',
                goID: 'GO:0043276'
            },
            {
                ref: {
                    collection: RelationEngineCollection.ONTOLOGY,
                    namespace: OntologyNamespace.GO,
                    id: 'GO:0008637',
                    timestamp
                },
                relation: OntologyRelation.PART_OF,
                // id: 'go_ontology/GO:0008637',
                name: 'apoptotic',
                // type: OntologySource.GO,
                goID: 'GO:0008637'
            }
        ]
        const parents: Array<OntologyTermRelatedBrief> = [
            {
                ref: {
                    collection: RelationEngineCollection.ONTOLOGY,
                    namespace: OntologyNamespace.GO,
                    id: 'GO:0012501',
                    timestamp
                },
                relation: OntologyRelation.IS_A,
                // id: 'go_ontology/GO:0012501',
                name: 'programmed cell death',
                // type: OntologySource.GO,
                goID: 'GO:0012501'
            }
        ]
        return <div className="Col scrollable OntologyNav">
            <div className="Col OntologyNav-title">
                parents
            </div>
            <div className="Col OntologyNav-ancestorsArea">
                <Parents
                    terms={parents}
                    totalItems={parents.length}
                    selectedTermRef={null}
                    selectTermRef={this.selectTermRef.bind(this)}
                    navigateToTermRef={this.navigateToTermRef.bind(this)}
                />
            </div>
            <div className="Col OntologyNav-title">
                selected
            </div>
            <div className="Col OntologyNav-termArea">
                <OntologyItem
                    term={term}
                    isActive={false}
                    selectTermRef={this.selectTermRef.bind(this)}
                    navigateToTermRef={this.navigateToTermRef.bind(this)} />
            </div>
            <div className="Col OntologyNav-title">
                children
            </div>
            <div className="Col OntologyNav-childrenArea scrollable">
                <Children
                    terms={children}
                    totalItems={children.length}
                    selectedTermRef={null}
                    selectTermRef={this.selectTermRef.bind(this)}
                    navigateToTermRef={this.navigateToTermRef.bind(this)}
                />

            </div>
        </div>
    }
}