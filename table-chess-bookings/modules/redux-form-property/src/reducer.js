import {Map, Record} from 'immutable'
import {DataToEntities, createDeepEqualSelector} from './utils'
import {createSelector} from 'reselect'


/**
 * Constants
 **/
export const moduleName = 'redux_form_property';
const prefix = `my/modules/${moduleName}`;

const REGISTER_NEW_FORM = `${prefix}/REGISTER_NEW_FORM`;
const UPDATE_PROPERTY_OF_FORM = `${prefix}/UPDATE_PROPERTY_OF_FORM`;

/**
 * Selectors
 **/
export const stateSelector = states=> states[moduleName];
const entitiesSelector = createSelector(stateSelector, state=> state.entities);

    const getNameForm = (_, name_form)=> name_form;
    const entityByNameFormSelector = createSelector(entitiesSelector, getNameForm,
    (entities, name)=> entities.find((el)=> el.id === name));
export const factoryPropertySelector = ()=> createDeepEqualSelector(entityByNameFormSelector, (entity)=> {
    return entity && entity.property;
});

    const getArrayNameForm = (_, arrayNameForm)=> arrayNameForm;
    const entitiesByNamesFormsSelector = createSelector(entitiesSelector, getArrayNameForm,
    (entities, names)=> entities.filter((form)=> {
        for(let name in names){
            if(name === form.id) return true;
        }
        return false;
    } ));
export const factoryPropertyByNamesFormsSelector = ()=>
    createDeepEqualSelector(entitiesByNamesFormsSelector, getArrayNameForm, (entities, names)=>{

        const arrayConnectProperty = {};
        for(let name_form in names){
            const formRecord = entities.get(name_form);
            const prop = formRecord && formRecord.property;
            if(!prop){return null;}

            arrayConnectProperty[name_form] = prop;
        }

        return arrayConnectProperty;
    });

/**
 * Reducer
 * */
const ReducerRecord = Record({
    entities: new Map({})
});

const FormRecord = Record({
    id:null,
    property: null
});

export function reducer(state = new ReducerRecord(), action){
    const {type, payload}=action;

    switch(type){
        case REGISTER_NEW_FORM: return state
                    .mergeIn(['entities'], DataToEntities(payload, FormRecord));

        case UPDATE_PROPERTY_OF_FORM: return state
                    .mergeIn(['entities', payload.NameForm, 'property'], {
                        ...state.getIn(['entities', payload.NameForm, 'property']),
                        ...payload.Property
                    });

        default: return state;
    }
}

/**
 * Actions
 **/
export function registerNewForm(name, property){
    return {
        type: REGISTER_NEW_FORM,
        payload:[{property, id:name}]
    };
}

export function updatePropertyOfForm({NameForm, Property}){
    return {
        type: UPDATE_PROPERTY_OF_FORM,
        payload:{NameForm, Property}
    };
}




