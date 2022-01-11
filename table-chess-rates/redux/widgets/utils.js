import {OrderedMap} from 'immutable';

export function generateID() {
    return Date.now();
}

/*
* DataToEntities
* */
export function DataToEntities(data, RecordModel = OrderedMap, callGenericId = null) {
    return data.reduce((map, item) => {
            if(callGenericId){
                item.id = callGenericId(item);
            }
            return map.set(item.id, new RecordModel(item))
        },
        new OrderedMap({}))
}