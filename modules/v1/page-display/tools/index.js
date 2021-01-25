/**
 * 深拷贝
 * @param val
 */
const deepCopy = (val) => {
    if (typeof val !== 'object') return val;
    return JSON.parse(JSON.stringify(val))
};

/**
 * 拼接 url
 * @param url
 * @param json
 * @param isAdd
 * @returns {string|*}
 */
const replaceUrl = (url, json, isAdd = true) => {
    if (!url) return url;
    url = url.toString();
    if (!json && typeof json === 'undefined') return url;
    if (isAdd) url += isIndexOf(url, '?') ? url.lastIndexOf('&') === 0 ? '' : '&' : '?';

    for (const item in json) {
        if (!json.hasOwnProperty(item)) continue;
        if (url.indexOf('{' + item + '}') >= 0) {
            url = url.replace('{' + item + '}', json[item]);
        } else {
            if (isAdd) url += `${item}=${json[item]}&`;
        }
    }
    const last = lastLetter(url);
    if (last === '&' || last === '?') url = url.substr(0, url.length - 1);
    return url;
};

/**
 * 将json转换成为search
 * @param json
 * @returns {string}
 */
const jsonToSearch = (json) => {
    let search = '';
    // if (!this.isJSON(json)) return search;
    for (const item in json) {
        if (!json.hasOwnProperty(item)) continue;
        search += `${item}=${json[item]}&`;
    }
    if (search) search = search.substring(0, search.length - 1);
    return search;
};

/**
 * 将array装换成为search
 * 参数 key value
 * @param arr
 * @returns {string}
 */
const arrayToSearch = (arr) => {
    let search = '';
    if (!Array.isArray(arr)) return search;
    for (let i = 0, len = arr.length; i < len; i++) {
        search += `${arr[i].key}=${arr[i].value}&`;
    }
    if (search) search = search.substring(0, search.length - 1);
    return search;
};

/**
 * 获取 string 字符串最后一个字母
 * @param name
 * @returns {string}
 */
const lastLetter = (name) => {
    if (!name.toString()) return "";
    return name.substring(name.length - 1, name.length)
};

/**
 * 判断 string 类型字符串中是否存在 value 字符
 * @param name
 * @param value
 * @returns {boolean}
 */
const isIndexOf = (name, value) => {
    if (!name.toString()) return false;
    return name.indexOf(value) >= 0
};

/**
 * 将search转换成json
 * @param val
 */
const searchToJson = (val) => {
    let json = {};
    if (!val) return val;
    val = isIndexOf('?') >= 0 ? val.substring(val.indexOf('?') + 1, val.length) : val;
    const arr = val.split('&');
    if (!arr) return json;
    for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i].split('=');
        if (item[1]) json[item[0]] = item[1];
        else json[item[0]] = '';
    }
    return json;
};

/**
 * 搜索数组 返回值
 * @param array 数组
 * @param params    参数
 * @param value     对比值
 * @returns {null|*}
 */
const selectArrayByParams = (array, params, value) => {
    if (!array) return null;
    for (let i = 0, len = array.length; i < len; i++) {
        if (array[i][params] === value) return array[i];
    }
};

/**
 * 搜索数组 返回匹配值
 * @param array 数组
 * @param params    参数
 * @param value     对比值
 * @returns {array}
 */
const selectArrayByArray = (array, params, value) => {
    if (!array) return [];
    let arrayResult = [];
    for (let i = 0, len = array.length; i < len; i++) {
        if (array[i][params] === value) arrayResult.push(array[i]);
    }
    return arrayResult
};

/**
 * 转换科学计数法
 * @param val
 * @returns {string}
 */
const scientificCount = (val) => {
    let m = val.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return val.toFixed(Math.max(0, (m[1] || '').length - m[2]));
};

/**
 * 金额转换，三位一个逗号 1,000
 * @param val
 * @returns {string}
 */
const amountConversion = function (val) {
//金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
    let str = val.toString();
    let d = str.indexOf(".");
    if (d < 0) d = str.length;
    let intSum = str.substring(0, d).replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
    let dot = '';
    if (str.indexOf(".") >= 0) dot = str.substring(str.length, str.indexOf("."));//取到小数部分搜索
    return (intSum + dot).toString();
};

/**
 * 金额转换
 * @param amount    金额
 * @param isConversion  是否金额转换
 * @param minLength 最小保留尾数
 * @param maxLength 最大保留尾数
 * @returns {string}
 */
const amount = (amount, isConversion = true, minLength = 2, maxLength = 8) => {
    let numberFloat = parseFloat(amount);
    let numberInt = parseInt(amount);
    //没有小数点后尾数
    if (numberFloat === numberInt) {
        if (isConversion) return amountConversion(numberFloat.toFixed(minLength));
        return numberFloat.toFixed(minLength).toString();
    }

    //有小数点后尾数
    let numberString = numberFloat.toString();
    let numberLength = numberString.length;
    let dotIndex = numberString.indexOf('.');
    let dotLength = numberString.substring(dotIndex + 1, numberLength).length;
    if (dotLength >= maxLength) numberFloat = numberFloat.toFixed(maxLength);
    if (numberFloat.toString().indexOf('e') > 0) numberFloat = scientificCount(numberFloat);
    if (isConversion) return amountConversion(numberFloat);
    return numberFloat.toString()
};

//是否是金额
const isAmount = (amount) => {
    let numberAmount = parseFloat(amount);
    console.log('isAmount', `${numberAmount.toString()} -- ${amount.toString()}`);
    return numberAmount.toString() === amount.toString();
};

const isNum = (val) => {
    if (typeof val === "undefined") return false;
    if (typeof val === "object") return false;
    let num = parseFloat(val);
    if (isNaN(num)) return false;
    return num.toString().length === val.toString().length;
}

/**
 * 格式化字符串，将中间文字替换成...
 * @param str       文字
 * @param count     左右保留个数
 * @returns {string|*}
 */
const subString = (str, count = 10) => {
    if (typeof str !== 'string') return str;
    if (str.length <= count * 2) return str;
    return `${str.substring(0, count)}...${str.substring(str.length - count, str.length)}`
};

/**
 * 格式化时间
 * @param date  new Date() 后的时间
 * @param unit
 * @returns {string}
 */
const formatDate = (date, unit = '-') => {
    if (!date) return '';
    if (typeof date === 'string' && date.indexOf('-') >= 0) date = date.replace(/-/g, '/');
    date = new Date(date);
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();
    month = month > 9 ? month : `0${month}`;
    day = day > 9 ? day : `0${day}`;
    hours = hours > 9 ? hours : `0${hours}`;
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    seconds = seconds > 9 ? seconds : `0${seconds}`;

    return `${year}${unit}${month}${unit}${day} ${hours}:${minutes}:${seconds}`
};


/**
 * 格式化时间 并且削正时区偏差
 * @param date
 * @param unit
 * @returns {string|*}
 */
const formatDateTimezoneOffset = (date, unit = '-') => {
    if (!date) return '';
    if (typeof date === 'string' && date.indexOf('-') >= 0) date = date.replace(/-/g, '/');
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    let time = new Date(date).getTime();
    time = new Date(time - timezoneOffset);
    return formatDate(time, unit);
};

/**
 * 洗牌，打乱数组
 * @param arr
 * @returns {*}
 */
const shuffle = (arr) => {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
};


/**
 * 生成随机坐标轴
 * @param rangeX    X轴参数 [起始数值，结束数值]
 * @param rangeY    Y轴参数 [起始数值，结束数值]
 * @param count     总共多少个
 * @param params
 * @returns {[]|Array}
 */
const randomXY = (rangeX = [], rangeY = [], count, params = {}) => {
    //默认值
    params.areas = params.areas ?? [50, 50, 0, 0, 0, 0];//默认区域大小
    params.historyList = params.historyList ?? [];      //历史坐标

    let arr = [], areasArr = [], i = 1;
    //历史坐标存在赋值
    if (params.historyList && params.historyList.length > 0) {
        i = params.historyList.length;
        arr = params.historyList;
    }

    if (rangeX.length < 2 || rangeY.length < 2) return [];
    if (rangeX[0] >= rangeX[1] || rangeY[0] >= rangeY[1]) return [];
    do {
        let randomX = Math.floor(Math.random() * rangeX[1]);
        let randomY = Math.floor(Math.random() * rangeY[1]);
        if (randomX < rangeX[0] || randomX > randomX[1]
            || randomY < rangeY[0] || randomY > rangeY[1]) continue;
        if (params.areas && params.areas.length >= 2) {
            const width = params.areas[0],
                height = params.areas[1],
                yT = params.areas[2] ?? 0,
                xR = params.areas[3] ?? 0,
                yB = params.areas[4] ?? 0,
                xL = params.areas[5] ?? 0;
            const startLeft = {x: randomX + xL, y: randomY + yT};
            const startRight = {x: randomX + width - xR, y: randomY + yT};
            const endLeft = {x: randomX + xL, y: randomY + height - yB};
            const endRight = {x: randomX + width - xR, y: randomY + height - yB};
            const item = areasCover(areasArr, startLeft, startRight, endLeft, endRight);
            if (item === false) continue;
            areasArr.push(item);
            // console.log(areasArr);
        }
        arr.push({x: randomX, y: randomY});
        i++;
    } while (i <= count);


    return arr;
};

const areasCover = (areasArr, startLeft, startRight, endLeft, endRight) => {
    if (areasArr.length === 0) return {startLeft, startRight, endLeft, endRight};
    for (let i = 0, len = areasArr.length; i < len; i++) {
        const item = areasArr[i];
        //左上角
        if (startLeft.x >= item.startLeft.x && startLeft.x <= item.startRight.x
            && startLeft.y >= item.startLeft.y && startLeft.y <= item.endLeft.y) return false;

        //右上角
        if (startRight.x >= item.startLeft.x && startRight.x <= item.startRight.x
            && startRight.y >= item.startRight.y && startRight.y <= item.endRight.y) return false;

        //左下角
        if (endLeft.x >= item.endLeft.x && endLeft.x <= item.endRight.x
            && endLeft.y >= item.startLeft.y && endLeft.y <= item.endLeft.y) return false;

        //右下角
        if (endRight.x >= item.endLeft.x && endRight.x <= item.endRight.x
            && endRight.y >= item.startRight.y && endRight.y <= item.endRight.y) return false;
    }
    return {startLeft, startRight, endLeft, endRight};
};

export default {
    deepCopy,
    replaceUrl,
    jsonToSearch,
    arrayToSearch,
    searchToJson,
    isIndexOf,
    lastLetter,
    selectArrayByParams,
    selectArrayByArray,
    subString,

    amountConversion,
    amount,
    isAmount,

    isNum,

    formatDate,
    formatDateTimezoneOffset,

    shuffle,
    randomXY,
}
