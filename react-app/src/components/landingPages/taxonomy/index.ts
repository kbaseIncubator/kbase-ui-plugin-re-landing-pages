import { RelationEngineID, StoreState } from '../../../redux/store';
// import { TaxonID } from './redux/store';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { navigate } from '../../../redux/actions';
import { connect } from 'react-redux';
import Taxonomy from './main';
import { sendTitle } from '@kbase/ui-lib';

export interface OwnProps {
    // taxonID: TaxonID;
}

export interface StateProps {
    // taxonID: TaxonID;
}

export interface DispatchProps {
    navigate: (relationEngineID: RelationEngineID) => void;
    setTitle: (title: string) => void;
    // load: (taxonID: TaxonID) => void;
}

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        navigate: (relationEngineId: RelationEngineID) => {
            dispatch(navigate(relationEngineId) as any);
        },
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        }
        // load: (taxonID: TaxonID) => {
        //     dispatch(load(taxonID) as any);
        // }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Taxonomy);
