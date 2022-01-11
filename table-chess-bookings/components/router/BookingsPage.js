import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    handleSettings,
    fetchWithSettings,
    stateSelector as bookingsStateSelector,
    bookingsGroupByRoomCategoriesSelector
} from '../../redux/widgets/bookings';

import TableChessWithCat from '../tableChess/TableChessWithCat';
import PanelSearch from '../tableChess/search/';
import FormEditorBooking from '../formEditorBooking'
import Loader from '../common/Loader'
import BookingsTablesShadow from '../bookings-tables-shadow/'
import LegendsOfDateLine from "../tableChess/legends/LegendsOfDateLine";


class BookingsPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {
            loaded,
            loading, fetchWithSettings
        } = this.props;

        if (!loading && !loaded)
            fetchWithSettings();
    }

    render() {
        console.log('BookingsPage render', this.props); //TODO: debug
        const {
            bookings,
            loading, error, date_start, date_end, scale,
            day_shift_index, variants_periods, statuses,

        } = this.props;

        return (
            <div>
                {/*<DropDownFetch Component={Button}/>*/}
                <FormEditorBooking updatePage={this.updatePage}
                                   categoriesNumbers={bookings}
                                   statuses={statuses}
                />
                <Loader loading={loading} error={error}/>

                <PanelSearch
                    date_start={date_start}
                    date_end={date_end}
                    scale={scale}
                    day_shift_index={day_shift_index}
                    variants_periods={variants_periods}

                    onClickSubmit={this.handleClickUpdateTableChess}
                >
                    <TableChessWithCat bookings={bookings}
                                       loading={loading}
                                       updatePage={this.updatePage}
                    />
                </PanelSearch>
                <LegendsOfDateLine statuses={statuses}/>

                <BookingsTablesShadow />
            </div>
        );
    }

    handleClickUpdateTableChess = (payload) => {
        this.props.handleSettings(payload);
    };

    updatePage = () => {
        //this.props.handleSettings();
    }
}

export default connect((state) => ({
    loaded: bookingsStateSelector(state).loaded,
    loading: bookingsStateSelector(state).loading,
    error: bookingsStateSelector(state).error,
    bookings: bookingsGroupByRoomCategoriesSelector(state),

    date_start: bookingsStateSelector(state).date_start,
    date_end: bookingsStateSelector(state).date_end,
    scale: bookingsStateSelector(state).scale,
    day_shift_index: bookingsStateSelector(state).day_shift_index,
    variants_periods: bookingsStateSelector(state).variants_periods,
    statuses: bookingsStateSelector(state).statuses,
}), {handleSettings, fetchWithSettings})(BookingsPage);