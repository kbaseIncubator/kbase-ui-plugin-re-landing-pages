import React from 'react';
import './style.css';
import OntologyItem from '../OntologyTerm';
import { OntologyTerm, OntologyReference } from '../../../types/ontology';
import Children from '../Children';
import Parents from '../Parents';

export interface NavProps {
    targetTerm: OntologyTerm;
    selectedTerm: OntologyTerm;
    selectTerm: (termRef: OntologyReference) => void;
}

interface NavState {
}

export default class Nav extends React.Component<NavProps, NavState> {
    // selectTermRef(termRef: OntologyReference) {
    //     console.log('selecting', termRef);
    // }
    navigateToTermRef(termRef: OntologyReference) {
        console.log('navigating to ', termRef);
    }

    render() {
        const isActive = this.props.selectedTerm !== null &&
            this.props.selectedTerm.ref.collection === this.props.targetTerm.ref.collection &&
            this.props.selectedTerm.ref.namespace === this.props.targetTerm.ref.namespace &&
            this.props.selectedTerm.ref.id === this.props.targetTerm.ref.id;

        return <div className="Col scrollable OntologyNav">
            <div className="Nav-box Col-auto">
                <div className="Col Nav-box-title">
                    Parents
                </div>
                <div className="Col Nav-box-content">
                    <Parents
                        termRef={this.props.selectedTerm.ref}
                        selectedTermRef={this.props.selectedTerm.ref}
                        selectTerm={this.props.selectTerm.bind(this)}
                        navigateToTermRef={this.navigateToTermRef.bind(this)}
                    />
                </div>
            </div>
            <div className="Nav-box Col-auto">
                <div className="Col-auto Nav-box-title">
                    Selected Term
                </div>
                <div className="Col Nav-box-content">
                    <OntologyItem
                        term={this.props.targetTerm}
                        isActive={isActive}
                        selectTerm={this.props.selectTerm.bind(this)}
                        navigateToTermRef={this.navigateToTermRef.bind(this)} />
                </div>
            </div>
            <div className="Nav-box Col scrollable">
                <div className="Col-auto Nav-box-title">
                    Children
                </div>
                <div className="Col Nav-box-content" style={{ overflowY: 'auto' }}>
                    <Children
                        termRef={this.props.selectedTerm.ref}
                        selectedTermRef={this.props.selectedTerm.ref}
                        selectTerm={this.props.selectTerm.bind(this)}
                        navigateToTermRef={this.navigateToTermRef.bind(this)}
                    />
                </div>
            </div>
        </div >
    }
}