import React from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase } from '@kbase/ui-lib';
import './App.css';

const store = createReduxStore();

interface AppProps {}

interface AppState {}

export default class App<AppProps, AppState> extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppBase>
                    <div className="App">
                        <p>Hello!</p>
                    </div>
                </AppBase>
            </Provider>
        );
    }
}
