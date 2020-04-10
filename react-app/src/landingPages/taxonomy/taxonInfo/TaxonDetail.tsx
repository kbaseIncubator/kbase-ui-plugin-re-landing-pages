import React from 'react';
import { Taxon, NCBITaxon, GTDBTaxon } from '../../../types/taxonomy';
import TaxonDetailNCBI from './TaxonDetailNCBI';
import TaxonDetailGTDB from './TaxonDetailGTDB';

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
            case RelationEngineDataSource.GTDB:
                return <TaxonDetailGTDB taxon={taxon as GTDBTaxon} />;
            default:
                return <Alert type="error" message="This taxon type is not supported" />;
        }
    }
}
