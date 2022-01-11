import React, { Component } from 'react';
import TableChessWithCat from './TableChessWithCat';
import FormEditor from '../forms';

class TableChess extends Component {
    state = {
        formEditor:{
            visible: false,
            type: null,
            payload: null,
        }
    };

    render() {
        return (
            <div >
                <TableChessWithCat {...this.props}
                    onOpenEditor={this.handleOpenEditor}
                />
                <FormEditor
                    {...this.state.formEditor}
                    onClose = {this.handleCloseEditor}
                    updatePage = {this.props.updatePage}
                />
            </div>
        );
    }

    handleOpenEditor = (type, payload)=>{
        //console.log('handleClickEditorCategory',type, payload); //TODO: debug

        this.setState({
            formEditor:{
                visible: true,
                type,
                payload
            }
        })
    };

    handleCloseEditor = ()=>{

        this.setState({
            formEditor:{
                visible: false,
            }
        })
    }
}

export default TableChess;