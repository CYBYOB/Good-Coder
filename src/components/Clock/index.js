// 时钟 组件

import React, {Component} from 'react';


import './Clock.less';

class Clock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {clock} = this.props;

        return (
            <div className="clock-item">
                <div>{clock.timeZone}</div>
                <div className="date">{clock.date}</div>
                <div>{clock.time}</div>
            </div>
        )
    }
}

export default Clock;