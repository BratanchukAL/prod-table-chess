import React, {PureComponent} from 'react';
import Scaling from './Scaling'
import DatePicker from './DatePicker'
import Label from 'reactstrap/lib/Label';
import Button from 'reactstrap/lib/Button';
import Space from '../../common/Space';
import Icon from "../../common/Icon";
import {limitExecByInterval} from "../../../models/utilities/performance";


class PanelSearch extends PureComponent {

    constructor(props) {
        super(props);

        this.SelectPeriod = props.variants_periods;

        this.state = {
            downPanel: {
                right: false,
            }
        };
    }

    Elements = {
        'down-panel':{
            ref: React.createRef(),
        }
    };

    SelectPeriod = null;

    TableScroll = null;

    render() {
        //console.log('PanelSearch render'); //TODO: debug
        const {day_shift_index, date_start, date_end, scale} = this.props;
        const {children} = this.props;
        const tag_table_chess = React.cloneElement(children, {
            onChangeScroll: this.handleScrollTable,
            date_start,
            date_end,
            scale,
            refDownPanel: this.Elements['down-panel'].ref,
        });

        return (
            <div>
                <div className="table-chess-rates_panel">
                    <div className="table-chess-rates_panel">
                        <Scaling onChangeScaling={this.handleChangeScaling}
                                 value={scale}
                                 min={50}
                                 max={100}
                        />
                    </div>

                    <div className="table-chess-rates_panel">
                        <DatePicker onClickSubmit={this.handleClickSubmitDatePicker}
                                    setThis={this.getThisDatePicker}
                                    dateStart = {date_start}
                        />
                        <Space/>
                        <Button size='sm' onClick={this.handleClickScrollPanel.bind(this, 'left14')}
                                title="назад на 14 дней"
                        >
                            <Icon name="chevron-left" repeat="2"/>
                        </Button><Space/>
                        <Button size='sm' onClick={this.handleClickScrollPanel.bind(this, 'left7')}
                                title="назад на 7 дней"
                        >
                            <Icon name="chevron-left"/>
                        </Button><Space/>
                        <Button size='sm' onClick={this.handleClickScrollPanel.bind(this, 'right7')}
                                title="вперёд на 7 дней"
                        >
                            <Icon name="chevron-right"/>
                        </Button><Space/>
                        <Button size='sm' onClick={this.handleClickScrollPanel.bind(this, 'right14')}
                                title="вперёд на 14 дней"
                        >
                            <Icon name="chevron-right" repeat="2"/>
                        </Button>
                    </div>

                    <div className="table-chess-rates_panel">
                        <Label className="m-0 row-horizontally-center">период:</Label><Space />
                        <select value={day_shift_index} onChange={this.handleClickSelectPeriod} size="1">
                            <option disabled>Установите период</option>
                            <option value={2}>60 дней</option>
                            <option value={3}>90 дней</option>
                            <option value={4}>120 дней</option>
                            <option value={5}>150 дней</option>
                            <option value={6}>180 дней</option>
                            <option value={7}>365 дней</option>
                        </select>
                    </div>
                </div>
                {tag_table_chess}
                <div ref={this.Elements['down-panel'].ref}
                     className="table-chess-rates_panel">
                    <Button
                        onClick={this.handleClickScrollPanel.bind(this, 'left30')}
                        title="назад на 30 дней"
                        size='sm'
                    >
                        <Icon name="chevron-left" repeat="3"/>
                    </Button>
                    <Button disabled={!this.state.downPanel.right}
                            onClick={this.handleClickScrollPanel.bind(this, 'right30')}
                            title="вперёд на 30 дней"
                            size='sm'
                    >
                        <Icon name="chevron-right" repeat="3"/>
                    </Button>
                </div>
            </div>
        );
    }

    componentDidUpdate(){
        if(this.state.downPanel.right){
            this.TableScroll.scrollTo(this.TableScroll.scrollWidth, this.TableScroll.scrollTop);
        }
    }

    componentDatePicker = null;
    getThisDatePicker = (call) => {
        this.componentDatePicker = call
    };

    handleClickSubmitDatePicker = (date) => {
        const date_start = date;
        const {onClickSubmit} = this.props;

        onClickSubmit({date_start})
    };

    handleClickSelectPeriod = async (event) => {
        const {onClickSubmit} = this.props;
        onClickSubmit({day_shift_index: Number(event.target.value)})
    };

    handleClickScrollPanel = async (type) => {
        const _this = this;

        async function shifting_table(days) {
            const date = new Date(_this.componentDatePicker.state.date);
            date.setDate(date.getDate() + days);
            await _this.componentDatePicker.handleChangeDatePicker(date);
        }

        switch (type) {
            case 'left30':
                const date = new Date(this.componentDatePicker.state.date);
                if (date.getDate() > 1) {
                    date.setDate(1);
                } else {
                    date.setMonth(date.getMonth() - 1);
                }
                await this.componentDatePicker.handleChangeDatePicker(date);
                break;
            case 'right30':
                if (this.props.day_shift_index < (this.SelectPeriod.length - 1)) {
                    const next_index = this.props.day_shift_index + 1;
                    await this.handleClickSelectPeriod({target: {value: next_index}});
                } else {
                    const date = new Date(this.componentDatePicker.state.date);
                    if (date.getDate() > 1) {
                        date.setDate(1);
                        date.setMonth(date.getMonth() + 1);
                    } else {
                        date.setMonth(date.getMonth() + 1);
                    }
                    await this.componentDatePicker.handleChangeDatePicker(date);
                }
                break;
            case 'left14':
                await shifting_table(-14);
                break;
            case 'right14':
                await shifting_table(+14);
                break;
            case 'left7':
                await shifting_table(-7);
                break;
            case 'right7':
                await shifting_table(+7);
                break;
        }
    };

    handleScrollTable = limitExecByInterval((target) => {
        this.TableScroll = target;
        if ((target.scrollLeft + 2) >= target.scrollWidth - target.clientWidth) {
            this.setState({
                downPanel: {
                    ...this.state.downPanel,
                    right: true
                }
            })
        } else {
            this.setState({
                downPanel: {
                    ...this.state.downPanel,
                    right: false
                }
            })
        }
    });

    handleChangeScaling = (scaling) => {
        const {onClickSubmit} = this.props;
        onClickSubmit({scale: scaling})
    };
}

export default PanelSearch;