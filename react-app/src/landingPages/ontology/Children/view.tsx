import React from 'react';
import { OntologyRelatedTerm, OntologyRelation } from '../../../types/ontology';
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
            scroll={{ y: '100%' }}
        >
            <Column dataIndex='term.name' title="Name" width="60%" />
            <Column dataIndex="term.goID" title="ID" width="20%"
                render={(id: string, term: OntologyRelatedTerm) => {
                    const tooltip = (
                        <div>
                            {term.term.name}<br />
                            {term.term.goID}
                            <hr />
                            {term.term.definition}
                        </div>
                    )
                    return (
                        <Tooltip title={tooltip} placement="left">
                            <a href={`/#review/ontology/go/${id}/${term.term.ref.timestamp}`} target="_parent">
                                {id}
                            </a>
                        </Tooltip>
                    )
                }} />
            <Column dataIndex="relation" title="Relation" width="20%"
                render={(relation: OntologyRelation) => {
                    return this.renderRelation(relation);
                }} />
        </Table>
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
