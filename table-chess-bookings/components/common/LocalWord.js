import React, { Component } from 'react';

/**
 *  static defaultProps={
 *       dictionary:{hello:'Hello world'}
 *   };
 * */

class LocalWord extends Component {

    static defaultProps={
        dictionary:{hello:'Hello world'}
    };

    render() {
        const word = this.getWordFromDictionary();

        return (word);
    }

    getWordFromDictionary(){
        const {children, dictionary} = this.props;

        for(let index in dictionary)
            if(index === children)
            {
                return dictionary[index];
                break;
            }
        return 'К сожалению, не знаю';
    }
}

export default LocalWord;