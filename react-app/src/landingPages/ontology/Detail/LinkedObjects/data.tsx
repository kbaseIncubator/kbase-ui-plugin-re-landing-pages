import React from 'react';
import LinkedObjectsDB, { LinkedObjectsDBStateLoaded } from './LinkedObjectsDB';
import { DBStatus, DBStateError } from '../../../../lib/DB';

import { AppConfig } from '@kbase/ui-components';
import View from './view';
import { OntologyReference } from '../../../../types/ontology';
import { Icon } from 'antd';
import ErrorView from '../../../../components/ErrorView';

export interface Props {
    token: string;
    config: AppConfig;
    termRef: OntologyReference;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: LinkedObjectsDB;
    constructor(props: Props) {
        super(props);
        this.db = new LinkedObjectsDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                status: DBStatus.NONE
            },
            token: props.token,
            config: props.config
        });
    }

    renderLoading() {
        return <Icon type="loading" />;
    }

    renderError(db: DBStateError) {
        return <ErrorView error={db.error} />
    }

    renderLoaded(db: LinkedObjectsDBStateLoaded) {
        return (
            <View
                linkedObjects={db.linkedObjects}
            />
        );
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.getLinkedObjects(this.props.termRef);
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
        }
    }
}
