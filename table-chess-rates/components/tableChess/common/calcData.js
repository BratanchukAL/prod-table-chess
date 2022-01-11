import {numberDayToShortStr, numberMonthToStr, isDayOff} from '../../../models/utilities/date'
import {createSelector} from 'reselect'

/**
 * @description out line weekdays, days, months
 * @param date_start 01.05.2018
 * @param date_end 20 calc 21.05.2018
 *
 * @return result = {
 *      days: [{ 1, 2...
 *          key: null,
 *          data: null,
 *          isToday: undefined
 *      }],
 *      weekdays: [{ Пн, Вт...
 *          key: null,
 *          data: null
 *          isDayOff: false,
 *      }],
 *      months: [{ Январь...
 *          key: null,
 *          data: null,
 *          count: null  active days
 *      }]
 *      }
 */
function _getCalendarInRang(date_start, date_end) {
    const result = {
        days: [{
            key: null,
            data: null,
        }],
        weekdays: [{
            key: null,
            data: null,
            isDayOff: false,
        }],
        months: [{
            key: null,
            data: null,
            count: null
        }],
    };

    let index_month = 0;
    let index_dw = 0; //for days and weekdays
    let count_active_day = 0;

    let time_old = date_start.getTime();
    let month_old = date_start.getMonth();
    let year_old = date_start.getFullYear();

    let today = new Date();

    for (let i = new Date(date_start); i <= date_end; i.setDate(i.getDate() + 1)) {

        const time = i.getTime();
        const month = i.getMonth();
        const year = i.getFullYear();
        const date = i.getDate();
        const date_string = i.toDateString();

        result.days[index_dw] = {};
        result.days[index_dw].key = time;
        result.days[index_dw].data = date;
        result.days[index_dw].isToday = today.toDateString() === date_string ? true:false;
        result.weekdays[index_dw] = {};
        result.weekdays[index_dw].key = time;
        result.weekdays[index_dw].data = numberDayToShortStr(i.getDay());
        result.weekdays[index_dw].isDayOff = isDayOff(i);
        index_dw++;

        if ((month_old !== month)) {
            result.months[index_month] = {};
            result.months[index_month].key = time_old;
            result.months[index_month].data = numberMonthToStr(month_old) + ' - ' + year_old;
            result.months[index_month].count = count_active_day;

            time_old = time;
            month_old = month;
            year_old = year;

            count_active_day = 1;
            index_month++;
        } else {
            count_active_day++;
        }
    }
    result.months[index_month] = {};
    result.months[index_month].key = date_end.getTime();
    result.months[index_month].data = numberMonthToStr(date_end.getMonth()) + ' - ' + date_end.getFullYear();
    result.months[index_month].count = count_active_day;

    return result;
}

const getDateStart = (date_start) => date_start;
const getDayShift = (_, day_shift) => day_shift;

/**
 * @description out line weekdays, days, months
 * @param date_start 01.05.2018
 * @param day_shift 20 calc 21.05.2018
 *
 * @return result = {
 *      days: [{ 1, 2...
 *          key: null,
 *          data: null
 *      }],
 *      weekdays: [{ Пн, Вт...
 *          key: null,
 *          data: null
 *          isDayOff: false,
 *      }],
 *      months: [{ Январь...
 *          key: null,
 *          data: null,
 *          count: null  active days
 *      }]
 *      }
 */
export const getCalendarInRang = createSelector(getDateStart, getDayShift,
    (date_start, day_shift) => _getCalendarInRang(date_start, day_shift));
