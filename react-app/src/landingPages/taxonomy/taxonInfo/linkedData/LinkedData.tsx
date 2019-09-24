import React from 'react';
import { LinkedObject } from '../../lib/model';
import { Table, Tooltip } from 'antd';
import Column from 'antd/lib/table/Column';

export interface Props {
    linkedObjects: Array<LinkedObject>;
}

interface State { }

export default class LinkedData extends React.Component<Props, State> {
    renderLinkedObjects() {
        return <Table
            dataSource={this.props.linkedObjects}
            size="small"
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            // pagination={false}
            // scroll={{ y: '100%' }}
            bordered={false}
            rowKey={(linkedObject: LinkedObject) => {
                return [linkedObject.workspaceID, linkedObject.objectID, linkedObject.version].join('/');
            }}
        // rowKey="objectName"
        >
            <Column
                title="Type"
                // dataIndex="workspaceID"
                width="15%"
                render={(workspaceId: number) => {
                    return <a href="https://ci.kbase.us/#spec/type/KBaseGenomes.Genome" target="_blank" rel="noopener noreferrer">
                        Genome
                    </a>
                }}
            />
            <Column
                title="Object"
                dataIndex="objectName"
                width="35%"
                sorter={(a: LinkedObject, b: LinkedObject) => {
                    return a.objectName.localeCompare(b.objectName);
                }}
                render={(objectName: string, linkedObject: LinkedObject) => {
                    const url = [
                        '',
                        '#dataview',
                        linkedObject.workspaceID,
                        linkedObject.objectID,
                        linkedObject.version
                    ].join('/');
                    const headerStyle = {
                        fontStyle: 'italic',
                        marginRight: '3px'
                    }
                    const tooltip = (
                        <div>
                            <div>
                                <span style={headerStyle}>
                                    Ref
                                </span>
                                <span>
                                    {linkedObject.workspaceID}/{linkedObject.objectID}/{linkedObject.version}
                                </span>
                            </div>
                            <div>
                                <span style={headerStyle}>
                                    Workspace ID
                                </span>
                                <span>
                                    {linkedObject.workspaceID}
                                </span>
                            </div>
                            <div>
                                <span style={headerStyle}>
                                    Object ID
                                </span>
                                <span>
                                    {linkedObject.objectID}
                                </span>
                            </div>
                            <div>
                                <span style={headerStyle}>
                                    Version
                                </span>
                                <span>
                                    {linkedObject.version}
                                </span>
                            </div>
                        </div>
                    )
                    return (
                        <Tooltip title={tooltip}>
                            <a href={url}>
                                {objectName}
                            </a>
                        </Tooltip>
                    )
                }}
            />
            <Column
                title="Narrative"
                // dataIndex="workspaceID"
                width="35%"
                render={(workspaceID: number) => {
                    return <a href={`https://ci.kbase.us/narrative/${workspaceID}`} target="_blank" rel="noopener noreferrer">
                        Narrative or refdata ws title
                    </a>
                }}
            />
            <Column
                title="Object Created"
                dataIndex="createdAt"
                width="15%"
                sorter={(a: LinkedObject, b: LinkedObject) => {
                    return a.createdAt - b.createdAt;
                }}
                render={(createdAt: number) => {
                    return Intl.DateTimeFormat('en-US').format(createdAt);
                }}
            />
        </Table>
    }
    render() {
        return this.renderLinkedObjects();
    }
}
