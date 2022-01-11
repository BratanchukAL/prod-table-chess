import React, {Component} from 'react';
import {strToLocaleDateStr} from "../../models/utilities/date";
import Masks from "../../models/utilities/masks";
import {connect} from 'react-redux';
import {stateSelector as bookingsStateSelector, fetchEditOrder} from '../../redux/widgets/bookings';

import FormControl from 'reactstrap/lib/Input'
import Label from "reactstrap/lib/Label";
import Space from "../common/Space";

class TooltipFormBooking extends Component {

    constructor(props) {
        super(props);

        this.NamesField = {
            DownStatus: 'DownStatus',
        };

        this.state = {
            values: {
                [this.NamesField.DownStatus]: this.props.booking.status === undefined ? this.props.statuses['default'] : this.props.booking.status,
            },
        };
    }

    static  defaultProps = {
        booking: null,
        statuses: null,
    };

    render() {
        const {booking} = this.props;
        return (
            <div>
                <div>{booking.client_fio}</div>
                <div>Заезд: {strToLocaleDateStr(booking.date_start)}</div>
                <div>Выезд: {strToLocaleDateStr(booking.date_end)}</div>
                <div>Телефон: {Masks.telephone(booking.client_phone).value}</div>
                {booking.client_email && <div>E-mail: {booking.client_email}</div>}
                <div>{this.fieldStatus()}</div>
                <div>к оплате: {booking.price}</div>
                <div>Дата: {strToLocaleDateStr(booking.created_at)}</div>
                <div>ID: {booking.id}</div>
            </div>
        );
    }

    handleChangeStatus=(value)=>{
        const {fetchEditOrder, booking}=this.props;
        const status = value;
        fetchEditOrder({
            booking_id: booking.id,
            date_start: booking.date_start,
            date_end: booking.date_end,
            category_id: booking.category_id,
            room_id: booking.room_id,
            client_fio: booking.client_fio,
            client_phone: booking.client_phone,
            client_email: booking.client_email,
            comment: booking.comment,
            price: booking.price,
            created_at: booking.created_at,
            status});
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

        return this.itemFieldSelect(this.NamesField.DownStatus, 'Статус:', tag_statuses);
    }

    itemFieldSelect(name_component, label, tagOption) {
        return (
            <div style={{display: 'flex'}}>
                <Label>{label}</Label><Space/>
                <FormControl
                    style={{padding: 0}}
                    type="select"
                    value={this.state.values[name_component]}
                    bsSize="sm"
                    onChange={this.handleChange.bind(this, name_component)}
                >
                    {tagOption}
                </FormControl>
            </div>
        );
    }
}

export default connect((state) => ({
    statuses: bookingsStateSelector(state).statuses
}), {fetchEditOrder})(TooltipFormBooking);