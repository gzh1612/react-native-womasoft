import storage from '../../data-storage/storage';
import redux from '../../data-storage/redux';
import unmount from '../unmount';

const timerVerify = 'wocode_timer_verify';
let defaultUnmount = '';

//初始化
const init = () => {
    redux.add(timerVerify, 0);
    storage.get(timerVerify).then(res => {
        if (res) res = parseInt(res);
        redux.update(timerVerify, res)
    });
};

//写入配置
const set = (_this, text = '', time = 30, unmount = '') => {
    if (!_this) return console.warn('timerVerify init方法 this undefined');
    defaultUnmount = unmount ? unmount : _this.unmount ?? _this.name;
    if (!defaultUnmount) return console.warn('timer set unmount没有获取到值，请检查');
    _this.setState({
        verify_timer_json: {
            defText: text,
            defTime: time,
            text: text,
            time: time,
            isOnPress: true,//是否可点击

        },
    });
};

const text = (_this) => {
    if (!_this) return console.warn('timerVerify text方法 this undefined');
    if (!_this.state.verify_timer_json) return;
    return _this.state.verify_timer_json.text;
};

const onPress = (_this, countDown) => {
    return new Promise((resolve, reject) => {
        if (!_this) return console.warn('timerVerify onPress this undefined');
        let json = _this.state.verify_timer_json;
        if (!json.isOnPress) return;
        json.isOnPress = false;//变成不可点击

        //获取时间进行比对
        const startTime = new Date().getTime();
        const endTime = startTime + json.defTime * 1e3;
        const historyTime = redux.get(timerVerify) ?? 0;
        //判断历史时间是否执行完毕
        if (historyTime > startTime) {
            let time = (historyTime - startTime) / 1e3;
            time = parseInt(time.toString());
            json.time = time;
            setState(_this, json);
            return reject(time);//历史时间还未结束
        }
        redux.update(timerVerify, endTime);
        storage.set(timerVerify, endTime.toString());

        setState(_this, json, countDown);
        return resolve();
    });
};

//写入循环
const setTime = (_this, countDown) => {
    const interval = setInterval(() => {
        if (!unmount.confirm(defaultUnmount)) return clearInterval(interval);
        const json = _this.state.verify_timer_json;
        if (json.time === 1) {
            json.text = json.defText;
            json.time = json.defTime;
            json.isOnPress = true;
            _this.setState({verify_timer_json: json});
            return clearInterval(interval);
        }
        json.time--;
        setText(json);
        _this.setState({verify_timer_json: json});
        if (typeof countDown === "function") countDown();
    }, 1000);
};

const setText = (json) => {
    json.text = `${json.time} s`;
};

const setState = (_this, json, countDown) => {
    setText(json);
    _this.setState({verify_timer_json: json}, () => setTime(_this, countDown));
};

export default {
    init,
    set,
    text,
    onPress,
}
