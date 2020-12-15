// 时钟列表 组件

import React, {Component} from 'react';
import {Select} from 'antd';
import Clock from '../Clock';

import './ClockList.less';

const { Option } = Select;

const options = [
    {
        label: '北京',
        value: 'BeiJing',
    },
    {
        label: '伦敦',
        value: 'London',
    },
    {
        label: '纽约',
        value: 'Newyork',
    },
    {
        label: '悉尼',
        value: 'Sydney',
    },
    {
        label: '东京',
        value: 'Tokyo',
    },
    {
        label: '巴黎',
        value: 'Paris',
    },
];

class ClockList extends Component {
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
                }
            ],
            isSelectTimeZone: false,
            timeZoneValue: '',
        }

        this.onAddClock = this.onAddClock.bind(this);
        this.onSelectTimeZone = this.onSelectTimeZone.bind(this);
    }

    // 点击添加时钟
    onAddClock() {
        debugger
        this.setState({
            // 时钟列表
            // clockList: [],
            // 当前是否处于 【下拉选择时区】 中
            isSelectTimeZone: true
        });
    }
    // 选中具体的时区
    onSelectTimeZone() {
        debugger
        const {clockList} = this.state;
        this.setState({
            clockList: [...clockList, {
                    timeZone: '时区1',
                    date: '2020-11-01',
                    time: '01:00:00'
                }],
            isSelectTimeZone: false,
            timeZoneValue: ''
        }, () => console.log(this.state))
    }
    render() {
        const {clockList, isSelectTimeZone, timeZoneValue} = this.state;

        return (
            <div className="clock-list-wrapper">
                <div className="clock-list">
                    {
                        clockList.map((clock, index) => {
                            return <Clock clock={clock} key={index}/>
                        })
                    }
                    
                    {/* 跟在列表后面的 “添加时钟” 图标 */}
                    {
                        !isSelectTimeZone ?
                            (<div className="add-clock" onClick={this.onAddClock}>
                                <span className="add-clock-icon">+</span>
                            </div>)
                            :
                            (<div className="add-clock">
                                <Select style={{ width: 150 }} value={timeZoneValue} options={options} 
                                    onSelect={this.onSelectTimeZone}>
                                </Select>
                            </div>
                            )
                    }
                </div>
            </div>
        )
    }
}

export default ClockList;