import React from 'react';
import { FlexTabs } from '@kbase/ui-components';
import './style.css';
import { OntologyTerm, Synonym, OntologySource } from '../../../types/ontology';
import TermLink from '../TermLink';
import LinkedObjects from './LinkedObjects';
import Children from '../Children';
import AncestorGraph from '../AncestorGraph';
import { Tabs } from 'antd';

export interface DetailProps {
    term: OntologyTerm;
}

interface DetailState {
}

export default class Detail extends React.Component<DetailProps, DetailState> {
    renderSynonyms(synonyms: Array<Synonym>) {
        if (synonyms.length === 0) {
            return <i>-</i>;
        }
        return synonyms.map((s, index) => {
            return (
                <div key={String(index)}>
                    {s}
                </div>
            );
        });
    }

    renderComments() {
        if (this.props.term.comments.length === 0) {
            return <i>-</i>;
        }

        return this.props.term.comments.map((comment, index) => {
            const comments = comment.split('\n');
            return comments.map((comment, index2) => {
                return <p key={String(index) + '-' + String(index2)}>{comment}</p>;
            });
        });
    }

    renderDetail() {
        return (
            <div className="scrolling-flex-column">
                <div className="InfoTable DetailTable">
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            ID
                    </div>
                        <div className="InfoTable-dataCol">
                            <TermLink term={this.props.term} newWindow={true} />
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Name
                    </div>
                        <div className="InfoTable-dataCol">
                            {this.props.term.name}
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Definition
                    </div>
                        <div className="InfoTable-dataCol">
                            {this.props.term.definition}
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Comments
                    </div>
                        <div className="InfoTable-dataCol">
                            {this.renderComments()}
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            synonyms
                </div>
                        <div className="InfoTable-dataCol">
                            {this.renderAllSynonyms()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderAllSynonyms() {
        const term = this.props.term;
        if (term.type === OntologySource.ENVO) {
            return <i>Synonyms not available for ENVO Ontology</i>;
        }
        return (
            <div className="InfoTable DetailTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        exact
                        </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(term.synonyms.exact)}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        narrow
                                </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(term.synonyms.narrow)}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        broad
                                </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(term.synonyms.broad)}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        related
                                </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(term.synonyms.related)}
                    </div>
                </div>
            </div>
        );
    }
    renderGraph() {
        return (
            <AncestorGraph termRef={this.props.term.ref} />
        );
    }
    renderLinkedObjects() {
        return (
            <LinkedObjects termRef={this.props.term.ref} />
        );
    }
    renderMetadata() {
        return (
            <div>
                render metadata here...
            </div>
        );
    }
    renderChildren() {
        return <Children
            termRef={this.props.term.ref}
        />;
    }

    renderx() {
        const tabs = [
            {
                tab: 'detail',
                title: 'Detail',
                component: this.renderDetail()
            },
            // {
            //     tab: 'synonyms',
            //     title: 'Synonyms',
            //     component: this.renderAllSynonyms()
            // },
            {
                tab: 'graph',
                title: 'Graph',
                component: this.renderGraph()
            },


            {
                tab: 'children',
                title: 'Children',
                component: this.renderChildren()
            },
            {
                tab: 'linked',
                title: 'Linked Data',
                component: this.renderLinkedObjects()
            },
            // {
            //     tab: 'metadata',
            //     title: 'Metadata',
            //     component: this.renderMetadata()
            // }
        ];
        return (
            <FlexTabs tabs={tabs} />
        );
    }

    render() {
        return <Tabs className="FullHeight-tabs" type="card">
            <Tabs.TabPane tab="Detail" key="detail" forceRender={false}>
                <div className="Col" style={{ overflowY: 'auto', paddingTop: '10px' }}>
                    {this.renderDetail()}
                </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Graph" key="graph" forceRender={false}>
                {this.renderGraph()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Children" key="children" forceRender={false}>
                {this.renderChildren()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Data" key="linkedData" forceRender={false}>
                <div className="Col" style={{ overflowY: 'auto', paddingTop: '10px' }}>
                    {this.renderLinkedObjects()}
                </div>
            </Tabs.TabPane>
        </Tabs>;
    }
}