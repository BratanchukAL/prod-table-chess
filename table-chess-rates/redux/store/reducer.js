import {combineReducers} from 'redux';
import {getReducer as getReducerReduxFormProperty} from '../../modules/redux-form-property'
import {moduleName as ratesModule,
        reducer as ratesReducer} from '../widgets/rates'


const rootReducer = combineReducers({
    [ratesModule]: ratesReducer,
    ...getReducerReduxFormProperty()
});

export default  rootReducer