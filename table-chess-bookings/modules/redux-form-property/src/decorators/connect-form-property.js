import React from 'react';
import {connect} from 'react-redux'
import {factoryPropertyByNamesFormsSelector} from '../reducer'


 const WrappedFormProperty = (TCommponent, propWhiteList)=>
 class WrappedFormProperty extends React.Component{

    render(){
         //console.log('WrappedConnectFormProperty render' );//TODO: debug
        if(this.props.doVisible)
            return <TCommponent {...this.props} propWhiteList = {propWhiteList}/>;
        else
            return null;
    }
};


export const ConnectFormProperty = (connectNamesForm)=>(TCommponent, wait_all_property = false) =>{

    const  propertyByNamesFormsSelector = factoryPropertyByNamesFormsSelector();

    return connect( states=>{

        const arrayConnectProperty = propertyByNamesFormsSelector(states, connectNamesForm);
        let doVisible = true;
        if(!arrayConnectProperty){doVisible = !wait_all_property;}

        return {
            connectedProperty: arrayConnectProperty,
            doVisible
        };
    })
    (WrappedFormProperty(TCommponent, connectNamesForm));
};
