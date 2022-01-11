import React, { Component } from 'react';
import Space from "../../common/Space";
import GlobalWindow from "../../../models/utilities/window";


class LineToday extends Component {

    static defaultProps={
        time: null,
        refEndTable: null,
    };

    silentState = {
         ref: React.createRef()
    };

    render() {
        return (
            <div ref={this.silentState.ref} className="today-line">
                <Space/>
            </div>
        );
    }

    componentDidMount(){
        this.calcBounding();
    }
    componentDidUpdate(){
        this.calcBounding();
    }

    calcBounding(){
        if( !this.props.refEndTable || !this.props.refEndTable.current) return;

        const element = this.silentState.ref.current;
        const  width = GlobalWindow.getComputedStyle(element, 'width', true);

        const box_day = GlobalWindow.getBoxById(`th-day${this.props.time}`);
        const half_width = box_day.width/2.0 - width/2.0 - 1;

        element.style.left = half_width+'px';

        const box_element = element.getBoundingClientRect();
        const end_table = this.props.refEndTable.current.getBoundingClientRect();

        element.style.height =  (end_table.top-box_element.top)+'px';
    }
}

export default LineToday;