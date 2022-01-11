import {configQuery, ActionsApi} from '../configs/db'
import {FALSE, postQuery, TRUE} from './db'
import {strToDate, isEquallyYear, startNowYear} from "./utilities/date";


class ModelBookings {


    //for getDataRates для первого вызова прайс листа. Первое что должен показать это цены если есть
    static  doNotCorrect = FALSE;
    static isDoNotCorrect(){

        let res = TRUE;
        if(ModelBookings.doNotCorrect === FALSE) {
            res = ModelBookings.doNotCorrect;
            ModelBookings.doNotCorrect = TRUE;
        }

        return res;
    }

    static may_change_date_start = TRUE;
    static ifSelectPeriodYear(date_start, date_end){

        const is_year = isEquallyYear(date_start, date_end);
        if(is_year) {
            if (ModelBookings.may_change_date_start === TRUE) {
                ModelBookings.may_change_date_start = FALSE;

                date_start = startNowYear();
            }
        }else{
            ModelBookings.may_change_date_start = TRUE;
        }

        return date_start;
    }


    /*response = {
    client_email:"aaa@test.ru"
    client_fio:"Рабинович С.М."
    client_phone:"79123456789"
    ctg_name:"Одноместный стандарт+"
    category_id:2
    date_end:"2018-05-18"
    date_start:"2018-05-01"
    id:2
    comment:null
    created_at:"2018-03-27"}
    * return out={data: [response], error:error}
    * Note: Wrap up in try catch!!!
    * */
    static async getDataBookings({date_start, date_end}) {

        console.log('getDataBookings ', ActionsApi.GET_BOOKINGS, date_start, date_end);//TODO: debug

        let doNotCorrect = ModelBookings.isDoNotCorrect();
        date_start = ModelBookings.ifSelectPeriodYear(date_start, date_end);

        return await
            postQuery({
                api: configQuery.bookings,
                params: `action=${ActionsApi.GET_BOOKINGS}&date_start=${date_start.toDateString()}&date_end=${date_end.toDateString()}&doNotCorrect=${doNotCorrect}`
            });
    }

    /*response = {
   * cost cat on period
   * return out={data: <response>, error:error}
   * response - {sum: number}
   * Note: Wrap up in try catch!!!
   * */
    static async getDataCost({date_start, date_end, category_id}) {

        console.log('getDataCost ', `action=${ActionsApi.GET_COST}&date_start=${date_start}&date_end=${date_end}&category_id=${category_id}`);//TODO: debug

        return await
            postQuery({
                api: configQuery.bookings,
                params: `action=${ActionsApi.GET_COST}&date_start=${date_start.toDateString()}&date_end=${date_end.toDateString()}&category_id=${category_id}`
            });
    }

    /*response = {
   *
   * return out={data: <response>, error:error}
   * response - {id:numder}
   * Note: Wrap up in try catch!!!
   * */
    static async setDataNewOrder({
                              date_start,
                              date_end,
                              category_id,
                              room_id,
                              client_fio,
                              client_phone,
                              client_email,
                              comment,
                              price,
                              send_mail,
                              status
                          }) {

        console.log('setDataNewOrder ', `action=${ActionsApi.NEW_ORDER}&send_mail=${send_mail}&date_start=${date_start.toDateString()}&date_end=${date_end.toDateString()}&category_id=${category_id}&room_id=${room_id}&client_fio=${client_fio}&client_phone=${client_phone}&client_email=${client_email}&comment=${comment}&price=${price}&status=${status}`);//TODO: debug

        return await
            postQuery({
                api: configQuery.bookings,
                params: `action=${ActionsApi.NEW_ORDER}&send_mail=${send_mail}&date_start=${date_start.toDateString()}&date_end=${date_end.toDateString()}&category_id=${category_id}&room_id=${room_id}&client_fio=${client_fio}&client_phone=${client_phone}&client_email=${client_email}&comment=${comment}&price=${price}&status=${status}`
            });
    }

    /*response = {
  *
  * return out={data: <response>, error:error}
  * response - [{id: edit booking}]
  * Note: Wrap up in try catch!!!
  * */
    static async setDataEditOrder({
                              booking_id,
                              date_start,
                              date_end,
                              category_id,
                              room_id,
                              client_fio,
                              client_phone,
                              client_email,
                              comment,
                              price,
                              status,
                              send_mail
                          }) {
        date_start = strToDate(date_start);
        date_end = strToDate(date_end);

        console.log('setDataEditOrder ', `action=${ActionsApi.EDIT_ORDER}&send_mail=${send_mail}&booking_id=${booking_id}&date_start=${date_start.toDateString()}&date_end=${date_end.toDateString()}&category_id=${category_id}&room_id=${room_id}&client_fio=${client_fio}&client_phone=${client_phone}&client_email=${client_email}&comment=${comment}&price=${price}&status=${status}`);//TODO: debug

        return await
            postQuery({
                api: configQuery.bookings,
                params: `action=${ActionsApi.EDIT_ORDER}&booking_id=${booking_id}&date_start=${date_start.toDateString()}&date_end=${date_end.toDateString()}&category_id=${category_id}&room_id=${room_id}&client_fio=${client_fio}&client_phone=${client_phone}&client_email=${client_email}&comment=${comment}&price=${price}&status=${status}&send_mail=${send_mail}`
            });
    }

    /*response = {
  * return out={data: <response>, error:error}
  * response - [{id:}]
  * Note: Wrap up in try catch!!!
  * */
    static async deleteOrder({
                              booking_id,
                          }) {

        console.log('deleteOrder ', `action=${ActionsApi.DELETE_ORDER}&booking_id=${booking_id}`);//TODO: debug

        return await
            postQuery({
                api: configQuery.bookings,
                params: `action=${ActionsApi.DELETE_ORDER}&booking_id=${booking_id}`
            });
    }

    /*response = {
  * return out={data: <response>, error:error}
  * response - [{id:}]
  * Note: Wrap up in try catch!!!
  * */
    // static async editFieldViewed({
    //                                  booking_id,
    //                                  viewed
    //                       }) {
    //
    //     console.log('editFieldViewed ', `action=${ActionsApi.EDIT_FIELD_VIEWED}&booking_id=${booking_id}&viewed=${viewed}`);//TODO: debug
    //
    //     return await
    //         postQuery({
    //             api: configQuery.bookings,
    //             params: `action=${ActionsApi.EDIT_FIELD_VIEWED}&booking_id=${booking_id}&viewed=${viewed}`
    //         });
    // }
}

export default ModelBookings