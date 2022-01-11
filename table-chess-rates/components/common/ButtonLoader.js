import React, { Component } from 'react';
import Button from "reactstrap/lib/Button";

/**
 *   static defaultProps={
 *       actionFetch: null, //template fetch(callBackResult, callBackError)
 *       onClick: null,
 *       onResult: null,
 *       onError: null,
 *   };
* */

class ButtonLoader extends Component {

    state={
        loading: false,
    };

    static defaultProps={
        actionFetch: null, //template fetch(callBackResult, callBackError)
        onClick: null,
        onResult: null,
        onError: null,
    };

    render() {
        const {loading}=this.state;
        const { children, actionFetch, onResult, onError, ...param} = this.props;
        return (
            <Button {...param} onClick={this.handleClick}>
                { loading ? 'Загрузка...' : children}
            </Button>
        );
    }

    handleClick=()=>{
        const {onClick, actionFetch} = this.props;
        onClick && onClick();
        actionFetch(this.handleResult, this.handleError);

        this.setState({loading: true});
    };

    handleResult=(res)=>{
        const {onResult} = this.props;
        onResult && onResult(res);
        this.setState({loading: false});
    };

    handleError=(res)=>{
        const {onError} = this.props;
        onError && onError(res);
        this.setState({loading: false});
    };
}

export default ButtonLoader;