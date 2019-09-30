import React from 'react';
import { OntologyReference, ontologyNamespaceToString, OntologyTermBrief } from '../react-app/src/types/ontology';
import { Tooltip, Icon } from 'antd';
import './Term.css';

export interface Props {
    term: OntologyTermBrief;
    isActive: boolean;
    selectTermRef: (ref: OntologyReference) => void;
    navigateToTermRef: (ref: OntologyReference) => void;
}

interface State {
    hovering: boolean;
}

export default class OntologyItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false
        };
    }
    clickTerm() {
        this.props.selectTermRef(this.props.term.ref);
    }
    clickNavigateToTerm() {
        const hash = [
            'review',
            'ontology',
            ontologyNamespaceToString(this.props.term.ref.namespace),
            String(this.props.term.ref.timestamp)
        ].join('/');
        // const hash = `review/${this.props.term.id}`;
        // TODO: use the integration api?
        if (window.parent) {
            window.parent.location.hash = hash;
        } else {
            window.location.hash = hash;
        }
        // window.history.pushState({}, 'my title', `/#review/${this.props.taxon.id}`);
        // this.props.navigateToTaxonID(this.props.taxon.id);
    }

    onMouseEnter(ev: React.MouseEvent<HTMLDivElement>) {
        this.setState({ hovering: true });
    }

    onMouseLeave(ev: React.MouseEvent<HTMLDivElement>) {
        this.setState({ hovering: false });
    }

    renderOver() {
        return (
            <React.Fragment>
                <div className="OntologyTermRelatedBrief-name" onClick={this.clickNavigateToTerm.bind(this)}>
                    {this.props.term.name}
                </div>
                <div className="OntologyTermRelatedBrief-inspector" onClick={this.clickTerm.bind(this)}>
                    <Icon type="arrow-right" />
                </div>
            </React.Fragment>
        );
    }

    renderActive() {
        return (
            <React.Fragment>
                <div className="OntologyTermRelatedBrief-name" onClick={this.clickNavigateToTerm.bind(this)}>
                    {this.props.term.name}
                </div>
                <div className="OntologyTermRelatedBrief-inspector">
                    <Icon type="arrow-right" />
                </div>
            </React.Fragment>
        );
    }

    renderNormal() {
        return (
            <React.Fragment>
                <div className="OntologyTermRelatedBrief-name">{this.props.term.name}</div>
            </React.Fragment>
        );
    }

    renderItem() {
        if (this.props.isActive) {
            return this.renderActive();
        }
        if (this.state.hovering) {
            return this.renderOver();
        } else {
            return this.renderNormal();
        }
    }

    render() {
        const term = this.props.term;
        const classNames = ['OntologyTermRelatedBrief'];
        if (this.props.isActive) {
            const classNames = ['OntologyTermRelatedBrief'];
            classNames.push('OntologyTermRelatedBrief-active');
        }

        const tooltipTitle = (
            <div>
                <div style={{ borderBottom: '1px solid silver' }}>{term.name}</div>
            </div>
        );

        return (
            <Tooltip title={tooltipTitle} placement="right">
                <div
                    className={classNames.join(' ')}
                    key={this.props.term.ref.id}
                    onMouseEnter={this.onMouseEnter.bind(this)}
                    onMouseLeave={this.onMouseLeave.bind(this)}
                >
                    {this.renderItem()}
                </div>
            </Tooltip>
        );
    }
}
