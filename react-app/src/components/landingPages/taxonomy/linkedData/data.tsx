import React from 'react';
import LinkedDataDB, { LinkedDataDBStateError, LinkedDataDBStateLoaded } from './LinkedDataDB';
import { DBStatus } from '../lib/DB';

import { AppConfig } from '@kbase/ui-lib/lib/redux/integration/store';
import LinkedData from './LinkedData';
import { TaxonID } from '../redux/store';
import { Icon, Alert } from 'antd';

export interface Props {
    token: string;
    config: AppConfig;
    taxonID: TaxonID;
}

interface State {}

export default class Data extends React.Component<Props, State> {
    db: LinkedDataDB;
    constructor(props: Props) {
        super(props);
        this.db = new LinkedDataDB({
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

    fetchLinkedData(taxonID: TaxonID, page: number, pageSize: number) {
        return this.db.fetchLinkedObjects({ taxonID, page, pageSize });
    }

    renderNone() {
        return <Icon type="loading" />;
    }

    renderLoading() {
        return <Icon type="loading" />;
    }

    renderError(db: LinkedDataDBStateError) {
        return <Alert type="error" message={db.message} />;
    }

    renderLoaded(db: LinkedDataDBStateLoaded) {
        return <LinkedData linkedObjects={db.linkedObjects} />;
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.fetchLinkedObjects({ taxonID: this.props.taxonID, page: 1, pageSize: 1000 });
                return this.renderNone();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
        }
    }
}
