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

class ClockList extends Component {
    constructor(props) {
        super(props);
        let clockList = JSON.parse(localStorage.getItem('clockList'));

        if (clockList && clockList.length) {
            clockList = clockList.map(item => {
                item.curMoment = moment(item.curMoment);
                return item;
            });
        }

        this.state = {
            clockList: clockList || [],
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
        // debugger

        clockList = [...clockList, {id, timeZone, curMoment}];
        this.setState({
            clockList,
            isSelectTimeZone: false,
            timeZoneValue: ''
        });

        // 清除定时器,很关键
        clearInterval(updateClockPerSecond);
        clearInterval(updateClockPerMinute);

        // localStorage持久化
        localStorage.setItem('clockList', JSON.stringify(clockList));
    }
    onCancelSelectTimeZone() {
        this.setState({
            isSelectTimeZone: false
        });
    }

    componentWillUnmount() {
        // 清除相关的定时器。
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
                    clockList: this.updateClockListBySyncTime(syncTimeMoment)
                });
                
                clearInterval(updateClockPerSecond);
                clearInterval(updateClockPerMinute);
            }).catch(() => {
                // 静默失败，所以啥也不用做
            });
        // }, 60 * 1000);
        }, 5 * 1000);
    }
    componentDidMount() {
        // if (!updateClockPerSecond) {
        //     updateClockPerSecond = this.updateClockPerSecond();
        // }
        // if (!updateClockPerMinute) {
        //     updateClockPerMinute = this.updateClockPerMinute();
        // }
        clearInterval(updateClockPerSecond);
        clearInterval(updateClockPerMinute);

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