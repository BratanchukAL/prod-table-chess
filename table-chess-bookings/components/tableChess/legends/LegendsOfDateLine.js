import React, { Component } from 'react';
import './styles.css';
import Space from "../../common/Space";

class LegendsOfDateLine extends Component {
    render() {
        const {statuses} = this.props;

        let tag = [];
        for(const index in statuses) {
            if (index === 'default' ||
                index === '0' ||   //'0': 'отмена',  '1': 'незаезд',
                index === '1' ) continue;
            tag[index] = (
                <div key={index}>
                    <div  className={index !== undefined ? "line-status-color-" + index : "line-status-color"}>
                        <Space/>
                    </div>
                    {statuses[index]}
                </div>
            );
        }
        return (
            <div className="content-legends-of-dateline">
                {tag}
            </div>
        );
    }
}

export default LegendsOfDateLine;