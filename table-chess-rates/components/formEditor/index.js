import React from 'react'
import {connect} from 'react-redux'
import {ReduxFormProperty} from '../../modules/redux-form-property/index'
import {fetchEditOrder, fetchDeleteOrder} from '../../redux/widgets/rates'

import BodyBooking from './body'
import {DAY, todayDate, strToDate} from '../../models/utilities/date'
import {appName} from "../../configs/config";

export const NAME_FORM = 'FormEditor';

export const EDITOR_NEW_RECORD = 'EDITOR_NEW_RECORD';
export const EDITOR_EDIT_RECORD = 'EDITOR_EDIT_RECORD';
export const EDITOR_EDIT_PERIOD = 'EDITOR_EDIT_PERIOD';
export const EDITOR_EDIT_SELECTED_CATEGORIES = 'EDITOR_EDIT_SELECTED_CATEGORIES';
// export const EDITOR_DRAG_RECORD = 'EDITOR_DRAG_RECORD';

class FormEditor extends React.Component {

    constructor(props) {
        super(props);
        this.props.updateProperty({this: this});

        this.state = FormEditor.initState();
    }

    static initState(){
        return {
            type: null,
            visible: false,
            date_start: todayDate(),
            date_end: todayDate(),
            rate: null,
        };
    }

    Body = {
        this: null,
        handleThis: (_this) => {
            const {type} = this.state;
            this.Body.this = _this;

            switch(type){
                case EDITOR_NEW_RECORD:
                case EDITOR_EDIT_RECORD:
                case EDITOR_EDIT_PERIOD:
                case EDITOR_EDIT_SELECTED_CATEGORIES:
                    const param = {
                        rate: this.state.rate.rate || '0',
                        discount: this.state.rate.discount || '0',
                        category_id: this.state.rate.ctg_id || 'all',
                    };
                    this.Body.this.valuesField = param;
                    break;
            }

        },
        fillPayload:()=>{
            const {rate, category_id, discount} = this.Body.this.valuesField;
            const {date_start, date_end} = this.state;

            return {
                date_start,
                date_end,
                ctg_id: category_id,
                rate: rate,
                discount: discount
            };
        },
        // getCategory:()=>{
        //     return this.Body.this.valuesField.category_id;
        // }
    };

    isCallFromGlobal(){
        return this.state.rate && !(this.state.rate.id) && (this.state.type !== EDITOR_NEW_RECORD)&& (this.state.type !== EDITOR_EDIT_SELECTED_CATEGORIES);
    }

    resultFetchEditor=()=>{

       if(this.isCallFromGlobal()){
           const {rate, discount} = this.Body.this.valuesField;
            global.window[appName].FormEditor.ownerCall({rate, discount});
       }

        this.props.updatePage();
        this.handleClose();
    };

    /*
    * payload-{
    *          date_start,
    *          date_end,
    *          ctg_id: category_id,
    *          rate: rate
    * }
    * */
    doFetchEditOrder =(payload)=>{
        this.props.fetchEditOrder(payload || this.Body.fillPayload(), this.resultFetchEditor);
    };

    /*
    * payload-{
    *          date_start,
    *          date_end,
    *          ctg_id: category_id,
    * }
    * */
    doFetchDeleteOrder =(payload)=>{
        this.props.fetchDeleteOrder(payload || this.Body.fillPayload(), this.resultFetchEditor);
    };

    getTitle(){
        switch (this.state.type){
            case EDITOR_NEW_RECORD:
            case EDITOR_EDIT_RECORD:
                return 'Редактирование цен';

            case EDITOR_EDIT_PERIOD:
                return 'Изменение цены у всех категорий';

            case EDITOR_EDIT_SELECTED_CATEGORIES:
                return 'Изменение цены у выбранных категорий';
        }
    }

    render() {
        const {visible, type} = this.state;

        if(!visible) return null; //delete return obj from Vir DOM react

        const date_start = this.state.date_start;
        const date_end = this.state.date_end;

        const maxDate = new Date(date_end.getTime());
        const minDate = new Date(date_start.getTime());

        const onClose = this.handleClose;
        const onChangeDatePicker = this.handleChangeDatePicker;

        const onClickSubmit = this.handleSubmit;
        const onClickDelete = (type===EDITOR_EDIT_RECORD) && (!this.isCallFromGlobal()) ? this.handleDelete:null;/*//TODO:edited*/

        const title =  this.getTitle();
        const buttonSubmitCaption = 'Сохранить';

        const enabledDatePicker = !this.isCallFromGlobal() ? true:false;

        return (
            <div>
                 <BodyBooking
                              onChangeFields={this.handleChangeFields}
                              onThis={this.Body.handleThis}
                              visible = {visible}
                              title = {title}
                              buttonSubmitCaption = {buttonSubmitCaption}
                              onClickSubmit = {onClickSubmit}
                              onClickDelete = {onClickDelete}
                              onClose = {onClose}
                              date_start = {date_start}
                              date_end = {date_end}
                              maxDate={maxDate}
                              minDate = {minDate}
                              onChangeDatePicker = {onChangeDatePicker}
                              enabledDatePicker = {enabledDatePicker}
                 />
            </div>
        );
    }

    handleClose = () => {
        this.setState({
            ...FormEditor.initState()
        });
    };

    handleSubmit = () => {
       // const {type}=this.state;

        //if(type === EDITOR_NEW_RECORD) /*//TODO:edited*/
            this.doFetchEditOrder();

        //if(type === EDITOR_EDIT_RECORD)
         //   this.doFetchEditOrder();
    };

    handleDelete = () => {
        const {type}=this.state;

        if(type === EDITOR_EDIT_RECORD)
            this.doFetchDeleteOrder();
    };

    handleChangeDatePicker = (name_date, value) => {

        const {date_end, date_start} = this.state;

        if (!value) {
            const today = todayDate();
            if (name_date === 'date_start') {
                if (today.getTime() < date_end.getTime())
                    value = today;
                else {
                    value = new Date(date_end);
                    value.setDate(value.getDate() - 1);
                }
            } else if (name_date === 'date_end') {
                if (today.getTime() > date_start.getTime())
                    value = today;
                else {
                    value = new Date(date_start);
                    value.setDate(value.getDate() + 1);
                }
            }
        }

        if (value)
            this.setState({
                [name_date]: value
            })
    };

    handleChangeFields = (name_field, value) =>{
        ////
    };

    Show({date_start, date_end, rate}, type) {

        switch(type){ //TODO:edited
            case EDITOR_EDIT_RECORD:
            case EDITOR_EDIT_PERIOD:
            case EDITOR_NEW_RECORD:
            case EDITOR_EDIT_SELECTED_CATEGORIES:
                this.setState({
                    type,
                    visible: true,
                    date_start: strToDate(date_start),
                    date_end: strToDate(date_end),
                    rate
                });

                break;
        }
    }
};

export default ReduxFormProperty({
    this: null
})
(connect(
    null,
    {
        fetchEditOrder,
        fetchDeleteOrder //TODO: edited
    })(FormEditor), NAME_FORM);