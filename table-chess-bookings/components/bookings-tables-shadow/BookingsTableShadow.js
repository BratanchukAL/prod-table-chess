import React, {Component} from 'react';
import {Table} from "reactstrap";
import Row from './Row'
import Icon from "../common/Icon";
import Space from "../common/Space";
import ListGroupItem from "reactstrap/lib/ListGroupItem";


class BookingsTableShadow extends Component {
    state = {
        isOpen: false
    };

    static defaultProps = {
        bookings: null,
        statuses: null,
        caption: null,
        styleCaption: null
    };

    render() {
        const {bookings, statuses, caption, styleCaption} = this.props;

        console.log('TableShadow'); //TODO: debug
        let tag_rows = bookings.map((booking) => {
            return <Row key={booking.id}
                        onClickSubmit={this.handleSubmitStatus}
                        statuses={statuses}
                        booking={booking}
            />
        });

        if (!tag_rows.length)
            tag_rows = <tr>
                <td colSpan={20}>Не найдено</td>
            </tr>;

        const button_m_p = this.state.isOpen ? <Icon name="menu-up"/> : <Icon name="menu-down"/>;

        return (
            <ListGroupItem className="container-table-shadow">
                <div className={`${this.state.isOpen && 'mb-4'} cursor-pointer button`}
                     onClick={this.handleClickOpen}
                >
                    <div className={`${styleCaption}`}><Space/></div>
                    <Space/>
                    <div className="text">{caption}</div>
                    <Space/>
                    {button_m_p}
                </div>

                <Table hidden = {!this.state.isOpen} >
                    <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Имя гостя
                        </th>
                        <th>
                            Заезд
                        </th>
                        <th>
                            Выезд
                        </th>
                        <th>
                            Телефон
                        </th>
                        <th>
                            Дата заявки
                        </th>
                        <th>
                            Статус
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tag_rows}
                    </tbody>

                </Table>

            </ListGroupItem>
        );
    }

    handleClickOpen = () => {
        this.setState({isOpen: !this.state.isOpen})
    };

    handleSubmitStatus = (booking, status) => {
        const {fetchEditOrder} = this.props;

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
            status
        });
    };
}

export default BookingsTableShadow;