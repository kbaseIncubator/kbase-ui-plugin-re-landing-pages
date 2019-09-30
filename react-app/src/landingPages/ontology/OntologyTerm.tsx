import React from 'react';
import { OntologyReference, OntologyTermBrief, ontologyNamespaceToString } from '../../types/ontology';
import { Tooltip, Icon } from 'antd';
import './OntologyTerm.css';

export interface Props {
    term: OntologyTermBrief;
    isActive: boolean;
    selectTerm: (termRef: OntologyReference) => void;
    navigateToTermRef: (ref: OntologyReference) => void;
}

interface State {
    hovering: boolean;
}

export default class OntologyTerm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false
        };
    }
    clickTerm() {
        this.props.selectTerm(this.props.term.ref);
    }
    clickNavigateToTerm() {
        const hash = [
            'review',
            'ontology',
            ontologyNamespaceToString(this.props.term.ref.namespace),
            this.props.term.ref.id,
            String(this.props.term.ref.timestamp)
        ].join('/');
        // const hash = `review/${this.props.term.}`;
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

    renderTerm() {
        return <div className="OntologyTerm-term" onClick={this.clickNavigateToTerm.bind(this)}>
            <div className="OntologyTerm-name">
                {this.props.term.name}
            </div>
        </div>;
        // <div className="OntologyTerm-id">
        //         {this.props.term.ref.id}
        //     </div>
    }

    renderOver() {
        return (
            <React.Fragment>
                {this.renderTerm()}
                <div className="OntologyTerm-inspector" onClick={this.clickTerm.bind(this)}>
                    <Icon type="arrow-right" />
                </div>
            </React.Fragment>
        );
    }

    renderActive() {
        return (
            <React.Fragment>
                {this.renderTerm()}
                <div className="OntologyTerm-inspector">
                    <Icon type="arrow-right" />
                </div>
            </React.Fragment>
        );
    }

    renderNormal() {
        return this.renderTerm();
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
        const classNames = ['OntologyTerm'];
        if (this.props.isActive) {
            classNames.push('OntologyTerm-active');
        }

        const tooltipTitle = (
            <div>
                <div style={{ borderBottom: '1px solid silver' }}>{term.name}</div>
                {term.ref.id}
            </div>
        );

        return (
            <Tooltip title={tooltipTitle} placement="right" key={this.props.term.ref.id}>
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
