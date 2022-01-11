import React, { Component } from 'react';

class Icon extends Component {
    static defaultProps = {
        className: null,
        name: 'plus',
        repeat: 1,
    };
    render() {
        const{className, name, repeat} = this.props;
        let tag_icons=[];
        for(let i = 0; i < repeat; i++)
            tag_icons[i]=(
                <span key={i} className={`glyphicon glyphicon-${name} ${className}`}></span>
            );
        return (
            tag_icons
        );
    }
}

export default Icon;