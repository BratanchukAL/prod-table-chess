import React, {Component} from 'react';
import GlobalWindow from '../../models/utilities/window'
import MarkLine from './MarkLine';
import FreeCellDropTarget, {FreeCell} from './FreeCell';
import {msToDays, DAY, isDayOff, strToDate} from '../../models/utilities/date'
import {NEW_BOOKING, EDIT_BOOKING, DRAG_BOOKING, NAME_FORM as NAME_FORM_EDITOR_BOOKING} from '../formEditorBooking'
import {ConnectFormProperty} from '../../modules/redux-form-property'
import Space from "../common/Space";


class Row extends Component {

    constructor(props) {
        super(props);

        this.CellSelected = {
            ref: [],
            busy: [],
            isBusy: (key) => {
                return this.CellSelected.busy[key];
            },
            calcRangBusy: (key) => {
                const max = this.maxTimeCalendar;
                const min = this.minTimeCalendar;
                const isBusy = this.CellSelected.isBusy;
                const rang_busy = {time_start: max, time_end: min};
                /*time_start*/
                for (let index = key; index <= max; index += DAY) {
                    if (isBusy(index)) {
                        rang_busy.time_start = strToDate(isBusy(index).date_start).getTime();
                        break;
                    }
                }
                /*time_end*/
                for (let index = key; index >= min; index -= DAY) {
                    if (isBusy(index)) {
                        rang_busy.time_end = strToDate(isBusy(index).date_end).getTime();
                        break;
                    }
                }
                return rang_busy;
            },
            set_by_key: (key) => {
                if (this.CellSelected.isBusy(key)) {
                    const box_date_start = GlobalWindow.getBoxById(`th-day${key}`);
                    const width = box_date_start.right - box_date_start.left;
                    this.CellSelected.ref[key].current.style.width = width + 'px';
                }

                this.CellSelected.ref[key].current.className = ComStyles.selectedCell;
                this.CellSelected.ref[key].current.innerHTML = (new Date(key)).getDate();
            },
            clear_ref: () => {
                for (let index in this.CellSelected.ref) {
                    if (this.CellSelected.ref[index].current)
                        this.CellSelected.clear_ref_by_key(index);
                }
                this.CellSelected.last_key = null;
                this.CellSelected.first_key = null;
                this.CellSelected.row_id = null;
                this.CellSelected.isDown = false;
                this.CellSelected.rang_busy = {time_start: null, time_end: null}
            },
            clear_ref_by_key: (key) => {
                this.CellSelected.ref[key].current.className = ComStyles.unSelectedCell;
                this.CellSelected.ref[key].current.innerHTML = "&nbsp;"
                this.CellSelected.ref[key].current.title = "";
            },
            delete_ref: () => {
                this.CellSelected.ref = [];
                this.CellSelected.busy = [];
            },
            reset: () => {
                this.CellSelected.clear_ref();
                this.CellSelected.delete_ref();
            },
            get_date: () => {
                const {last_key, first_key} = this.CellSelected;
                if (last_key === first_key) {
                    return {
                        date_start: new Date(last_key),
                        date_end: new Date(last_key + DAY)
                    }
                }

                if (last_key > first_key)
                    return {
                        date_start: new Date(first_key),
                        date_end: new Date(last_key)
                    };
                else
                    return {
                        date_start: new Date(last_key),
                        date_end: new Date(first_key)
                    };
            },
            resetSelected: () => {
                console.log('resetSelected') //TODO: debug
                this.CellSelected.clear_ref();
            },
            handleMouseOver:(key)=>{
                const {
                    rang_busy,
                    isDown,
                    last_key, first_key
                } = this.CellSelected;

                if (isDown === true) {
                    const dir_line = key - first_key;
                    let is_crossing_booking = false;

                    if (rang_busy.time_start) {
                        if (dir_line > 0)
                            is_crossing_booking = (rang_busy.time_start < key);
                        else
                            is_crossing_booking = (rang_busy.time_end > key);
                    }

                    const dir = (key - last_key) / Math.abs(key - last_key);
                    const dir_day = DAY * dir;
                    const dir_key = key * dir;

                    if (( ((last_key - first_key) > 0) === ((key - last_key) > 0)) ||
                        (last_key === first_key)) {

                        if (!is_crossing_booking) {
                            for (let index = last_key; (index * dir <= dir_key); index += dir_day) {
                                this.CellSelected.set_by_key(index);
                            }

                            this.CellSelected.last_key = key;
                        }
                    } else {
                        if (first_key !== last_key) {
                            if (!is_crossing_booking) {
                                for (let index = last_key; (index * dir < dir_key); index += dir_day) {
                                    this.CellSelected.clear_ref_by_key(index);
                                }

                                for (let index = first_key; (index * dir <= dir_key); index += dir_day) {
                                    this.CellSelected.set_by_key(index);
                                }
                                this.CellSelected.last_key = key;
                            }
                        }
                    }
                }
            },
            isDown: false,
            first_key: null,
            last_key: null,
            rang_busy: {time_start: null, time_end: null},
            row_id: null,
        };
    }

    state = {
        what_booking_id_drag: null
    };

    get maxTimeCalendar() {
        return this.props.calendar.days[this.props.calendar.days.length - 1].key;
    }

    get minTimeCalendar() {
        return this.props.calendar.days[0].key;
    }

    FormEditorBooking = {
        this: null,
        handleThis: (_this) => {
            this.FormEditorBooking.this = _this;
            this.FormEditorBooking.handleClose = this.FormEditorBooking.this.handleCloseFormBooking;
            this.FormEditorBooking.this.handleCloseFormBooking = this.FormEditorBooking.decorHandleClose;
        },
        decorHandleClose: () => {
            this.FormEditorBooking.handleClose();
            this.CellSelected.clear_ref();
        },
        handleClose: null,

        show: (type, booking, key) => {

            switch (type) {
                case NEW_BOOKING:
                case EDIT_BOOKING:
                    const booking_date = this.CellSelected.get_date();
                    this.FormEditorBooking.this.Show({
                        date_start: booking_date.date_start,
                        date_end: booking_date.date_end,
                        category_id: this.props.arrayData.category_id,
                        room_id: this.props.arrayData.id,
                        booking
                    }, type);
                    break;

                case DRAG_BOOKING:
                    const date_start = strToDate(key);
                    const shift = strToDate(booking.date_end) - strToDate(booking.date_start);
                    const date_end = strToDate(date_start);
                    date_end.setTime(date_end.getTime() + shift);

                    this.FormEditorBooking.this.Show({
                        date_start,
                        date_end,
                        category_id: this.props.arrayData.category_id,
                        room_id: this.props.arrayData.id,
                        booking
                    }, type);
                    break;
            }
        },

    };

    factoryRefsCell(key) {
        if (!this.CellSelected.ref[key]) {
            this.CellSelected.ref[key] = React.createRef();
        }
        return this.CellSelected.ref[key]
    }

    handleMouseClickCell(key, row_id, busy, sender) {
        if(sender.button===0) {
            const {setRowIDCursor} = this.props;

            GlobalWindow.canceledSelection();

            if (!this.CellSelected.isDown) {
                if (!busy) {
                    this.CellSelected.clear_ref();

                    this.CellSelected.ref[key].current.title = 'Выберите следующую дату и нажмите правой кнопкой мыши';
                    setRowIDCursor(row_id, this.CellSelected.resetSelected);

                    this.CellSelected.isDown = true;
                    this.CellSelected.row_id = row_id;
                    this.CellSelected.first_key = key;
                    this.CellSelected.last_key = key;
                    this.CellSelected.set_by_key(key);

                    this.CellSelected.rang_busy = this.CellSelected.calcRangBusy(key);
                }
            } else {
                this.CellSelected.isDown = false;
                this.CellSelected.last_key = key;
                this.FormEditorBooking.show(NEW_BOOKING);
                //setRowIDCursor(null);
            }
        }
    };

    handleMouseOverCell(key) {
        this.CellSelected.handleMouseOver(key);
        this.Elements['day-select'].handleMouseOver(key);
    };

    handleClickMarkLine = (booking) => {
        this.FormEditorBooking.show(EDIT_BOOKING, booking);
    };

    handleMouseLeaveCell = (key)=>{
        this.Elements['day-select'].handleMouseLeave(key);
    };

    madeMarkLine(key, colspan, booking, row_id, isDayOff, isToday) {
        const BUSY = true;
        const NOTBUSY = false;

        if (booking) {
            const nofit_date_line = this.minTimeCalendar > strToDate(booking.date_start);

            this.CellSelected.busy[key] = booking;
            return <td
                className={`busy-cell`} key={key} colSpan={colspan}
                onClick={this.handleMouseClickCell.bind(this, key, row_id, BUSY)}
                onMouseOver={this.handleMouseOverCell.bind(this, key)}
                onMouseLeave={this.handleMouseLeaveCell.bind(this, key)}
            >
                <FreeCell refLink={this.factoryRefsCell(key)}
                          startStyles={ComStyles.unSelectedCell}
                />

                {isDayOff &&
                    <FreeCell
                        refLink={this.Elements['day-off-start-booking'].getRef(key)}
                        startStyles={'absolute day-off fill-free'}
                    />
                }

                <MarkLine booking={booking}
                          onClick={this.handleClickMarkLine.bind(this, booking)}
                          onBeginDrag={this.handleEventBeginDrag.bind(this, booking.id)}
                          onEndDrag={this.handleEventEndDrag}
                          noFitInStart={nofit_date_line}
                />
            </td>;
        }
        else {
            this.CellSelected.busy[key] = null;
            return <td className={`${ComStyles.freeDay} ${isDayOff && 'day-off'}`}
                       key={key}
                       onMouseDown={this.handleMouseClickCell.bind(this, key, row_id, NOTBUSY)}
                       onMouseOver={this.handleMouseOverCell.bind(this, key)}
                       onMouseLeave={this.handleMouseLeaveCell.bind(this, key)}
            >
                <FreeCellDropTarget refLink={this.factoryRefsCell(key)}
                                    onShowEditor={this.FormEditorBooking.show.bind(null, DRAG_BOOKING)}
                                    time={key}
                                    startStyles={ComStyles.unSelectedCell}
                />
            </td>;
        }
    }

    madeCells(data, calendar) {
        let countdown = 0;
        let drawed_id = 0;
        const calendar_start = this.minTimeCalendar;
        const calendar_end = this.maxTimeCalendar;

        return calendar.days.map((day, index) => {
            if (countdown === 0) {
                let colspan_day = 0;

                const booking = data.bookings.find((booking) => {
                    if (booking.id === drawed_id) return false;

                    const date_end = strToDate(booking.date_end);
                    const date_start = strToDate(booking.date_start);
                    const new_enddate = Math.min(date_end, calendar_end);

                    if (day.key >= date_start && day.key < new_enddate) {
                        colspan_day = msToDays(new_enddate - Math.max(date_start, calendar_start));
                        /* когда бронь уходит за пределы с правой стороны таблицы */
                        if (date_end > calendar_end)
                            colspan_day += 1;
                        drawed_id = booking.id;
                        return true;
                    }
                    else return false;
                });

                if (booking)
                    if (booking.id === this.state.what_booking_id_drag) {
                        colspan_day = 0;
                        countdown = 0;
                    } else
                        countdown = colspan_day - 1;

                return this.madeMarkLine(day.key, colspan_day, booking, data.id,
                                        calendar.weekdays[index].isDayOff,
                                        calendar.days[index].isToday
                    );
            } else
                countdown--;
        });
    }

    componentWillUpdate() {
        this.CellSelected.reset();
    }

    componentDidMount() {
        this.FormEditorBooking.handleThis(this.props.connectedProperty[NAME_FORM_EDITOR_BOOKING].this);

        this.Elements.reRender();
    }

    render() {
        const {arrayData, calendar} = this.props;
        console.log('Row render'); //TODO: debug

        const tag_cells = this.madeCells(arrayData, calendar);

        return (
            <tr className="tr-number"
                ref={this.Elements['tr-number'].ref}
                onMouseOver={this.Elements['tr-number'].handleMouseOver}
                onMouseLeave={this.Elements['tr-number'].handleMouseLeave}
            >
                <td className="th-number"
                    ref={this.Elements['th-number'].ref}
                >
                    <div className="text-float"
                         ref={this.Elements['text-float'].ref}
                         title = {arrayData.name}
                    >
                        <div style={{display:'flex'}}>
                            <div className="text-nowrap">{arrayData.name}</div>
                            <Space/>
                            {this.getTagMarkerClosedRoom(arrayData.closed)}
                        </div>
                    </div>

                    <div className="text-in-shadow text-nowrap">
                        {arrayData.name}
                    </div>
                </td>
                {tag_cells}
            </tr>
        );
    }

    getTagMarkerClosedRoom(isClosed){
        let tag = null;
        if(isClosed)
            tag = (
                <div className="closed-room"
                    title="Закрыт для продаж"
                >
                    Закрыт
                </div>
            );

        return  tag;
    }


    Elements = {
        'day-off-start-booking': {
            refs: [],
            getRef:(key)=>{
                const root = this.Elements['day-off-start-booking'];
                if(!root.refs[key])
                    root.refs[key] =  React.createRef();

                return root.refs[key];
            },
            reRender: () => {
                const root = this.Elements['day-off-start-booking'];
                const refs = root.refs;

                for(const index in refs) {
                    if (refs[index].current) {
                        const box_date_start = GlobalWindow.getBoxById(`th-day${index}`);

                        let width;

                        const time = Number(index);
                        const timeNext = time + DAY;
                        if(isDayOff(timeNext)){
                            const box_date_end = GlobalWindow.getBoxById(`th-day${timeNext}`);
                            width = box_date_end.right - box_date_start.left;
                        }else
                            width = box_date_start.right - box_date_start.left;

                        refs[index].current.style.width = width + 'px';
                    }
                }

            },
        },

        /*для выделния строки полнустью вместе с вых и float th-number*/
        'tr-number':{
            ref: React.createRef(),
            handleMouseOver:()=>{
                const root = this.Elements['tr-number'];
                root.ref.current.className = "tr-number select-row-hover";
            },
            handleMouseLeave:()=>{
                const root = this.Elements['tr-number'];
                root.ref.current.className = "tr-number";
            },
        },

        'th-number': {
            ref: React.createRef(),
            reRender: () => { }
        },
        'text-float': {
            ref: this.props.factoryRefForRow(this.props.arrayData.id),
            reRender: () => {
                const ref = this.Elements['text-float'].ref;
                const parent = this.Elements['th-number'].ref;
                const height = parent.current.clientHeight - 1;
                const width = $(parent.current).outerWidth(); //TODO:edited

                ref.current.style.width = width + 'px';
                ref.current.style.height = height + 'px';
                ref.current.style.marginTop = '-' +
                    GlobalWindow.getComputedStyle(parent.current, 'padding-top');
            }
        },

        'day-select':{
            handleMouseOver:(key)=>{
                const day = GlobalWindow.getElementById(`th-day${key}`);
                if(day){
                    day.setAttribute('data-light', true);
                }
            },

            handleMouseLeave:(key)=>{
                const day = GlobalWindow.getElementById(`th-day${key}`);
                if(day){
                    day.setAttribute('data-light', false);
                }
            },
        },
        reRender: () => {
            for (const index in this.Elements) {
                if (index !== 'reRender')
                    this.Elements[index].reRender && this.Elements[index].reRender();
            }
        }
    };

    componentDidUpdate() {
        this.Elements.reRender();
    }

    handleEventBeginDrag = (id) => {
        setTimeout(
            () => {
                this.setState({what_booking_id_drag: id})
            }
            , 0);
    };

    handleEventEndDrag = () => {
        this.setState({what_booking_id_drag: null})
    };

}

const ComStyles = {
    freeDay: 'free-day',
    selectedCell:
    'absolute ' +
    'z-10 ' +
    'text-selected-cell ' +
    'fill-free ' +
    'background-green ' +
    'unselect-text ',
    unSelectedCell: 'unselected-cell absolute fill-free',
};

export default ConnectFormProperty({
    [NAME_FORM_EDITOR_BOOKING]: {this: false}
})(Row);