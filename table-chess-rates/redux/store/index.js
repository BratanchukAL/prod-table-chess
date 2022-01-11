import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';

/////middleware;
    //import logger from 'redux-logger';

    //SAGA
        import createSagaMiddleware from 'redux-saga';
        import saga from './saga';
    //END saga

//END middleware


const sagaMiddleware = createSagaMiddleware();

const enhancer = applyMiddleware(sagaMiddleware);
export const rootStore = createStore(reducer, {}, enhancer);

sagaMiddleware.run(saga);