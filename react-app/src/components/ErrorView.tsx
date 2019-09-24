import React from 'react';
import { UIError } from "../types";
import { Alert, Icon } from 'antd';

export interface ErrorViewProps {
    error: UIError
}

interface ErrorViewState {

}

export default class ErrorView extends React.Component<ErrorViewProps, ErrorViewState> {
    renderMessage() {
        return (
            // <Icon type="exclamation-circle" />
            <span>
                <Icon type="exclamation-circle" style={{ color: 'red' }} />
                {' '}
                {this.props.error.message}
            </span>
        )
    }
    render() {
        return (
            <Alert type="error" message={this.renderMessage()}></Alert>
        )
    }
}