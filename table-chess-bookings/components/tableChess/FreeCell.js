import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';


class _FreeCell extends Component {
    render() {
        const {refLink, startStyles} = this.props;

        let tag = (
            <div>
                <div className={startStyles} ref={refLink} >
                    &nbsp;
                </div>
            </div>);

        if (this.props.connectDropTarget)
            return this.props.connectDropTarget( tag );
        else
            return tag;
    }
}


const spec = {
    drop(props, monitor) {
        console.log('FreeCell drop', props, monitor);
        props.onShowEditor(monitor.getItem().booking, props.time)
    }
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    // canDrop: monitor.canDrop(),
    // hovered: monitor.isOver()
});

export default DropTarget('MarkLine', spec, collect)(_FreeCell);
export const FreeCell = _FreeCell;