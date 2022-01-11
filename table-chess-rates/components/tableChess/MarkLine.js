import React, {Component} from 'react';
// import ToolTip from '../common/ToolTip'
import {strToDate, strToLocaleDateStr} from "../../models/utilities/date";
import GlobalWindow from "../../models/utilities/window";

class MarkLine extends Component {

    render() {
        const {rate, maxTimeCalendar, minTimeCalendar, ...other_props} = this.props;

        const nofit_start_line = minTimeCalendar > strToDate(rate.first_day);//noFitInStart
        const nofit_end_line = maxTimeCalendar < strToDate(rate.last_day);//noFitInEnd

        const is_discount =  rate.discount && (rate.discount !== '0') && (rate.discount != 0);

// TODO:edited
        return (
            <div ref={this.Elements['madeMarkLine'].ref} className="date-line cursor-pointer" {...other_props}>
                <div className="line-status" style={{marginLeft: nofit_start_line && 0, marginRight: nofit_end_line && 0}}>
                    {/*<ToolTip> //TODO: был заменен на title, т.к. требуется свой Tooltip - нужно чтобы созд внутри элемента, а не где та забортом*/}
                        <div>
                            <div className="centered-vertical">
                                <div className="text-line text-nowrap z-20"
                                    title = {"С: "    +   strToLocaleDateStr(rate.first_day)+"\n"+
                                             "ПО: "   +   strToLocaleDateStr(rate.last_day)+"\n"+
                                            (is_discount ? "Скидка: "   +   rate.discount+"\n" : '')+
                                            (is_discount ? "Цена(без скидки): "   +   rate.rate+"\n" : '')+
                                             "Цена: " +   (rate.rate - rate.discount)}
                                >
                                    {is_discount ? rate.rate+' - %' : rate.rate}
                                </div>
                            </div>
                        </div>

                        {/*<div>*/}
                            {/*<div>С: {strToLocaleDateStr(rate.first_day)}</div>*/}
                            {/*<div>ПО: {strToLocaleDateStr(rate.last_day)}</div>*/}
                            {/*<div>Цена: {rate.rate}</div>*/}
                        {/*</div>*/}
                    {/*</ToolTip>*/}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.Elements.reRender();
    }

    componentDidUpdate() {
        this.Elements.reRender();
    }

    Elements = {
        'madeMarkLine': {
            ref: React.createRef(),

            reRender: () => {
                const {rate, maxTimeCalendar, minTimeCalendar} = this.props;
                const root = this.Elements['madeMarkLine'];
                const ref = root.ref;
                const element = ref.current;

                const new_date_start = Math.max(strToDate(rate.first_day), minTimeCalendar);
                const box_date_start = GlobalWindow.getBoxById(`th-day${new_date_start}`);
                const new_end_date = Math.min(strToDate(rate.last_day), maxTimeCalendar);
                const box_date_end = GlobalWindow.getBoxById(`th-day${new_end_date}`);

                const width = box_date_end.right - box_date_start.left;
                element.style.width = width + 'px';
            }
        },

        reRender: () => {
            for (const index in this.Elements) {
                if (index !== 'reRender')
                    this.Elements[index].reRender();
            }
        }
    }

}

export default MarkLine;