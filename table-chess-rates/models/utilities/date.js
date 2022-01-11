/*
*
* '01.02.0000' TO  'ISO'
*
* in_date is string
*
* return new Date
* */
export function formateDateRusToISO(in_date, separator = '.') {
    //date
    const date = in_date.split(separator);
    //days and time
    const year_time = date[2].split(' ');
    //time
    // const time = day_time[1] || '00:00'

    const year = year_time[0];
    const month = date[1];
    const day = date[0];

    return new Date(`${year}-${month}-${day}`);
}

/*
*
* 'ISO' TO  '01.02.0000'
*
* in_date is string
*
* return string date
* */
export function formateDateISOToRus(in_date, separator = '-') {

    //date
    const date = in_date.split(separator);
    //days and time
    const day_time = date[2].split(' ');
    //time
    // const time = day_time[1] || '00:00'

    const year = date[0];
    const month = date[1];
    const day = day_time[0];

    return `${day}.${month}.${year}`;
}

/*
*
* 'ISO' TO  '01.02.0000 00:00'
*
* in_date is string
*
* return string date and time
* */
export function formateDateTimeISOToRus(in_date, separator = '-') {

    //date
    const date = in_date.split(separator);
    //days and time
    const day_time = date[2].split(' ');

    const year = date[0];
    const month = date[1];
    const day = day_time[0];
    const time = day_time[1] || '00:00';

    return `${day}.${month}.${year} ${time}`;
}

export const DAY = 86400000;

export function msToDays(ms) {
    return ms / DAY;
}

export function numberMonthToStr(val) {
    switch (val) {
        case 0:
            return 'Январь';
        case 1:
            return 'Февраль';
        case 2:
            return 'Март';
        case 3:
            return 'Апрель';
        case 4:
            return 'Май';
        case 5:
            return 'Июнь';
        case 6:
            return 'Июль';
        case 7:
            return 'Август';
        case 8:
            return 'Сентябрь';
        case 9:
            return 'Октябрь';
        case 10:
            return 'Ноябрь';
        case 11:
            return 'Декабрь';
        default:
            return 'Месяц';
    }
}

export function numberDayToShortStr(val) {
    switch (val) {
        case 0:
            return 'Вс';
        case 1:
            return 'Пн';
        case 2:
            return 'Вт';
        case 3:
            return 'Ср';
        case 4:
            return 'Чт';
        case 5:
            return 'Пт';
        case 6:
            return 'Сб';
        default:
            return 'День';
    }
}

export function isDayOff(date_any){
    const date = new Date(date_any);
    const day_week = numberDayToShortStr(date.getDay());

    return (day_week === 'Вс' || day_week === 'Сб');
}

/*
* return new Date(now) без ссылок
* */
export function todayDate(){
    const now_date = new Date(Date.now());
    return new Date(now_date.toDateString());
}

/*
* in: date_str - date in str
* result: new Date, without time
* */
export function strToDate(date_str){
    const date = new Date(date_str);
    date.setHours(0);

    return date;
}

/*
* in: date_str - date in str
* result: new Date with shift
* */
export function dateToShift(date_str, day_shift){
    let shift_date = new Date(date_str);
    shift_date.setDate(shift_date.getDate() + day_shift);
    return shift_date;
}

export function strToLocaleDateStr(date_str){
    return new Date(date_str).toLocaleDateString();
}


/*
*
* */
export function difDay(date_start, date_end){
    return msToDays(new Date( date_end) - new Date(date_start));
}

export function isEquallyYear(countOrDateStart, date_end = false){

    const count_day_year = 365;

    if(date_end)
        return difDay(countOrDateStart, date_end) >= count_day_year;
    else
        return countOrDateStart >= count_day_year;
}

export function startNowYear(){
    const res = todayDate();

    res.setMonth(0);
    res.setDate(1);

    return res;
}
