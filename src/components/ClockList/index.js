// 时钟列表 组件
import React, {Component} from 'react';
import {Select, Button} from 'antd';
import moment from 'moment';
import {getDateTimeByTimeZone, getTimeZoneOptions, SECONDS, syncTime} from '../../util/utils';
import Clock from '../Clock';

import './ClockList.less';

const timeZoneOptions = getTimeZoneOptions();

// 格式化 clockList ，通过“JSON.stringfy序列化”后有些数据会“失真”
const formatClockList = (clockListPre) => {
    let clockList = JSON.parse(clockListPre);

    if (clockList && clockList.length) {
        clockList = clockList.map(item => {
            item.curMoment = moment(item.curMoment);
            return item;
        });
    }
    return clockList;
}

class ClockList extends Component {
    constructor(props) {
        super(props);
        let clockListPre = localStorage.getItem('clockList');
        const clockList = formatClockList(clockListPre);

        this.state = {
            clockList: clockList || [],
            isSelectTimeZone: false,
            timeZoneValue: '',
        }

        this.onAddClock = this.onAddClock.bind(this);
        this.onSelectTimeZone = this.onSelectTimeZone.bind(this);
        this.onCancelSelectTimeZone = this.onCancelSelectTimeZone.bind(this);
        this.onDeleteClock = this.onDeleteClock.bind(this);
        this.getClockListBySyncTime = this.getClockListBySyncTime.bind(this);
        // 2个定时器
        this.updateClockPerSecond = this.updateClockPerSecond.bind(this);
        this.updateClockPerMinute= this.updateClockPerMinute.bind(this);
        // storage相关的事件监听处理
        this.storageListenerHandler = this.storageListenerHandler.bind(this);
    }

    // 通过syncTime值返回最新的时钟列表数据
    getClockListBySyncTime(syncTime) {
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
        let {clockList} = this.state;

        clockList = clockList.filter(item => item.id !== id)
        this.setState({
            clockList,
        });

        // localStorage持久化
        localStorage.setItem('clockList', JSON.stringify(clockList));
    }
    // 选中具体的时区
    onSelectTimeZone(timeZone) {
        let {clockList} = this.state;
        const {id, curMoment} = getDateTimeByTimeZone(timeZone);

        clockList = [...clockList, {id, timeZone, curMoment}];
        this.setState({
            clockList,
            isSelectTimeZone: false,
            timeZoneValue: ''
        });

        // localStorage持久化
        localStorage.setItem('clockList', JSON.stringify(clockList));
    }
    onCancelSelectTimeZone() {
        this.setState({
            isSelectTimeZone: false
        });
    }

    storageListenerHandler(e) {
        const clockList =  formatClockList(e.newValue);

        this.setState({
            clockList
        });
    }

    componentWillMount() {
        // 监听 localStorage 变化，以更新各处Tab标签页的时钟列表
        window.addEventListener("storage", this.storageListenerHandler);
    }

    componentWillUnmount() {
        // 清除相关的定时器与监听事件。
        clearInterval(this.intervalSecond);
        clearInterval(this.intervalMinute);
        window.removeEventListener("storage", this.storageListenerHandler);
    }

    updateClockPerSecond() {
        const intervalSecondID =  setInterval(() => {
            const {clockList} = this.state;
            const {length} = clockList;

            // 性能优化，为空数组没必要setState
            if (!length) {
                return;
            }
            
            this.setState({
                clockList: clockList.map(item => {
                    item.curMoment = item.curMoment.add(1, SECONDS);
                    return item;
                })
            });
        }, 1 * 1000);

        return intervalSecondID;
    }
    updateClockPerMinute() {
        const intervalMinuteID = setInterval(() => {
            const {clockList} = this.state;
            const {length} = clockList;
            
            // 性能优化，为空数组没必要setState
            if (!length) {
                return;
            }

            syncTime().then(res => {
                const clockList = this.getClockListBySyncTime(res);
                this.setState({
                    clockList
                });
            }).catch(() => {
                // 静默失败，所以啥也不用做
            });
        }, 60 * 1000);

        return intervalMinuteID;
    }
    componentDidMount() {
        this.intervalSecond = this.updateClockPerSecond();
        this.intervalMinute = this.updateClockPerMinute();
    }

    render() {
        const {clockList, isSelectTimeZone, timeZoneValue} = this.state;

        return (
            <div className="clock-list-wrapper">
                <div className="clock-list">
                    {
                        clockList.map((clock) => {
                            return <Clock clock={clock} key={clock.id} onDeleteClock={this.onDeleteClock}/>
                        })
                    }
                    
                    {/* 跟在列表后面的 “添加时钟” 图标 */}
                    {
                        isSelectTimeZone ?
                            (<div className="add-clock">
                                <Select className="select-list" 
                                    value={timeZoneValue} options={timeZoneOptions} showSearch allowClear
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