import {combineReducers} from 'redux';
import {getReducer as getReducerReduxFormProperty} from '../../modules/redux-form-property'
import {moduleName as bookingsModule,
        reducer as bookingsReducer} from '../widgets/bookings'


const rootReducer = combineReducers({
    [bookingsModule]: bookingsReducer,
    ...getReducerReduxFormProperty()
});

export default  rootReducer