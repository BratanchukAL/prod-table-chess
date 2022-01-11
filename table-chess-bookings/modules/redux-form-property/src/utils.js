import {Map}from 'immutable'
import {createSelector,  createSelectorCreator, defaultMemoize} from 'reselect'
import  isDeepEqual from 'lodash/isEqual'


export function DataToEntities(data, RecordModel = Map){
    return data.reduce((acc, item)=>acc
            .set(item.id, new RecordModel(item)), new Map({}) );
}

//export class Unique{
//    static number=0;
//    static refs_Unique = null
//
//    getNumber(){
//        return this.number + 1;
//    }
//}

export const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    (r, l)=> isDeepEqual(r, l)
);