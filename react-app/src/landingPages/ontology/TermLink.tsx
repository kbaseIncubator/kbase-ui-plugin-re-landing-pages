import React from 'react';
import { OntologySource, GOOntologyTerm, OntologyTerm } from '../../types/ontology';

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
        return (
            <a href={href} target={target}>
                {term.ref.id}
            </a>
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