import React, {Component} from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';
import GlobalWindow from "../../models/utilities/window";

/*
* @params props = {children[], children[1] == textTip, byClick, !isCanDo}
* children[0] == children - component where
* children[1] == textTip - text tip
* byClick - by click show tip, over when leaves mouse with trigger_obj
* */

const CLICK = 'CLICK';
const OVER = 'OVER';

class UIToolTip extends Component {
    static id_generate = 0;

    autoIdentification() {
        UIToolTip.id_generate = UIToolTip.id_generate + 1;
        this.Identification = 'UIToolTip' + UIToolTip.id_generate;
    }

    getIdTarget(){
        return this.Identification + 'Target';
    };

    constructor(props) {
        super(props);
        this.autoIdentification();

        if(this.compatibility.Firefox)
            GlobalWindow.setHandleClick(this.handleClickGlobal);

        GlobalWindow.setHandleKeyUp(this.handleKeyUp);
    }

    silentState={
        isCanClose: true,//for Firefox
    };

    state = {
        isOpen: false
    };

    static defaultProps = {
        byClick: false,
        isCanDo: true,
    };

    compatibility={
        Firefox: GlobalWindow.getInfoEnvironment().browser === 'Firefox'
    };

    render() {
        const {children, textTip, isCanDo, byClick} = this.props;

        let trigger_obj = children[0] || children;
        let onToggle = this.handleToggle.bind(this, OVER);
        if(byClick) {
            onToggle = this.handleToggle.bind(this, OVER);
            trigger_obj = React.cloneElement(trigger_obj, {
                onClick: this.handleToggle.bind(this, CLICK)
            })
        }

        const isOpen =(isCanDo === true) && this.state.isOpen;

        return (
            <div className="cursor-pointer fill-free" id={this.getIdTarget()}>
                {trigger_obj}

                <Tooltip target={this.getIdTarget()}
                         isOpen={isOpen}
                         toggle={onToggle}
                         autohide={false}
                         delay={{show: 600, hide: 100}}
                         placement = 'bottom'
                         className='custom'
                         id={this.Identification}
                >
                    {children[1] || textTip || 'Сообщение'}
                </Tooltip>
            </div>
        );
    }

    handleToggle = (type_event, sender) => {
        for(const i in sender.path){
            if(sender.path[i].id === this.Identification){
                return;
            }
        }

        if(this.compatibility.Firefox)
            if(!this.silentState.isCanClose) return;

        if((type_event === CLICK) || (!this.state.isOpen === false)) {
            this.setState({isOpen: !this.state.isOpen});
        }else if(!this.props.byClick){
            this.setState({isOpen: !this.state.isOpen});
        }
    };

    //for Firefox
    handleClickGlobal=(sender)=>{
        if(this.state.isOpen){
            if(this.silentState.isCanClose === true) {
                if (sender.target.nodeName.toLowerCase() === "select") {
                    this.silentState.isCanClose = false;
                }
            }else{
                this.silentState.isCanClose = true;
                this.setState({isOpen: !this.state.isOpen});
            }
        }
    };

    handleKeyUp=()=>{
        this.setState({isOpen: false});
        this.silentState.isCanClose = true;
    }
}

export default UIToolTip;