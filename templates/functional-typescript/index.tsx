import React, { Component } from 'react';
import './index.scss';

interface InitProp {
    objData: any;
}
class NEED_CHANGE_COMPONENT_NAME extends Component<any, InitProp> {

    render() {
        return (
            <div className='content-bg'>
                <div className='content-container'>
                    <span className='content-container-title'>姓名:</span>
                    <span className='content-container-content'>{this.props.objData.name}</span>
                </div>
            </div >
        )
    }
}

export default NEED_CHANGE_COMPONENT_NAME;
