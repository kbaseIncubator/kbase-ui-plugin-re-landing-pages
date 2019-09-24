import React from 'react';
import { Taxon, TaxonReference } from '../../types/taxonomy';
import './TaxonList.css';
import TaxonItem from './TaxonItem';
import { Empty } from 'antd';

export interface Props {
    taxa: Array<Taxon>;
    maxItems: number;
    totalItems: number;
    selectedTaxonRef: TaxonReference | null;
    selectTaxonRef: (ref: TaxonReference) => void;
    navigateToTaxonRef: (ref: TaxonReference) => void;
}

interface State { }

export default class TaxonList extends React.Component<Props, State> {
    selectTaxon(ref: TaxonReference) {
        this.props.selectTaxonRef(ref);
    }
    navigateToTaxon(ref: TaxonReference) {
        this.props.navigateToTaxonRef(ref);
    }
    renderItemsPlain() {
        return this.props.taxa.map((taxon, index) => {
            const isActive = this.props.selectedTaxonRef !== null &&
                this.props.selectedTaxonRef.id === taxon.ref.id;
            return (
                <TaxonItem
                    taxon={taxon}
                    isActive={isActive}
                    selectTaxonRef={this.selectTaxon.bind(this)}
                    key={String(index)}
                    navigateToTaxonRef={this.navigateToTaxon.bind(this)}
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
