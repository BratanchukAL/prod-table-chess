import React, {Component} from 'react';
import Button from 'reactstrap/lib/Button'
import Modal from 'reactstrap/lib/Modal'
import ModalHeader from 'reactstrap/lib/ModalHeader'
import ModalBody from 'reactstrap/lib/ModalBody'
import ModalFooter from 'reactstrap/lib/ModalFooter'
import Form from 'reactstrap/lib/Form'
import DatePicker from 'react-date-picker'
import FieldGroup, {required} from '../common/FieldGroup';
import Space from "../common/Space";
import FormText from "reactstrap/lib/FormText";

/*
* in props ={
*  visible,
*  title,
* buttonSubmitCaption,
*  onClickSubmit,
*  onClose,
*  date_start,
*  date_end,
*  maxDate,
*  minDate,
*  onChangeDatePicker
*   }
* */
class Body extends Component {

    static defaultProps={
        onClickSubmit:null
    };

    constructor(props) {
        super(props);
        this.NameComponent = "FormEditor.Body.";
        this.NamesField = {
            DownCategory: this.NameComponent + "DownCategory",
            Rate: this.NameComponent + "Rate",
            Discount: this.NameComponent + "Discount",
        };

        this.state = {
            values: {
                [this.NamesField.DownCategory]: null,
                [this.NamesField.Rate]: " ",
                [this.NamesField.Discount]: " "
            },
        };
    }

    componentDidMount() {
        const {onThis} = this.props;
        onThis(this);
    }

    handleChange = (name_field, sender) => {
        const value = sender.target.value;
        let buf_value = value;
        this.props.onChangeFields(name_field, buf_value);

        this.setState({
            forceValid: false,
            values: {
                ...this.state.values,
                [name_field]: value
            }
        });

    };

    /*
    * get valuesField
    * return:{
    *      rate:
    *      category_id:
    * }
    * */
    get valuesField() {
        return {
            rate: this.state.values[this.NamesField.Rate],
            discount: this.state.values[this.NamesField.Discount],
            category_id: this.state.values[this.NamesField.DownCategory],
        };
    }

    /*
  * set valuesField
  * in param:{
  *      rate:
  *      category_id:
  * }
  * */
    set valuesField(param) {
        this.setState({
            values: {
                [this.NamesField.Rate]: param.rate > 100 ? param.rate: '',
                [this.NamesField.Discount]: param.discount,
                [this.NamesField.DownCategory]: param.category_id
            }
        });
    }

    render() {
        const {
            visible,
            title,
            buttonSubmitCaption,
            onClickDelete,
            onClose,
            date_start,
            date_end,
            maxDate,
            minDate,
            onChangeDatePicker,
            enabledDatePicker,
        } = this.props;


        return (
            <div>
                <Modal isOpen={visible} toggle={onClose} autoFocus={false}>
                    <ModalHeader toggle={onClose}>
                        {title}
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group is-in-line">
                            <label>С</label>
                            <DatePicker value={date_start} maxDate={maxDate}
                                        onChange={onChangeDatePicker.bind(this, 'date_start')} disabled={!enabledDatePicker}/>
                            <label>ПО</label>
                            <DatePicker value={date_end} minDate={minDate}
                                        onChange={onChangeDatePicker.bind(this, 'date_end')} disabled={!enabledDatePicker}/>
                        </div>
                        <Form onKeyPress={this.handleSubmit}>
                            {this.itemsFields()}
                        </Form>
                        <FormText>* Обязательные поля</FormText>
                    </ModalBody>
                    <ModalFooter>
                        <div style={{width: '100%'}}>
                            <Button color="primary" onClick={this.handleSubmit}>{buttonSubmitCaption}</Button><Space/>
                            <Button onClick={onClose}>Закрыть</Button>
                        </div>
                        <div>
                            {onClickDelete && <Button color="danger" onClick={onClickDelete}>Удалить</Button>}
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    handleSubmit = (sender) => {
        const {values}=this.state;
        const {Rate} = this.NamesField;
        if (!sender.which || (sender.which === 13)) {
            if(required(values[Rate]))
                this.setState({forceValid: true});
            else
                this.props.onClickSubmit();
            sender.preventDefault();
        }
    };

    itemsFields() {
        const NamesField = this.NamesField;

        return (
            <div>
                {this.itemFieldNumber(NamesField.Rate, "Цена *", [required], null, true)}
                {this.itemFieldNumber(NamesField.Discount, "Скидка",[], 'Например: 100')}
            </div>
        )
    }

    itemField(name_component, label, validations, textUnderInput) {
        return <FieldGroup
            value={this.state.values[name_component]}
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
            validations = {validations}
            forceValid = {this.state.forceValid}
            textUnderInput={textUnderInput}
        />
    }

    itemFieldNumber(name_component, label, validations, textUnderInput, autofocus=false) {
        return <FieldGroup
            value={this.state.values[name_component]}
            validations = {validations}
            forceValid = {this.state.forceValid}
            label={label}
            type='mask-number'
            min="0"
            max="1000000"
            onChange={this.handleChange.bind(this, name_component)}
            textUnderInput={textUnderInput}
            autoFocus={autofocus}
        />

    }

    itemFieldTextArea(name_component, label) {
        return <FieldGroup
            type="textarea"
            value={this.state.values[name_component]}
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
        />
    }

    itemFieldSelect(name_component, label, tagOption) {
        return <FieldGroup
            type="select"
            value={this.state.values[name_component]}
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
        >
            {tagOption}
        </FieldGroup>
    }
}

export default Body;