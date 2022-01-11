import React, { Component } from 'react';
import {strToLocaleDateStr} from "../../models/utilities/date";
import Masks from "../../models/utilities/masks";

import FormControl from 'reactstrap/lib/Input'

class Row extends Component {

    static defaultProps ={
        bookingsCanceled: null,
        onClickSubmit:null,
        statuses: null,
    };

    constructor(props){
        super(props);

        this.NamesField = {
            DownStatus: 'DownStatus',
        };

        this.state = {
            values: {
                [this.NamesField.DownStatus]: this.props.booking.status === undefined ? this.props.statuses['default'] : this.props.booking.status
            },
        };
    }

    render() {
        const {booking} = this.props;

        return (
            <tr >
                <td>{booking.id}</td>
                <td>{booking.client_fio}</td>
                <td> {strToLocaleDateStr(booking.date_start)}</td>
                <td> {strToLocaleDateStr(booking.date_end)}</td>
                <td> {Masks.telephone(booking.client_phone).value}</td>
                <td> {strToLocaleDateStr(booking.created_at)}</td>
                <td> {this.fieldStatus()} </td>
            </tr>

        );
    }

    handleChangeStatus=(value)=>{
        const {onClickSubmit, booking} = this.props;
        onClickSubmit(booking, value);
    };

    handleChange = (name_field, sender) => {
        let value = sender.target.value;

        if(name_field === this.NamesField.DownStatus)
            this.handleChangeStatus(value);

        this.setState({
            values: {
                ...this.state.values,
                [name_field]: value
            }
        });

    };

    fieldStatus() {
        const {statuses} = this.props;

        let tag_statuses = [];
        for (const index in statuses)
            tag_statuses[index] = <option key={index} value={index}> {statuses[index]} </option>;

        return this.itemFieldSelect(this.NamesField.DownStatus, '', tag_statuses);
    }

    itemFieldSelect(name_component, label, tagOption) {
        return (
            <div >
                <FormControl
                    style={{padding: 0}}
                    type="select"
                    value={this.state.values[name_component]}
                    // bsSize="sm"
                    onChange={this.handleChange.bind(this, name_component)}
                >
                    {tagOption}
                </FormControl>
            </div>
        );
    }
}

export default Row;