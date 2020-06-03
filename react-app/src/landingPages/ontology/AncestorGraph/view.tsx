import React from 'react';
import {
    TermsGraph, relationToString, TermsGraphNode, ontologyReferenceToNamespace
} from '../lib/model';
import NetworkGraph, { NetworkData } from './NetworkGraph';
import { OntologyTerm } from '../../../types/ontology';
import './style.css';
import { Table } from 'antd';

export interface AncestorGraphProps {
    term: OntologyTerm;
    graph: TermsGraph;
}

interface AncestorGraphState {
    selectedNodeID: string | null;
}

export default class AncestorGraph extends React.Component<AncestorGraphProps, AncestorGraphState> {
    constructor(props: AncestorGraphProps) {
        super(props);
        this.state = {
            selectedNodeID: null
        };
    }
    selectGraphNode(termNode: TermsGraphNode) {
        this.setState({
            selectedNodeID: termNode.term.ref.id
        });
    }
    renderTable() {
        return <Table
            dataSource={this.props.graph.terms}
            size="small"
            pagination={false}
            scroll={{ y: '100%' }}
            className="ScrollingFlexTable"
            rowSelection={{
                onSelect: (termNode: TermsGraphNode) => {
                    this.selectGraphNode(termNode);
                },

                type: 'radio',
                // fixed: false,
                // hideDefaultSelections: true,
                selectedRowKeys: this.state.selectedNodeID ? [this.state.selectedNodeID] : []
            }}
            rowKey={(node: TermsGraphNode) => {
                return node.id;
            }}>

            <Table.Column dataIndex="term"
                defaultSortOrder="ascend"
                sorter={(a: TermsGraphNode, b: TermsGraphNode) => {
                    return a.term.name.localeCompare(b.term.name);
                }}
                key="term.id"
                title="Name"
                width="85%"
                render={(term: OntologyTerm, termNode: TermsGraphNode) => {
                    return <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            this.selectGraphNode(termNode);
                        }}>
                        {term.name}
                    </span>;
                }}
            />

            < Table.Column dataIndex="term"
                sorter={(a: TermsGraphNode, b: TermsGraphNode) => {
                    return a.term.name.localeCompare(b.term.name);
                }}
                title="ID"
                width="15%"

                render={(term: OntologyTerm) => {
                    const url = [
                        '/#review',
                        ontologyReferenceToNamespace(term.ref),
                        term.ref.id
                    ].join('/');
                    return (
                        <a href={url} target="_parent">{term.ref.id}</a>
                    );
                }} />

        </Table>;
    }
    selectNodeID(nodeID: string) {
        this.setState({
            selectedNodeID: nodeID
        });
    }
    render() {
        const nodes = this.props.graph.terms.map((termNode) => {
            const isTerm = termNode.id === this.props.term.ref.id;
            return {
                id: termNode.id,
                label: termNode.term.name,
                isTerm: isTerm,
                isRoot: termNode.isRoot,
                isSelected: termNode.term.ref.id === this.state.selectedNodeID
            };
        });
        // Here we add the term of focus to the graph.
        // TODO: this should be done in the data layer.
        // nodes.push({
        //     id: this.props.term.ref.id,
        //     label: this.props.term.name,
        //     isTerm: true,
        //     isRoot: false,
        //     isSelected: false
        // })
        const edges = this.props.graph.relations.map((relation) => {
            return {
                from: relation.from,
                to: relation.to,
                label: relationToString(relation.relation)
            };
        });
        const data: NetworkData = {
            nodes,
            edges
        };
        console.log('DATA', data);
        return (
            <div className="AncestorGraph">
                <div className="AncestorGraph-graph">
                    <NetworkGraph
                        data={data}
                        height="400px"
                        selectedNodeID={this.state.selectedNodeID}
                        selectNodeID={this.selectNodeID.bind(this)} />
                </div>
                <div className="AncestorGraph-table">
                    {this.renderTable()}
                </div>
            </div>
        );
    }

}