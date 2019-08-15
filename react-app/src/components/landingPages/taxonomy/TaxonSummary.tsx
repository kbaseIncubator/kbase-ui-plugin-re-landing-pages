import React from 'react';
import { Taxon } from './redux/store';

export interface Props {
    taxon: Taxon;
}

export interface State {}

export default class TaxonSummary extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <div className="InfoTable">
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                            Name
                        </div>
                        <div className="InfoTable-dataCol">{this.props.taxon.name}</div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                            Rank
                        </div>
                        <div className="InfoTable-dataCol">{this.props.taxon.rank}</div>
                    </div>
                </div>
            </div>
        );
    }
}
