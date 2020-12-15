
import moment from 'moment';

// 【均匀】产生 min-max（头尾都含，即 [min, max] ） 的随机数。
// 使用 ES6 解构、默认参数，异常检测 max >= min ？
const genRandomNum = (min, max) => {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}

// 实现 syncTime ，“异步”获取时间。const syncTime = () => Promise<TimeResponse>;
const syncTime = () => {
    return new Promise((resolve, reject) => {
        const MIN = 1;
        const MAX = 10;
        // 固定 0.8秒 的延迟。
        const TIME_OF_DELAY = 800;

        if (genRandomNum(MIN, MAX) <= 3) {
            reject('我是message，错误原因：xxx');
        } else {
            setTimeout(() => {
                // 日期格式可能需要作进一步调整
                resolve(moment());
            }, TIME_OF_DELAY);
        }
    });
}