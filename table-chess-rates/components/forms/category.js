import React, {Component} from 'react';
import Button from 'reactstrap/lib/Button'
import Modal from 'reactstrap/lib/Modal'
import ModalHeader from 'reactstrap/lib/ModalHeader'
import ModalBody from 'reactstrap/lib/ModalBody'
import ModalFooter from 'reactstrap/lib/ModalFooter'
import Form from 'reactstrap/lib/Form'
import FormGroup from 'reactstrap/lib/FormGroup'
import ControlLabel from 'reactstrap/lib/Label'
import FormControl from 'reactstrap/lib/Input'
import FieldGroup, {required} from '../common/FieldGroup';
import Space from "../common/Space";
import FormText from "reactstrap/lib/FormText";


export const FORM_EDITOR_NEW_CATEGORY = 'FORM_EDITOR_NEW_CATEGORY';
export const FORM_EDITOR_EDIT_CATEGORY = 'FORM_EDITOR_EDIT_CATEGORY';

class FormCategory extends Component {
    constructor(props) {
        super(props);

        this.NamesField = {
            NameCategory: "NameCategory",
            AmountNumber: "Amount",
            CopyPrevious: "CopyPrevious",
            CopyPreviousOnlyPeriods:"CopyPreviousOnlyPeriods",
        };

        this.state = {
            forceValid: false,
            ctg_id: this.props.payload.id,
            values: {
                [this.NamesField.NameCategory]: this.props.payload.ctg_name || ' ',
                [this.NamesField.AmountNumber]: this.props.payload.rms_amt || '0',
                [this.NamesField.CopyPreviousOnlyPeriods]: true,
                [this.NamesField.CopyPrevious]: false,
            },
        };
    }

    static defaultProps = {
        visible: false,
        title: 'Добавить новую категорию',
        type: null,
        payload: null,
        onClose: null,
        onClickSubmit: null,
        onClickDelete: null,
        onChangeFields: null,
        updatePage: null,
    };

    render() {

        const {
            visible,
            onClose,
            title,
            type
        } = this.props;

        return (
            <Modal isOpen={visible} toggle={onClose} autoFocus={false}>
                <ModalHeader toggle={onClose}>
                    {title}
                </ModalHeader>
                <ModalBody>
                    <Form onKeyPress={this.handleSubmit}>
                        {this.itemsFields()}
                    </Form>
                    <FormText>* Обязательные поля</FormText>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-primary" onClick={this.handleSubmit}>Сохранить</Button><Space/>
                    {type===FORM_EDITOR_EDIT_CATEGORY && <Button className="btn-danger" onClick={this.handleDelete}>Отключить категорию</Button>}<Space/>
                    <Button onClick={onClose}>Закрыть</Button>
                </ModalFooter>
            </Modal>
        );
    }

    handleSubmit = (sender) => {
        if (!sender.which || (sender.which === 13)) {
            const {values} = this.state;
            const {NameCategory, AmountNumber, CopyPrevious} = this.NamesField;
            if (!sender.which || (sender.which === 13)) {
                if (required(values[NameCategory]) /*||
                    required(values[AmountNumber])*/)
                    this.setState({forceValid: true});
                else
                    this.props.onClickSubmit({
                            ctg_id: this.state.ctg_id,
                            ctg_name: this.state.values[NameCategory],
                            rms_amt: this.state.values[AmountNumber],
                            copy_rates_only_periods: this.state.values.CopyPreviousOnlyPeriods,
                            copy_rates: this.state.values[CopyPrevious],
                        },
                        () => {
                            this.props.updatePage();
                            this.props.onClose();
                        }
                    );
            }
            sender.preventDefault();
        }
    };

    handleDelete=()=>{
        this.props.onClickDelete({ctg_id: this.state.ctg_id},
            () => {
                this.props.updatePage();
                this.props.onClose();
            }
        );
    };

    handleChange = (name_field, sender) => {
        let value = sender.target.value;

        if (sender.target.type === 'checkbox')
            value = sender.target.checked;

        this.props.onChangeFields && this.props.onChangeFields(name_field, value);
        this.setState({
            values: {
                ...this.state.values,
                [name_field]: value
            }
        });

    };

    itemsFields() {
        const NamesField = this.NamesField;
        const {type} = this.props;

        let check_box_copyprevious;
        let check_box_copyprevious_only_periods;
        if (type === FORM_EDITOR_NEW_CATEGORY) {
            check_box_copyprevious_only_periods = this.itemCheckBox(NamesField.CopyPreviousOnlyPeriods, "Скопировать периоды из предыдущей категории");
            check_box_copyprevious = this.itemCheckBox(NamesField.CopyPrevious, "Скопировать цены из предыдущей категории");
        }

        /*{this.itemFieldNumber(NamesField.AmountNumber, "Количество номеров *", [required])}*/
        return (
            <div>
                {this.itemField(NamesField.NameCategory, "Название категории *", [required])}
                {check_box_copyprevious_only_periods}
                {check_box_copyprevious}
            </div>
        )
    }

    itemField(name_component, label, validations, textUnderInput) {
        return <FieldGroup
            value={this.state.values[name_component]}
            label={label}
            onChange={this.handleChange.bind(this, name_component)}
            validations={validations}
            forceValid={this.state.forceValid}
            textUnderInput={textUnderInput}
            autoFocus={true}
        />
    }

    itemFieldNumber(name_component, label, validations, textUnderInput) {
        return <FieldGroup
            value={this.state.values[name_component]}
            validations={validations}
            forceValid={this.state.forceValid}
            label={label}
            type='mask-number'
            max={50}
            min={1}
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

    itemRadioBox(name_component, label, group_name) {
        return (
            <FormGroup check>
                <ControlLabel check>
                    <FormControl
                        checked={this.state.values[name_component]}
                        onChange={this.handleChange.bind(this, name_component)}
                        type="radio"
                        name={group_name}
                        value="dffgdf"
                    />
                    {label}
                </ControlLabel>
            </FormGroup>
        );
    }
}

export default FormCategory;