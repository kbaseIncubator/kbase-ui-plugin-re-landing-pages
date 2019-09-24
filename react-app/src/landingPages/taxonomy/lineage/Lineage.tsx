import React from 'react';
import { Taxon, TaxonReference } from '../../../types/taxonomy';
import TaxonList from '../TaxonList';

export interface Props {
    lineage: Array<Taxon>;
    selectedTaxonRef: TaxonReference;
    selectTaxonRef: (ref: TaxonReference) => void;
    navigateToTaxonRef: (ref: TaxonReference) => void;
}

interface State { }

export default class Lineage extends React.Component<Props, State> {
    render() {
        return (
            <TaxonList
                taxa={this.props.lineage}
                selectedTaxonRef={this.props.selectedTaxonRef}
                selectTaxonRef={this.props.selectTaxonRef}
                navigateToTaxonRef={this.props.navigateToTaxonRef}
                totalItems={this.props.lineage.length}
                maxItems={10}
            />
        );
    }
}
