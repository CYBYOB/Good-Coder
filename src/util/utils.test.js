import {
  getTimeZoneOptions,
  timeZoneList,
  genRandomNum,
  syncTime
} from './utils'

test('测试getTimeZoneOptions函数', () => {
  const tempArr = timeZoneList.map(item => {
      const [label, value] = item;
      return {label, value};
  });

  expect(getTimeZoneOptions()).toStrictEqual(tempArr)
})

test('测试genRandomNum函数', () => {
  const min = 1;
  const max = 10;

  for (let i=1; i< 1000; i++) {
    const res = genRandomNum(min, max);
    expect(res >= min).toBeTruthy();
    expect(res <= max).toBeTruthy();
  }
})

test('测试syncTime函数[reject]', () => {
  return expect(syncTime()).rejects.toMatch(/我是message，错误原因：/);
});
