/*redux-form-property Version 0.4.2*/
import {reducer as _reducer,
        moduleName as _moduleName,
        factoryPropertySelector,
        updatePropertyOfForm
} from './src/reducer'
import {ReduxFormProperty as _ReduxFormProperty} from './src/decorators/redux-form-property'
import {ConnectFormProperty as _ConnectFormProperty} from './src/decorators/connect-form-property'
import Connect from './src/classes/Connect'

/*
 * reducer - paste in combineReducer ({...getReducer()})
 */
export function getReducer(){
    return {[_moduleName]: _reducer};
}

/* Decorator for react of components. Create properties form
 *
 * (<property>)=>(TCommponent, nameForm) =>
 * property = {name: values}
 *
 * result:  property of form access in this.props.property, and accessed this.props.updateProperty({nameProperty: value, ...})
 */
export const ReduxFormProperty = _ReduxFormProperty;

/* Decorator for react of components. Create hear of form. Form registered in reducer  ('FormPropertyReducer')
 *
 * (connectNamesForm)=>(TCommponent, wait_all_property = false)=>
 * connectNameForms = {'NAME_FORMS': <propWhiteList> or {}(not recommended, to be white or black)}
 * propWhiteList = {'prop':true, 'prop1':false} - Monitors changes, behavior how state, and accessed all property of form.
 *
 *  result: properties of forms access in this.props.connectedProperty['NAME_FORM'], not access update property other forms
 */
export const ConnectFormProperty = _ConnectFormProperty;

/*
 * Class meets the <propWhiteList>. Paste in extends where decorator ConnectFormProperty
 */
export const TConnect = Connect;

export const VISIBLE_WHEN_ALL_PROP_ACCESS = true;
export const TRACK_PROP = true;
export const NOTRACK_PROP =false;
/*TODO:
 *
 *
 * */

/*
* For Communication between reducers
* */
/*
* in (state, nameForm)
* */
export const formPropertySelector = factoryPropertySelector();
/*
* {NameForm, Property}
* */
export const actionUpdatePropertyOfForm = updatePropertyOfForm;