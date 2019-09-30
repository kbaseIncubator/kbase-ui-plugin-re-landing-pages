import React from 'react';
import { OntologyReference, OntologyTermRelatedBrief } from '../../../types/ontology';
import './style.css';
import Term from './Term';
import { Empty } from 'antd';

export interface Props {
    terms: Array<OntologyTermRelatedBrief>;
    // maxItems: number;
    totalItems: number;
    selectedTermRef: OntologyReference | null;
    selectTermRef: (termRef: OntologyReference) => void;
    navigateToTermRef: (termRef: OntologyReference) => void;
}

interface State { }

export default class OntologyList extends React.Component<Props, State> {
    selectTerm(termRef: OntologyReference) {
        this.props.selectTermRef(termRef);
    }
    navigateToTerm(termRef: OntologyReference) {
        this.props.navigateToTermRef(termRef);
    }
    renderItemsPlain() {
        return this.props.terms.map((term) => {
            const isActive = this.props.selectedTermRef === term.ref;
            return (
                <Term
                    term={term}
                    isActive={isActive}
                    selectTermRef={this.selectTerm.bind(this)}
                    key={term.ref.id}
                    navigateToTermRef={this.navigateToTerm.bind(this)}
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
