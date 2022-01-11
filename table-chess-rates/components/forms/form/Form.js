import React, { Component } from 'react';
import {ReduxFormProperty} from "../../../modules/redux-form-property";
// TODO: not implementation

class FormManager extends Component {

    constructor(props){
        super(props);
        this.props.updateProperty({handleOpen: this.handleOpen});
        this.state = {
            type: null,
            payload: null
        };
    }

    render() {
        const {type, payload} = this.state;
        const {children} = this.props;

        if(!type) return null;

        let tag = null;

        if(children[0])
            for(const index in children){
                if(children[index].props.type === type){
                    tag = children[index];
                }
            }
        else{
            if(children.props.type === type){
                tag = children
            }
        }

        return (
            <div >
                {tag}
            </div>
        );
    }

    handleOpen=(type, payload)=>{
        this.setState({type, payload})
    }
}

export default ReduxFormProperty({
    handleOpen: null
})(FormManager, 'FormManager');