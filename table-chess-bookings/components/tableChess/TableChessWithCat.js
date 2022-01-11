import React, {Component} from 'react';
import {connect} from 'react-redux'
import Table from 'reactstrap/lib/Table'
import './styles/index';
import Head from './Head'
import RowsDropDown from './RowsDropDown'

import {getCalendarInRang} from './common/calcData'
import GlobalWindow from "../../models/utilities/window";
import Question from "../question-answer/Question";
import {helper} from "../../helper/index";


class TableChessWithCat extends Component {

    constructor(props) {
        super(props);

        GlobalWindow.setHandleKeyUp(this.handleKeyPress);
        GlobalWindow.setHandleScale(this.handleScale);
        // GlobalWindow.setHandleScroll(this.handleChangeScroll.bind(this, 'Document'));
        this.silentState.getRefTable();
    }

    silentState = {
        refTable: null,
        getRefTable: () => {
            if (this.silentState.refTable === null) {
                this.silentState.refTable = React.createRef();
            }
            return this.silentState.refTable;
        },

        refEndTable: React.createRef()
    };

    Row = {
        rowIDCursor: null,
        callBackClearRef: null,
        setRowIDCursor: (id_row, callBack) => {
            const {callBackClearRef, rowIDCursor} = this.Row;
            if (callBackClearRef && (rowIDCursor !== id_row))
                callBackClearRef();

            this.Row.callBackClearRef = callBack;
            this.Row.rowIDCursor = id_row;
        },
        getRowIDCursor: () => {
            return this.Row.rowIDCursor;
        },

        resetSelected: () => {
            const {callBackClearRef} = this.Row;
            if (callBackClearRef)
                callBackClearRef();
            this.Row.callBackClearRef = null;
            this.Row.rowIDCursor = null;
        }
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.scaling !== this.props.scaling)
            this.silentState.refTable.current.className = `chess-table-${nextProps.scaling || '100'} mt-0 mb-0`;

        return true;
    }

    componentDidMount() {
        this.Elements.reRender();
    }

    render() {
        console.log('TableChessWithCat') //TODO: debug
        const {bookings, date_start, date_end, day_shift, scale} = this.props;

        const calendar = getCalendarInRang(date_start, date_end);
        const tag_RowsDropDowns = bookings.map((category) => {
            return <RowsDropDown key={category.id}
                                 calendar={calendar}
                                 columnCount={day_shift}
                                 arrayRowsData={category}
                                 setRowIDCursor={this.Row.setRowIDCursor}
                                 scale={scale}

                                 factoryRefForRowsDropDown={this.Elements['chess-table-clone']['rows-drop-downs'].getRef}
                                 factoryRefForRow={this.Elements['chess-table-clone']['row'].getRef}
                                 onClickDown={this.handleClickRowDropDown}
            />
        });

        return (
            <div onScroll={this.handleChangeScroll.bind(this, 'Local')}
                 ref={this.silentState.refTable}
                 className={`container-chess-table chess-table-${scale || '100'}`}
                 onMouseLeave={this.handleMouseLeave}
            >
                <div
                    ref={this.Elements['chess-table-clone'].ref}
                    className="chess-table-clone"
                >
                    <Table className="chess-table mt-0 mb-0" bordered>
                        <Head calendar={calendar}
                              isClone
                        />
                    </Table>
                </div>

                <table
                    ref={this.Elements['container-chess-table']['table'].ref}
                    className="chess-table mt-0 mb-0 table table-bordered"
                >
                    <Head calendar={calendar}
                          refFirstColumn={
                              this.Elements['chess-table-clone']['head'].refs}
                          refEndTable = {this.silentState.refEndTable}
                    />
                    {tag_RowsDropDowns}
                </table>
                <div ref={this.silentState.refEndTable}></div>
            </div>
        );
    }

    Elements = {
        /*TODO: где используется фабрика ссылок. Отсуствует удаление элементов: тех, которые потеряли указатель над объектом (тег)(есть вероятность утечки памяти в дальнейшем);  объекты, подписанные на события onClickDownPanel,..., без необходимости реагируют (т.е. не всем разом нужно слушать)*/
        'chess-table-clone': {
            'rows-drop-downs': {
                base_pos: {x: null, y: null},
                refs: [],
                getRef: (key) => {
                    const root = this.Elements['chess-table-clone']['rows-drop-downs'];
                    if (!root.refs[key])
                        root.refs[key] = React.createRef();

                    return root.refs[key];
                },
                setPosition: (left, top) => {
                    const root = this.Elements['chess-table-clone'];
                    const elements = root['rows-drop-downs'].refs;

                    const base_pos = root['rows-drop-downs'].base_pos;
                    for (const index in elements) {
                        if (elements[index].current) {
                            if (base_pos.x === null) {
                                const left = GlobalWindow.getComputedStyle(elements[index].current, 'left', true);
                                base_pos.x = left;
                            }
                            elements[index].current.style.left = (base_pos.x + left) + 'px';
                        }
                    }
                },
            },
            'row': {
                refs: [],
                base_pos: {x: null, y: null},
                last_pos:{x: null, y: null},
                getRef: (key) => {
                    const root = this.Elements['chess-table-clone']['row'];
                    if (!root.refs[key])
                        root.refs[key] = React.createRef();

                    return root.refs[key];
                },
                setPosition: (left, top) => {
                    const root = this.Elements['chess-table-clone'];
                    const elements = root['row'].refs;

                    const base_pos = root['row'].base_pos;

                    if(left === undefined)
                        left = root['row'].last_pos.x;
                    else
                        root['row'].last_pos.x = left;

                    for (const index in elements) {
                        if (elements[index].current) {
                            if (base_pos.x === null) {
                                const left = GlobalWindow.getComputedStyle(elements[index].current, 'left', true);
                                base_pos.x = left;
                            }
                            elements[index].current.style.left = (base_pos.x + left) + 'px';
                        }
                    }
                },

                handleClickRowDown:()=>{
                    const root = this.Elements['chess-table-clone']['row'];
                    root.setPosition();
                },
            },
            'head': {
                refs: [
                    React.createRef(),
                    React.createRef(),
                    React.createRef()
                ],
                setPosition: (left, top) => {

                    let root = this.Elements['chess-table-clone'];
                    let head_elements = root['head'].refs;
                    let rect = head_elements[0].current.getBoundingClientRect();

                    for (const index in head_elements) {
                        head_elements[index].current.style.top = (top + index * (rect.height - 1)) + 'px';
                        head_elements[index].current.style.left = left + 'px';
                    }
                },
                reRender: () => {
                    let root = this.Elements['chess-table-clone'];
                    let head_elements = root['head'].refs;
                    let rect = head_elements[0].current.getBoundingClientRect();

                    for (const index in head_elements)
                        head_elements[index].current.style.top = (root.buf_position_y + index * (rect.height - 1)) + 'px';
                }
            },
            ref: React.createRef(),
            buf_position_x: 0,
            buf_position_y: 0,
            base_pos: {x: null, y: null},

            reCalcPosition: (type, scroll) => {
                let element = this.Elements['chess-table-clone'];
                let buf_pos = element;
                let base_pos = element.base_pos;
                let table = element.ref.current.style;

                const head_element = element['head'];
                const rows_drop_downs = element['rows-drop-downs'];
                const row = element['row'];

                if (type === 'Local') {
                    let new_top = scroll.scrollTop;
                    if (new_top < base_pos.y)
                        new_top = base_pos.y;

                    table.top = new_top + 'px';
                    buf_pos.buf_position_y = new_top;

                    head_element.setPosition(scroll.scrollLeft, new_top);
                    rows_drop_downs.setPosition(scroll.scrollLeft);
                    row.setPosition(scroll.scrollLeft);
                }
            },

            reRender: () => {
                let element = this.Elements['chess-table-clone'];
                if (element.base_pos.x === null) {
                    let top = GlobalWindow.getComputedStyle(element.ref.current, 'top', true);
                    let left = GlobalWindow.getComputedStyle(element.ref.current, 'left', true);
                    let base_pos = element.base_pos;

                    base_pos.x = left;
                    base_pos.y = top;
                }

                for (const index in element) {
                    if (index !== 'reRender')
                        element[index].reRender && element[index].reRender();
                }
            },
        },
        'container-chess-table': {
            'table': {
                ref: React.createRef(),
            },
            ref: this.silentState.getRefTable(),
            height: null,
            onScale: () => {
                const root = this.Elements['container-chess-table'];
                const element = root.ref;
                const top = GlobalWindow.getComputedStyle(element.current, 'top', true);

                const {refDownPanel} = this.props;
                const height_down_panel = refDownPanel.current && GlobalWindow.getComputedStyle(refDownPanel.current, 'height', true);
                const height_up_down_panel = height_down_panel + height_down_panel + height_down_panel;

                const other_size_elements = height_up_down_panel + helper.configs.getReduceSizeByHeight();

                if ((root.height + other_size_elements) > GlobalWindow.getHeight()) {
                    const new_calc_height = GlobalWindow.getHeight() - other_size_elements;
                    element.current.style.height = new_calc_height + 'px';
                }
                else
                    element.current.style.height = (root.height + 18) + 'px';
            },
            reRender: () => {
                const root = this.Elements['container-chess-table'];
                const table = root['table'].ref;

                root.height = table.current.scrollHeight;

                root.onScale();
            },
            handleClickRowDown: () => {
                const root = this.Elements['container-chess-table'];
                root.reRender();
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

    handleMouseLeave = () => {
        this.Row.resetSelected();
    };

    handleKeyPress = () => {
        this.Row.resetSelected();
    };

    handleChangeScroll = (type, sender) => {

        switch (type) {
            case 'Local':
                this.props.onChangeScroll(sender.target);
                // case 'Document':
                this.Elements['chess-table-clone'].reCalcPosition(type, sender.target);
                break;
        }
    };

    handleScale = () => {
        this.Elements['container-chess-table'].onScale();
    };

    handleClickRowDropDown=()=>{
        this.Elements['container-chess-table'].handleClickRowDown();
        this.Elements['chess-table-clone']['row'].handleClickRowDown();
    }
}

// { // eslint-disable-next-line
//     SUPER_GLOBAL}
export default connect(null)(TableChessWithCat);