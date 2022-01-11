// export const configQuery = { //TODO: for debug
//     url:'http://192.168.2.150/api/',
//     bookings:'bookings/',
//     users:'users/'
// };

export const configQuery = {
    url:'/api/',
    bookings:'bookings',
    users:'users'
};

/*
* Action: [ActionsApi],
* params -  GET_BOOKINGS-{
*     start_date,
*     end_date
* },
*   GET_RATE:{
*       start_date,
*       end_date,
*       category_id
*   },
*
*   NEW_ORDER-{
*       start_date,
*       end_date,
*       category_id,
*       client_fio,
*       client_phone,
*       client_email,
*       comment,  (comment)
*       price
*   }
*
*   EDIT_ORDER-{
*       cm. NEW_ORDER,
*       booking_id
*   }
*   DELETE_ORDER-{
*       booking_id
*   }
* */
export const ActionsApi = {

    /*users*/
    GET_SETTINGS_USER:'getSettingsUser',
    SET_SETTINGS_USER: 'setSettingsUser',

    /*bookings*/
    GET_BOOKINGS: "getBookings",
    GET_RATE: "getRate",
    GET_COST: "getRate",
    NEW_ORDER: "newOrder",
    EDIT_ORDER: "editOrder",
    DELETE_ORDER: "deleteOrder",
    EDIT_FIELD_VIEWED: 'editFieldViewed'
};

export const IntervalPostQuery ={
    timeout: 120000,
};