import {all} from 'redux-saga/effects';
import {saga as ratesSaga} from '../widgets/rates';


export default function* rootSaga() {
    yield all([
        ratesSaga(),

    ]);
}



