import { StoreState, RelationEngineID, Navigation } from '../../redux/store';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Dispatcher } from './Dispatcher';
import { RootState } from '@kbase/ui-components';
import { navigate } from '../../redux/actions';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    // view: RelationEngineView;
    // viewState: ViewStatus;
    navigation: Navigation;
    trigger: number;
}

interface DispatchProps {
    navigate: (relationEngineID: RelationEngineID) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        root: { state: rootState },
        navigation,
        trigger
    } = state;

    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    return { token, rootState, navigation, trigger };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        navigate: (relationEngineID: RelationEngineID) => {
            dispatch(navigate(relationEngineID) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
