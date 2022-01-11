import {all} from 'redux-saga/effects';
import {saga as bookingsSaga} from '../widgets/bookings';


export default function* rootSaga() {
    yield all([
        bookingsSaga(),

    ]);
}



