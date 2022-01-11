import React, {Component} from 'react';
import GlobalWindow from '../../models/utilities/window'
import {ContextMenuProvider, NAME_CUSTOM_CONTEXTMENU} from './CustomContextMenu'
import MarkLine from './MarkLine';
import FreeCell from './FreeCell';
import {msToDays, DAY, strToDate} from '../../models/utilities/date'
import {EDITOR_NEW_RECORD, EDITOR_EDIT_RECORD, NAME_FORM as NAME_FORM_EDITOR} from '../formEditor'
import {ConnectFormProperty} from '../../modules/redux-form-property'
import {FORM_EDITOR_EDIT_CATEGORY} from '../forms/category'
import {helper} from "../../helper/index";

class Row extends Component {

    constructor(props) {
        super(props);

        GlobalWindow.setHandleScale(()=>{this.updateDOM()});

        this.CellSelected = {
            ref: [],
            category_id: props.arrayDateLine.id,
            set_by_key: (key) => {
                if(!key) return; //TODO:edited

                this.CellSelected.ref[key].current.className = ComStyles.selectedCell;
                if(this.CellSelected.view_day)
                    this.CellSelected.ref[key].current.innerHTML = (new Date(key)).getDate();
            },
            clear_ref: () => {

                for (let index in this.CellSelected.ref) {
                    if (this.CellSelected.ref[index].current)
                        this.CellSelected.clear_ref_by_key(index);
                }

                this.CellSelected.close_rate = null;
                this.CellSelected.last_key = null;
                this.CellSelected.first_key = null;
                this.CellSelected.row_id = null;
                this.CellSelected.isDown = false;
                this.CellSelected.view_day = true;
            },
            clear_ref_by_key: (key) => {
                if(!key) return; //TODO:edited

                this.CellSelected.ref[key].current.className = ComStyles.unSelectedCell;
                this.CellSelected.ref[key].current.innerHTML = "&nbsp;";
                this.CellSelected.ref[key].current.title = "";
            },
            delete_ref: () => {
                this.CellSelected.ref = []
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
                        date_end: new Date(last_key)
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
            resetSelected:(delete_ZindexToUnSelectedCell = true)=>{
                if(delete_ZindexToUnSelectedCell)
                    ComStyles.dropZindexToUnSelectedCell();
                this.CellSelected.clear_ref();

                this.Elements['tr-number'].handleMouseLeave();
            },
            addZindexToUnSelectedCell:()=>{
                ComStyles.addZindexToUnSelectedCell(this.getIdentification());
                for (let index in this.CellSelected.ref) {
                    if (this.CellSelected.ref[index].current)
                        this.CellSelected.clear_ref_by_key(index);
                }
            },
            handleMouseClick: (key, close_rate)=>{
                if(!key) return; //TODO:edited

                if (this.CellSelected.isDown === false) {
                    this.CellSelected.addZindexToUnSelectedCell();
                    this.CellSelected.isDown = true;
                    this.CellSelected.first_key = key;
                    this.CellSelected.last_key = key;
                    this.CellSelected.set_by_key(key);
                    this.CellSelected.close_rate = close_rate;

                    this.Elements['tr-number'].handleMouseOver();
                }
            },
            handleMouseOver:(_key)=> {
                if(!_key) return; //TODO:edited

                const {
                    isDown,
                    last_key, first_key
                } = this.CellSelected;

                if (isDown === true) {

                    const dir = (_key - last_key) / Math.abs(_key - last_key);
                    const dir_day = DAY * dir;
                    const dir_key = _key * dir;

                    if (( ((last_key - first_key) > 0) === ((_key - last_key) > 0)) ||
                        (last_key === first_key)) {

                        for (let index = last_key; (index * dir <= dir_key); index += dir_day) {
                            this.CellSelected.set_by_key(index);
                        }

                        this.CellSelected.last_key = _key;
                    } else {
                        if (first_key !== last_key) {
                            for (let index = last_key; (index * dir < dir_key); index += dir_day) {
                                this.CellSelected.clear_ref_by_key(index);
                            }
                            for (let index = first_key; (index * dir <= dir_key); index += dir_day) {
                                this.CellSelected.set_by_key(index);
                            }
                            this.CellSelected.last_key = _key;
                        }
                    }
                }
            },
            isDown: false,
            first_key: null,
            last_key: null,
            row_id: null,
            close_rate: null,
            view_day: true,
        };
        props.initRefCellSelected( this.CellSelected);

        helper.setControlOnFormEditorInGlobal((rate)=>{
            this.handleClickMarkLine(rate);
        });
    }

    getIdentification(){
        return 'TableChessRate.Row'+this.props.arrayDateLine.id;
    }

    updateDOM(){
        this.setState({update:!this.state.update})
    }

    state={
        update: true,
    };

    get maxTimeCalendar() {
        return this.props.calendar.days[this.props.calendar.days.length - 1].key;
    }

    get minTimeCalendar() {
        return this.props.calendar.days[0].key;
    }

    FormEditor = {
        this: null,
        handleThis: (_this) => {
            this.FormEditor.this = _this;
            this.FormEditor.handleClose = this.FormEditor.this.handleClose;
            this.FormEditor.this.handleClose = this.FormEditor.decorHandleClose;
        },
        decorHandleClose: () => {
            this.FormEditor.handleClose();
            this.props.onCloseEditorRate();//TODO:edited
            //this.CellSelected.resetSelected(); //TODO:edited
        },
        handleClose: null,

        show: (type, rate) => {
            switch (type) {
                case EDITOR_NEW_RECORD:
                    const rang_date = this.CellSelected.get_date();

                    this.FormEditor.this.Show({
                        date_start: rang_date.date_start,
                        date_end: rang_date.date_end,
                        rate: this.CellSelected.close_rate
                    }, type);
                    break;
                case EDITOR_EDIT_RECORD:
                    this.FormEditor.this.Show({
                        date_start: rate.first_day,
                        date_end: rate.last_day,
                        rate
                    }, type);
                    break;
            }
        },

    };

    factoryRefsCell(key) {
        if (!this.CellSelected.ref[key]) {
            this.CellSelected.ref[key] = React.createRef();
        }
        return this.CellSelected.ref[key];
    }

    handleMouseClickCell(key, row_id, old_rate, sender) {

        if(sender.button===0) {
            const {setRowIDCursor, onMouseClickCell} = this.props;

            GlobalWindow.canceledSelection();

            if (!this.CellSelected.isDown) {
                //this.CellSelected.clear_ref();

                this.CellSelected.ref[key].current.title = 'Выберите следующую дату и нажмите правой кнопкой мыши';
                //setRowIDCursor(row_id, this.CellSelected.resetSelected);

                const close_rate =  old_rate || {rate: '0', ctg_id: this.props.arrayDateLine.id};
                this.CellSelected.handleMouseClick(key,close_rate);

            } else {
                // this.CellSelected.isDown = false;
                // this.CellSelected.last_key = key;
                // this.FormEditor.show(EDITOR_NEW_RECORD); //TODO:edited
            }

            onMouseClickCell(key, this.CellSelected);
        }

    };

    handleMouseOverCell(key) {
        const {onMouseOverCell} = this.props;

       // this.CellSelected.handleMouseOver(key);
        onMouseOverCell(key);

        this.Elements['day-select'].handleMouseOver(key);
    };

    handleClickMarkLine = (rate) => {
        this.FormEditor.show(EDITOR_EDIT_RECORD, rate);
    };

    handleMouseLeaveCell = (key, sender)=>{
        this.Elements['day-select'].handleMouseLeave(key);
    };

    handleMouseOverRow=()=>{
        this.Elements['tr-number'].handleMouseOver();
    };

    handleMouseLeaveRow=()=>{
        if(!this.CellSelected.isDown)
            this.Elements['tr-number'].handleMouseLeave();
    };

    madeMarkLine(key, row_id, rate, old_rate, isDayOff) {
        if (rate) {
            return (
                <td className={`busy-cell ${isDayOff && 'day-off'}`} key={key}  >
                    <ContextMenuProvider id={NAME_CUSTOM_CONTEXTMENU} collect={()=>({coped: old_rate, row_id})}>
                        <MarkLine
                            maxTimeCalendar = {this.maxTimeCalendar}
                            minTimeCalendar = {this.minTimeCalendar}
                            rate={rate}
                            onClick={this.handleClickMarkLine.bind(null, rate)}
                        />
                        <FreeCell refLink={this.factoryRefsCell(key)}
                                  startStyles={ComStyles.unSelectedCell}
                                  onMouseDown={this.handleMouseClickCell.bind(this, key, row_id, old_rate)}
                                  onMouseOver={this.handleMouseOverCell.bind(this, key)}
                                  onMouseLeave={this.handleMouseLeaveCell.bind(this, key)}
                                  title=""
                        />
                    </ContextMenuProvider>

                </td>
            );
        }
        else {
            return <td className={`${ComStyles.freeDay} ${isDayOff && 'day-off'}`}
                       key={key}
            >
                <ContextMenuProvider id={NAME_CUSTOM_CONTEXTMENU} collect={()=>({coped: old_rate, row_id})} >
                    <FreeCell refLink={this.factoryRefsCell(key)}
                              startStyles={ComStyles.unSelectedCell}
                              onMouseDown={this.handleMouseClickCell.bind(this, key, row_id, old_rate)}
                              onMouseOver={this.handleMouseOverCell.bind(this, key)}
                              onMouseLeave={this.handleMouseLeaveCell.bind(this, key)}
                              title=""
                    />
                </ContextMenuProvider>
            </td>;
        }
    }

    madeCells(data, calendar) {
        let countdown = 0;
        let drawed_id = 0;
        let old_rate = null;
        const calendar_start = this.minTimeCalendar;
        const calendar_end = this.maxTimeCalendar;

        return calendar.days.map((day, index) => {
            let colspan_day = 0;
            let rate = null;
            if (countdown === 0) {
                colspan_day = 0;

                rate = data.rates.find((rate) => {
                    if (rate.id === drawed_id) return false;

                    const date_end = strToDate(rate.last_day);
                    const date_start = strToDate(rate.first_day);
                    const new_enddate = Math.min(date_end, calendar_end);

                    if (day.key >= date_start && day.key <= new_enddate) {
                        colspan_day = msToDays(new_enddate - Math.max(date_start, calendar_start));
                        drawed_id = rate.id;
                        return true;
                    }
                    else return false;
                });

                if (rate) {
                    countdown = colspan_day;
                    old_rate = rate;
                }
            } else
                countdown--;

            return this.madeMarkLine(day.key, data.id, rate, old_rate, calendar.weekdays[index].isDayOff);
        });
    }

    componentWillUpdate() {
        this.CellSelected.reset();
    }

    componentDidMount() {
        this.FormEditor.handleThis(this.props.connectedProperty[NAME_FORM_EDITOR].this);

        this.Elements.reRender();
    }
    render() {
        const {arrayDateLine, calendar, onOpenEditor} = this.props;
        //console.log('Row render'); //TODO: debug

        const tag_cells = this.madeCells(arrayDateLine, calendar);

        return (
            <tr id={this.getIdentification()} className="tr-number"
                ref={this.Elements['tr-number'].ref}
                onMouseOver={this.handleMouseOverRow}
                onMouseLeave={this.handleMouseLeaveRow}
            >
                <td className="th-number"
                    ref={this.Elements['th-number'].ref}
                >
                    <div className="text-float cursor-pointer"
                         ref={this.Elements['text-float'].ref}
                         title = {arrayDateLine.ctg_name}
                         onClick={onOpenEditor.bind(null, FORM_EDITOR_EDIT_CATEGORY, arrayDateLine)}
                    >
                        <div className="text-nowrap">{arrayDateLine.ctg_name}</div>
                    </div>

                    <div className="text-in-shadow text-nowrap">
                        {arrayDateLine.ctg_name}
                    </div>
                </td>
                {tag_cells}
            </tr>
        );
    }


    Elements = {
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
            ref: this.props.factoryRefForRow(this.props.arrayDateLine.id),
            reRender: () => {
                const ref = this.Elements['text-float'].ref;
                const parent = this.Elements['th-number'].ref;
                const height = parent.current.clientHeight;
                const width = $(parent.current).outerWidth();

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

}

const ComStyles = {
    freeDay: 'p-0 relative',
    selectedCell:
    'absolute ' +
    'z-10 ' +
    'text-selected-cell ' +
    'fill-free ' +
    'background-green ' +
    'unselect-text ',
    unSelectedCell: 'unselected-cell absolute fill-free',
    addZindexToUnSelectedCell: (/*id*/) => {
       // const elements = document.getElementById(id).getElementsByClassName(ComStyles.unSelectedCell);
        ComStyles.unSelectedCell = 'unselected-cell absolute fill-free z-10';

        // for (let i = 0; i < elements.length; i++)
        //     elements[i].className = ComStyles.unSelectedCell;
    },
    dropZindexToUnSelectedCell: () => {
        ComStyles.unSelectedCell = 'unselected-cell absolute fill-free';
    }
};

export default ConnectFormProperty({
    [NAME_FORM_EDITOR]: {this: false}
})(Row);