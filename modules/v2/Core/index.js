import Tools from "../Tools";

export default class Core {
    constructor() {
    }

    init() {
        this.#stringInit();
        this.#objectInit();
    }

    #stringInit = () => {
        //判断是否是JSON
        String.prototype.isJson = () => {
            return Tools.isJson(this);
        }

        //将string类型转换成json
        String.prototype.toJson = () => {
            let value = this;
            if (value.isJson()) {
                value = value.toString();
                return JSON.parse(value);
            } else {
                console.warn('toJson 出现了错误', value);
            }
        }

        ///判断是否存在
        String.prototype.isIndexOf = (name) => {
            if (!this.toString()) return false;
            return this.toString().indexOf(name) >= 0
        }

        //获取第一个字符
        String.prototype.getFromFirst = (length = 1) => {
            return Tools.getFromFirst(this, length);
        }

        //获取最后一个字符
        String.prototype.getFromLast = (length = 1) => {
            return Tools.getFromLast(this, length);
        }

        //用json替换string中的值
        String.prototype.replaceWithJson = (json) => {
            let value = this.toString();
            if (!value) return value;
            if (!json.isJson()) return value;
            return Tools.replaceWithJson(value, json);
        }

        //拼接或替换 转换为url
        String.prototype.replaceOrSpliceToUrl = (json) => {
            let value = this.toString();
            if (!value) return value;
            if (!json.isJson()) return value;
            return Tools.replaceOrSpliceToUrl(value, json);
        }

        /**
         * 格式化字符串，将中间文字替换成...
         * @param count     左右保留个数，默认 10 位
         * @param unit   替换为，默认[...]
         * @returns {string|*}
         */
        String.prototype.cutString = (count = 10, unit = '...') => {
            return Tools.cutString(this, count, unit)
        }

    }

    #objectInit = () => {
        // Object.prototype.toSearch = () => {
        //     console.log(JSON.stringify(this));
        // }
    }


}
