import React, {Component} from 'react';
import Button from 'reactstrap/lib/Button'
import Modal from 'reactstrap/lib/Modal'
import ModalHeader from 'reactstrap/lib/ModalHeader'
import ModalBody from 'reactstrap/lib/ModalBody'
import ModalFooter from 'reactstrap/lib/ModalFooter'
import DatePicker from 'react-date-picker'
import Form from 'reactstrap/lib/Form'
import FormGroup from 'reactstrap/lib/FormGroup'
import ControlLabel from 'reactstrap/lib/Label'
import FormControl from 'reactstrap/lib/Input'
import FormText from 'reactstrap/lib/FormText'
import FieldGroup, {required} from '../common/FieldGroup';
import {NEW_BOOKING} from './index'
import Space from '../common/Space'
import ButtonLoader from "../common/ButtonLoader";

class BodyNewBooking extends Component {

    constructor(props) {
        super(props);

        this.NamesField = {
            NameClient:  "NameClient",
            Telephone:  "Telephone",
            Email:  "Email",
            Cost:  "Cost",
            DownNumber:  "DownNumber",
            DownStatus: 'DownStatus',
            Comment: "Comment",
            SendMail: "SendMail",
        };

        this.state = {
            isChanged: false,
            values: {
                [this.NamesField.NameClient]: "",
                [this.NamesField.Telephone]: "",
                [this.NamesField.Email]: "",
                [this.NamesField.Comment]: "",
                [this.NamesField.DownNumber]: "0",
                [this.NamesField.DownStatus]: this.props.statuses['default'],
                [this.NamesField.Cost]: "Узнаем стоимость. Пожалуйста, подождите....",
                [this.NamesField.SendMail]: false
            },
            [this.NamesField.SendMail]:{
                visible: false
            },

            [this.NamesField.Email]:{
                validate: {
                    enabled: false,
                    composite: [required]
                },
            },
        };
    }

    componentDidMount() {
        const {onThis} = this.props;
        onThis(this);
    }

    handleChange = (name_field, sender) => {
        let value = sender.target.value;
        let buf_value = value;
        const {DownNumber, DownStatus, SendMail} = this.NamesField;

        if (sender.target.type === 'checkbox')
            value = sender.target.checked;

        if (DownNumber === name_field)
            buf_value = JSON.parse(buf_value);

        if (DownStatus === name_field)
            this.handleChangeStatuses(value);

        if (SendMail === name_field)
            this.handleChangeSendMail(value);

        this.props.onChangeFields(name_field, buf_value);

        this.setState({
            isChanged: true,
            values: {
                ...this.state.values,
                [name_field]: value
            }
        });

    };

    set Cost(value) {
        this.setState({
            values: {
                ...this.state.values,
                [this.NamesField.Cost]: value
            }
        });
    }

    /*
    * get valuesField
    * return:{
    *       name_client:,
    *       telephone: ,
    *       email: ,
    *       cost: ,
    *       comment:
    *       down_number
    * }
    * */
    get valuesField() {
        const cat_and_number = JSON.parse(this.state.values[this.NamesField.DownNumber]);
        return {
            name_client: this.state.values[this.NamesField.NameClient],
            telephone: this.state.values[this.NamesField.Telephone],
            email: this.state.values[this.NamesField.Email],
            cost: this.state.values[this.NamesField.Cost],
            comment: this.state.values[this.NamesField.Comment],
            send_mail: this.state.values[this.NamesField.SendMail],
            status: this.state.values[this.NamesField.DownStatus],
            category_id: cat_and_number.category_id,
            room_id: cat_and_number.room_id,
        };
    }

    /*
  * set valuesField
  * in param:{
  *       name_client:,
  *       telephone: ,
  *       email: ,
  *       cost: ,
  *       comment:
  *       category_id
  *       room_id
  * }
  * */
    set valuesField(param) {
        const params_field_number = JSON.stringify({category_id: param.category_id, room_id: param.room_id});
        this.setState({
            values: {
                ...this.state.values,
                [this.NamesField.NameClient]: param.name_client,
                [this.NamesField.Telephone]: param.telephone,
                [this.NamesField.Email]: param.email,
                [this.NamesField.Cost]: param.cost,
                [this.NamesField.Comment]: param.comment,
                [this.NamesField.DownNumber]: params_field_number,
                [this.NamesField.DownStatus]: param.status,
            }
        });
    }

    render() {
        console.log('BodyBooking render'); //TODO: debug
        const {
            visible,
            title,
            buttonSubmitCaption,
            onClickCalc,
            onClickSubmit,
            onClickDelete,
            onClose,
            isWarningCost,
            date_start,
            date_end,
            maxDate,
            minDate,
            onChangeDatePicker,
            isLoading,
        } = this.props;

        return (
            <div>
                <Modal isOpen={visible} toggle={onClose}>
                    <ModalHeader toggle={onClose}>
                        {title}
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group is-in-line">
                            <label>ЗАЕЗД</label><Space/>
                            <DatePicker value={date_start} maxDate={maxDate}
                                        onChange={onChangeDatePicker.bind(this, 'date_start')}/>
                            <label>ВЫЕЗД</label><Space/>
                            <DatePicker value={date_end} minDate={minDate}
                                        onChange={onChangeDatePicker.bind(this, 'date_end')}/>
                        </div>

                        <Form onKeyPress={this.handleSubmit}>
                            {this.itemsFileds(isWarningCost)}
                        </Form>
                        <FormText>* Обязательные поля</FormText>
                    </ModalBody>
                    <ModalFooter>
                        {onClickCalc &&
                        <ButtonLoader actionFetch={onClickCalc}>Пересчитать</ButtonLoader>}<Space/>
                        <Button disabled={isLoading} onClick={this.handleSubmit}>{buttonSubmitCaption}</Button><Space/>
                        {onClickDelete && <Button onClick={onClickDelete}>Удалить</Button>}<Space/>
                        <Button onClick={onClose}>Закрыть</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    handleSubmit = (sender) => {
        const {values}=this.state;
        const {NameClient, Telephone, Cost, Email} = this.NamesField;
        if (!sender.which || (sender.which === 13)) {
            if(required(values[NameClient]) ||
                required(values[Telephone])||
                required(values[Cost]) ||
                (this.state[Email].validate.enabled && required(values[Email]))
            )
                this.setState({forceValid: true});
            else
                this.props.onClickSubmit();
        }
    };

    handleChangeStatuses = (value)=>{
        const {type} = this.props;
        const {SendMail} = this.NamesField;

        if(type !== NEW_BOOKING) {
            let visible = false;

            if (value === '3') //Confirmed
                visible = true;

            this.setState({
                [SendMail]: {
                    ...this.state[SendMail],
                    visible
                }
            });
        }
    };

    handleChangeSendMail = (value) =>{
        const {Email} = this.NamesField;
        this.setState({
            [Email]: {
                ...this.state[Email],
                validate:{
                    ...this.state[Email].validate,
                    enabled: value
                }
            }
        });
    };

    itemsFileds(isWarningCost) {
        const NamesField = this.NamesField;
        const {categoriesNumbers, statuses, type} = this.props;

        const tag_cat_number = categoriesNumbers.map((category) => {
            return category.rooms.map((room, index) => {
                const params = JSON.stringify({category_id: category.id, room_id: room.id});
                if (index === 0)
                    return [
                        <option key={category.id} disabled> {category.ctg_name} </option>,
                        <option key={room.id} value={params}> {room.name} </option>
                    ];
                else //why index. easy find category
                    return <option key={room.id} value={params}> {room.name} </option>
            });
        });

        let tag_statuses=[];
        for(const index in statuses)
            tag_statuses[index]= <option key={index} value={index}> {statuses[index]} </option>;

        let tag_send_mail = null;
        if (type === NEW_BOOKING || this.state[NamesField.SendMail].visible) {
            tag_send_mail = this.itemCheckBox(NamesField.SendMail, "Отправить уведомление гостю");
        }

        const stateRequiredEmail = this.state[NamesField.Email].validate;

        return (
            <div>
                {this.itemFieldSelect(NamesField.DownNumber, "Номер", tag_cat_number)}
                {this.itemField(NamesField.NameClient, "Имя гостя *", [required])}
                {this.itemFieldTelephone(NamesField.Telephone, "Телефон *", [required])}
                {this.itemFieldMail(NamesField.Email, "Email",
                    stateRequiredEmail.enabled ? stateRequiredEmail.composite : []
                )}
                {this.itemFieldNumber(NamesField.Cost, "Общая стоимость *", [required])}
                {this.itemFieldSelect(NamesField.DownStatus, "Статус", tag_statuses)}
                {this.itemFieldTextArea(NamesField.Comment, "Комментарий")}

                {tag_send_mail}
            </div>
        )
    }

    itemField(name_component, label, validations, textUnderInput) {
        return <FieldGroup
            value={this.state.values[name_component]}
            validations = {validations}
            forceValid = {this.state.forceValid}
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
            textUnderInput={textUnderInput}
        />
    }

    itemFieldNumber(name_component, label, validations, textUnderInput) {
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
        />
    }

    itemFieldMail(name_component, label, validations, textUnderInput) {
        return <FieldGroup
            value={this.state.values[name_component]}
            validations = {validations}
            forceValid = {this.state.forceValid}
            type="email"
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
            textUnderInput={textUnderInput}
        />
    }

    itemFieldTelephone(name_component, label, validations, textUnderInput) {
        return <FieldGroup
            value={this.state.values[name_component]}
            validations = {validations}
            forceValid = {this.state.forceValid}
            type="mask-telephone"
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
            textUnderInput={textUnderInput}
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

    itemCheckBox(name_component, label) {
        return (
            <FormGroup check>
                <ControlLabel check>
                    <FormControl
                        checked={this.state.values[name_component]}
                        onChange={this.handleChange.bind(this, name_component)}
                        type="checkbox"
                    />
                    {label}
                </ControlLabel>
            </FormGroup>
        );
    }
}

export default BodyNewBooking;