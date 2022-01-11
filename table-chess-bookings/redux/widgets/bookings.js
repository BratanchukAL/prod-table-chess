import {appName} from '../../configs/config';
import {Record, Map} from 'immutable';
import {all, takeEvery, put, call, fork, select} from 'redux-saga/effects';
import {
    factoryActionForFetchGenericFE,
    factoryActionForFetchGenericSE,
    factoryFetchGenericFE,
    factoryFetchGenericSE,
    factoryAction,
    ACTION_EMPTY
} from './templates'
import {createSelector} from 'reselect'
import {DataToEntities} from './utils'
import {todayDate, dateToShift, strToDate} from '../../models/utilities/date';

import {ERROR_IS_NULL} from '../../models/decodeErrors';
import ModelBookings from '../../models/bookings'
import {CLEAR_ERROR} from "./state";
import {ModelUserSettings} from "../../models/user-settings";

//CONSTANT
export const moduleName = 'bookings';
export const prefix = `${appName}/${moduleName}`;

const FIRST_REQUEST_WITH_SETTINGS = `${prefix}/FIRST_REQUEST_WITH_SETTINGS`;
const REQUEST = `${prefix}/REQUEST`;
const SUCCESS = `${prefix}/SUCCESS`;
const ERROR = `${prefix}/ERROR`;

const SAVE_SUCCESS = `${prefix}/SAVE_SUCCESS`;
const DELETE_SUCCESS = `${prefix}/DELETE_SUCCESS`;

const GET_COST =  `${prefix}/GET_COST`;
const POST_NEW_ORDER =  `${prefix}/POST_NEW_ORDER`;
const POST_SET_EDIT_ORDER =  `${prefix}/POST_SET_EDIT_ORDER`;
const POST_DELETE_ORDER =  `${prefix}/POST_DELETE_ORDER`;
// const POST_EDIT_FIELD_VIEWED =  `${prefix}/POST_EDIT_FIELD_VIEWED`;

const HANDLE_SETTINGS = `${prefix}/HANDLE_SETTINGS`;
const SAVE_SETTINGS = `${prefix}/SAVE_SETTINGS`;


/*
 * Selectors
 */
export const stateSelector = states => states[moduleName] || states;
const entitiesBookingsSelector = createSelector(stateSelector, state => state.bookings);
const entitiesCategoriesSelector = createSelector(stateSelector, state => state.categories);
const entitiesRoomsSelector = createSelector(stateSelector, state => state.rooms);

export const bookingsSelector = createSelector(entitiesBookingsSelector, entities => entities.toArray());
const categoriesSelector = createSelector(entitiesCategoriesSelector, entities => entities.toArray());
const roomsSelector = createSelector(entitiesRoomsSelector, entities => entities.toArray());


/*оставшиеся брони со статусом '0': 'отмена' и '1': 'незаезд'*/
export const bookingsCanceledSelector = createSelector(bookingsSelector,
    (bookings)=>{
        return bookings.filter((booking) => {
            if (
                booking.status !== undefined &&
                ( booking.status.toString() === '0' || //'0': 'отмена'
                  booking.status.toString() === '1' )  //'1': 'незаезд',
            )
                return true;
            else return false
        });
    }
);

/* брони со статусом (status) */
export const factoryBookingsStatusSelector = (status)=>{

   return createSelector(bookingsSelector,
        (bookings)=>{
            return bookings.filter((booking) => {
                if (
                    booking.status !== undefined &&
                    ( booking.status.toString() === status )
                )
                    return true;
                else return false
            });
        }
   );
};


// '2': 'не подтверждено'
export const bookingsNotConfirmedSelector = factoryBookingsStatusSelector('2');
// '3': 'подтверждено'
export const bookingsConfirmedSelector = factoryBookingsStatusSelector('3');
// '4': 'проживает'
export const bookingsResidesSelector = factoryBookingsStatusSelector('4');
// '5': 'выезд'
export const bookingsDepartureSelector = factoryBookingsStatusSelector('5');
// '9': 'резерв'
export const bookingsReserveSelector = factoryBookingsStatusSelector('9');

/*
* все брони сгрупированые по номерам КРОМЕ со статусом '0': 'отмена' и '1': 'незаезд'
* */
const bookingsGroupByRoomsSelector = createSelector(roomsSelector, bookingsSelector,
    (rooms, bookings) => {
        return rooms.map((room) => {
            const bookingsByRoom = bookings.filter((booking) => {
                if ((room.id === booking.room_id) &&
                    (booking.status !== undefined &&
                        booking.status.toString() !== '0' && //'0': 'отмена'
                        booking.status.toString() !== '1')    //'1': 'незаезд',
                )
                    return true;
                else return false
            });
            return {
                id: room.id,
                name: room.name ? room.number +' ('+ room.name + ')': room.number,
                category_id: room.category_id,
                closed: !room.sale,
                bookings: bookingsByRoom
            }
        });
    }
);

/*
* out categories{id, ctg_name, rooms: [roomsBy]}
* roomsBy {
*            id,
*            name,
*            category_id,
*            closed
*            bookings: map BookingsRecord}
*         }
* */
export const bookingsGroupByRoomCategoriesSelector = createSelector(categoriesSelector, bookingsGroupByRoomsSelector,
    (cats, rooms) => {
        return cats.map((cat) => {
            const roomsBy = rooms.filter((room) => {
                if (cat.id === room.category_id)
                    return true;
                else
                    return false;
            });
            return {id: cat.id, ctg_name: cat.ctg_name, rooms: roomsBy}
        });
    });

//REDUCER
/*
*   client_email:"aaa@test.ru"
*   client_fio:"Рабинович С.М."
*   client_phone:"79123456789"
*   ctg_name:"Одноместный стандарт+"
*   category_id:2
*   date_end:"2018-05-18"
*   date_start:"2018-05-01"
*   id:2
*   comment:null
*   created_at:"2018-03-27"
*   price: null,
*   room_id: null
* */
export const BookingsRecord = Record({
    id: null,
    category_id: null,
    date_start: null,
    date_end: null,
    client_email: null,
    client_fio: null,
    client_phone: null,
    comment: null,
    created_at: null,
    price: null,
    room_id: null,
    status: null,
    viewed: null,
});

export const CategoriesRecord = Record({
    id: null,
    ctg_name: null
});

export const RoomsRecord = Record({
    id: null,
    category_id: null,
    name: null,
    number: null,
    sale: null,
});

export const ReducerRecord = Record({
    bookings: new Map({}),
    categories: new Map({}),
    rooms: new Map({}),

    statuses:{
        'default': '2',
        '0': 'отмена',
        '1': 'незаезд',
        '2': 'не подтверждено',
        '3': 'подтверждено',
        '4': 'проживает',
        '5': 'выезд',
        '9': 'резерв'
    },

    date_start: dateToShift(todayDate(), -2),
    date_end: dateToShift( dateToShift(todayDate(), -2), 60),
    variants_periods: [0, 30, 60, 90, 122, 164, 186, 371],
    /*settings*/
    day_shift_index: 2,
    scale: 100,

    error: null,
    loading: false,
    loaded: false,
});

export function reducer(state = new ReducerRecord(), action) {
    const {type, payload, inparam, error} = action;

    switch (type) {
        case FIRST_REQUEST_WITH_SETTINGS:
        case REQUEST:
            return state
                .set('loading', true)
                .set('error', null);

        case ERROR:
            return state
                .set('loading', false)
                .set('error', error);

        case SUCCESS:
            const categories = payload.data.categories;
            const bookings = payload.data.bookings || [];
            const rooms = payload.data.rooms || [];
            const new_params = payload.data.params || null;

            if((!categories && !(categories && categories.length)) ||  (typeof categories === 'string') )
                return state.set('error', ERROR_IS_NULL)
                    .set('loading', false);

            const params = (new_params && new_params.date_start) ? new_params : inparam;

            return state
                .set('date_start', strToDate(params.date_start))
                .set('date_end', strToDate(params.date_end))
                .set('day_shift_index', inparam.day_shift_index)
                .set('loading', false)
                .set('bookings', DataToEntities(bookings, BookingsRecord))
                .set('categories', DataToEntities(categories, CategoriesRecord))
                .set('rooms', DataToEntities(rooms, RoomsRecord));

        case SAVE_SUCCESS:
            console.log('SAVE_SUCCESS', inparam, payload);
            return state
                .mergeIn(['bookings'], DataToEntities([{
                    ...inparam,
                    id: Number(payload.data.id),
                    created_at: inparam.created_at || todayDate().toDateString(),
                    category_id: inparam.category_id,
                }], BookingsRecord));

        case DELETE_SUCCESS:
            return state
                .deleteIn(['bookings', inparam.booking_id]);

        case SAVE_SETTINGS:
            return state
                .set('scale', payload.scale);

        case CLEAR_ERROR:
            return state.set('error', null);

        default:
            return state;
    }
}

//ACTIONS
export const fetchWithSettings = factoryAction(FIRST_REQUEST_WITH_SETTINGS);
const fetchWithSettingsSaga = function *(action){
    try{
        const res = yield call(ModelUserSettings.get);
        console.log('fetchWithSettingsSaga: get', action, res.data); //TODO: debug

        const state = yield select(stateSelector);

        const settings = res.data[appName];
        console.log('fetchWithSettingsSaga  settings, res.data[appName], res', settings, res.data[appName], res) //TODO: debug
        if(settings) {

            yield put({
                type: SAVE_SETTINGS,
                payload: {scale: settings.scale || state.scale}
            });

            const date_start = state.date_start;
            const day_shift_index = settings.day_shift_index || state.day_shift_index;
            const day_shift = state.variants_periods[day_shift_index];

            let date_end = dateToShift(date_start, day_shift);
            yield put(fetch({date_start, date_end, day_shift_index}));
        }else{
            yield fork(ModelUserSettings.set, {
                day_shift_index: state.day_shift_index,
                scale: state.scale
            });
            const date_start = state.date_start;
            const {day_shift_index} = state;
            const day_shift = state.variants_periods[day_shift_index];

            let date_end = dateToShift(date_start, day_shift);
            yield put(fetch({date_start, date_end, day_shift_index}));
        }

    }catch (error){
        yield put({
            type:ERROR,
            error
        })
    }
};

export const handleSettings = factoryAction(HANDLE_SETTINGS);
const handleSettingsSaga = function *(action){
    let {date_start, day_shift_index, scale} = action.payload;

    try{
        const state = yield select(stateSelector);

        if(scale){
            yield fork(ModelUserSettings.set, {scale});
            yield put({
                type: SAVE_SETTINGS,
                payload: {scale}
            })
        }else {
            if (date_start)
                day_shift_index = day_shift_index || state.day_shift_index;
            else if (day_shift_index) {
                date_start = date_start || state.date_start;
                yield fork(ModelUserSettings.set, {day_shift_index});
            }else{
                day_shift_index = state.day_shift_index;
                date_start = state.date_start;
            }

            const day_shift = state.variants_periods[day_shift_index];

            const date_end = dateToShift(date_start, day_shift);
            yield put(fetch({date_start, date_end, day_shift_index}));
        }

    }catch(error){
        yield put({
            type:ERROR,
            error
        })
    }
};

export const fetch = factoryActionForFetchGenericSE(REQUEST);
const fetchSaga = factoryFetchGenericSE(ModelBookings.getDataBookings, SUCCESS, ERROR);


/*
* callBackResult - catch result
* */

export const fetchCost = factoryActionForFetchGenericFE(GET_COST);

const fetchCostSaga = factoryFetchGenericFE(ModelBookings.getDataCost, ACTION_EMPTY, ERROR);

/*
* payload ={ date_start,
*             date_end,
*             category_id,
*             room_id,
*             client_fio,
*             client_phone,
*             client_email,
*             comment,
*             price}*
* */

export const fetchNewOrder = factoryActionForFetchGenericFE(POST_NEW_ORDER);

const fetchNewOrderSaga = factoryFetchGenericFE(ModelBookings.setDataNewOrder, SAVE_SUCCESS, ERROR);

/*
* payload ={
*             booking_id
*             date_start,
*             date_end,
*             category_id,
*             room_id,
*             client_fio,
*             client_phone,
*             client_email,
*             comment,
*             price}*
* */

export const fetchEditOrder = factoryActionForFetchGenericFE(POST_SET_EDIT_ORDER);

const fetchEditOrderSaga = factoryFetchGenericFE(ModelBookings.setDataEditOrder, SAVE_SUCCESS, ERROR);


/*
* payload ={booking_id}
* */
export const fetchDeleteOrder = factoryActionForFetchGenericFE(POST_DELETE_ORDER);

const fetchDeleteOrderSaga = factoryFetchGenericFE(ModelBookings.deleteOrder, DELETE_SUCCESS, ERROR);

// /*
// * payload ={booking_id, viewed}
// * */
// export const fetchEditFieldViewed = factoryActionForFetchGenericFE(POST_EDIT_FIELD_VIEWED);
//
// const fetchEditFieldViewedSaga = factoryFetchGenericFE(ModelBookings.editFieldViewed, SAVE_SUCCESS, ERROR);


export const saga = function* () {
    yield all([
        takeEvery(FIRST_REQUEST_WITH_SETTINGS, fetchWithSettingsSaga),
        takeEvery(HANDLE_SETTINGS, handleSettingsSaga),
        takeEvery(REQUEST, fetchSaga),
        takeEvery(GET_COST, fetchCostSaga),
        takeEvery(POST_NEW_ORDER, fetchNewOrderSaga),
        takeEvery(POST_SET_EDIT_ORDER, fetchEditOrderSaga),
        takeEvery(POST_DELETE_ORDER, fetchDeleteOrderSaga),
        // takeEvery(POST_EDIT_FIELD_VIEWED, fetchEditFieldViewedSaga)
    ]);
};