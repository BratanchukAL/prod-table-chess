import {appName} from "../configs/config";
import {isEmptyAssoc} from "../utils/array";

export  function push(values){

    window[appName]={
        ...window[appName],
        ...values
    }

}

export  function get(){
    return window[appName];
}

export function set(keys, value){
    let variant = get();
    let isNotMiddleKey = false;

    for(const index in keys) {
        const key = keys[index];

        if(parseInt(index) === (keys.length-1)) {

            let isNotLastKey = false;
            if(!variant[key])
                isNotLastKey = true;

            variant[key] = value;

            // if(isNotMiddleKey)
            //     this.forceUpdate();

            return {isNotMiddleKey, isNotLastKey};
        }

        if (variant[key]) {
            if(isEmptyAssoc(variant[key])) {
                const key_next = keys[parseInt(index + 1)];
                if(key_next) {
                    variant[key] = {[key_next]: {}};
                    isNotMiddleKey = true;
                }
            }
        }else{
            const key_next = keys[parseInt(index)];
            if(key_next) {
                variant[key] = {};
                isNotMiddleKey = true;
            }
        }
        variant = variant[key];
    }
}