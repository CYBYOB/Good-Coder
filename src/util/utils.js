
import moment from 'moment';
import _ from 'lodash';

// moment.js 相关的常量字符串
export const SECONDS = 'seconds';
export const HOURS = 'hours';
export const DAYS = 'days';

export const timeZoneList = [
    // label展示给用户的、value是程序使用的【label、value进行分离、解耦】；timeDiff计算差多少个小时，如 -1、+1（即1）。
    // [label, value, timeDiff],
    ['北京', '北京', 0],
    ['伦敦', '伦敦', -8],
    ['纽约', '纽约', -13],
    ['巴黎', '巴黎', -7],
    ['东京', '东京', +1],
    ['悉尼', '悉尼', +2]
];

// ClockList组件中，时区下拉框的数据源
export const getTimeZoneOptions = () => {
    return timeZoneList.map(item => {
        const [label, value] = item;
        return {label, value};
    })
}

// 根据时区返回相应的“日期、时间等数据”。为了复用加上curMoment字段【其存在这说明是通过 syncTime 做的更新】。
export const getDateTimeByTimeZone = (timeZone, curMoment) => {
    let resObj = {};
    const timeDiff = timeZoneList.filter(item => item[1] === timeZone)[0][2];

    if (!curMoment) {
        // 此时需要生成对应的id
        curMoment = moment();
        resObj.id = curMoment.valueOf()
    }

    let tempCurMoment = _.cloneDeep(curMoment);
    tempCurMoment = tempCurMoment.add(timeDiff, HOURS);
    resObj = Object.assign(resObj, {curMoment: tempCurMoment});

    return resObj;
}

// 【均匀】产生 min-max（头尾都含，即 [min, max] ） 的随机数。
export const genRandomNum = (min, max) => {
    // const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNum = _.random(min, max);
    return randomNum;
}

// 实现 syncTime ，“异步”获取时间。const syncTime = () => Promise<TimeResponse>;
export const syncTime = () => {
    return new Promise((resolve, reject) => {
        const MIN = 1;
        const MAX = 10;
        // 固定 0.8秒 的延迟。
        const TIME_OF_DELAY = 800;

        if (genRandomNum(MIN, MAX) <= 3) {
            reject('我是message，错误原因：xxx');
        } else {
            setTimeout(() => {
                // 随机产生秒级的【假误差】，范围是 [-1, 1] 。
                const randomSeconds = genRandomNum(-1, 1);
                resolve(moment().add(randomSeconds, SECONDS));
            }, TIME_OF_DELAY);
        }
    });
}