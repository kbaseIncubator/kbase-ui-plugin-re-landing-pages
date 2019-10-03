import React from 'react';
import { OntologySource, GOOntologyTerm, OntologyTerm } from '../../types/ontology';
import { Icon, Tooltip } from 'antd';

export interface Props {
    term: OntologyTerm;
    newWindow: boolean;
}

interface State {
}

export default class TermLink extends React.Component<Props, State> {
    renderGOLink(term: GOOntologyTerm) {
        const href = `http://amigo.geneontology.org/amigo/term/${term.goID}`;
        const target = this.props.newWindow ? '_blank' : '_parent';
        const tooltip = (
            <React.Fragment>
                <p>Link to the Gene Ontology AmiGO page for this term.</p>
                <p>Opens in a separate window or tab.</p>
            </React.Fragment>
        )
        return (
            <Tooltip title={tooltip}>
                <a href={href} target={target}>
                    {term.ref.id} <Icon type="link" />
                </a>
            </Tooltip>
        )
    }

    render() {
        const term = this.props.term;
        switch (term.type) {
            case (OntologySource.GO):
                return this.renderGOLink(term);
        }
    }
}