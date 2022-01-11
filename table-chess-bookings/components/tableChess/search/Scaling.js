import React, {Component} from 'react';
import Button from 'reactstrap/lib/Button';
import Label from 'reactstrap/lib/Label';
import Space from '../../common/Space'
import Icon from "../../common/Icon";

class Scaling extends Component {

    constructor(props) {
        super(props);
        this.silentState.value = this.checkValue(this.props.valueStart);
    }

    silentState = {
        value: 0
    };
    static defaultProps = {
        valueStart: 0,
        shift: 50,
        max: 100,
        min: 50
    };


    render() {
        if (this.props.value !== undefined)
            this.silentState.value = this.checkValue(this.props.value);

        return (
            <div className="row-horizontally-center">
                <Label className="m-0">Масштаб:</Label><Space/>
                <Button size='sm'
                        onClick={this.handleChangeScaling.bind(this, '+')}
                        disabled = {this.silentState.value === this.props.max}
                ><Icon name="plus"/></Button><Space/>
                <Button size='sm'
                        onClick={this.handleChangeScaling.bind(this, '-')}
                        disabled = {this.silentState.value === this.props.min}
                ><Icon name="minus"/></Button>
            </div>
        );
    }

    handleChangeScaling = (type) => {

        let buf_value = this.silentState.value;
        if (type === '+') buf_value += this.props.shift;
        if (type === '-') buf_value -= this.props.shift;

        buf_value = this.checkValue(buf_value);

        if(buf_value !== this.silentState.value) {
            this.silentState.value = buf_value;
            this.props.onChangeScaling(buf_value);
        }
    };

    checkValue(buf_value) {
        if (buf_value <= this.props.max) {
            if (buf_value < this.props.min)
                return this.props.min;

            return buf_value;
        } else return this.props.max;
    }
}

export default Scaling;