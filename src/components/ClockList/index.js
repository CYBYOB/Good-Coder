// 时钟列表 组件

import React, {Component} from 'react';
import {Select, Button} from 'antd';
import moment from 'moment';
import {getDateTimeByTimeZone, getTimeZoneOptions, syncTime} from '../../util/utils';
import Clock from '../Clock';

import './ClockList.less';

let updateClockPerSecond = '';
let updateClockPerMinute = '';

const timeZoneOptions = getTimeZoneOptions();

// const timeZoneOptions = [
//     {
//         label: '北京',
//         value: 'BeiJing',
//     },
//     {
//         label: '伦敦',
//         value: 'London',
//     },
//     // {
//     //     label: '纽约',
//     //     value: 'Newyork',
//     // },
//     // {
//     //     label: '悉尼',
//     //     value: 'Sydney',
//     // },
//     // {
//     //     label: '东京',
//     //     value: 'Tokyo',
//     // },
//     // {
//     //     label: '巴黎',
//     //     value: 'Paris',
//     // },
// ];

class ClockList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock数据
            clockList: [
                {
                    // id 是生成当前时钟的时间戳，作为Clock组件的key
                    id: 1,
                    timeZone: 'BeiJing',
                    curMoment: moment()
                },
            ],
            isSelectTimeZone: false,
            timeZoneValue: '',
        }

        this.onAddClock = this.onAddClock.bind(this);
        this.onSelectTimeZone = this.onSelectTimeZone.bind(this);
        this.onCancelSelectTimeZone = this.onCancelSelectTimeZone.bind(this);
        this.onDeleteClock = this.onDeleteClock.bind(this);
        this.updateClockListBySyncTime = this.updateClockListBySyncTime.bind(this);
        // 2个定时器
        this.updateClockPerSecond = this.updateClockPerSecond.bind(this);
        this.updateClockPerMinute= this.updateClockPerMinute.bind(this);
    }

    // 通过syncTime更新时钟列表
    updateClockListBySyncTime(syncTime) {
        let {clockList} = this.state;
        clockList = clockList.map(item => {
            const {timeZone} = item;
            item = Object.assign(item, getDateTimeByTimeZone(timeZone, syncTime));
            return item;
        });

        return clockList;
    }

    // 点击添加时钟
    onAddClock() {
        this.setState({
            // 当前是否处于 【下拉选择时区】 中
            isSelectTimeZone: true
        });
    }
    // 点击删除时钟
    onDeleteClock(id) {
        const {clockList} = this.state;
        this.setState({
            clockList: clockList.filter(item => item.id !== id)
        });
    }
    // 选中具体的时区
    onSelectTimeZone(timeZone) {
        const {clockList} = this.state;
        // const {id, date, time} = getDateTimeByTimeZone(timeZone);
        const {id, curMoment} = getDateTimeByTimeZone(timeZone);
        // debugger
        this.setState({
            clockList: [...clockList, {
                    id,
                    timeZone,
                    // date,
                    // time
                    curMoment
                }],
            isSelectTimeZone: false,
            timeZoneValue: ''
        }, () => console.log(this.state))
    }
    onCancelSelectTimeZone() {
        this.setState({
            isSelectTimeZone: false
        });
    }

    componentWillUnmount() {
        // 清除定时器 —— 每1秒更新时钟。
        clearInterval(updateClockPerSecond);
        clearInterval(updateClockPerMinute);
    }

    updateClockPerSecond() {
        setInterval(() => {
            const {clockList} = this.state;
            const {length} = clockList;

            // 性能优化，为空数组没必要setState
            if (!length) {
                return;
            }
            
            this.setState({
                clockList: clockList.map(item => {
                    item.curMoment = item.curMoment.add(1, 'seconds')
                    return item;
                })
            });
        }, 1000);
        // }, 5000);
    }
    updateClockPerMinute() {
        setInterval(() => {
            const {clockList} = this.state;
            const {length} = clockList;
            
            // 性能优化，为空数组没必要setState
            if (!length) {
                return;
            }

            let syncTimeMoment = moment();
            syncTime().then(res => {
                syncTimeMoment = res;
                this.setState({
                    // clockList: clockList.map(item => {
                    //     item.curMoment = item.
                    // })
                    clockList: this.updateClockListBySyncTime(syncTimeMoment)
                });
                
                debugger
                clearInterval(updateClockPerSecond);
                clearInterval(updateClockPerMinute);
            }).catch(() => {
                // 静默失败，所以啥也不用做
            });
        // }, 60 * 1000);
        }, 5 * 1000);
    }
    componentDidMount() {
        updateClockPerSecond = this.updateClockPerSecond();

        updateClockPerMinute = this.updateClockPerMinute();
    }

    render() {
        const {clockList, isSelectTimeZone, timeZoneValue} = this.state;

        return (
            <div className="clock-list-wrapper">
                <div className="clock-list">
                    {
                        clockList.map((clock, index) => {
                            return <Clock clock={clock} key={clock.id} onDeleteClock={this.onDeleteClock}/>
                        })
                    }
                    
                    {/* 跟在列表后面的 “添加时钟” 图标 */}
                    {
                        isSelectTimeZone ?
                            (<div className="add-clock">
                                <Select className="select-list" value={timeZoneValue} options={timeZoneOptions} 
                                    onSelect={this.onSelectTimeZone}>
                                </Select>
                                <Button onClick={this.onCancelSelectTimeZone}>取消</Button>
                            </div>)
                            :
                            (<div className="add-clock" onClick={this.onAddClock}>
                                <span className="add-clock-icon">+</span>
                            </div>)
                    }
                </div>
            </div>
        )
    }
}

export default ClockList;