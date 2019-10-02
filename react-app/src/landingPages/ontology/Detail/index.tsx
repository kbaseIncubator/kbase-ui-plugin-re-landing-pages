import React from 'react';
import { FlexTabs } from '@kbase/ui-components';
import './style.css';
import { OntologyTerm, Synonym } from '../../../types/ontology';
import TermLink from '../TermLink';
import LinkedObjects from './LinkedObjects';
import Children from '../Children';

export interface DetailProps {
    term: OntologyTerm
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
            )
        });
    }

    renderComments() {
        if (this.props.term.comments.length === 0) {
            return <i>-</i>;
        }
        return this.props.term.comments.map((comment, index) => {
            return <p key={String(index)}>{comment}</p>
        });
    }

    renderDetail() {
        return (
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
        )
    }
    renderAllSynonyms() {
        return (
            <div className="InfoTable DetailTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        exact
                        </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(this.props.term.synonyms.exact)}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        narrow
                                </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(this.props.term.synonyms.narrow)}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        broad
                                </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(this.props.term.synonyms.broad)}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">
                        related
                                </div>
                    <div className="InfoTable-dataCol">
                        {this.renderSynonyms(this.props.term.synonyms.broad)}
                    </div>
                </div>
            </div>
        )
    }
    renderGraph() {
        return (
            <div>
                graph here...
            </div>
        )
    }
    renderLinkedObjects() {

        return (
            <LinkedObjects termRef={this.props.term.ref} />
        )
    }
    renderMetadata() {
        return (
            <div>
                render metadata here...
            </div>
        )
    }
    renderChildren() {
        return <Children
            termRef={this.props.term.ref}
        />
    }

    render() {
        const tabs = [
            {
                tab: 'graph',
                title: 'Graph',
                component: this.renderGraph()
            },
            {
                tab: 'detail',
                title: 'Detail',
                component: this.renderDetail()
            },
            {
                tab: 'synonyms',
                title: 'Synonyms',
                component: this.renderAllSynonyms()
            },
            {
                tab: 'children',
                title: 'Children',
                component: this.renderChildren()
            },
            {
                tab: 'linked',
                title: 'Linked Objects',
                component: this.renderLinkedObjects()
            },
            // {
            //     tab: 'metadata',
            //     title: 'Metadata',
            //     component: this.renderMetadata()
            // }
        ]
        return (
            <FlexTabs tabs={tabs} />
        )
    }
}