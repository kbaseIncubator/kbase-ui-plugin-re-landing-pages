import React from 'react';
import { Pagination, Icon, Alert, Input } from 'antd';
import TaxonList from '../TaxonList';
import { TaxonID } from '../redux/store';
import { TaxonDBState, TaxonDBStateError, TaxonDBStateLoaded } from './TaxonChildrenDB';
import { DBStatus } from '../lib/DB';
import './index.css';

const DEFAULT_PAGE_SIZE = 10;

export interface Props {
    db: TaxonDBState;
    taxonID: TaxonID;
    selectedTaxonID: TaxonID | null;
    // taxa: Array<Taxon>;
    // total: number;
    selectTaxonID: (taxonID: TaxonID) => void;
    navigateToTaxonID: (taxonID: TaxonID) => void;
    fetchChildren: (taxonID: TaxonID, page: number, pageSize: number, searchTerm: string) => void;
}

export interface State {}

export default class TaxonChildren extends React.Component<Props, State> {
    searchTerm: string;
    page: number;
    pageSize: number | null;
    constructor(props: Props) {
        super(props);
        this.searchTerm = '';
        this.page = 1;
        this.pageSize = null;
    }
    componentDidMount() {
        this.props.fetchChildren(this.props.taxonID, 1, DEFAULT_PAGE_SIZE, '');
    }
    renderTaxaNone() {
        return <div>None</div>;
    }
    renderTaxaLoading() {
        return <Icon type="loading" />;
    }
    renderTitle() {
        const db = this.props.db;
        switch (db.status) {
            case DBStatus.NONE:
            case DBStatus.LOADING:
                return <div>Loading...</div>;
            case DBStatus.ERROR:
                return <div>ERROR: {db.message}</div>;
            case DBStatus.LOADED:
                if (db.total === 0) {
                    return <div className="Col-auto TaxonChildren-box-title">No Children</div>;
                }

                const totalCount = Intl.NumberFormat('en-US', {
                    useGrouping: true
                }).format(db.total);
                const currentItem = (db.page - 1) * db.pageSize + 1;
                const lastItem = currentItem + db.taxa.length - 1;

                return (
                    <div className="Col-auto TaxonChildren-box-title">
                        Children ({currentItem}-{lastItem} of {totalCount})
                    </div>
                );
        }
    }
    doSearch(term: string) {
        // console.log('searching: ' + term);
        this.searchTerm = term;
        this.props.fetchChildren(this.props.taxonID, this.page, this.pageSize || DEFAULT_PAGE_SIZE, term);
    }
    renderSearch() {
        const disabled =
            this.props.db.status !== DBStatus.LOADED ||
            (this.props.db.total <= this.props.db.pageSize && !this.searchTerm);
        return (
            <div style={{ marginBottom: '4px' }}>
                <Input.Search placeholder="Search Children" onSearch={this.doSearch.bind(this)} disabled={disabled} />
            </div>
        );
    }
    renderTaxaLoaded(db: TaxonDBStateLoaded) {
        return (
            <React.Fragment>
                <TaxonList
                    taxa={db.taxa}
                    selectedTaxonID={this.props.selectedTaxonID}
                    selectTaxonID={this.props.selectTaxonID}
                    navigateToTaxonID={this.props.navigateToTaxonID}
                    totalItems={db.total}
                    maxItems={DEFAULT_PAGE_SIZE}
                />
            </React.Fragment>
        );
    }
    renderTaxaError(db: TaxonDBStateError) {
        return <Alert type="error" message={db.message} />;
    }
    renderTaxa() {
        switch (this.props.db.status) {
            case DBStatus.NONE:
                return this.renderTaxaNone();
            case DBStatus.LOADING:
                return this.renderTaxaLoading();
            case DBStatus.LOADED:
                return this.renderTaxaLoaded(this.props.db);
            case DBStatus.ERROR:
                return this.renderTaxaError(this.props.db);
        }
    }
    changePage(page: number, pageSize: number | undefined) {
        this.page = page;
        this.pageSize = pageSize || DEFAULT_PAGE_SIZE;
        this.props.fetchChildren(this.props.taxonID, this.page, this.pageSize, this.searchTerm);
    }
    renderPagination() {
        const db = this.props.db;
        if (db.status !== DBStatus.LOADED) {
            return (
                <Pagination
                    size="small"
                    // defaultPageSize={0}
                    // defaultCurrent={1}
                    showLessItems={true}
                    // current={db.page}
                    hideOnSinglePage={false}
                    // total={db.total}
                    // onChange={this.changePage.bind(this)}
                />
            );
        }
        return (
            <Pagination
                size="small"
                defaultPageSize={db.pageSize}
                // defaultCurrent={1}
                showLessItems={true}
                current={db.page}
                hideOnSinglePage={false}
                total={db.total}
                onChange={this.changePage.bind(this)}
            />
        );
    }
    renderChildren() {
        return (
            <div>
                {this.renderTitle()}
                {this.renderSearch()}
                {this.renderPagination()}
                {this.renderTaxa()}
            </div>
        );
    }

    render() {
        return this.renderChildren();
    }
}
