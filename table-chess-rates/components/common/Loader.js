import React from 'react';
import {connect} from 'react-redux';
import {clearError} from '../../redux/widgets/state'
import {DANGER, decodeError, WARNING} from '../../models/decodeErrors';
import AlertModal from "./alert-modal/AlertModal";
import GlobalWindow from "../../models/utilities/window";

/**
 *   static defaultProps = {
 *       loading: false,
 *       children: null,
 *       error: null,
 *       hideChildren: false,
 *       onClose: null,
 *       timeStartTaskShow: 400,
 *       playAnimation: 1500,
 *   };
 * */
class Loader extends React.Component {

    silentState={
        taskOfLoader: null,
        playStartedAnimation: null
    };
    state = {
        update: false,
    };

    static defaultProps = {
        loading: false,
        children: null,
        error: null,
        hideChildren: false,
        onClose: null,
        timeStartTaskShow: 400,
        playAnimation: 1500,
    };

    shouldComponentUpdate(nextProps){
        const {taskOfLoader, playStartedAnimation} = this.silentState;
        if(nextProps.loading){
            if(taskOfLoader === null) {
                this.silentState.taskOfLoader = setTimeout(() => {
                    this.setState({update: !this.state.update});
                },
                    this.props.timeStartTaskShow
                );
            }else{
                this.silentState.playStartedAnimation = Date.now();
                this.silentState.taskOfLoader = null;
                return true;
            }

            return false;
        }else{
            if(taskOfLoader !== null){
                clearTimeout(taskOfLoader);
                this.silentState.taskOfLoader = null;
            }

            if(this.props.loading===true){
                const time_end_animation = (playStartedAnimation + this.props.playAnimation);
                const now_time =  Date.now();
                if(time_end_animation > now_time){
                    const delta_last_time = time_end_animation - now_time;
                    setTimeout(()=>{
                        this.setState({update: !this.state.update});
                        },
                            delta_last_time
                    );
                    return false;
                }
            }
        }

        return true;
    }

    render() {
        const {loading, children, error, hideChildren} = this.props;

        const tag_children = children && React.cloneElement(children, {key: 2});

        const error_level = decodeError(error).level;
        const error_text = decodeError(error).text;
        const tag_error = error && (
            <AlertModal key="1" type={error_level}
                        onClose={this.handleCloseErrorAlert}
            >
                <h5 key="1">{error_text}</h5>
            </AlertModal>
        );

        if (loading) {
            const tag_loader = (
                <AlertModal key="1">
                    <h2 className="text-centered">Загрузка прайс-листа...</h2>
                </AlertModal>
            );

            if (hideChildren) {
                return tag_loader;
            } else
                return [tag_loader, tag_children];
        } else {
            if (error)
                return tag_error;
            else
                return tag_children || null;
        }
    }

    handleCloseErrorAlert = () => {
        const error_level = decodeError(this.props.error).level;

        if(this.props.onClose)
            this.props.onClose();
        else {
            if(error_level === DANGER)
                GlobalWindow.reload();
            if(error_level === WARNING)
                this.props.clearError();
        }
    }
}

export default connect(null, {clearError})(Loader)

