import { StoreState, RelationEngineID, Navigation, View } from '../../redux/store';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Dispatcher } from './view';
import { RootState } from '@kbase/ui-components';
import { navigate } from '../../redux/actions';
import { TopLevelView } from '../../redux/store/view';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    view: TopLevelView;
    trigger: number;
}

interface DispatchProps {
    navigate: (relationEngineID: RelationEngineID) => void;
    // view: (view: View) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        root: { state: rootState },
        trigger,
        view
    } = state;

    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    return { token, rootState, view, trigger };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        navigate: (relationEngineID: RelationEngineID) => {
            dispatch(navigate(relationEngineID) as any);
        },
        // view: (view: View) => {
        //     dispatch(view(view) as any)
        // }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
