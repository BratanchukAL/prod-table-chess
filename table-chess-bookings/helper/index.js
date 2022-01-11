import {get, push, set} from "./editor";
/*
* configs:
*   reduceSizeByHeight
* */
export const helper = {
    storeElement: function(element){
        push({element});

        const attr_config = get().element.getAttribute('data-configs');
        if(attr_config)
            push({config: {...JSON.parse(attr_config)}});
    },
    
    //with attribute element`s
    configs:{
        getReduceSizeByHeight:function(){
            const config =  get().config;
            if(config)
                return config.reduceSizeByHeight || 0;
            else
                return 0;
        },
    },
};
