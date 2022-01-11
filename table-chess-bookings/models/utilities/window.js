import {limitExecByInterval} from "./performance";


class Browser{
    static getInfoEnvironment(){
        let BrowserDetect = {
            init: function () {
                if(!this.browser) {
                    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                    this.OS = this.searchString(this.dataOS) || "an unknown OS";
                }
            },
            searchString: function (data) {
                for (var i=0;i<data.length;i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
            },
            dataBrowser: [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                { string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {
                    /* For Newer Netscapes (6+) */
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Internet Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {
                    /* For Older Netscapes (4-) */
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS : [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ]

        };
        BrowserDetect.init();
        return BrowserDetect;
    }
}

class Scroll extends Browser{
    static getScrollTop(){
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    static getWidth(){
        return document.documentElement.clientWidth; // ширина
    }
    static getHeight(){
        return document.documentElement.clientHeight; // высота
    }
}

class Events extends Scroll{

    static setHandleClick = function (event) {
        window.addEventListener('click', event);
    };

    /*
    * setHandleKeyUp
    * */
    static setHandleKeyUp = function (event) {
        window.addEventListener('keyup', event);
    };
/*
    * setHandleScroll
    * */
    static setHandleScroll = function (event) {
        window.addEventListener('scroll', event);
    };

    /*
    * setHandleResize
    * */
    static setHandleScale = function (_event) {

        const event = limitExecByInterval(_event, 1500);

        window.addEventListener('resize', event);
    };
}

class GlobalWindow extends Events{

    static reload(){
        window.location.reload();
    }

    static canceledSelection = function () {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE
            document.selection.empty();
        }
    };

    static getBoxById(id){
        const buf_box = document.getElementById(id)&&
        document.getElementById(id).getBoundingClientRect();

        return buf_box || {left:0, right:0, top:0, bottom:0, isEmpty:true};
    }

    static getBoxByElement(element){
        const buf_box = element &&
            element.getBoundingClientRect();

        return buf_box || {left:0, right:0, top:0, bottom:0, isEmpty:true};
    }

    static getElementById(id){
        return document.getElementById(id);
    }

    static getElementsByClass(className){
        return document.getElementsByClassName(className);
    }

    static getElementsByName(Name){
        return document.getElementsByName(Name);
    }

    /*
    *getComputedStyle(element, name_attribute)
    * out: value and 'px'
    * */
    static getComputedStyle(_element, name_attribute, isOutNumber=false){

        const element = window.getComputedStyle(_element);
        const res = element.getPropertyValue(name_attribute);

        if(isOutNumber)
            switch(name_attribute){
                case 'top':
                case 'left':
                case 'height':
                case 'width':
                case 'padding-top':
                    return Number(res.match(/\d+/)[0]);

                default: console.log('getComputedStyle, OutNumber Error');
            }

        return res;
    }
}


/*
* funcTarget(result)
function smoothing (start, end, funcTarget, _time_interval) {
    if (!funcTarget) return;

    const time_interval = _time_interval;
    let id_setInterval;
    id_setInterval = setInterval(
        (() => {
            let old_res = start;
            let old_fps = Date.now();
            let del_value = end - start;

            return () => {
                const fps = (Date.now() - old_fps);
                old_res = old_res + del_value / (time_interval / fps);
                old_fps = Date.now();

                if (del_value >= 0)
                    if (old_res >= end) {
                        old_res = old_res + (end - old_res);
                        funcTarget(old_res);
                        clearInterval(id_setInterval);
                    } else {
                        funcTarget(old_res);
                    }
                else if (old_res <= end) {
                    old_res = old_res + (end - old_res);
                    funcTarget(old_res);
                    clearInterval(id_setInterval);
                } else {
                    funcTarget(old_res);
                }
            }
        })()
        , 0);

    return id_setInterval;
}
* */

export default GlobalWindow;