import React from 'react'
import {connect} from 'react-redux'
import {ReduxFormProperty} from '../../modules/redux-form-property/index'
import {fetchCost, fetchNewOrder, fetchEditOrder, fetchDeleteOrder} from '../../redux/widgets/bookings'

import BodyBooking from './body'
import {DAY, todayDate, strToDate} from '../../models/utilities/date'

export const NAME_FORM = 'FormEditorBooking';

export const NEW_BOOKING = 'NEW_BOOKING';
export const EDIT_BOOKING = 'EDIT_BOOKING';
export const DRAG_BOOKING = 'DRAG_BOOKING';

class FormEditorBooking extends React.Component {

    constructor(props) {
        super(props);
        this.props.updateProperty({this: this});

        this.state = FormEditorBooking.initState();
    }

    static initState(){
        return {
            type: null,
            visible: false,
            isLoading: false,
            isWarningCost:false,
            date_start: todayDate(),
            date_end: todayDate(),
            category_id: null,  //нужен для того чтобы знать был посчитан номер или нет(кнопка или ручной ввод стоимости)
            room_id: null, //потерял актуалность
            formNewBooking: {

            },
            formEditBooking:{
                booking: null
            }
        };
    }

    BodyBooking = {
        this: null,
        handleThis: (_this) => {
            const {type, room_id, category_id} = this.state;
            this.BodyBooking.this = _this;

            switch(type){
                case EDIT_BOOKING:
                    console.log('EDIT_BOOKING', this.state.formEditBooking.booking) //TODO: debug
                    const param = {
                        name_client: this.state.formEditBooking.booking.client_fio || '',
                        telephone: this.state.formEditBooking.booking.client_phone || '',
                        email: this.state.formEditBooking.booking.client_email || '',
                        cost: this.state.formEditBooking.booking.price || '0',
                        status: this.state.formEditBooking.booking.status || this.props.statuses['default'],
                        comment: this.state.formEditBooking.booking.comment || '',
                        category_id,
                        room_id
                    };
                    this.BodyBooking.this.valuesField = param;
                    break;

                case NEW_BOOKING:
                    this.BodyBooking.this.valuesField = {
                        ...this.BodyBooking.this.valuesField,
                        category_id,
                        room_id
                    };
                    break;
            }

        },
        setCost: (value) => {
            if (this.BodyBooking.this)
                this.BodyBooking.this.Cost = value;
        },
        fillPayload:()=>{
            const {name_client, telephone, email, cost,
                   comment, category_id, room_id, send_mail,
                    status} = this.BodyBooking.this.valuesField;
            const {date_start, date_end} = this.state;

            return {
                booking_id: this.state.formEditBooking.booking && this.state.formEditBooking.booking.id,
                date_start,
                date_end,
                category_id: category_id,
                room_id: room_id,
                client_fio: name_client,
                client_phone: telephone,
                client_email: email,
                comment: comment,
                price: cost,
                send_mail,
                status,
                viewed: true,
                created_at: this.state.formEditBooking.booking && this.state.formEditBooking.booking.created_at
            };
        },
        getCategory:()=>{
            return this.BodyBooking.this.valuesField.category_id;
        }
    };

    resultFetchCost = (value) => {
        value = value.sum;

        this.BodyBooking.setCost(value || '0');

        this.setState({
            isLoading: false,
            isWarningCost:false,
            category_id: this.BodyBooking.getCategory()
        })
    };

    doFetchCost({date_start, date_end, category_id}, callBackResult, callBackError){

        this.props.fetchCost({date_start, date_end, category_id}, (res)=>{this.resultFetchCost(res), callBackResult && callBackResult(res)}, callBackError);
    }

    resultFetchEditor=()=>{
        console.log('resultFetchEditor') //TODO: debug
        this.props.updatePage();
        this.handleCloseFormBooking();
    };

    doFetchNewOrder =()=>{
        this.props.fetchNewOrder(this.BodyBooking.fillPayload(), this.resultFetchEditor);
    };

    doFetchEditOrder =()=>{
        this.props.fetchEditOrder(this.BodyBooking.fillPayload(), this.resultFetchEditor);
    };

    doFetchEditFieldViewed=()=>{
        setTimeout(()=>this.props.fetchEditOrder(this.BodyBooking.fillPayload()));
    };

    doFetchDeleteOrder =()=>{
        this.props.fetchDeleteOrder({booking_id: this.state.formEditBooking.booking.id}, this.resultFetchEditor);
    };

    render() {
        console.log('FormEditorBooking render'); //TODO: debug
        const {categoriesNumbers, statuses} = this.props;
        const {visible, type} = this.state;

        if(!visible) return null; //delete return obj from Vir DOM react

        const date_start = this.state.date_start;
        const date_end = this.state.date_end;

        const maxDate = new Date(date_end.getTime() - DAY);
        const minDate = new Date(date_start.getTime() + DAY);

        const onClose = this.handleCloseFormBooking;
        const onChangeDatePicker = this.handleChangeDatePicker;

        const isLoading = this.state.isLoading;
        const isWarningCost = this.state.isWarningCost;

        const onClickCalc = this.handleClickCalcCost;
        const onClickSubmit = this.handleSubmitFormBooking;
        const onClickDelete = type===EDIT_BOOKING && this.handleDeleteFormBooking;

        const title = type===NEW_BOOKING ?  'Новое бронирование' : 'Редактирование бронирования';
        const buttonSubmitCaption = type===NEW_BOOKING ?  'Забронировать' : 'Сохранить';

        return (
            <div>
                 <BodyBooking isWarningCost = {isWarningCost}
                              onChangeFields={this.handleChangeFields}
                              onThis={this.BodyBooking.handleThis}

                              type={type}
                              visible = {visible}
                              title = {title}
                              buttonSubmitCaption = {buttonSubmitCaption}
                              onClickCalc = {onClickCalc}
                              onClickSubmit = {onClickSubmit}
                              onClickDelete = {onClickDelete}
                              onClose = {onClose}
                              date_start = {date_start}
                              date_end = {date_end}
                              maxDate={maxDate}
                              minDate = {minDate}
                              onChangeDatePicker = {onChangeDatePicker}
                              isLoading = {isLoading}
                              categoriesNumbers = {categoriesNumbers}
                              statuses={statuses}
                 />
            </div>
        );
    }

    handleCloseFormBooking = () => {
        this.setState({
            ...FormEditorBooking.initState()
        });
    };

    handleSubmitFormBooking = () => {
        const {type}=this.state;

        if(type === NEW_BOOKING)
            this.doFetchNewOrder();
        if(type === EDIT_BOOKING)
            this.doFetchEditOrder();
    };

    handleDeleteFormBooking = ()=>{
        this.doFetchDeleteOrder();
    };

    handleChangeDatePicker = async(name_date, value) => {

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
            await this.setState({
                visible: true,
                isWarningCost:true,
                [name_date]: value
            });

        this.handleClickCalcCost();
    };

    handleChangeFields = async(name_field, value) =>{
        if(this.BodyBooking.this.NamesField.Cost === name_field)
            this.setState ( {
                isWarningCost: false,
                category_id: this.BodyBooking.getCategory()
            });
        else if(this.BodyBooking.this.NamesField.DownNumber === name_field) {
            if(value.category_id !== this.state.category_id) {
                await this.setState({
                    isWarningCost: true,
                });
                this.handleClickCalcCost();
            }
            else
                this.setState({
                    isWarningCost: false
                })
        }
    };

    handleClickCalcCost=(callBackResult, callBackError)=>{
        const {date_start, date_end} = this.state;
        const category_id = this.BodyBooking.getCategory();
        this.doFetchCost({date_start, date_end, category_id}, callBackResult, callBackError);
    };

    Show({date_start, date_end, category_id, room_id, booking}, type) {

        switch(type){
            case NEW_BOOKING:
                this.doFetchCost({date_start, date_end, category_id});

                this.setState({
                    type,
                    visible: true,
                    isLoading: true,
                    date_start: date_start,
                    date_end: date_end,
                    category_id: category_id,
                    room_id: room_id
                });
                break;
            case EDIT_BOOKING:
                if(!booking.viewed) this.doFetchEditFieldViewed();

                this.setState({
                    type,
                    visible: true,
                    isLoading: false,
                    date_start: strToDate(booking.date_start),
                    date_end: strToDate(booking.date_end),
                    category_id: category_id,
                    room_id: room_id,
                    formEditBooking: {booking},
                });
                break;
            case DRAG_BOOKING:
                this.doFetchCost({date_start, date_end, category_id});
                this.setState({
                    type: EDIT_BOOKING,
                    visible: true,
                    isLoading: false,
                    date_start: date_start,
                    date_end: date_end,
                    isWarningCost:true,
                    category_id: category_id,
                    room_id: room_id,
                    formEditBooking: {booking},
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
        fetchCost,
        fetchNewOrder,
        fetchEditOrder,
        fetchDeleteOrder
    })(FormEditorBooking), NAME_FORM);