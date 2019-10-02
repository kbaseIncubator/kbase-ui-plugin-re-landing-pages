import React from 'react';
import { OntologyReference, OntologyTermBrief } from '../../../types/ontology';
import './style.css';
import Term from '../OntologyTerm';
import { Empty } from 'antd';

export interface Props {
    terms: Array<OntologyTermBrief>;
    // maxItems: number;
    // totalItems: number;
    selectedTermRef: OntologyReference | null;
    selectTerm: (termRef: OntologyReference) => void;
    navigateToTermRef: (termRef: OntologyReference) => void;
}

interface State { }

export default class OntologyList extends React.Component<Props, State> {
    renderItemsPlain() {
        return this.props.terms.map((term) => {
            const isActive = this.props.selectedTermRef !== null &&
                this.props.selectedTermRef.collection === term.ref.collection &&
                this.props.selectedTermRef.namespace === term.ref.namespace &&
                this.props.selectedTermRef.id === term.ref.id;

            return (
                <Term
                    term={term}
                    isActive={isActive}
                    selectTerm={this.props.selectTerm.bind(this)}
                    key={term.ref.id}
                    navigateToTermRef={this.props.navigateToTermRef.bind(this)}
                />
            );
        });
    }
    renderNoItems() {
        return <Empty description="No Children" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    render() {
        if (this.props.terms.length === 0) {
            return this.renderNoItems();
        }
        return this.renderItemsPlain();
    }
}
