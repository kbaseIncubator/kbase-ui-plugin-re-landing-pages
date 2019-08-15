import React from 'react';
import { Taxon } from './redux/store';
import { Tooltip } from 'antd';
import './TaxonItem.css';

export interface Props {
    taxon: Taxon;
    isActive: boolean;
    selectTaxonID: (taxonID: string) => void;
    navigateToTaxonID: (taxonID: string) => void;
}

interface State {}

export default class TaxonItem extends React.Component<Props, State> {
    clickTaxon() {
        this.props.selectTaxonID(this.props.taxon.id);
    }
    clickNavigateToTaxon() {
        const fixedID = this.props.taxon.id.replace('/', ':');
        const hash = `review/${fixedID}`;
        // TODO: use the integration api?
        if (window.parent) {
            window.parent.location.hash = hash;
        } else {
            window.location.hash = hash;
        }
        // window.history.pushState({}, 'my title', `/#review/${this.props.taxon.id}`);
        // this.props.navigateToTaxonID(this.props.taxon.id);
    }
    render() {
        const taxon = this.props.taxon;
        const classNames = ['TaxonItem'];
        if (this.props.isActive) {
            classNames.push('TaxonItem-active');
        }

        const tooltipTitle = (
            <div>
                <div style={{ borderBottom: '1px solid silver' }}>{taxon.name}</div>
                <div>{taxon.rank}</div>
            </div>
        );

        return (
            <Tooltip title={tooltipTitle} placement="right">
                <div
                    className={classNames.join(' ')}
                    key={this.props.taxon.id}
                    onClick={this.clickTaxon.bind(this)}
                    onDoubleClick={this.clickNavigateToTaxon.bind(this)}
                >
                    {this.props.taxon.name}
                </div>
            </Tooltip>
        );
    }
}
