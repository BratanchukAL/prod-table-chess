import {configQuery, ActionsApi} from '../configs/db'
import {postQuery} from './db'
import {appName} from "../configs/config";

export
class ModelUserSettings {

    /*
    * result data: <TypeJSON>usr_settings
    * */
    static async get(){
        console.log('ModelUserSettings get ', ActionsApi.GET_SETTINGS_USER);//TODO: debug

        const res = await
        postQuery({
            api: configQuery.users,
            params: `action=${ActionsApi.GET_SETTINGS_USER}`
        });
        return res;
    }

    /*
    * in - associative array
    * */
    static async set(settings){
        console.log('ModelUserSettings set ', ActionsApi.SET_SETTINGS_USER);//TODO: debug

        return await
        postQuery({
            api: configQuery.users,
            params: `action=${ActionsApi.SET_SETTINGS_USER}&json_value=${JSON.stringify({
                [appName]:{...settings}
            })}`
        });
        //*/

       /* return await
        postQuery({
            api: configQuery.users,
            params: `action=${ActionsApi.SET_SETTINGS_USER}&json_value=null`
        });
        //*/
    }
}