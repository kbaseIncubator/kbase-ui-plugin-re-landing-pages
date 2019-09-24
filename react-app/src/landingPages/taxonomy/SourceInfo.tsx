import React from 'react';
import './SourceInfo.css';

export interface SourceInfoProps {}

interface SourceInfoState {}

export class SourceInfo extends React.Component<SourceInfoProps, SourceInfoState> {
    render() {
        return (
            <div className="Row">
                <div className="Col-auto">
                    <img src="images/ncbi-logo.jpg" style={{ height: '64px' }} alt="NCBI Logo" />
                </div>
                <div className="Col">
                    <div className="InfoTable">
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Source
                            </div>
                            <div className="InfoTable-dataCol">
                                <a
                                    href="https://www.ncbi.nlm.nih.gov/guide/taxonomy/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    NCBI
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
