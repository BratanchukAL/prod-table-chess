import React, {Component} from 'react';
import ToolTip from '../common/ToolTip'
import {DragSource} from 'react-dnd';
import TooltipFormBooking from './TooltipFormBooking';

class MarkLine extends Component {

    render() {
        const {connectDragSource, connectPreview, isDragging,
            booking, onClick, noFitInStart} = this.props;

        const line_status_color = booking.status !== undefined ? "line-status-color-"+booking.status:"line-status-color";

        return connectDragSource(
            connectPreview(
                <div>
                    <div className={line_status_color}>
                        <div className="date-line-before"/>
                    </div>
                    <div className="date-line" onClick={onClick}>
                        <div className={`line-status ${line_status_color} ${noFitInStart && 'nofit-date_start-line'}`}>
                            <ToolTip isCanDo={!isDragging}>
                                <div>
                                    <div className="centered-vertical">
                                        <div className="text-line text-nowrap">
                                            {booking.client_fio}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <TooltipFormBooking booking={booking}/>
                                </div>
                            </ToolTip>
                        </div>
                    </div>
                    <div className={line_status_color}>
                        <div className="date-line-after"/>
                    </div>
                </div>
                , {offsetX: 5, offsetY: 5})
        );
    }
}

const spec = {
    beginDrag(props) {
        props.onBeginDrag();
        return {
            booking: props.booking
        };
    },
    endDrag(props) {
        props.onEndDrag();
    }
};

const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
});

export default DragSource('MarkLine', spec, collect)(MarkLine);