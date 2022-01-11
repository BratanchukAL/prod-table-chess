import IMask from 'imask'


class Masks{
    static telephone(value){
        let masked = IMask.createMask({
            mask: '+7 (000) 000-00-00',
        });
        masked.resolve(value.toString());

       return masked;
    }

    /*
    * number(value, max, min)
    * */
    static number(value, max, min){
        let masked = IMask.createMask({
            mask: Number,
            max,
            min
        });
        masked.resolve(value);
        return masked;
    }
}

export default Masks