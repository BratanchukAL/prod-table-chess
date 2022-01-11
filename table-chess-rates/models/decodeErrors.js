import {appName} from '../configs/config';

//FROM Server
const FAILD_FETCH = 'TypeError: Failed to fetch';
const NOT_ACCESS_BROWSE = 'NotAccessBrowse';
//END  FROM Server

//FROM APP
export const ERROR_CONNECTION_IS_FAILED = `${appName}/ERROR_CONNECTION_IS_FAILED`;
export const ERROR_CONNECTION_TIMEOUT = `${appName}/ERROR_CONNECTION_TIMEOUT`;
export const ERROR_IS_NULL = `${appName}/ERROR_IS_NULL`;
//END  FROM APP

export const WARNING = 'warning';
export const DANGER = 'danger';

export function decodeError(type){
    if(!type) return {level:null, text:null};

    console.log('decodeError',type) //TODO: debug

    switch(type.toString()){
        //FROM Server
        case FAILD_FETCH: return {
            level: WARNING,
            text:'Сервер не доступен по этому адресу.'
        };
        case NOT_ACCESS_BROWSE: return{
            level: WARNING,
            text:'Вам недоступен просмотр и редактирования цен'
        };
        //END  FROM Server

        //FROM APP
        case ERROR_CONNECTION_IS_FAILED: return {
            level: WARNING,
            text:'Ошибка соединения.'
        };
        case ERROR_CONNECTION_TIMEOUT: return {
            level: WARNING,
            text:'Превышено время ожидания соединения. Попробуйте позже.'
        };
        case ERROR_IS_NULL: return {
            level: WARNING,
            text:'Сервер проигнорировал.'
        };
        //END  FROM APP

        default: return {
            level: DANGER,
            text:'Что-то пошло не так как задумывалось.'
        } //'Crash  in Query: unhandled error from server. Code -1'
    }
}