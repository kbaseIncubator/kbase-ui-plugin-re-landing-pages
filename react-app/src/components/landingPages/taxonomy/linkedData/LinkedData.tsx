import React from 'react';
import { LinkedObject } from '../lib/model';

export interface Props {
    linkedObjects: Array<LinkedObject>;
}

interface State {}

export default class LinkedData extends React.Component<Props, State> {
    render() {
        return <div>Coming soon...</div>;
    }
}
