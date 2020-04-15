import React from 'react';
import './index.less';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import appStore from '@/stores/AppStore';
import BasicLayout from '../BasicLayout';

function App() {
    return (
        <Provider appStore={appStore}>
            <HashRouter>
                <Switch key="bas">
                    <Route path="/" render={(props) => <BasicLayout {...props} />} />
                </Switch>
            </HashRouter>
        </Provider>
    );
}

export default App;
