import React, {Component} from 'react';
import Space from "../common/Space";
import LineToday from "./trifles/LineToday";


class Head extends Component {
    render() {
        console.log('Head'); //TODO: debug
        const {calendar, isClone, refFirstColumn, refEndTable} = this.props;

        const tag_field_month = calendar.months.map((el) => {
            return <th key={el.key} colSpan={el.count} className="text-nowrap">{el.data}</th>;
        });

        const tag_field_weekday = calendar.weekdays.map((el, index) => {
            let style_class = "";
            const isToday = calendar.days[index].isToday;

            if(el.isDayOff)
                style_class = style_class + ' day-off';
            if(isToday)
                style_class = style_class + ' today';

            return <th key={el.key} className={style_class}>
                    {el.data}
                </th>;
        });

        const tag_field_day = calendar.days.map((el, index) => {
            let style_class = "th-day";
            const isToday = el.isToday;

            if(calendar.weekdays[index].isDayOff)
                style_class = style_class + ' day-off';
            if(isToday)
                style_class = style_class + ' today';

            return <th id={`th-day${el.key}`} className={style_class} key={el.key}>
                    {el.data}
                    {(isToday && !isClone) &&
                        <LineToday time={el.key} refEndTable = {refEndTable}/>
                    }
                </th>;

        });

        const styleForNoClone = isClone ? "th-number text-in-shadow":"th-number text-float";
        return (
            <thead>
                <tr>
                    <th ref={refFirstColumn && refFirstColumn[0]}
                        className={styleForNoClone}><Space/></th>
                    {tag_field_month}
                </tr>
                <tr>
                    <th ref={refFirstColumn && refFirstColumn[1]}
                        className={styleForNoClone}><Space/></th>
                    {tag_field_weekday}
                </tr>
                <tr>
                    <th ref={refFirstColumn && refFirstColumn[2]}
                        className={`th-number ${styleForNoClone}`}>
                        Номера
                    </th>
                    {tag_field_day}
                </tr>
            </thead>
        );
    }
}

export default Head;