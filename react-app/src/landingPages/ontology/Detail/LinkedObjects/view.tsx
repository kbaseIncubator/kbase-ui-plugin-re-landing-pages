import React from 'react';
import './style.css';
import { Table } from 'antd';
import { LinkedObject } from '../../../../types/ontology';

export interface Props {
    linkedObjects: Array<LinkedObject>;
}

interface State {
}

export default class LinkedObjects extends React.Component<Props, State> {
    renderTable() {
        return <Table<LinkedObject>
            dataSource={this.props.linkedObjects}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            size="small"
            pagination={false}
            scroll={{ y: '100%' }}
            rowKey={(row: LinkedObject) => {
                return [
                    row.object.workspaceID,
                    row.object.id,
                    row.object.version,
                    row.feature
                ].join(':');
            }}
            bordered={false}
        >
            <Table.Column
                dataIndex={"scientificName"}
                title="Scientific Name"
                width="40%"
            />
            <Table.Column
                dataIndex={"type.name"}
                title="Type"
                width="30%"
            />
            <Table.Column
                dataIndex={"feature"}
                title="Feature"
                width="30%"
            />
        </Table>
    }
    renderNone() {
        return (
            <p style={{ fontStyle: 'italic' }}>
                No objects use this term.
            </p>
        )
    }
    render() {
        if (this.props.linkedObjects.length === 0) {
            return this.renderNone();
        }
        return this.renderTable();
    }
}