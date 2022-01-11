import React, {Component} from 'react';
import Table from 'reactstrap/lib/Table';
import Button from 'reactstrap/lib/Button';
import CustomContextMenu from './CustomContextMenu'
import GlobalWindow from '../../models/utilities/window';
import './styles/index';
import Head from './Head';
import Row from './Row';
import {ConnectFormProperty} from '../../modules/redux-form-property'
import {NAME_FORM as NAME_FORM_EDITOR} from '../formEditor'
import {strToDate} from '../../models/utilities/date'
import {FORM_EDITOR_NEW_CATEGORY} from '../forms/category'

import {getCalendarInRang} from './common/calcData'
import {helper} from "../../helper/index";
import {EDITOR_EDIT_SELECTED_CATEGORIES, EDITOR_NEW_RECORD} from "../formEditor/index";


class TableChessWithCat extends Component {

    constructor(props) {
        super(props);

        GlobalWindow.setHandleKeyUp(this.handleKeyPress);
        GlobalWindow.setHandleScale(this.handleScale);
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
        isDown: false,
        selectedRows:[],
        refsCellSelected:[],
        number_category_start:null,
        number_category_end:null,
        initRefCellSelected:(index, obj_cell_selector)=>{
            this.Row.refsCellSelected[index] = obj_cell_selector;
        },
        first:()=>{
            return this.Row.refsCellSelected[this.Row.number_category_start];
        },

        // rowIDCursor: null,
        // callBackClearRef: null,
        // setRowIDCursor: (id_row, callBack) => {
        //     const {callBackClearRef, rowIDCursor} = this.Row;
        //     if (callBackClearRef && (rowIDCursor !== id_row))
        //         callBackClearRef();
        //
        //     this.Row.callBackClearRef = callBack;
        //     this.Row.rowIDCursor = id_row;
        // },
        // getRowIDCursor: () => {
        //     return this.Row.rowIDCursor;
        // },

        resetSelected: () => {
            // const {callBackClearRef} = this.Row;
            // if (callBackClearRef)
            //     callBackClearRef();
            // this.Row.callBackClearRef = null;
            // this.Row.rowIDCursor = null;

            if(this.Row.number_category_start === 0 || this.Row.number_category_start){
                const start = Math.min(this.Row.number_category_start, this.Row.number_category_end);
                const end = Math.max(this.Row.number_category_start, this.Row.number_category_end);

                for(let index = start; index <= end; index++)
                    this.Row.refsCellSelected[index].resetSelected();

                this.Row.isDown = false;
                this.Row.key_cell_start = null;
                this.Row.key_cell_end = null;
                this.Row.number_category_start = null;
                this.Row.number_category_end = null;
                this.Row.selectedRows = [];
            }
        }
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.scale !== this.props.scale)
            this.silentState.refTable.current.className = `chess-table-${nextProps.scale || '100'} mt-0 mb-0`;

        return true;
    }

    componentDidMount() {
        this.Elements.reRender();
    }

    render() {
        const {rates, date_start, date_end, scale, loading} = this.props;

        const onOpenEditor = this.handleEditorShow;
        const calendar = getCalendarInRang(date_start, date_end);
        const tag_Rows = rates.map((category, index) => {
            return <Row key={category.id}
                        calendar={calendar}
                        arrayDateLine={category}
                        setRowIDCursor={this.Row.setRowIDCursor}
                        forUpdateDateLine={scale}
                        loading = {loading}
                        onOpenEditor = {onOpenEditor}
                        factoryRefForRow={this.Elements['chess-table-clone']['row'].getRef}

                        initRefCellSelected = {this.Row.initRefCellSelected.bind(this, index)}
                        onMouseOverCell = {this.handleMouseOverCell.bind(this, index)}
                        onMouseClickCell = {this.handleMouseClickCell.bind(this, index)}
                        onCloseEditorRate = {this.handleCloseEditorRate}
            />
        });

        return (
            <div>
                <div onScroll={this.handleChangeScroll.bind(this, 'Local')}
                     ref={this.silentState.refTable}
                     className={`container-chess-table chess-table-${scale || '100'}`}
                     onMouseLeave={this.handleMouseLeave}
                     onMouseDown={this.handleMouseDownClick}
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
                        <tbody>
                            {tag_Rows}
                            <tr className="tr-number">
                                <th  className="text-center  th-number"  colSpan={0}
                                     ref={this.Elements['chess-table-clone']['th-number'].ref}
                                >
                                    <div className="text-float float-button-addCategory"
                                         ref={this.Elements['chess-table-clone']['button-float'].ref}
                                         data-button
                                    >
                                        <div ref={this.silentState.refEndTable}></div>
                                        <Button onClick={this.handleOpenEditorNewCategory} color="primary" size="sm" block>
                                            Добавить категорию
                                        </Button>
                                    </div>

                                    <div className="text-in-shadow">
                                        Добавить категорию
                                    </div>
                                </th>
                                <th colSpan={1000}> </th>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <CustomContextMenu onClickPaste={this.handlePasteContextMenu}/>
            </div>
        );
    }


    Elements = {
        /*TODO: где используется фабрика ссылок. Отсуствует удаление элементов: тех, которые потеряли указатель над объектом (тег)(есть вероятность утечки памяти в дальнейшем);  объекты, подписанные на события onClickDownPanel,..., без необходимости реагируют (т.е. не всем разом нужно слушать)*/
        'chess-table-clone': {
            'th-number': {
                ref: React.createRef(),
                reRender: () => { }
            },
            'button-float': {
                ref: React.createRef(),
                reRender: () => {
                    const ref = this.Elements['chess-table-clone']['button-float'].ref;
                    const parent = this.Elements['chess-table-clone']['th-number'].ref;
                    const height = parent.current.clientHeight;
                    const width = $(parent.current).outerWidth();

                    const marginTop = parseFloat(GlobalWindow.getComputedStyle(parent.current, 'padding-top'))-1;

                    ref.current.style.width = width + 'px';
                    ref.current.style.height = height + 'px';
                    ref.current.style.marginTop = '-' + marginTop +'px';
                }
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

                    const float_button = this.Elements['chess-table-clone']['button-float'].ref;
                    float_button.current.style.left = (base_pos.x + left) + 'px';
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
                const row = element['row'];

                if (type === 'Local') {
                    let new_top = scroll.scrollTop;
                    if (new_top < base_pos.y)
                        new_top = base_pos.y;
                    table.top = new_top + 'px';
                    buf_pos.buf_position_y = new_top;

                    head_element.setPosition(scroll.scrollLeft, new_top);
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

    handleCloseEditorRate=()=>{
        this.Row.resetSelected();
    };

    handleEditorShow=(name, params)=>{ //TODO: edited
        const {onOpenEditor} = this.props;
        onOpenEditor(name, params);
        this.Row.resetSelected();
    };

    handleOpenEditorNewCategory = ()=>{
        const {rates} = this.props;
        let copy_cat;

        for(let ctg_index = rates.length-1;  ctg_index >= 0; ctg_index--){
            if(rates[ctg_index].rates && rates[ctg_index].rates.length){
                copy_cat = rates[ctg_index];
                break;
            }
        }

        this.handleEditorShow(FORM_EDITOR_NEW_CATEGORY, {id: copy_cat && copy_cat.id}) //TODO: edited

    };

    handleMouseLeave = (sender) => {
        function isCursorInElement(element, sender){
           const selector =  $(element);
           const top = selector.offset().top;
           const left = selector.offset().left;
           const right = left + selector.innerWidth();
           const bottom = top + selector.innerHeight();
           const x = sender.pageX;
           const y = sender.pageY;

           function isPointInBox({top, left, right, bottom}, {x, y}) {
               return ((left <= x && right >= x) && (top <= y && bottom >= y ));
           }

            return isPointInBox({top, left, right, bottom}, {x, y});
        }

        if(!isCursorInElement(this.Elements['container-chess-table'].ref.current, sender))
            this.Row.resetSelected();
    };

    handleMouseDownClick = (sender) => {
        if(sender.button !== 0)
            this.Row.resetSelected();
    };

    handleKeyPress = () => {
        this.Row.resetSelected();
    };

    handlePasteContextMenu=({row_id, coped})=>{
        this.props.connectedProperty[NAME_FORM_EDITOR].this.doFetchEditOrder({
            date_start: strToDate(coped.first_day),
            date_end: strToDate(coped.last_day),
            discount: coped.discount,
            ctg_id: row_id,
            rate: coped.rate,
        });
    };

    handleChangeScroll=(type, sender)=>{
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

    handleMouseOverCell = (number_category, key) =>{
       // console.log('handleMouseOverCell category_id, key, obj_cell_selector', number_category, key, obj_cell_selector) //TODO: debug

        if(this.Row.isDown) {

            const number_category_start = this.Row.number_category_start;
            const number_category_end = this.Row.number_category_end;

            const dir = (number_category_start - number_category_end) / Math.abs(number_category_start - number_category_end);

            let delete_items = dir*(number_category - number_category_end);

            if(delete_items > 0) {
                for (let index = 1; index <= delete_items; index++) {
                    if (this.Row.selectedRows[this.Row.selectedRows.length - 1] !== number_category_start) {
                        const poped = this.Row.selectedRows.pop();
                        if (poped === 0 || poped)
                            this.Row.refsCellSelected[poped].resetSelected();
                    } else {
                        break;
                    }
                }
            }

            const start = Math.min(number_category_start, number_category);
            const end = Math.max(number_category_start, number_category);

            for(let index = start; index <= end; index++){
                const rowCellsSelected = this.Row.refsCellSelected[index];
                if(rowCellsSelected.isDown === false) {
                    rowCellsSelected.view_day = false;
                    rowCellsSelected.handleMouseClick(this.Row.first().first_key);

                    this.Row.selectedRows.push(index);
                }

                rowCellsSelected.handleMouseOver(key);
            }

            this.Row.number_category_end = number_category;
        }
    };

    handleMouseClickCell = (number_category, key, obj_cell_selector) =>{
        //console.log('handleMouseClickCell category_id, key, obj_cell_selector', number_category, key, obj_cell_selector) //TODO: debug
        if(this.Row.isDown){
            this.Row.number_category_end = number_category;

            const rang_date = obj_cell_selector.get_date();
            const date_start = rang_date.date_start;
            const date_end = rang_date.date_end;

            const number_category_start = this.Row.number_category_start;
            const number_category_end = this.Row.number_category_end;

            let type = null;
            let rate = null;

            if(number_category_start === number_category_end){
                type = EDITOR_NEW_RECORD;
                rate =  this.Row.first().close_rate;
            }
            else{
                let ctg_ids = [];

                const start = Math.min(this.Row.number_category_start, this.Row.number_category_end);
                const end = Math.max(this.Row.number_category_start, this.Row.number_category_end);

                for(let index = start; index <= end; index++)
                    ctg_ids.push(this.Row.refsCellSelected[index].category_id);

                type = EDITOR_EDIT_SELECTED_CATEGORIES;

                if(this.Row.first().close_rate.id)
                    rate = {
                        ...this.Row.first().close_rate.toObject(),
                        ctg_id: ctg_ids,
                    };
                else
                    rate = {
                        ...this.Row.first().close_rate,
                        ctg_id: ctg_ids,
                    };
            }

            this.props.connectedProperty[NAME_FORM_EDITOR].this.Show(
                {
                    date_start,
                    date_end,
                    rate,
                }, type
            );

           // this.Row.resetSelected();
        }
        else{
            if(obj_cell_selector.isDown){
                this.Row.number_category_start = number_category;
                this.Row.number_category_end = number_category;
                this.Row.selectedRows.push(number_category);
                this.Row.isDown = true;
            }
        }
    };
}

// { // eslint-disable-next-line
//     SUPER_GLOBAL}
export default ConnectFormProperty({
    [NAME_FORM_EDITOR]: {this: false}
})(TableChessWithCat);