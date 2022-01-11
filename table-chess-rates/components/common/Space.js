import React, { Component } from 'react';

class Space extends Component {
    render() {
        const {className} = this.props;
        return (
            <span className={className || 'ml-1 mr-1'}></span>
        );
    }
}

export default Space;