import Redux from "../Redux";
import Unmount from "../Unmount";

export default class PageVerifyCode {
    #name = 'woma_framework_verify_code';
    //获取
    #getParams = () => {
        const params = new Redux().get(this.#name);
        if (typeof params === "undefined") new Redux().add(this.#name, {});
        return params ?? {};
    }
    //写入
    #setParams = () => {
        const params = {
            defaultText: this.defaultText,
            defaultTimer: this.defaultTimer,
            currentTime: this.currentTime,
            text: this.text,
            timer: this.timer,
            endTime: this.endTime,
        };
        new Redux().update(this.#name, params);
        this._this.setState({woma_framework_verify_code: params});
    }
    //循环
    #forTimer = () => {
        const endTime = this.endTime;
        this.forTimerInterval = setInterval(() => {
            if (!this.unmount.confirm(this.pageName)) return;
            let time = Math.ceil((endTime - new Date().getTime()) / 1e3);
            if (time <= 0) {
                clearInterval(this.forTimerInterval);
                this.text = this.defaultText;
                this.isClick = true;
                return this.#setParams();
            }
            this.text = `${time} s`;
            console.log(this.text);
            this.#setParams();
        }, 10);
    }

    constructor(_this, name) {
        this._this = _this;
        this.pageName = name;
        this.unmount = new Unmount(this.#name);
    }

    set(text, timer) {
        this.defaultText = text;
        this.defaultTimer = timer;
        this.currentTime = new Date().getTime();    //当前时间
        const params = this.#getParams();
        console.log(params);
        this.text = text;
        this.timer = timer;
        this.endTime = params.endTime ?? this.currentTime;  //结束时间
        this.#setParams();
        this.isClick = true;
        console.log(`${this.currentTime}:${this.endTime}`, this.currentTime < this.endTime)
        if (this.endTime > this.currentTime) {
            this.isClick = false;
            this.#forTimer();
        }
        console.log(this.isClick);
    }


    getText() {
        const state = this._this.state.woma_framework_verify_code;
        return state ? state.text : '';
    }

    onPress() {
        return new Promise((resolve, reject) => {
            if (!this.isClick) return;
            return resolve(true);
        })
    }

    send() {
        this.currentTime = new Date().getTime();
        this.endTime = this.currentTime + this.defaultTimer * 1e3;
        this.text = `${this.defaultTimer} s`;
        this.isClick = false;
        console.log(this.endTime);
        this.#setParams();
        this.#forTimer();
    }

    remove() {
        clearInterval(this.forTimerInterval);
    }
}
