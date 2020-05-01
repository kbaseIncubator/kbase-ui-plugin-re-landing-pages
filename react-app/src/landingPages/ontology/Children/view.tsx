import React from 'react';
import { OntologyRelatedTerm, OntologyRelation, OntologySource } from '../../../types/ontology';
import './style.css';
import { Empty, Table, Tooltip } from 'antd';
import Column from 'antd/lib/table/Column';
import { relationToString } from '../lib/model';

export interface Props {
    terms: Array<OntologyRelatedTerm>;
}

interface State { }

export default class OntologyList extends React.Component<Props, State> {
    renderRelation(relation: OntologyRelation) {
        return relationToString(relation);

    }
    renderItemsTable() {
        return <Table<OntologyRelatedTerm>
            dataSource={this.props.terms}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            size="small"
            pagination={false}
            rowKey={(row: OntologyRelatedTerm) => {
                return row.term.ref.id;
            }}
            scroll={{ y: '100%' }}
        >
            <Column dataIndex='term.name' title="Name" width="60%" />
            <Column dataIndex="term.goID" title="ID" width="20%"
                render={(id: string, term: OntologyRelatedTerm) => {
                    let ownId: string;
                    let namespace: string;
                    switch (term.term.type) {
                        case OntologySource.GO:
                            ownId = term.term.goID;
                            namespace = 'go_ontology';
                            break;
                        case OntologySource.ENVO:
                            ownId = term.term.envoID;
                            namespace = 'envo_ontology';
                    }
                    const tooltip = (
                        <div>
                            {term.term.name}<br />
                            {ownId}
                            <hr />
                            {term.term.definition}
                        </div>
                    );
                    // TODO: fix the hard coded url below!
                    return (
                        <Tooltip title={tooltip} placement="left">
                            <a href={`/#review/${namespace}/${ownId}/${term.term.ref.timestamp}`} target="_parent">
                                {ownId}
                            </a>
                        </Tooltip>
                    );
                }} />
            <Column dataIndex="relation" title="Relation" width="20%"
                render={(relation: OntologyRelation) => {
                    return this.renderRelation(relation);
                }} />
        </Table>;
    }
    renderNoItems() {
        return <Empty description="No Children" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    render() {
        if (this.props.terms.length === 0) {
            return this.renderNoItems();
        }
        return this.renderItemsTable();
    }
}
