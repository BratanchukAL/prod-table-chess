import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    handleSettings,
    fetchWithSettings,
    stateSelector as ratesStateSelector,
    ratesGroupByCategoriesSelector
} from '../../redux/widgets/rates';

import TableChessWithCat from '../tableChess';
import PanelSearch from '../tableChess/search';
import FormEditor from '../formEditor'
import Loader from '../common/Loader'

class RatesPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {
            loaded,
            loading,  fetchWithSettings
        } = this.props;

        if (!loading && !loaded)
            fetchWithSettings();
    }

    render() {
        const {
            rates,
            loading, error, date_start, date_end, scale,
            day_shift_index, variants_periods
        } = this.props;

        return (
            <div>
                <FormEditor updatePage={this.updatePage}/>
                <Loader loading={loading} error={error}/>
                <PanelSearch
                    date_start = {date_start}
                    date_end = {date_end}
                    scale = {scale}
                    day_shift_index = {day_shift_index}
                    variants_periods = {variants_periods}

                    onClickSubmit={this.handleClickUpdateTableChess}
                >
                    <TableChessWithCat rates={rates}
                                       loading={loading}
                                       updatePage={this.updatePage}
                    />
                </PanelSearch>
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
    loaded: ratesStateSelector(state).loaded,
    loading: ratesStateSelector(state).loading,
    error: ratesStateSelector(state).error,
    rates: ratesGroupByCategoriesSelector(state),

    date_start: ratesStateSelector(state).date_start,
    date_end: ratesStateSelector(state).date_end,
    scale: ratesStateSelector(state).scale,
    day_shift_index: ratesStateSelector(state).day_shift_index,
    variants_periods: ratesStateSelector(state).variants_periods

}), {handleSettings, fetchWithSettings})(RatesPage);