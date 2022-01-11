import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    bookingsCanceledSelector, stateSelector,
    fetchEditOrder, bookingsNotConfirmedSelector,
    bookingsConfirmedSelector, bookingsResidesSelector,
    bookingsDepartureSelector, bookingsReserveSelector
} from "../../redux/widgets/bookings";
import BookingsTableShadow from './BookingsTableShadow'
import './styles.css'
import ListGroup from "reactstrap/lib/ListGroup";

class BookingsTablesShadow extends Component {
    render() {
        const {bookingsSortByStatuses, fetchEditOrder, statuses} = this.props;

        const tag_list_table = bookingsSortByStatuses.map((bookingsSort, index) =>
            <BookingsTableShadow
                key={index}
                statuses={statuses}
                bookings={bookingsSort.data}
                caption={bookingsSort.title}
                fetchEditOrder = {fetchEditOrder}
                styleCaption = {"line-status-color-" + bookingsSort.status }
            />
        );

        return (
            <ListGroup >
                {tag_list_table}
            </ListGroup>
        );
    }
}

export default connect(
    (state) => {
        const statuses = stateSelector(state).statuses;
        return {
            bookingsSortByStatuses: [
                {
                    data: bookingsCanceledSelector(state),
                    title: 'Отмененные и незаезд',
                    status: '0',
                },
                {
                    data: bookingsNotConfirmedSelector(state),
                    title: statuses['2'],
                    status: '2',
                },
                {
                    data: bookingsConfirmedSelector(state),
                    title: statuses['3'],
                    status: '3',
                },
                {
                    data: bookingsResidesSelector(state),
                    title: statuses['4'],
                    status: '4',
                },
                {
                    data: bookingsDepartureSelector(state),
                    title: statuses['5'],
                    status: '5',
                },
                {
                    data: bookingsReserveSelector(state),
                    title: statuses['9'],
                    status: '9',
                },
            ],

            statuses
        }
    }
    , {fetchEditOrder}
)(BookingsTablesShadow);