import React from 'react';
import { OntologySource, GOOntologyTerm, OntologyTerm, ENVOOntologyTerm } from '../../types/ontology';
import { Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

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
        );
        return (
            <Tooltip title={tooltip}>
                <a href={href} target={target}>
                    {term.ref.id} <LinkOutlined />
                </a>
            </Tooltip>
        );
    }

    renderENVOLink(term: ENVOOntologyTerm) {
        // e.g. http://purl.obolibrary.org/obo/ENVO_00001998 
        const termID = term.envoID.replace(':', '_');
        const href = `http://purl.obolibrary.org/obo/${termID}`;
        // const href = `http://amigo.geneontology.org/amigo/term/${term.goID}`;
        const target = this.props.newWindow ? '_blank' : '_parent';
        const tooltip = (
            <React.Fragment>
                <p>Link to the ENVO Ontology Ontobee page for this term.</p>
                <p>Opens in a separate window or tab.</p>
            </React.Fragment>
        );
        return (
            <Tooltip title={tooltip}>
                <a href={href} target={target}>
                    {term.ref.id} <LinkOutlined />
                </a>
            </Tooltip>
        );
    }


    render() {
        const term = this.props.term;
        switch (term.type) {
            case (OntologySource.GO):
                return this.renderGOLink(term);
            case (OntologySource.ENVO):
                return this.renderENVOLink(term);
        }
    }
}