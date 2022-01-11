import {configQuery, ActionsApi} from '../configs/db'
import {FALSE, postQuery, TRUE} from './db'
import {isEquallyYear, startNowYear} from "./utilities/date";


export
class ModelRates {

    //for getDataRates для первого вызова прайс листа. Первое что должен показать это цены если есть
    static  doNotCorrect = FALSE;
    static isDoNotCorrect(){

       let res = TRUE;
        if(ModelRates.doNotCorrect === FALSE) {
            res = ModelRates.doNotCorrect;
            ModelRates.doNotCorrect = TRUE;
        }

        return res;
    }

    static may_change_date_start = TRUE;
    static ifSelectPeriodYear(date_start, date_end){

        const is_year = isEquallyYear(date_start, date_end);
        if(is_year) {
            if (ModelRates.may_change_date_start === TRUE) {
                ModelRates.may_change_date_start = FALSE;

                date_start = startNowYear();
            }
        }else{
            ModelRates.may_change_date_start = TRUE;
        }

        return date_start;
    }

    /*response = {
         id
         ctg_name
    }
    * return out={data: [response], error:error}
    * Note: Wrap up in try catch!!!
    * */
    static async getDataRates({date_start, date_end}) {

        let doNotCorrect = ModelRates.isDoNotCorrect();

        date_start = ModelRates.ifSelectPeriodYear(date_start, date_end);

        //console.log('getDataRates ', `action=${ActionsApi.GET_RATES}&start_date=${date_start.toDateString()}&end_date=${date_end.toDateString()}&doNotCorrect=${doNotCorrect}`);//TODO: debug

        return await
            postQuery({
                api: configQuery.rates,
                params: `action=${ActionsApi.GET_RATES}&start_date=${date_start.toDateString()}&end_date=${date_end.toDateString()}&doNotCorrect=${doNotCorrect}`
            });
    }

    /*in = {
    *  {date_start, date_end, rate, ctg_id}
    * }
    * Note: Wrap up in try catch!!!
    * */
    static async setDataEditRate({date_start, date_end, rate, discount=0, ctg_id}) {

        //console.log('setDataEditRate ', ActionsApi.SET_RATE, date_start, date_end, rate, ctg_id);//TODO: debug

        return await
            postQuery({
                api: configQuery.rates,
                params: `action=${ActionsApi.SET_RATE}&start_date=${date_start.toDateString()}&end_date=${date_end.toDateString()}&new_rate=${rate}&ctg_id=${ctg_id}&discount=${discount}`
            });
    }

    static async setDataDeleteRate({date_start, date_end, rate, ctg_id}) { //TODO:edited

        //console.log('setDataDeleteRate ', ActionsApi.DELETE_RATE, date_start, date_end, rate, ctg_id);//TODO: debug

        return await
            postQuery({
                api: configQuery.rates,
                params: `action=${ActionsApi.DELETE_RATE}&start_date=${date_start.toDateString()}&end_date=${date_end.toDateString()}&new_rate=${rate}&ctg_id=${ctg_id}`
            });
    }

    /*in = {
    *  {ctg_name, rms_amt}
    * }
    * Note: Wrap up in try catch!!!
    * */
    static async setDataNewCategory({ctg_id, ctg_name, rms_amt, copy_rates, copy_rates_only_periods}) {

        //console.log('setDataNewCategory', `action=${ActionsApi.NEW_CATEGORY}&ctg_id=${ctg_id}&ctg_name=${ctg_name}&rms_amt=${rms_amt}&copy_rates=${copy_rates}`);//TODO: debug

        return await
            postQuery({
                api: configQuery.rates,
                params: `action=${ActionsApi.NEW_CATEGORY}&ctg_id=${ctg_id}&ctg_name=${ctg_name}&rms_amt=${rms_amt}&copy_rates=${copy_rates}&copy_rates_only_periods=${copy_rates_only_periods}`
            });
    }

    /*in = {
    *  {ctg_id, ctg_name, rms_amt}
    * }
    * Note: Wrap up in try catch!!!
    * */
    static async setDataEditCategory({ctg_id, ctg_name, rms_amt}) {

        //console.log('setDataEditCategory', ActionsApi.EDIT_CATEGORY, {ctg_id, ctg_name, rms_amt});//TODO: debug

        return await
            postQuery({
                api: configQuery.rates,
                params: `action=${ActionsApi.EDIT_CATEGORY}&ctg_id=${ctg_id}&ctg_name=${ctg_name}&rms_amt=${rms_amt}`
            });
    }


    /*in = {
    *  {ctg_id}
    * }
    * Note: Wrap up in try catch!!!
    * */
    static async postDeleteCategory({ctg_id}) {

        //console.log('postDeleteCategory', ActionsApi.DELETE_CATEGORY, {ctg_id});//TODO: debug

        return await
            postQuery({
                api: configQuery.rates,
                params: `action=${ActionsApi.DELETE_CATEGORY}&ctg_id=${ctg_id}`
            });
    }
}