/*
* fn, time
* */
export function limitExecByInterval(fn, time=1000, callback_arguments = (arg)=>{return arg;}) {
    let lock, execOnUnlock, args;
    return function() {
        args = callback_arguments(arguments);
        if (!lock) {
            lock = true;
            const scope = this;
            setTimeout(function(){
                lock = false;
                if (execOnUnlock) {
                    fn.apply(scope, args);
                    execOnUnlock = false;
                }
            }, time);
            return fn.apply(scope, args);
        } else execOnUnlock = true;
    }
}