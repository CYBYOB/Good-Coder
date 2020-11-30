// 时钟列表 组件

import React from 'react';

import Clock from '../Clock';


class ClockList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {clockList} = this.props;

        return (
            <div className="clock-list">
                {
                    clockList.map(clock => {
                        return <Clock clock={clock}/>
                    })
                }
                {/* 跟在列表后面的 “添加时钟” 图标 */}
                <div class="add-clock">
                    +
                </div>
            </div>
        )
    }
}

export default ClockList;