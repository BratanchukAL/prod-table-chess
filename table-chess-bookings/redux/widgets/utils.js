import {OrderedMap} from 'immutable';

export function generateID(){
    return Date.now();
}

export function DataToEntities(data, RecordModel = OrderedMap){
    return data.reduce((map, item)=> map.set(item.id, new RecordModel(item)),
        new OrderedMap({}))
}

