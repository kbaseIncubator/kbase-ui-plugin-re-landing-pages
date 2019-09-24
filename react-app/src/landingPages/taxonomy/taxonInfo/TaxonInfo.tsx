import React from 'react';
import { Tabs } from 'antd';
import TaxonDetail from './TaxonDetail';
import TaxonDescription from './TaxonDescription';
import LinkedData from './linkedData';
import { Taxon } from '../../../types/taxonomy';

export interface TaxonInfoProps {
    taxon: Taxon;
}

interface TaxonInfoState { }

export default class TaxonInfo extends React.Component<TaxonInfoProps, TaxonInfoState> {
    render() {
        return (
            <Tabs defaultActiveKey="detail" animated={false} className="FullHeight-tabs">
                <Tabs.TabPane tab="Detail" key="detail" forceRender={false}>
                    <TaxonDetail taxon={this.props.taxon} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Description" key="description" forceRender={false}>
                    <TaxonDescription taxon={this.props.taxon} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Linked Data" key="linkedData" forceRender={false}>
                    <LinkedData taxonRef={this.props.taxon.ref} />
                </Tabs.TabPane>
            </Tabs>
        );
    }
}
