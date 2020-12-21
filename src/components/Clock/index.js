// 时钟 组件
import React, {Component} from 'react';

import './Clock.less';

class Clock extends Component {
    render() {
        const {clock, onDeleteClock} = this.props;
        const {id, timeZone, curMoment} = clock;
        const [date, time] = curMoment.format('YYYY-MM-DD HH:mm:ss').split(' ');
        
        return (
            <div className="clock-item">
                {/* hover状态下，右上角的 x 。控制显隐，visibility 比 display 性能好 */}
                <div className="delete-icon" style={ {visibility: 'hidden'} } onClick={ () => onDeleteClock(id) }>X</div>
                <div>{timeZone}</div>
                <div className="date">{date}</div>
                <div>{time}</div>
            </div>
        )
    }
}

export default Clock;