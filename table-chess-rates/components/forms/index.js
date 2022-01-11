import React, { Component } from 'react';
import FormCategory, {FORM_EDITOR_EDIT_CATEGORY, FORM_EDITOR_NEW_CATEGORY} from './category';

import {connect} from 'react-redux'
import {fetchNewCategory, fetchEditCategory, fetchDeleteCategory} from '../../redux/widgets/rates'
// import Form from "./form/Form"; TODO: not implementation


class Forms extends Component {
    static defaultProps = {
        visible: false,
        type: null,
        payload: null,
        onClose: null,
        onClickSubmit:null,
        onChangeFields: null,
        updatePage: null,
    };

    render() {
        const {
            type,
            visible,
        } = this.props;

        if(!visible) return null;

        let tag;

        switch(type){
            case FORM_EDITOR_NEW_CATEGORY:{
                tag = <FormCategory
                    title="Добавить новую категорию"
                    {...this.props} onClickSubmit = {this.props.fetchNewCategory}/>;
                break;
            }

            case FORM_EDITOR_EDIT_CATEGORY:{
                tag = <FormCategory
                    title = "Редактировать категорию"
                    {...this.props} onClickSubmit = {this.props.fetchEditCategory}
                    onClickDelete = {this.props.fetchDeleteCategory}
                />;
                break;
            }

            default:
                tag = null;
        }

        return (
            <div>
                {tag}
            </div>
        );
    }

}

export default connect(null, {fetchNewCategory, fetchEditCategory, fetchDeleteCategory})(Forms);