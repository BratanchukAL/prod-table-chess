import React, {Component} from 'react';
import Row from './Row'
import Icon from "../common/Icon";


class RowsDropDown extends Component {
    state={
        visible:true
    };

    render() {
        const { columnCount, arrayRowsData, calendar,
            setRowIDCursor, scale, factoryRefForRowsDropDown, factoryRefForRow} = this.props;

        console.log('RowsDropDown render'); //TODO: debug

        const tag_rows = this.state.visible &&
            arrayRowsData.rooms.map((room)=>
                <Row key={room.id} calendar = {calendar}
                     arrayData={room}
                     setRowIDCursor={setRowIDCursor}
                     scale = {scale}
                     factoryRefForRow = {factoryRefForRow}
                />);

        const button_m_p = this.state.visible ? <Icon name="menu-up" />:<Icon name="menu-down" />;

        return (
            <tbody>
                <tr onClick = {this.handleClick} >
                    <td colSpan={columnCount+2} className="th-category cursor-pointer">
                        <div className="text-float text-nowrap z-10"
                             ref={factoryRefForRowsDropDown(arrayRowsData.id)}
                             title={arrayRowsData.ctg_name}
                        >
                            {button_m_p} {' '+ arrayRowsData.ctg_name}
                        </div>
                        <div className="text-in-shadow">
                            {arrayRowsData.ctg_name}
                        </div>

                    </td>
                </tr>
                {tag_rows}
            </tbody>

        );
    }

    handleClick= async ()=>{
        await this.setState({visible: !this.state.visible});
        this.props.onClickDown && this.props.onClickDown();
    };
}

export default RowsDropDown;