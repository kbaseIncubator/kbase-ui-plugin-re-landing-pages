import React from 'react';
import { LinkedObject, WorkspaceType } from '../../lib/model';
import { Table, Tooltip, Spin, Alert } from 'antd';
import Column from 'antd/lib/table/Column';
import { LinkedObjectsCollection, LinkedObjectsData } from './LinkedDataDB';
import { DBCollectionStatus } from '../../../../lib/DB2';
import { UIError } from '../../../../types';

const DEFAULT_PAGE_SIZE = 12;

export interface Props {
    linkedObjectsCollection: LinkedObjectsCollection
    // linkedObjects: Array<LinkedObject>;
    fetchLinkedObjects: (page: number, pageSize: number) => void
}

interface State { }

export default class LinkedData extends React.Component<Props, State> {
    onFetchPage(page: number, pageSize?: number) {
        this.props.fetchLinkedObjects(page, pageSize || DEFAULT_PAGE_SIZE);
    }
    componentDidMount() {
        this.props.fetchLinkedObjects(1, DEFAULT_PAGE_SIZE)
    }
    renderLinkedObjects(data: LinkedObjectsData, isLoading: boolean) {
        return <Table
            dataSource={data.linkedObjects}
            size="small"
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            // pagination={false}
            // scroll={{ y: '100%' }}
            bordered={false}
            rowKey={(linkedObject: LinkedObject) => {
                return [linkedObject.workspaceID, linkedObject.objectID, linkedObject.version].join('/');
            }}
            pagination={{
                position: 'top',
                onChange: this.onFetchPage.bind(this),
                defaultPageSize: DEFAULT_PAGE_SIZE,
                total: data.totalCount
            }}
            loading={isLoading}
        >
            <Column
                title="Type"
                dataIndex="type"
                width="15%"
                render={(type: WorkspaceType) => {
                    const typeID = [[type.module, type.name].join('.'), [type.majorVersion, type.minorVersion].join('.')].join('-');
                    return <a href={`/#spec/type/${typeID}`} target="_blank" rel="noopener noreferrer">
                        {type.name}
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
    renderLoading() {
        return (
            <Spin />
        )
    }
    renderError(error: UIError) {
        return (
            <Alert type="error" message={error.message} />
        )
    }
    render() {
        const collection = this.props.linkedObjectsCollection;
        switch (collection.status) {
            case DBCollectionStatus.NONE:
                return this.renderLoading();
            case DBCollectionStatus.ERROR:
                return this.renderError(collection.error);
            case DBCollectionStatus.LOADING:
                return this.renderLinkedObjects(collection.data, true);
            case DBCollectionStatus.LOADED:
                return this.renderLinkedObjects(collection.data, false);
            case DBCollectionStatus.RELOADING:
                return this.renderLinkedObjects(collection.data, true)
        }
    }
}
