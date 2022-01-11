import React, { Component } from 'react';
import './style.css'
import Alert from "reactstrap/lib/Alert";
import Button from "reactstrap/lib/Button";
import Space from "../Space";

/*
*  static defaultProps={
*        visible: true,
*        type: "primary",
*        onOk: null,
*        onClose: null,
 *       toggle: false, // крестик-закрыть
*    };
* */
class AlertModal extends Component {

    static defaultProps={
        visible: true,
        type: "primary",
        onOk: null,
        onClose: null,
    };

    render() {
        const {type, children, onOk, onClose, visible}=this.props;
        if(!visible) return null;
        return (
            <div className="alert-modal">
                <div className="overlay-opacity"> </div>
                <Alert color={type} isOpen={visible} toggle={onClose && this.handleDismiss}
                       style={{opacity: visible ? 1.0: 0}}
                >
                    {children}
                    {onOk && <span><Button onClick={onOk} color="primary">Ок</Button><Space/></span>}
                    {onClose && <Button onClick={this.handleDismiss}>Закрыть</Button>}
                </Alert>
            </div>
        );
    }

    handleDismiss=()=>{
        this.props.onClose && this.props.onClose();
    }
}

export default AlertModal;