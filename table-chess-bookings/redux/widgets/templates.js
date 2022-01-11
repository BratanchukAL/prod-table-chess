import {call, put} from 'redux-saga/effects';

//default action
export const ACTION_EMPTY = '';

/*
*templates
* generic saga fetch
* Success - in gen func action.callBackResult(result)
* Error - actionError
* */
export function factoryFetchGenericFE(fetch, actionSuccess, actionError){

    return function* (action) {
        try {
            const res = yield call(fetch, action.payload);

            yield put({
                type: actionSuccess,
                payload: {...res},
                inparam: action.payload,
            });

            if(action.callBackResult)
                yield call(action.callBackResult, res.data);

            console.log('factoryFetchGenericFE: ', action, res) //TODO: debug
        } catch (err) {
            yield put({
                type: actionError,
                error: err
            });

            if(action.callBackError)
                yield call(action.callBackError, err);
        }
    }
}
export function factoryActionForFetchGenericFE(actionType){
    return function (payload, callBackResult, callBackError) {
        return {
            type: actionType,
            payload: payload || {},
            callBackResult: callBackResult,
            callBackError: callBackError
        }
    }
}

/*
*templates
*  generic saga fetch
*   Success - actionSuccess
*   Error - actionError
* */
export function factoryFetchGenericSE(fetch, actionSuccess, actionError){
    return function* (action) {
        try {
            const res = yield call(fetch, action.payload);
            console.log('factoryFetchGenericSE: ', action, res); //TODO: debug

            yield put.resolve({
                type: actionSuccess,
                payload: {...res},
                inparam: action.payload,
            });

        } catch (err) {
            yield put({
                type: actionError,
                error: err
            })
        }
    }

}
export function factoryActionForFetchGenericSE(actionType){
    return function (payload) {
        return {
            type: actionType,
            payload: payload || {},
        }
    }
}

export function factoryAction(actionType){
    return function (payload) {
        return {
            type: actionType,
            payload: payload || {},
        }
    }
}