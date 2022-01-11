import React, { Component } from 'react';

class AsyncDraw extends Component {

    static defaultProps={
        delay: 100
    };

    constructor(props) {
        super(props);

        setTimeout(()=>this.updateDOM(), this.props.delay);
    }

    state={
        update: true
    };

    updateDOM(){
        this.setState({update:!this.state.update})
    }

    shouldComponentUpdate(nextProps) {
        if(nextProps.loading !== this.props.loading && this.props.loading === true){
            setTimeout(()=>this.updateDOM(), this.props.delay);
            return false;
        }else if(nextProps.loading)
            return false;

        return true;
    }

    render() {
        return (
            this.props.children
        );
    }
}

export default AsyncDraw;