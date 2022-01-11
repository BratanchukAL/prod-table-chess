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
//TODO: был заменен на title, т.к. требуется свой Tooltip - нужно чтобы созд внутри элемента, а не где та забортом
class UIToolTip extends Component {
    static id_generate = 0;

    autoIdentification() {
        UIToolTip.id_generate = UIToolTip.id_generate + 1;
        this.Identification = 'UIToolTip' + UIToolTip.id_generate;
    }

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
            <div className="cursor-pointer fill-free"
                 // onMouseMove={this.handleMouseOverTargetMove}
                 onMouseOver={this.handleMouseOverTargetMove}
                 onMouseLeave={this.handleMouseLeave}
            >
                {/*TODO: edited*/}
                {/*dynamic target for tooltip*/}
                <div id={this.Identification}
                     style={{position:'absolute',
                         width:10,
                         height:10,
                         // backgroundColor: '#000',
                     }}
                > </div>

                {trigger_obj}

                <Tooltip target={this.Identification}
                         isOpen={isOpen}
                         toggle={onToggle}
                         autohide={false}
                         placement = 'bottom-start'
                         className='custom'
                >
                    {children[1] || textTip || 'Сообщение'}
                </Tooltip>
            </div>
        );
    }

    handleToggle = (type_event, sender) => {

        if(this.compatibility.Firefox)
            if(!this.silentState.isCanClose) return;

        if((type_event === CLICK) || (!this.state.isOpen === false)) {
            this.setState({isOpen: !this.state.isOpen});
        }else if(!this.props.byClick){
            this.setState({isOpen: !this.state.isOpen});
        }
        //this.setState({isOpen: true});
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
        if(!this.state.isOpen) return;

        this.setState({isOpen: false});
        this.silentState.isCanClose = true;
    };

    // handleMouseOver=(sender)=>{ /*TODO: edited*/
    //     console.log('handleMouseOver') //TODO: debug
    //     const isOpen = this.state.isOpen;
    //     if(!isOpen)
    //         this.handleToggle(OVER, sender);
    // };
    handleMouseLeave=(sender)=>{ /*TODO: edited*/
        // console.log('handleMouseLeave') //TODO: debug

        const isOpen = this.state.isOpen;
        if(isOpen /*&& !UIToolTip.isInitEvent(sender)*/)
            this.handleToggle(OVER, sender);
    };

    handleMouseOverTargetMove=(sender)=> { /*TODO: edited*/

        const pageX = sender.pageX;
        const pageY = sender.pageY;

        const target = $('#' + this.Identification);
        const plain = $(sender.target);
        const pos = plain.offset();

        function correctRange(v, left, right) {
            if (v < left) {
                v = left;
            } else if (v > right)
                v = right;

            return v;
        }

        let x = pageX - pos.left - 5;
        let y = pageY - pos.top;

        x = correctRange(x, 0, plain.innerWidth() - target.innerWidth());
        y = correctRange(y, 7, plain.innerHeight() - target.innerHeight() + 3);

        target.css('top', y - 5);
        target.css('left', x);

        if (!this.state.isOpen)
            this.handleToggle(OVER, sender);
    };


    static isInitEvent(sender) {
        const place_event = $( sender.relatedTarget);
        const cl_arrow = place_event.hasClass('arrow');
        const cl_tooltip = place_event.hasClass('tooltip');
        const cl_tooltip_inner = place_event.hasClass('tooltip-inner');

        if(cl_arrow || cl_tooltip || cl_tooltip_inner)
            return true;
        else
            return false;
    }
}

export default UIToolTip;