export default class Tools {
    /**
     ---    is 判断方法
     *  isArray             //  判断是否为数组
     *  isAmount            //  判断是否为金额
     *  isNum               //  判断是否为数字
     ---
     */
    constructor() {
    }

    /**
     * is 判断方法
     */
    //判断是否为数据
    static isArray(value) {
        if (typeof value === 'object') {
            if (value.length > 0) return true;
            else if (value.toString() === '') return true;
        }
        return false
    }

    //是否是金额
    static isAmount(value) {
        let numberAmount = parseFloat(value);
        console.log('isAmount', `${numberAmount.toString()} -- ${value.toString()}`);
        return numberAmount.toString() === value.toString();
    }

    //是否是数字
    static isNum(value) {
        if (typeof value === "undefined") return false;
        if (typeof value === "object") return false;
        let num = parseFloat(value);
        if (isNaN(num)) return false;
        return num.toString().length === value.toString().length;
    }

    //是否是JSON
    static isJson(value) {
        try {
            if (typeof value === "string") return false;
            value = JSON.stringify(value);
            const json = JSON.parse(value);
            return !!(typeof json === "object" && json);
        } catch (err) {
            return false;
        }
    }

    //判断最后一个index
    static isLastIndexOf(str, value) {
        if (typeof str !== "string") return console.warn(`Tools isLastIndexOf str=${str}`);
        return str.lastIndexOf(value) === str.length - 1
    }

    /**
     *  -----------------------------
     */

    //深拷贝
    static copy(value) {
        if (typeof value !== "object") return value;
        return JSON.parse(JSON.stringify(value));
    }

    //用json替换string中的值
    static replaceWithJson(value, json) {
        if (!value) return value;
        if (!Tools.isJson(json)) return value;
        for (const item in json) {
            if (!json.hasOwnProperty(item)) continue;
            if (value.indexOf(`{${item}}`) < 0) continue;
            value = value.replace(`{${item}}`, json[item]);
        }
        return value;
    }

    //拼接或替换 转换为url
    static replaceOrSpliceToUrl(value, json) {
        if (!value) return value;
        if (!Tools.isJson(json)) return value;
        value += value.indexOf('?') > 0 ? Tools.isLastIndexOf(value, '&') ? '' : '&' : '?';
        for (const item in json) {
            if (!json.hasOwnProperty(item)) continue;
            if (value.indexOf(`{${item}}`) < 0) {
                value += `${item}=${json[item]}&`;
            } else {
                value = value.replace(`{${item}}`, json[item]);
            }
        }
        if (Tools.isLastIndexOf(value, '?') || Tools.isLastIndexOf(value, '&')) value = value.substring(0, value.length - 1);
        return value;
    }

    //将json转换成为search
    static jsonToSearch(json) {
        let search = '';
        for (const item in json) {
            if (!json.hasOwnProperty(item)) continue;
            search += `${item}=${json[item]}&`;
        }
        if (search) search = search.substring(0, search.length - 1);
        return search;
    }

    //将array装换成为search
    static arrayToSearch(arr) {
        let search = '';
        if (!Array.isArray(arr)) return search;
        for (let i = 0, len = arr.length; i < len; i++) {
            search += `${arr[i].key}=${arr[i].value}&`;
        }
        if (search) search = search.substring(0, search.length - 1);
        return search;
    }

    //将search转换成json
    static searchToJson(value) {
        let json = {};
        if (!value) return value;
        value = value.isIndexOf('?') ? value.substring(value.indexOf('?') + 1, value.length) : value;
        const arr = value.split('&');
        if (!arr) return json;
        for (let i = 0, len = arr.length; i < len; i++) {
            const item = arr[i].split('=');
            if (item[1]) json[item[0]] = item[1];
            else json[item[0]] = '';
        }
        return json;
    }

    //获取第一个字符
    static getFromFirst(value, length = 1) {
        if (!value) return false;
        if (value.toString().length < length) {
            console.warn('getFirst 出现错误', `长度比：${value.toString().length}：${length}`);
            return '';
        }
        return value.toString().substring(0, length);
    }

    //获取最后一个字符
    static getFromLast(value, length = 1) {
        if (!value.toString()) return false;
        if (value.toString().length < length) {
            console.warn('getFirst 出现错误', `长度比：${value.toString().length}：${length}`);
            return '';
        }
        return value.toString().substring(value.toString().length - length, value.toString().length);
    }

    /**
     * 搜索数组 返回值
     * @param array     数组
     * @param params    参数
     * @param value     对比值
     * @returns {null|*}
     */
    static selectArrayByParams(array, params, value) {
        if (!array) return null;
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i][params] === value) return array[i];
        }
    }

    /**
     * 搜索数组 返回匹配值
     * @param array     数组
     * @param params    参数
     * @param value     对比值
     * @returns {array}
     */
    static selectArrayByArray(array, params, value) {
        if (!array) return [];
        let arrayResult = [];
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i][params] === value) arrayResult.push(array[i]);
        }
        return arrayResult
    }

    //json对比
    static JsonContrast(jsonOne, jsonTwo) {
        const jsonOneString = JSON.stringify(jsonOne);
        const jsonTwoString = JSON.stringify(jsonTwo);
        return jsonOneString === jsonTwoString;
    }

    //转换科学计数法
    static scientificCount(value) {
        let m = value.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
        return value.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    }

    /**
     * 金额转换，三位一个逗号 1,000
     * @param value
     * @returns {string}
     */
    static amountConversion(value) {
        //金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
        let str = value.toString();
        let d = str.indexOf(".");
        if (d < 0) d = str.length;
        let intSum = str.substring(0, d).replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
        let dot = '';
        if (str.indexOf(".") >= 0) dot = str.substring(str.length, str.indexOf("."));//取到小数部分搜索
        return (intSum + dot).toString();
    }

    /**
     * 金额转换
     * @param value         金额
     * @param params        参数  [convert | min | max]
     * @returns {string}
     */
    static amount(value, params) {
        if (!params) params = {};
        let convert = typeof params.convert === "boolean" ? params.convert : true;
        let minLength = typeof params.min === "number" ? params.min : 2;
        let maxLength = typeof params.max === "number" ? params.max : 4;

        let numberFloat = parseFloat(value);
        let numberInt = parseInt(value);
        //没有小数点后尾数
        if (numberFloat === numberInt) {
            if (convert) return Tools.amountConversion(numberFloat.toFixed(minLength));
            return numberFloat.toFixed(minLength).toString();
        }
        //有小数点后尾数
        let numberString = numberFloat.toString();
        let numberLength = numberString.length;
        let dotIndex = numberString.indexOf('.');
        let dotLength = numberString.substring(dotIndex + 1, numberLength).length;
        if (dotLength >= maxLength) numberFloat = numberFloat.toFixed(maxLength);
        if (numberFloat.toString().indexOf('e') > 0) numberFloat = Tools.scientificCount(numberFloat);
        if (convert) return Tools.amountConversion(numberFloat);
        return numberFloat.toString()
    }


    /**
     * 格式化字符串，将中间文字替换成...
     * @param value     文字
     * @param count     左右保留个数，默认 10 位
     * @param unit   替换为，默认[...]
     * @returns {string|*}
     */
    static cutString(value, count = 10, unit = '...') {
        if (typeof value !== 'string') return value;
        if (value.length <= count * 2) return value;
        return `${value.substring(0, count)}${unit}${value.substring(value.length - count, value.length)}`
    }

    //格式化时间
    static formatDate(date, unit = '-') {
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
    }

    //格式化时间 并且削正时区偏差
    static formatDateTimezoneOffset(date, unit = '-') {
        if (!date) return '';
        if (typeof date === 'string' && date.indexOf('-') >= 0) date = date.replace(/-/g, '/');
        const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        let time = new Date(date).getTime();
        time = new Date(time - timezoneOffset);
        return Tools.formatDate(time, unit);
    }

    //洗牌，打乱数组
    static shuffle(arr) {
        let i = arr.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
    }

    /**
     * 生成随机坐标轴
     * @param rangeX    X轴参数 [起始数值，结束数值]
     * @param rangeY    Y轴参数 [起始数值，结束数值]
     * @param count     总共多少个
     * @param params
     * @returns {[]|Array}
     */
    static randomXY(rangeX = [], rangeY = [], count, params = {}) {
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
                const item = randomXYAreasCover(areasArr, startLeft, startRight, endLeft, endRight);
                if (item === false) continue;
                areasArr.push(item);
                // console.log(areasArr);
            }
            arr.push({x: randomX, y: randomY});
            i++;
        } while (i <= count);
        return arr;
    }

    /**
     * 版本对比
     * @param newVersion        对比版本
     * @param newBuild          对比build
     * @param version           版本
     * @param build             build
     * @returns {boolean|void}
     */
    static versionContrast(newVersion, newBuild, version, build) {
        if (typeof newVersion === "undefined") return console.warn('tools versionContrast newVersion 值为undefined');
        if (typeof newBuild === "undefined") return console.warn('tools versionContrast newBuild 值为undefined');
        if (typeof version === "undefined") return console.warn('tools versionContrast version 值为undefined');
        if (typeof build === "undefined") return console.warn('tools versionContrast build 值为undefined');
        const newList = newVersion.split('.'),
            thisList = version.split('.');
        let result = false;
        thisList.map((item, key) => {
            const newValue = parseInt(newList[key]),
                thisValue = parseInt(item);
            console.log(`${newValue}:${thisValue}`);
            if (newValue > thisValue) return result = true;
        });
        if (parseInt(newBuild) > parseInt(build)) result = true;
        console.log('versionContrast', result);
        return result;
    }
}


//生成随机坐标轴 覆盖区域
const randomXYAreasCover = (areasArr, startLeft, startRight, endLeft, endRight) => {
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
}
