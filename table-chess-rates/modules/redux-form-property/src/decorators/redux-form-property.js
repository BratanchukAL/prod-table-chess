import React from 'react';
import {connect} from 'react-redux'
import {registerNewForm, updatePropertyOfForm, factoryPropertySelector} from '../reducer'

const WrappedFormProperty = (TCommponent, nameForm, property)=>
class WrappedFormProperty extends React.Component{

    constructor(props){
        super(props);
        this.props.registerNewForm(nameForm, property);
    }

    updateProperty= (params)=>{
        this.props.updatePropertyOfForm({
            NameForm: nameForm,
            Property: params
        });
    };

    render(){
        if(this.props.doVisible)
            return <TCommponent {...this.props}
                updateProperty={this.updateProperty}

                registerNewForm={undefined}
                updatePropertyOfForm={undefined}
            />;
        else
            return null;
    }
};


export const ReduxFormProperty = (property)=>(TCommponent, nameForm) =>{

    const  propertySelector = factoryPropertySelector();

    return connect( (states)=>{
            const prop = propertySelector(states, nameForm);
            let doVisible = true;

            if(!prop) doVisible = false;

            return {
                property: prop,
                doVisible
            };
        },
        {registerNewForm, updatePropertyOfForm})
        (WrappedFormProperty(TCommponent, nameForm, property));
};