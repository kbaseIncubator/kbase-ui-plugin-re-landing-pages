import React from 'react';
import { Taxon, TaxonID } from './redux/store';
import { SelectParam } from 'antd/lib/menu';
import './LineageNavigator.css';
import TaxonItem from './TaxonItem';
import TaxonChildren from './taxonChildren';
import Lineage from './lineage';

export interface LineageProps {
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
}

interface LineageState {}

export default class LineageNavigator extends React.Component<LineageProps, LineageState> {
    onClick(taxonId: string) {
        this.props.selectTaxonID(taxonId);
        // alert('navigate to ' + taxonId);
    }

    menuSelected(param: SelectParam) {
        this.props.selectTaxonID(param.key);
        // alert('navigate to ' + param.key);
    }

    clickTaxon(taxon: Taxon) {
        this.props.selectTaxonID(taxon.id);
    }

    renderLineage() {
        return (
            <Lineage
                taxonID={this.props.targetTaxon.id}
                selectedTaxonID={this.props.selectedTaxon.id}
                selectTaxonID={this.props.selectTaxonID}
                navigateToTaxonID={this.props.navigateToTaxonID}
            />
        );
        // return 'disabled';
    }

    renderChildrenCount(count: number) {
        if (count === 0) {
            return <div className="">No children</div>;
        }
        if (count === 1) {
            return <div>One child</div>;
        }
        return (
            <div>
                {Intl.NumberFormat('en-US', {
                    useGrouping: true
                }).format(count)}{' '}
                children
            </div>
        );
    }

    renderChildren() {
        let selectedId;
        if (this.props.selectedTaxon) {
            selectedId = this.props.selectedTaxon.id;
        } else {
            selectedId = null;
        }

        return (
            <TaxonChildren
                taxonID={this.props.targetTaxon.id}
                selectedTaxonID={selectedId}
                selectTaxonID={this.props.selectTaxonID}
                navigateToTaxonID={this.props.navigateToTaxonID}
            />
        );
    }

    // renderChildrenxscrolling() {
    //     let selectedId;
    //     if (this.props.selectedTaxon) {
    //         selectedId = this.props.selectedTaxon.id;
    //     } else {
    //         selectedId = null;
    //     }

    //     return (
    //         <div className="scrolling">
    //             <TaxonList
    //                 taxa={this.props.offspring}
    //                 selectedTaxonID={selectedId}
    //                 selectTaxonID={this.props.selectTaxonID}
    //                 navigateToTaxonID={this.props.navigateToTaxonID}
    //                 totalItems={this.props.totalOffspring}
    //                 maxItems={10}
    //             />
    //         </div>
    //     );
    // }

    renderTargetTaxon() {
        const isActive =
            (this.props.selectedTaxon && this.props.selectedTaxon.id === this.props.targetTaxon.id) || false;

        return (
            <TaxonItem
                taxon={this.props.targetTaxon}
                isActive={isActive}
                selectTaxonID={this.props.selectTaxonID}
                navigateToTaxonID={this.props.navigateToTaxonID}
            />
        );
    }

    render() {
        return (
            <div className="Col scrollable">
                <div className="Col-auto Lineage-box">
                    <div className="Lineage-box-title">Lineage</div>
                    {this.renderLineage()}
                </div>
                <div className="Col-auto Lineage-box Lineage-target-taxon">{this.renderTargetTaxon()}</div>
                <div className="Col-auto scrollable Lineage-box">{this.renderChildren()}</div>
            </div>
        );
    }
}
