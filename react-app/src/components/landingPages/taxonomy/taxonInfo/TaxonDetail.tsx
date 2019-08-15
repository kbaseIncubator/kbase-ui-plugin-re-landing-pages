import React from 'react';
import { Taxon, TaxonomySource } from '../redux/store';
import TaxonDetailNCBI from './TaxonDetailNCBI';
import { Alert } from 'antd';

export interface TaxonDetailProps {
    taxon: Taxon;
}

interface TaxonDetailState {}

export default class TaxonDetail extends React.Component<TaxonDetailProps, TaxonDetailState> {
    render() {
        switch (this.props.taxon.type) {
            case TaxonomySource.NCBI:
                return <TaxonDetailNCBI taxon={this.props.taxon} />;
            default:
                return <Alert type="error" message="This taxon type is not suppported" />;
        }
    }
}
