import React from 'react';
import { Taxon, TaxonID } from './redux/store';
import './TaxonList.css';
import TaxonItem from './TaxonItem';
import { Empty } from 'antd';

export interface Props {
    taxa: Array<Taxon>;
    maxItems: number;
    totalItems: number;
    selectedTaxonID: string | null;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
}

interface State {}

export default class TaxonList extends React.Component<Props, State> {
    selectTaxon(taxonID: TaxonID) {
        this.props.selectTaxonID(taxonID);
    }
    navigateToTaxon(taxonID: TaxonID) {
        this.props.navigateToTaxonID(taxonID);
    }
    renderItemsPlain() {
        return this.props.taxa.map((taxon) => {
            const isActive = this.props.selectedTaxonID === taxon.id;
            return (
                <TaxonItem
                    taxon={taxon}
                    isActive={isActive}
                    selectTaxonID={this.selectTaxon.bind(this)}
                    key={taxon.id}
                    navigateToTaxonID={this.navigateToTaxon.bind(this)}
                />
            );
        });
    }
    renderNoItems() {
        return <Empty description="No Children" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    render() {
        if (this.props.taxa.length === 0) {
            return this.renderNoItems();
        }
        return this.renderItemsPlain();
    }
}
