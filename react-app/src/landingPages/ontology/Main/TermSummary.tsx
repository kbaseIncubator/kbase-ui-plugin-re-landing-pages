import React from 'react';
import { OntologyTerm } from '../../../types/ontology';

export interface Props {
    term: OntologyTerm
}

interface State {

}

export default class TermSummary extends React.Component<Props, State> {
    render() {
        return (
            <div className="InfoTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        ID
                    </div>
                    <div className="InfoTable-dataCol">{this.props.term.goID}</div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        Name
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.term.name}
                    </div>
                </div>

            </div>
        );
    }

}