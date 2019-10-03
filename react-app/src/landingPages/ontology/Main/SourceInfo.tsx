import React from 'react';

export interface Props {

}

interface State {

}

export default class SourceInfo extends React.Component<Props, State> {
    render() {
        return (
            <div className="Row">
                <div className="Col-auto" style={{ justifyContent: 'center' }}>
                    <img src="images/go-logo.png" style={{ height: '50px' }} alt="Gene Ontology Logo" />
                </div>
                <div className="Col">
                    <div className="InfoTable">
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Source
                            </div>
                            <div className="InfoTable-dataCol">
                                <a
                                    href="http://geneontology.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Gene Ontology (GO)
                                </a>
                            </div>
                        </div>
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Version
                            </div>
                            <div className="InfoTable-dataCol">SOME VERSION</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}