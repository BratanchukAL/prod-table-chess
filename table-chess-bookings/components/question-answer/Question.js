import React, {Component} from 'react';
import Icon from "../common/Icon";
import './style.css'
import UIToolTip from "../common/ToolTip";
import LocalWord from "../common/LocalWord";
import {dictionary} from "./dictionary";

/**
 *   defaultProps = {
 *       visible: true,
 *       indexWord: 'hello',
*
 *       inner:false,
 *       outside: false,
*        left: false,
 *       bottom: false,
 *       right: false,
  *      top:false,
 *   };
 */

class Question extends Component {

    static defaultProps = {
        visible: true,
        indexWord: 'hello',

        inner: false,
        outside: false,
        left: false,
        bottom: false,
        right: false,
        top: false,
    };

    render() {
        const {
            children, visible,
            indexWord
        } = this.props;


        const position = visible && this.getPosition();

        return (
            <div className="wrap-content-question">
                {
                    visible &&
                    <div className="wrap-question"
                         style={{...position.wrap_question}}
                    >
                        <div className="question"
                             style={{...position.question}}
                        >
                            <UIToolTip byClick
                                       textTip={<LocalWord dictionary={dictionary}>{indexWord}</LocalWord>}>
                                <Icon
                                    className="icon-question"
                                    style={{top: -1}}
                                    name="question-sign"
                                />
                            </UIToolTip>
                        </div>
                    </div>
                }
                {children}
            </div>
        );
    }

    getPosition() {
        const {inner, outside, top, left, bottom, right} = this.props;

        if (inner)
            return {
                wrap_question: {
                    left: left ? 0 : null,
                    top: top ? 0 : null,
                    right: right ? 0 : null,
                    bottom: bottom ? 0 : null,

                }, question: {left: 0}
            };
        else if (outside) {
            return {
                wrap_question: {
                    left: left ? 0 : null,
                    top: top ? 0 : null,
                    right: right ? 0 : null,
                    bottom: bottom ? 0 : null,

                }, question: {
                    left: left ? '-50%' : null,
                    top: top ? '-50%' : null,
                    right: right ? '-50%' : null,
                    bottom: bottom ? '-50%' : null,
                }
            };
        }


        return {wrap_question: {left: 0}, question: {left: 0}}
    }

}

export default Question;