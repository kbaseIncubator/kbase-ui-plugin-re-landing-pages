import React from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase } from '@kbase/ui-lib';
import './App.css';
import Dispatcher from './components/dispatcher';
import { Unsubscribe } from 'redux';
import { navigate } from './redux/actions';

const store = createReduxStore();

interface AppProps {}

interface AppState {}

export default class App<AppProps, AppState> extends React.Component {
    storeSubscription: Unsubscribe | null;
    constructor(props: AppProps) {
        super(props);
        this.storeSubscription = null;
    }
    componentDidMount() {
        let last: {
            view: string | null;
            params: { [key: string]: string };
        } = {
            view: null,
            params: {}
        };
        this.storeSubscription = store.subscribe(() => {
            const state = store.getState();
            if (!state) {
                return;
            }
            const {
                app: {
                    runtime: { navigation }
                }
            } = state;

            const view = navigation.view;
            const params = navigation.params as { [key: string]: string };

            // console.log('store changed', navigation);

            if (
                view !== last.view ||
                last.params === null ||
                Object.keys(params).some((key) => {
                    return params[key] !== last.params[key];
                })
            ) {
                last.params = params;
                last.view = view;
                // console.log('yahoo', view, params);
                // TODO: store may change but there is not navigation yet.
                if (params['relationEngineID']) {
                    store.dispatch(navigate(params['relationEngineID']) as any);
                }
            }
        });
    }
    render() {
        return (
            <Provider store={store}>
                <AppBase>
                    <div className="App Col scrollable">
                        <Dispatcher />
                    </div>
                </AppBase>
            </Provider>
        );
    }
}
