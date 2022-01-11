import React, { Component } from 'react';
import {ContextMenu, MenuItem as Item, ContextMenuTrigger} from 'react-contextmenu';

export const NAME_CUSTOM_CONTEXTMENU = "TableChessRate.ContextMenu";

class CustomContextMenu extends Component {
    state = {
        disabledItemPaste:true,
        coped: null
    };

    render() {
        return (
            <ContextMenu id={NAME_CUSTOM_CONTEXTMENU}>
                <Item onClick={this.handleClickCopy}>Скопировать диапозон</Item>
                <Item disabled={this.state.disabledItemPaste}
                    onClick={this.handleClickPaste}
                >Вставить</Item>
            </ContextMenu>
        );
    }

    handleClickCopy=(e, collect)=>{
        if(collect.coped){
            this.setState({disabledItemPaste: false, coped:collect.coped});
        }else{
            this.setState({disabledItemPaste: true});
        }
    };

    handleClickPaste=(e, collect)=>{
        this.props.onClickPaste && this.props.onClickPaste({row_id: collect.row_id, coped: this.state.coped});
    }
}

export const ContextMenuProvider = ContextMenuTrigger;
export default CustomContextMenu;