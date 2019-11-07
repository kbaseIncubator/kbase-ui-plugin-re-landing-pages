import React from 'react';
import { Taxon, NCBITaxon } from '../../../types/taxonomy';
import TaxonDetailNCBI from './TaxonDetailNCBI';
import { Alert } from 'antd';
import { RelationEngineDataSource } from '../../../types/core';

export interface TaxonDetailProps {
    taxon: Taxon;
}

interface TaxonDetailState { }

export default class TaxonDetail extends React.Component<TaxonDetailProps, TaxonDetailState> {
    render() {
        const taxon = this.props.taxon;
        switch (taxon.ref.dataSource) {
            case RelationEngineDataSource.NCBI:
                // TODO: why does this not prove to TS that we have a NCBITaxon?
                return <TaxonDetailNCBI taxon={taxon as NCBITaxon} />;
            default:
                return <Alert type="error" message="This taxon type is not supported" />;
        }
    }
}
