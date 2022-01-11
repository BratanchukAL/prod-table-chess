import React from 'react';


class TConnect extends React.Component{
    /*
     * getLinkProp(index, prop)
     */
    getConnectedProp(index, prop){
        const con_prop = this.props.connectedProperty && this.props.connectedProperty[index];
        return con_prop && this.props.connectedProperty[index][prop];
    }

    shouldComponentUpdate(nextProps, nextState){
        const{connectedProperty, propWhiteList} = this.props;

        let doRender = true;
        if(connectedProperty)
        for(let name_form in nextProps.connectedProperty)
            for(let prop in nextProps.connectedProperty[name_form])
                if(connectedProperty[name_form]){
                    if(propWhiteList[name_form][prop]){
                        if(connectedProperty[name_form][prop] !== nextProps.connectedProperty[name_form][prop])
                            return true;
                    }else
                        if(connectedProperty[name_form][prop] !== nextProps.connectedProperty[name_form][prop])
                            doRender = false;
                }else if(nextProps.connectedProperty[name_form])
                    return true;

        return doRender;
    }
};

export default TConnect;
