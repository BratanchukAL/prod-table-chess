// export const configQuery = { //TODO:for debug
//     url:'http://192.168.2.150/api/',
//     rates:'rates/',
//     users:'users/'
// };

export const configQuery = {
    url:'/api/',
    rates:'rates',
    users:'users'
};

/*
* Action: [ActionsApi],
* params -  GET_RATES-{
*     start_date,
*     end_date
* },
*
* SET_RATE, DELETE_RATE-{
*     start_date,
*     end_date,
*     new_rate,
*     ctg_id
* },
*
* NEW_CATEGORY{
*   ctg_name
*
* }
*
* EDIT_CATEGORY{
*   ctg_id
*   ctg_name
*
* }
* */
export const ActionsApi = {
    /*users*/
    GET_SETTINGS_USER:'getSettingsUser',
    SET_SETTINGS_USER: 'setSettingsUser',

    /*rates*/
    GET_RATES: 'getRates',
    SET_RATE: 'setRates',
    DELETE_RATE: 'deleteRates', //TODO:edited
    NEW_CATEGORY: 'newCategory',
    EDIT_CATEGORY: 'editCategory',
    DELETE_CATEGORY: 'deleteCategory',
};

export const IntervalPostQuery ={
    timeout: 120000,
};