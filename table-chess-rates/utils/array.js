
/**
 * @return array
 * */
export function mapAssoc(data, callback){
    let result = [];
    let i = 0;

    for(let index in data ){

        result[i] =  (
            callback(index, data[index])
        );
        i++;
    }

    return result;
}

export function isEmptyAssoc(obj) {

    if(obj === undefined) return true;

    return Object.keys(obj).length === 0;
};