import {appName} from '../../configs/config';
import {Record, Map} from 'immutable';
import {all, takeEvery, put, call, fork, select} from 'redux-saga/effects';
import {createSelector} from 'reselect'
import {DataToEntities} from './utils'
import {todayDate, dateToShift, strToDate} from '../../models/utilities/date'
import {
    factoryFetchGenericSE,
    factoryFetchGenericFE,
    factoryActionForFetchGenericSE,
    factoryActionForFetchGenericFE,
    factoryAction
} from './templates';

import {ERROR_IS_NULL} from '../../models/decodeErrors';
import {ModelRates} from '../../models/rates'
import {CLEAR_ERROR} from "./state";
import {ModelUserSettings} from "../../models/user-settings";

//CONSTANT
export const moduleName = 'rates';
export const prefix = `${appName}/${moduleName}`;

const FIRST_REQUEST_WITH_SETTINGS = `${prefix}/FIRST_REQUEST_WITH_SETTINGS`;
const REQUEST = `${prefix}/REQUEST`;
const SUCCESS = `${prefix}/SUCCESS`;
const ERROR = `${prefix}/ERROR`;

const POST_EDITED_RECORD = `${prefix}/POST_EDITED_RECORD`;
const SAVE_SUCCESS = `${prefix}/SAVE_SUCCESS`;
const POST_DELETE_RECORD = `${prefix}/POST_DELETE_RECORD`;
const DELETE_SUCCESS = `${prefix}/DELETE_SUCCESS`;

const POST_NEW_RECORD_CATEGORY = `${prefix}/POST_NEW_RECORD_CATEGORY`;
const POST_EDITED_RECORD_CATEGORY = `${prefix}/POST_EDITED_RECORD_CATEGORY`;
const POST_DELETE_RECORD_CATEGORY = `${prefix}/POST_DELETE_RECORD_CATEGORY`;
const SAVE_NEW_CATEGORY_SUCCESS = `${prefix}/SAVE_NEW_CATEGORY_SUCCESS`;
const SAVE_EDITED_CATEGORY_SUCCESS = `${prefix}/SAVE_EDITED_CATEGORY_SUCCESS`;
const SAVE_DELETE_CATEGORY_SUCCESS = `${prefix}/SAVE_DELETE_CATEGORY_SUCCESS`;

const HANDLE_SETTINGS = `${prefix}/HANDLE_SETTINGS`;
const SAVE_SETTINGS = `${prefix}/SAVE_SETTINGS`;

/*
 * Selectors
 */
export const stateSelector = states => states[moduleName] || states;
const entitiesRatesSelector = createSelector(stateSelector, state => state.rates);
const entitiesCategoriesSelector = createSelector(stateSelector, state => state.categories);

const ratesSelector = createSelector(entitiesRatesSelector, entities => entities.toArray());
const categoriesSelector = createSelector(entitiesCategoriesSelector, entities => entities.toArray());


/*
* return {   id,
*            ctg_name,
*            rates: array
*         }
* */
export const ratesGroupByCategoriesSelector = createSelector(categoriesSelector, ratesSelector,
    (categories, rates) => {
        return categories.map((category) => {
            const ratesByCategory = rates.filter((rate) => category.id === rate.ctg_id);
            return {
                id: category.id,
                ctg_name: category.ctg_name,
                rms_amt: category.rms_amt,
                rates: ratesByCategory
            }
        });
    }
);

//REDUCER
function genericIdForRates(item) {
    return `${item.ctg_id}/${strToDate(item.first_day).getTime()}`;
}

/*  id: null,
*   first_day: null,
*   last_day: null,
*   rate: null
*
* */
export const RatesRecord = Record({
    id: null, //!!genericIdForRates //TODO:edited
    ctg_id: null,
    first_day: null,
    last_day: null,
    rate: null,
    discount: null,
});

export const CategoriesRecord = Record({
    id: null,
    ctg_name: null,
    rms_amt: null,
});

export const ReducerRecord = Record({
    categories: new Map({}),
    rates: new Map({}),

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
            const rates = payload.data.rates || [];
            const new_params = payload.data.params || null;

            if((!categories && !(categories && categories.length)) ||  (typeof categories === 'string') )
                return state.set('error', ERROR_IS_NULL)
                            .set('loading', false);

            const params = (new_params && new_params.date_start) ? new_params : inparam;

            return state
                .set('date_start', strToDate(params.date_start))
                .set('date_end', strToDate(params.date_end))
                .set('day_shift_index', inparam.day_shift_index)
                .set('loaded', true)
                .set('loading', false)
                .set('categories', DataToEntities(categories, CategoriesRecord))
                .set('rates', DataToEntities(rates, RatesRecord, genericIdForRates));

        case SAVE_SETTINGS:
            return state
                .set('scale', payload.scale);


        case SAVE_SUCCESS:
            let newAdd_rates = [];

            const is_object = typeof inparam.ctg_id === 'object';

            if(inparam.ctg_id === 'all')
                state.get('categories').mapEntries(([key, value]) => {
                    newAdd_rates.push({
                        ...inparam,
                        ctg_id: value.id,
                        first_day: inparam.date_start,
                        last_day: inparam.date_end,
                    });
                });
            else if(is_object){
                state.get('categories').mapEntries(([key, value]) => {
                    if(inparam.ctg_id.indexOf(value.id) > -1)
                        newAdd_rates.push({
                            ...inparam,
                            ctg_id: value.id,
                            first_day: inparam.date_start,
                            last_day: inparam.date_end,
                        });
                });
            }
            else
                newAdd_rates.push({
                    ...inparam,
                    first_day: inparam.date_start,
                    last_day: inparam.date_end,
                });

            const new_rates = state.get('rates').mapEntries(([key, value]) => {

                if (
                    (value.ctg_id === inparam.ctg_id) ||
                    inparam.ctg_id === 'all' ||
                    (is_object && (inparam.ctg_id.indexOf(value.ctg_id) > -1))
                ) {

                    const new_date_start = strToDate(inparam.date_start).getTime();
                    const new_date_end = strToDate(inparam.date_end).getTime();

                    const first_day = strToDate(value.first_day);
                    const mem_date_start = first_day.getTime();

                    const last_day = strToDate(value.last_day);
                    const mem_date_end = last_day.getTime();

                    if ((new_date_start <= mem_date_start) && (new_date_end >= mem_date_end))
                        return null;

                    if (((new_date_end >= mem_date_start) && (new_date_end <= mem_date_end)) &&
                        ((new_date_start > mem_date_start) && (new_date_start <= mem_date_end))) {

                        let new_last_day;

                        new_last_day = strToDate(inparam.date_start);
                        new_last_day.setDate(new_last_day.getDate() - 1);
                        newAdd_rates.push({
                            ctg_id: value.ctg_id,
                            rate: value.rate,
                            discount: value.discount,
                            first_day: value.first_day,
                            last_day: new_last_day,
                        });
                    }

                    if ((new_date_end >= mem_date_start) && (new_date_end <= mem_date_end)) {
                        let new_first_day;

                        new_first_day = strToDate(inparam.date_end);
                        if(mem_date_end !== new_date_end)
                            new_first_day.setDate(new_first_day.getDate() +1);

                        const buf_map = value.set('first_day', new_first_day);
                        return [genericIdForRates(buf_map), buf_map.set('id', genericIdForRates(buf_map))];
                    }

                    if ((new_date_start >= mem_date_start) && (new_date_start <= mem_date_end)) {
                        let new_last_day;

                        new_last_day = strToDate(inparam.date_start);
                        new_last_day.setDate(new_last_day.getDate() - 1);

                        const buf_map = value.set('last_day', new_last_day);
                        return [key, buf_map];
                    }
                };

                return [key, value];
            });

            return state
                .set('rates', new_rates)
                .mergeIn(['rates'], DataToEntities(newAdd_rates, RatesRecord, genericIdForRates));

        case DELETE_SUCCESS:
            const id = genericIdForRates({
                ctg_id: inparam.ctg_id,
                first_day: inparam.date_start
            });
            return state.deleteIn(['rates', id]);

        case SAVE_NEW_CATEGORY_SUCCESS:
            if (inparam.copy_rates_only_periods || inparam.copy_rates) {
                let increment = 0;
                const copied_rates = state
                    .getIn(['rates']).filter((value) => {
                        return (value.ctg_id === inparam.ctg_id)
                    })
                    .mapEntries(([index, value]) => {
                        let rate = 0, discount = 0;
                        if(inparam.copy_rates) {
                            rate = value.rate;
                            discount = value.discount;
                        }
                        else
                            rate = increment++;

                        let buf_map = {
                            ctg_id: payload.data[0].id,
                            first_day: value.first_day,
                            last_day: value.last_day,
                            rate: rate,
                            discount: discount,
                        };
                        const key = genericIdForRates(buf_map);
                        buf_map.id = key;

                        return [key, new RatesRecord(buf_map)]
                    });
                return state
                    .mergeIn(['categories'], DataToEntities([{
                        ...inparam,
                        id: payload.data[0].id,
                    }], CategoriesRecord))
                    .mergeIn(['rates'], copied_rates);
            }
            else
                return state
                    .mergeIn(['categories'], DataToEntities([{
                        ...inparam,
                        id: payload.data[0].id,
                    }], CategoriesRecord));

        case SAVE_EDITED_CATEGORY_SUCCESS:
            return state
                .mergeIn(['categories'], DataToEntities([{
                    ...inparam,
                    id: inparam.ctg_id,
                }], CategoriesRecord));

        case SAVE_DELETE_CATEGORY_SUCCESS:
            return state.deleteIn(['categories', inparam.ctg_id]);


        case CLEAR_ERROR:
            return state.set('error', null);

        default:
            return state;
    }
}

//ACTIONS
/*
* */
export const fetchWithSettings = factoryAction(FIRST_REQUEST_WITH_SETTINGS);
const fetchWithSettingsSaga = function *(action){
    try{
        const res = yield call(ModelUserSettings.get);
        const state = yield select(stateSelector);
        const settings = res.data[appName];

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
const handleSettingsSaga = function* (action) {
    let {date_start, day_shift_index, scale} = action.payload;

    try {
        const state = yield select(stateSelector);
        if (scale !== undefined) {
            yield fork(ModelUserSettings.set, {scale});
            yield put({
                type: SAVE_SETTINGS,
                payload: {scale}
            })
        } else {
            if (date_start)
                day_shift_index = day_shift_index || state.day_shift_index;
            else if (day_shift_index) {
                date_start = date_start || state.date_start;
                yield fork(ModelUserSettings.set, {day_shift_index});
            } else {
                day_shift_index = state.day_shift_index;
                date_start = state.date_start;
            }

            const day_shift = state.variants_periods[day_shift_index];

            const date_end = dateToShift(date_start, day_shift);
            yield put(fetch({date_start, date_end, day_shift_index}));
        }

    } catch (error) {
        yield put({
            type: ERROR,
            error
        })
    }
};

export const fetch = factoryActionForFetchGenericSE(REQUEST);
const fetchSaga = factoryFetchGenericSE(ModelRates.getDataRates, SUCCESS, ERROR);

/*
* in = {date_start, date_end, rate, ctg_id}
* */
export const fetchEditOrder = factoryActionForFetchGenericFE(POST_EDITED_RECORD);
const fetchEditOrderSaga = factoryFetchGenericFE(ModelRates.setDataEditRate, SAVE_SUCCESS, ERROR);
/*
* in = {date_start, date_end, rate, ctg_id}
* */
export const fetchDeleteOrder = factoryActionForFetchGenericFE(POST_DELETE_RECORD);
const fetchDeleteOrderSaga = factoryFetchGenericFE(ModelRates.setDataDeleteRate, DELETE_SUCCESS, ERROR);

/*
* in = {ctg_name, rms_amt}
* */
export const fetchNewCategory = factoryActionForFetchGenericFE(POST_NEW_RECORD_CATEGORY);
const fetchNewCategorySaga = factoryFetchGenericFE(ModelRates.setDataNewCategory, SAVE_NEW_CATEGORY_SUCCESS, ERROR);

/*
* in = {ctg_id, ctg_name, rms_amt}
* */
export const fetchEditCategory = factoryActionForFetchGenericFE(POST_EDITED_RECORD_CATEGORY);
const fetchEditCategorySaga = factoryFetchGenericFE(ModelRates.setDataEditCategory, SAVE_EDITED_CATEGORY_SUCCESS, ERROR);

/*
* in = {ctg_id}
* */
export const fetchDeleteCategory = factoryActionForFetchGenericFE(POST_DELETE_RECORD_CATEGORY);
const fetchDeleteCategorySaga = factoryFetchGenericFE(ModelRates.postDeleteCategory, SAVE_DELETE_CATEGORY_SUCCESS, ERROR);

//saga
export const saga = function* () {
    yield all([
        takeEvery(FIRST_REQUEST_WITH_SETTINGS, fetchWithSettingsSaga),
        takeEvery(HANDLE_SETTINGS, handleSettingsSaga),
        takeEvery(REQUEST, fetchSaga),
        takeEvery(POST_EDITED_RECORD, fetchEditOrderSaga),
        takeEvery(POST_DELETE_RECORD, fetchDeleteOrderSaga),
        takeEvery(POST_NEW_RECORD_CATEGORY, fetchNewCategorySaga),
        takeEvery(POST_EDITED_RECORD_CATEGORY, fetchEditCategorySaga),
        takeEvery(POST_DELETE_RECORD_CATEGORY, fetchDeleteCategorySaga),
    ]);
};