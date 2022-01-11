import {configQuery, IntervalPostQuery} from '../configs/db'
import {ERROR_CONNECTION_IS_FAILED, ERROR_CONNECTION_TIMEOUT} from './decodeErrors'


export const TRUE = 1; //TODO: edited
export const FALSE = 0;

/*
* variant: api, params
*
* return out={data: response, error:error} and
*
* error from server in response.error
* */
export function postQuery({api, params}) { //TODO: edited

    function installLoaderBar(){

        let loader_bar;
        loader_bar = $('.progress-bar-top');

        const progress_bar = loader_bar[0];
        if(!progress_bar) return null;

        progress_bar.LoaderBar = {loading:null};
        progress_bar.LoaderBar.loading = function (event) {

            if(!progress_bar.style.left) {
                progress_bar.style.left = 0;
                progress_bar.style.right = null;
            }

            const loaded = event.lengthComputable ?
                event.loaded || event.progress && event.progress.loaded :
                event.target.getResponseHeader('content-length') || event.target.getResponseHeader('x-decompressed-content-length');

            const total = event.total || event.progress && event.progress.total;
            const progress = loaded / total * 100;

            progress_bar.style.width = progress + '%';
            //console.log('progress', event) //TODO: debug
            if ( progress === 100 ) {
                setTimeout(function(){
                    progress_bar.style.left = '';
                    progress_bar.style.right = 0;
                    progress_bar.style.width = 0;
                }, 1500);
            }
        };

        return progress_bar;
    };

    function watchTimeout(ms, promise) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(ERROR_CONNECTION_TIMEOUT)
            }, ms);
            promise.then(resolve, reject)
        })
    }
    function status(response) {
        console.log('postQuery status', response) //TODO: debug
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(ERROR_CONNECTION_IS_FAILED)
        }
    }
    function json(response) {
        console.log('postQuery pre json', response) //TODO: debug

        if(typeof response === "string") // "string" //TODO: edited
            return response.json();
        else
            return response.data;
    }
    function callBackResult(response) {
        let res = {data: response, error: null};
        res.error = response.error || null;
        if (res.error)
            throw res.error;
        return res

    }
    function callBackError(error) {
        console.log('callBackError db', error); //TODO: debug
        throw error;
    }

    const loader_indicate = installLoaderBar();

    const myRequest = {
        method: 'post',
        url: `${configQuery.url}${api}`,
        data: params,
        headers:{
            ...window.axios.defaults.headers.common
        },
        onUploadProgress:function(event){
            loader_indicate.LoaderBar.loading(event);
        },
        onDownloadProgress:function(event){
            loader_indicate.LoaderBar.loading(event);
        }
    };

    return watchTimeout(IntervalPostQuery.timeout, window.axios(myRequest))
        .then(status)
        .then(json)
        .then(callBackResult)
        .catch(callBackError);
}