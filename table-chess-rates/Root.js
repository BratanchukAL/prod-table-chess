import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {rootStore} from './redux/store';
import './styles';
import RatesPage from './components/router/RatesPage'


class Root extends Component {
    render() {
        return (
            <Provider store={rootStore}>
                <RatesPage />
            </Provider>
        );
    }
}

export default Root;