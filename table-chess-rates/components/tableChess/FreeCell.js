import React, {Component} from 'react';

class FreeCell extends Component {
    render() {
        const {refLink, startStyles, ...other_props} = this.props;

        return (
            <div>
                <div className={startStyles} ref={refLink} {...other_props}>
                    &nbsp;
                </div>
            </div>
        );
    }
}


export default FreeCell;