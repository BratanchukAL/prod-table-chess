import React, { PureComponent } from 'react';
import DatePicker from 'react-date-picker'
import {todayDate} from '../../../models/utilities/date'

/*
* PROPS {onClickSubmit, onChange, value}
* */
class _DatePicker extends PureComponent {

    constructor(props){
        super(props);

        this.state = {
            date: this.props.dateStart,
            forceUpdate: false,
        };

        props.setThis(this);
    }

    static defaultProps={
        dateStart: todayDate()
    };

    silentState={
        today_date: this.props.dateStart,
    };


    render() {

        this.state.date = this.props.dateStart; 

        return (
            <div className="z-20">
                <DatePicker  value={this.props.dateStart}   onChange={this.handleChangeDatePicker}/>
            </div>
        );
    }

    handleChangeDatePicker = async(new_date) => {
        const {onClickSubmit} = this.props;

        if (!new_date) new_date = this.silentState.today_date;

        await this.setState({date: new_date});

        onClickSubmit(new_date);
    };


}

export default _DatePicker;