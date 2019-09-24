import React from 'react';
import LinkedDataDB, { LinkedDataDBStateError, LinkedDataDBStateLoaded } from './LinkedDataDB';
import { DBStatus } from '../../../../lib/DB';

import { AppConfig } from '@kbase/ui-components';
import LinkedData from './LinkedData';
import { TaxonReference } from '../../../../types/taxonomy';
import { Icon } from 'antd';
import ErrorView from '../../../../components/ErrorView';

export interface Props {
    token: string;
    config: AppConfig;
    taxonRef: TaxonReference;
}

interface State { }

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

    fetchLinkedData(taxonRef: TaxonReference, page: number, pageSize: number) {
        return this.db.fetchLinkedObjects({ taxonRef, page, pageSize });
    }

    renderNone() {
        return <Icon type="loading" />;
    }

    renderLoading() {
        return <Icon type="loading" />;
    }

    renderError(db: LinkedDataDBStateError) {
        return (
            <ErrorView error={db.error} />
        )
    }

    renderLoaded(db: LinkedDataDBStateLoaded) {
        return <LinkedData linkedObjects={db.linkedObjects} />;
    }

    componentDidMount() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 1000 });
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.taxonRef.id !== this.props.taxonRef.id ||
            prevProps.taxonRef.namespace !== this.props.taxonRef.namespace ||
            prevProps.taxonRef.timestamp !== this.props.taxonRef.timestamp) {

            this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 1000 });
        }
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                // this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 1000 });
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
