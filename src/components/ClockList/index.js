// 时钟列表 组件

import React from 'react';

import Clock from '../Clock';

import './ClockList.less';


class ClockList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock数据
            clockList: [
                {
                    timeZone: '时区1',
                    date: '2020-11-01',
                    time: '01:00:00'
                },
                {
                    timeZone: '时区2',
                    date: '2020-11-02',
                    time: '01:00:00'
                },
                {
                    timeZone: '时区3',
                    date: '2020-11-03',
                    time: '01:00:00'
                },
                {
                    timeZone: '时区4',
                    date: '2020-11-04',
                    time: '01:00:00'
                },
                {
                    timeZone: '时区5',
                    date: '2020-11-05',
                    time: '01:00:00'
                },
                {
                    timeZone: '时区6',
                    date: '2020-11-06',
                    time: '01:00:00'
                }
            ]
        }

        this.addClock = this.addClock.bind(this);
    }

    // 点击添加时钟
    addClock() {
        debugger
        this.setState({
            clockList: []
        })
    }
    render() {
        const {clockList} = this.state;

        return (
            <div className="clock-list-wrapper">
                <div className="clock-list">
                    {
                        clockList.map((clock, index) => {
                            return <Clock clock={clock} key={index}/>
                        })
                    }
                    
                    {/* 跟在列表后面的 “添加时钟” 图标 */}
                    <div className="add-clock" onClick={this.addClock}>
                        <span className="add-clock-icon">+</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default ClockList;