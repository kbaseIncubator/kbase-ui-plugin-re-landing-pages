import React from 'react';
import { Taxon, TaxonomyNamespace, NCBITaxon } from '../../../types/taxonomy';
import TaxonDetailNCBI from './TaxonDetailNCBI';
import { Alert } from 'antd';

export interface TaxonDetailProps {
    taxon: Taxon;
}

interface TaxonDetailState { }

export default class TaxonDetail extends React.Component<TaxonDetailProps, TaxonDetailState> {
    render() {
        const taxon = this.props.taxon;
        switch (taxon.ref.namespace) {
            case TaxonomyNamespace.NCBI:
                // TODO: why does this not prove to TS that we have a NCBITaxon?
                return <TaxonDetailNCBI taxon={taxon as NCBITaxon} />;
            default:
                return <Alert type="error" message="This taxon type is not supported" />;
        }
    }
}
