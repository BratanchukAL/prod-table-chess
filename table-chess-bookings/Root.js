import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {rootStore} from './redux/store';
import './styles';
import BookingsPage from './components/router/BookingsPage'


class Root extends Component {
    render() {
        return (
            <Provider store={rootStore}>
                <DragDropContextProvider backend={HTML5Backend}>
                    <BookingsPage />
                </DragDropContextProvider>
            </Provider>
        );
    }
}

export default Root;