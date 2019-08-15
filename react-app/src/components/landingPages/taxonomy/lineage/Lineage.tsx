import React from 'react';
import { Taxon, TaxonID } from '../redux/store';
import TaxonList from '../TaxonList';

export interface Props {
    lineage: Array<Taxon>;
    selectedTaxonID: TaxonID;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
}

interface State {}

export default class Lineage extends React.Component<Props, State> {
    render() {
        return (
            <TaxonList
                taxa={this.props.lineage}
                selectedTaxonID={this.props.selectedTaxonID}
                selectTaxonID={this.props.selectTaxonID}
                navigateToTaxonID={this.props.navigateToTaxonID}
                totalItems={this.props.lineage.length}
                maxItems={10}
            />
        );
    }
}
