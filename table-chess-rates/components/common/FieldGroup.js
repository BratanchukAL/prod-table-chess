import React, { Component } from 'react';
import FormGroup from 'reactstrap/lib/FormGroup'
import ControlLabel from 'reactstrap/lib/Label'
import FormControl from 'reactstrap/lib/Input'
import FormFeedback from 'reactstrap/lib/FormFeedback'
import FormText from 'reactstrap/lib/FormText'
import Masks from '../../models/utilities/masks'


/*
*  props ={ label="Text"
*           validationState="warning"
*           validations = [funcValid]
*           textValid, textInvalid, textUnderInput
*           ...props = {
*               type="text",
*               placeholder="Enter text",
*               value="",
*               onChange={},
*               .....
*           }
*         }
* */
class FieldGroup extends Component {

    state = {
        isFocused: false,
    };

    render() {
        const {label, validations, textUnderInput, forceValid, ...props} = this.props;

        let value = props.value;

        if(props.type === 'mask-telephone')
            value =  Masks.telephone(value).value;

        let tag_form_control;

        let text_invalid;
        let check_valid;
        if(validations && validations.length && (this.state.isFocused || forceValid)) {
            check_valid=false;
            for(let index in validations){
                text_invalid = validations[index](value);
                if(text_invalid){
                    check_valid=true;
                    break;
                }
            }
        }

        if (!check_valid && check_valid!==false) {
            tag_form_control = [<FormControl key='1' {...props} value={value}
                                            onBlur={this.handleBlur}
                                            onChange={this.handleChange}/>];
        }
        else {
            tag_form_control = [
                <FormControl key='1' {...props} value={value}
                             onBlur = {this.handleBlur}
                             onChange={this.handleChange}  invalid={check_valid} valid={!check_valid}/>,
                text_invalid && <FormFeedback key='2' invalid="true">{text_invalid}</FormFeedback>
            ];
        }

        return (
            <FormGroup>
                <ControlLabel>{label}</ControlLabel>
                {tag_form_control}
                {textUnderInput && <FormText>{textUnderInput}</FormText>}
            </FormGroup>
        );
    }

    handleChange = (sender)=>{
        const {type, max, min} = this.props;

        if(type === 'mask-number')
            sender.target.value = Masks.number(sender.target.value, max, min).value;

        if(type === 'mask-telephone')
            sender.target.value =  Masks.telephone(sender.target.value).unmaskedValue;

        this.props.onChange(sender);
    };

    handleBlur= ()=>{
        const {validations} = this.props;

        if(validations && validations.length && !this.state.isFocused)
            this.setState({isFocused: true})
    };
}


export const required = function(value){
    if((value === null || value === undefined) || !value.toString().trim().length)
        return  'поле не должно быть пустое';

    return null;
};

export default FieldGroup;