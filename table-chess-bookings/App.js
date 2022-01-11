import React, { Component } from 'react';
import Root from './Root'
import {helper} from "./helper/index";


class App extends Component {
    constructor(props){
        super(props);
        helper.storeElement(props.element);
    }

    render() {
        return (
            <Root />
        );
    }
}

export default App;
