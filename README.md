# react-native-womasoft

# 简介

本框架是针对于 React Native 的快速开发App工具

# 安装初始化

npm

```
 npm install react-native-womasoft
```

yarn

```
 yarn add react-native-womasoft
```

### 创建项目

#### 创建新项目

```
npx react-native init 项目名称
```

#### 在新项目中引用框架

```
cd 项目名称
```

##### npm

```
npm install react-native-womasoft
```

##### yarn

```
yarn add react-native-womasoft
```

#### 引入导航框架

##### npm

```
npm install @react-navigation/native
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view 
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
```

##### yarn

```
yarn add @react-navigation/native
yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
yarn add @react-navigation/stack
yarn add @react-navigation/bottom-tabs
```

#### 引用其他框架

##### npm

```
npm install --save react-native-device-info redux @react-native-community/async-storage react-native-localize react-native-vector-icons react-native-fs @react-native-community/clipboard react-native-svg react-native-qrcode-svg react-native-splash-screen
```

##### yarn

```
yarn add react-native-device-info redux @react-native-community/async-storage react-native-localize react-native-vector-icons react-native-fs @react-native-community/clipboard react-native-svg react-native-qrcode-svg react-native-splash-screen
```

因为导入了 react-native-fs  
需要在 android => settings.gradle 中添加：

```
include ':react-native-fs'
project(':react-native-fs').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fs/android')
```

#### 代码模板

```
https://github.com/gzh1612/react-native-template
```

将代码克隆下来后粘贴替换到生成的项目中。  
项目中的目录结构：

+ android
+ ios
+ src
    + assets
        + conf
        + confFetch
        + confFonts
        + confLanguage
        + confTheme
        + images
    + view
        + _template
        + page_center
        + page_main
        + page_public
    + init.js
+ App.js

# 说明文档

## 一、目录

#### 1、[Core](#user-content-core)

#### 2、[Emitter](#user-content-emitter)

#### 3、[Fetch](#user-content-fetch)

#### 4、[Files](#user-content-files)

#### 5、[Language](#user-content-language)

#### 6、[Loading](#user-content-loading)

#### 7、[Modal](#user-content-modal)

#### 8、[Nav](#user-content-nav)

#### 9、[Page](#user-content-page)

#### 10、[Popup](#user-content-popup)

#### 11、[Redux](#user-content-redux)

#### 12、[Storage](#user-content-storage)

#### 13、[System](#user-content-system)

#### 14、[Theme](#user-content-theme)

#### 15、[Tools](#user-content-tools)

#### 16、[Unmount](#user-content-umount)

## 二、使用说明

### 1、<a id="core">Core</a>

Core组件内置一些默认方法

```javascript
new Core().init();
```

### 2、<a id="emitter">Emitter</a>

Emitter组件包装于 react native DeviceEventEmitter方法

传递数据：

```javascript
new Emitter().set(name, value);
```

例：

```javascript
new Eimtter().set('nickname', '张三');

new Eimtter().set('user', {
    cellphone: '13000000000',
    email: '13000000000@163.com',
});
```

获取数据：

```javascript
new Emitter().get(name, success);
```

例：

```javascript
new Emitter().get('nickname', data => {
    console.log(data);
    // data = 张三
    // this.setState({nickname: data});
})
```

在有get方法时，需在页面关闭方法中（componentWillUnmount）将组件注销掉

```javascript
componentDidMount()
{
    this.emitter = new Eimtter().get('user', data => {
        //data 为要接收的参数，进行下一步操作
    })
}

componentWillUnmount()
{
    if (this.emitter) this.emitter.remove();
}
```

### 3、<a id="fetch">Fetch</a>

Fetch组件用于网络请求  
静态参数：

```javascript
//默认权限名称
Fetch.authDefaultName

//参数
Fetch.params.log                    //log
Fetch.params.timeout                //超时时间
Fetch.params.status                 //错误状态处理
Fetch.params.type                   //默认类型，可用于切换API
Fetch.params.authValue              //存储权限

//权限
Fetch.auth.token
Fetch.auth.session

//状态
Fetch.status.SERVE_TIMEOUT          //网络请求超时
Fetch.status.SERVE_FAILED           //网络请求失败
Fetch.status.SERVE_ERROR            //请求错误

//数据请求类型
Fetch.contentType.application_json
Fetch.contentType.application_www
Fetch.contentType.form_data
Fetch.contentType.text_html
```

##### 初始化 init 方法

+ log：true 或 false
+ timeout：int类型，精确到毫秒
+ status：错误状态处理，function类型
+ authValue：权限配置，Array类型

```javascript
new Fetch().init([
    {name: Fetch.params.log, value: false},                             //log
    {name: Fetch.params.timeout, value: 30000},                         //超时时间
    {name: Fetch.params.status, value: status()},                       //请求状态处理
    {name: Fetch.params.authValue, value: [{name: Fetch.authDefaultName, type: Fetch.auth.token, value: ''}]},
])
```

status错误状态处理

```javascript
function status() {
    const fetchStatus = {};
    fetchStatus[Fetch.status.SERVE_TIMEOUT] = () => {
        //请求超时
    };
    fetchStatus[Fetch.status.SERVE_FAILED] = () => {
        //请求失败
    };
    fetchStatus[Fetch.status.SERVE_ERROR] = () => {
        //请求错误
    };
    fetchStatus[401] = () => {
        //没有权限
    };
    //可自行配置 如 404、405等
    return fetchStatus;
}
```

##### get 请求

+ url：请求地址（必填）
+ body：json参数
+ params：contentType | isAuth | authValue

```javascript
new Fetch().get(url, body, params);
```

例：

```javascript
const url = 'http://192.168.31.108/api/article/{type}?size={size}&p={p}';

new Fetch().get(url, {type: 1, size: 10, p: 1}).then(res => {
    //请求结果
})

//需要权限验证才能请求到数据，否则请求返回 401 
new Fetch().get(url, {type: 1, size: 10, p: 1}, {isAuth: true}).then(res => {
    //请求结果
})
```

##### post 请求

+ url：请求地址（必填）
+ body：json参数
+ params：contentType | isAuth | authValue

```javascript
new Fetch().post(url, body, params);
```

例：

```javascript
const url = 'http://192.168.31.108/api/article/create';

new Fetch().post(url, {name: '1'}).then(res => {
    //请求结果
})

//需要权限验证才能请求到数据，否则请求返回 401 
new Fetch().post(url, {name: '1'}, {
    isAuth: true,
    contentType: Fetch.contentType.application_json
}).then(res => {
    //请求结果
})
```

##### put 请求

+ url：请求地址（必填）
+ body：json参数
+ params：contentType | isAuth | authValue

```javascript
new Fetch().put(url, body, params);
```

例：

```javascript
const url = 'http://192.168.31.108/api/article/create';

new Fetch().put(url, {name: '1'}).then(res => {
    //请求结果
})

//需要权限验证才能请求到数据，否则请求返回 401 
new Fetch().put(url, {name: '1'}, {isAuth: true, authValue: 'token值'}).then(res => {
    //请求结果
})
```

##### delete 请求

+ url：请求地址（必填）
+ body：json参数
+ params：contentType | isAuth | authValue

```javascript
new Fetch().delete(url, body, params);
```

例：

```javascript
const url = 'http://192.168.31.108/api/article/delete';

new Fetch().delete(url, {id: 1}).then(res => {
    //请求结果
})

```

##### getAuthValue

获取权限存储内容

```javascript
new Fetch().getAuthValue();
```

##### getAuthValueByName

根据名称搜索权限

```javascript
new Fetch().getAuthValueByName(name);
```

##### getType

获取默认类型

```javascript
new Fetch().getType();
```

##### getTimeout

获取超时时间

```javascript
new Fetch().getTimeout();
```

##### getStatus

```javascript
new Fetch().getStatus();
```

##### getIsLog

```javascript
new Fetch().getIsLog();
```

##### setAuthValue

写入默认权限  
用于登录成功后将token加入默认权限中

```javascript
new Fetch().setAuthValue(value);
```

##### setAuthValueCustom

权限 自定义  
可自定义多权限，配置多个权限token

```javascript
new Fetch().setAuthValueCustom(name, type, value);
```

##### setType

写入类型

```javascript
new Fetch().setType(value);
```

### 4、<a id="files">Files</a>

文件上传下载工具组件

##### path

文件存储地址

```javascript
Files.path
```

##### exists

判断文件是否存在

```javascript
new Files().exists(url);
```

##### stop

暂停下载

```javascript
 new Files().stop(id);
```

##### remove

删除文件

```javascript
new Files().remove(filePath);
```

##### download

下载

+ url：请求地址
+ filePath：下载保存路径
+ progressDivider：多少百分比返回一次
+ beginSuccess：开始下载调用
+ progressSuccess：下载进行中调用
+ params：{header:{"Cookie":"cookie"}}

```javascript
new Files().download(url, filePath, progressDivider, beginSuccess, progressSuccess, params);
```

##### upload

文件上传

+ uploadUrl
+ files
+ progressSuccess
+ params：{header:{}}

```javascript
new Files().upload(uploadUrl, files, progressSuccess, params);
```

### 5、<a id="language">Language</a>

多语言

```javascript
//多语言类型
Language.type;

//多语言数据存储
Language.data;
```

##### init

初始化多语言

+ languageAll：语言json配置文件。 如：{zh:{},en:{}}
+ defaultName：默认语言。如：zh

```javascript
new Language().init(languageAll, defaultName);
```

##### getLocales

获取系统语言，地区类型

```javascript
new Language().getLocales();
```

##### getType

获取当前存储的语言类型

```javascript
new Language().getType();
```

##### set

写入数据

+ type：多语言类型
+ data：多语言数据

```javascript
new Language().set(type, data);
```

##### all

根据名称获取全部

+ name：配置的页面名称

```javascript
new Language().all(name);
```

##### get

获取详细某一个

+ name：配置的页面名称。如：page.title,获取的就是page页面，title名称

```javascript
new Language().get(name);
```

### 6、<a id="loading">Loading</a>

Loading加载框

##### 静态参数

```javascript
//类型
Loading.type.system;            //系统默认类型
Loading.type.icon;              //icon 图标
Loading.type.image;             //image 图片
Loading.type.gif;               //gif 图片

//名称
Loading.names.start;            //开始
Loading.names.complete;         //完成
Loading.names.cancel;           //取消
Loading.names.error;            //错误
```

##### InitView

初始化 Loading 加载框

+ params [ ]（不必须 ）
    + name：名称
    + type：类型
    + value：值
    + style：样式（不必须）

```javascript
//页面配置
<Loading.InitView/>

//初始化方法
new Loading().init(params);

// 例：
new Loading().init([
    {name: Loading.names.start, type: Loading.type.image, value: '图片地址'},
])
```

##### isLoading

判断loading是否打开

```javascript
new Loading().isLoading();
```

##### show

显示

+ content：内容

```javascript
new Loading().show(content);
```

##### hide

隐藏

```javascript
new Loading().hide();
```

##### next

只更改显示文字

+ content

```javascript
new Loading().next(content);
```

##### start

框架自带方法

+ content

```javascript
new Loading().start(content);
```

##### cancel

框架自带方法

+ content

```javascript
new Loading().cancel(content);
```

##### complete

框架自带方法

+ content
+ func：func有值显示1秒后隐藏，执行func

```javascript
new Loading().complete(content, func);
```

##### error

框架自带方法

+ content

```javascript
new Loading().error(content);
```

##### small

小的loading，用于数据加载

+ params：{}
    + color
    + style

```javascript
new Loading().small(params);

//例:
new Loading().small();
new Loading().small({color: '#fff'});
```

### 7、<a id="modal">Modal</a>

Modal 模态弹出框

##### InitView

初始化 Modal 加载

+ params
    + name
    + type
    + btn []
        + id
        + text

```javascript
//页面加载
<Modal.InitView/>

//初始化方法
new Modal().init(params);
```

静态参数

```javascript
// 名称
Modal.names.alert;
Modal.names.confirm;
Modal.names.confirmPwd;

// 方向
Modal.type.row; // 行
Modal.type.col; // 列

// 按钮id
Modal.id.one;
Modal.id.two;
Modal.id.three;
Modal.id.four;
Modal.id.five;
```

##### show

显示 Modal，默认是 alert

+ content
+ func

```javascript
new Modal().show(content, func);

// 例：
new Modal().show('弹出框', res => {
    // res 返回点击按钮的id
})
```

##### hide

隐藏 Modal

```javascript
new Modal().hide();
```

##### alert

单按钮弹出框

+ content
+ func

```javascript
new Modal().alert(content, func);
```

##### confirm

确认弹出框

+ content
+ func

```javascript
new Modal().confirm(content, func);

// 例：
new Modal().confirm('是否是confirm', res => {
    if (new Modal().isOne(res)) {
        //点击了第一个按钮
    }
})
```

##### confirmPwd

确认带密码框

+ func

```javascript
new Modal().confirmPwd(func);
```

##### isOne

判断是否点击了第一个按钮

+ res

```javascript
 new Modal().confirm('我点击了第一个按钮', res => {
    if (new Modal().isOne(res)) {
        //点击第一个按钮进入这里
    }
});
```

##### isTwo

判断是否点击了第二个按钮

+ res

```javascript
 new Modal().confirm('我点击了第一个按钮', res => {
    if (new Modal().isTwo(res)) {
        //点击第二个按钮进入这里
    }
});
```

##### isThree

判断是否点击了第三个按钮，需要自定义配置，才会出现三个按钮

##### isFour

判断是否点击了第四个按钮，需要自定义配置，才会出现四个按钮

##### isFive

判断是否点击了第五个按钮，需要自定义配置，才会出现五个按钮

### 8、<a id="nav">Nav</a>

导航配置

##### 静态参数

```javascript
//导航 bar 颜色
Nav.headerBar;

//黑色
Nav.barBlack;

//白色
Nav.barWhite;

//header left icon 名称
Nav.headerLeftIconName;

//底部导航名称
Nav.footerName;

//页面渐隐
Nav.fade();
```

##### init

初始化导航

+ params {}
    + headerLeftIconName header左侧Icon名称

```javascript
new Nav().init({headerLeftIconName: 'iconName'});
```

##### setThis

写入 this

+ that 传入当前页面 this

```javascript
 new Nav().setThis(this);
```

##### headerLeft

header 左侧箭头显示

+ params {}
    + color 颜色
    + name 名称
    + onPress 点击事件

```javascript
new Nav().headerLeft(params);

// 获取默认配置的 headerLeft
new Nav().headerLeft();
```

##### go

跳转

+ routeName 页面名称
+ params 跳转传入参数值
+ timer 延时跳转时间

```javascript
new Nav().go(routeName, params, timer);

//  例:
new Nav().go('跳转页面', {id: 1});
```

##### back

返回

+ timer

```javascript
new Nav().back(timer);
```

##### empty

清空缓存

+ routeName
+ timer

```javascript
new Nav().empty(routeName, timer);
```

##### popToTop

返回到最顶级

+ timer

```javascript
new Nav().popToTop(timer);
```

##### replace

替换

+ routeName
+ params
+ timer

```javascript
new Nav().replace(routeName, params, timer);
``` 

##### getHeaderBar

获取header bar

```javascript
new Nav().getHeaderBar();
```

###### setHeaderBar

写入header bar 颜色

+ value 值

```javascript
new Nav().setHeaderBar(value);
```

##### hide

隐藏底部导航

```javascript
new Nav().hide();
```

##### show

显示底部导航

```javascript
new Nav().show();
```

##### emitterFooter

监听底部导航变化

+ func 变化后方法

```javascript
new Nav().emitterFooter(func);
```

### 9、<a id="page">Page</a>

#### (1)、Base

最底层页面

+ log 查看log
+ this 获取当前页面this
+ style 页面样式
+ isPress 是否可以点击
+ onBlur 点击失去焦点
+ onPress 点击事件

```javascript
render()
{
    return <Page.Base>
        // 内容
    </Page.Base>
}

// 例：
render()
{
    return <Page.Base this={this}>

    </Page.Base>
}
```

#### (2)、Render

底层页面，用于一般页面

+ log
+ this 获取当前页面this
+ style render附加样式
+ innerStyle 内边样式
+ isPress 是否可以点击
+ onBlur 点击失去焦点
+ isBar 是否显示 barView
+ isHeader 是否显示 headerView
+ headerStyle header 样式
+ headerLeft header 左侧图标
+ headerRight header 右侧图标
+ barBg bar 背景

```javascript
render()
{
    return <Page.Render>
        // 内容
    </Page.Render>
}

// this
<Page.Render this={this}>
    // 内容
</Page.Render>

// onBlur
<Page.Render onBlur={this}>
    // 内容
</Page.Render>

// isBar
<Page.Render isBar={false}>
    // 内容
</Page.Render>

// isHeader
<Page.Render isHeader={false}>
    // 内容
</Page.Render>
```

##### onBlur

失去焦点事件

+ that 当前页面this

```javascript
new Page.Render().onBlur(this);
```

#### (3)、Header

header 展示

+ this
+ log
+ title： title显示名称
+ left： 左侧 view
+ right： 右侧 view
+ style： header 样式
+ bg： header 背景颜色
+ titleStyle： title 样式
+ titleColor： title 颜色
+ titleSize：title 大小
+ leftColor：左侧图标颜色
+ t：marginTop

```javascript
<Page.Header></Page.Header>

// 例：
<Page.Header title={'title'} right={<View/>}></Page.Header>
```

#### (4)、Icon

图标Icon

+ log
+ name
+ size
+ color
+ style
+ t：marginTop
+ l：marginLeft
+ r：marginRight
+ b：marginBottom
+ onPress

```javascript
<Page.Icon name={'名称'} onPress={() => {
    // 点击事件
}}>
```

#### (5)、Text

文本显示，点击跳转

+ log
+ isText：是否全部是文本，默认false
+ text：显示内容
+ children：多样内容
+ color：颜色
+ size：大小
+ lineHeight：行高
+ line：显示行数并且多余的文字小数点替换，必须设置当前 View 的宽度
+ width：宽度
+ style
+ isPress
+ onPress
+ onLongPress：长按，不可与onPress同时存在
+ t
+ b
+ l
+ r

```javascript
// 基本演示
<Page.Text text={'文本'}/>

// 带点击事件
<Page.Text text={'文本'} OnPress={() => {
    // 点击后操作
}}/>

// 充当跳转点击View，children中添加复杂View
<Page.Text onPress={() => {
    // 点击后操作
}}>
    // children 中
    <Page.Text text={'点击跳转'} color={'#f00'}/>
</Page.Text>

// 长按
<Page.Text text={'长按'} onLongPress={() => {

}}/>
```

#### (6)、Slide

Page 滑动组件

+ log
+ style
+ onRefresh：下拉刷新操作
+ refreshing：下拉刷新loading
+ loading：显示loading
+ onPaging：分页执行

```javascript
<Page.Render>
    <Page.Slide refreshing={true} onrefresh={() => {
        //刷新后操作
    }} loading={true} onPaging={() => {
        //页面滑到底部，要执行分页操作
    }}>
        //页面
    </Page.Slide>
</Page.Render>
```

#### (7)、Popup

Page Popup 组件，页面弹出临时页面

+ log
+ this
+ id：唯一编号
+ type：方向，默认 bottom
+ width：宽度 默认 100
+ height：高度 默认 100
+ isHide：是否点击隐藏
+ bg

```javascript
const popupID = 'popupID';

render()
{
    return <Page.Base>
        <Page.Render>
            // 正常页面显示
        </Page.Render>
        <Page.Popup this={this} id={popupID} type={Page.Popup.type.bottom}>
            // 页面配置
            <Page.Header title={'我是Popup Title'} left={new Nav().headerLeft()}/>
        </Page.Popup>
    </Page.Base>
}
```

##### 静态参数

```javascript
// 出现方向
Page.Popup.type.left;
Page.Popup.type.right;
Page.Popup.type.top;
Page.Popup.type.bottom;

// 宽度比例
Page.Popup.width["30"];
Page.Popup.width["40"];
Page.Popup.width["50"];
Page.Popup.width["75"];
Page.Popup.width["100"];

// 高度比例
Page.Popup.height["30"];
Page.Popup.height["40"];
Page.Popup.height["50"];
Page.Popup.height["75"];
Page.Popup.height["100"];
```

#### (8)、VerifyCode

发送验证码

```javascript
//页面

export default class page_demo extends Component {
    #name = "page_demo";

    // ...
    constructor() {
        // ...
        this.VerifyCodeModal = new Page.VerifyCode(this, this.#name);
    }

    componentDidMount() {
        // ...
        this.VerifyCodeModal.set('获取验证码', 30);
    }

    componentWillUnmount() {
        // ...
        this.VerifyCodeModal.remove();
    }

    render() {
        return <Page.Render>
            <Page.Text text={this.VerifyCodeModal.getText()} onPress={() => {
                new Page.Render().onBlur(this);
                this.VerifyCodeModal.onPress().then(res => {
                    //发送成功
                    this.VerifyCodeModal.send();
                })
            }}/>
        </Page.Render>
    }

}

```

#### (9)、Clipboard

剪切板，复制

+ value：复制的值

```javascript
new Page().Clipboard(value);
```

#### (10)、Linking

打开新的浏览器

+ url：url地址

```javascript
new Page().Linking(url);
```

### 10、<a id="popup">Popup</a>

页面弹出 Popup

##### 静态参数

```javascript
// 名称
Popup.names.view;           // View 显示
Popup.names.select;         // select 选择
Popup.names.tips;           // tips 提示框
Popup.names.headerTips;     // headerTips 提示框

// 出现方向
Popup.type.left;
Popup.type.right;
Popup.type.top;
Popup.type.bottom;

// 宽度比例
Popup.width["30"];
Popup.width["40"];
Popup.width["50"];
Popup.width["75"];
Popup.width["100"];

// 高度比例
Popup.height["30"];
Popup.height["40"];
Popup.height["50"];
Popup.height["75"];
Popup.height["100"];
```

##### init

初始化 Popup

+ params []
    + name
    + type
    + width
    + height
    + style

```javascript
// 页面初始化
<Popup.InitView/>

// 初始化方法
new Popup().init();

// 例：
new Popup().init([
    {
        name: Popup.names.view, type: Popup.type.top,
        width: Popup.width["100"], height: Popup.height["50"]
    }
])
```

##### show

默认显示 view

+ data 显示View

```javascript
new Popup().show(data);

// 例：
new Popup().show('显示');
new Popup().show(<View/>);
```

##### hide

隐藏

```javascript
 new Popup().hide();
```

##### view

+ data 显示View

```javascript
new Popup().view(data);
```

##### select

select 选择框

+ arr：显示数组
+ func：选中返回，返回选中的值在数组中的位置
+ params：配置
    + text：显示字段，默认取数组中text字段，可以配置
    + title：显示标题
    + isCancel：是否有取消选项

```javascript
new Popup().select(arr, func, params);

// 例：
const arr = [{id: 1, a: '张三'}, {id: 2, a: '李四'}];
new Popup().select(arr, res => {
    // 返回数组中选中的id
    // arr[res].id;
}, {text: 'a'});
```

##### headerTips

header tips 头部提示框， 1.5秒后自动消失

+ data
+ params {}
    + color
    + bg

```javascript
new Popup().headerTips(data, params);

// 例：
new Popup().headerTips('显示内容', {color: '#fff', bg: '#f00'});
```

##### headerTipsError

header tips 头部错误提示框， 1.5秒后自动消失，背景色位为红色

+ content
+ params

```javascript
new Popup().headerTipsError(content, params);
```

### 11、<a id="redux">Redux</a>

App内数据临时存储，App关闭后数据清空

##### init

初始化

+ params []
    + name
    + value

```javascript
new Redux().init(params);

// 例：
new Redux().init([
    {name: 'nickname', value: '张三'},
])
```

##### listen

监听

+ name
+ func

```javascript
new Redux().listen(name, func);

// 监听 nickname 变化
new Redux().listen('nickname', res => {
    // 每次变化都会进来
})
```

##### add

添加，第一次创建

+ name
+ value

```javascript
new Redux().add(name, value);
```

##### adds

添加多个

+ params []
    + name
    + value

```javascript
new Redux().adds(params);
```

##### update

修改，如果没有，则不会自动创建

+ name
+ value

```javascript
new Redux().update(name, value);
```

##### remove

删除

+ name

```javascript
new Redux().remove(name);
```

##### get

获取

+ name

```javascript
new Redux().get(name);
```

### 12、<a id="storage">Storage</a>

持久化存储，App不删除，就会一直存在

##### 静态参数

```javascript
// 类型
Storage.type.getJson;   // 可以获取object 类型
Storage.type.get;       // 只能获取string 类型
```

##### init

初始化

+ params []
    + name：名称
    + type：类型
    + value：值

```javascript
new Storage().init(params);

// 例：
new Storage().init([
    {name: 'nickname', type: Storage.type.get, value: '张三'},
    {name: 'user', type: Storage.type.getJson, value: {id: 1, name: '李四'}}
])
```

##### set

写入string类型

+ key
+ value

```javascript
new Storage().set(key, value);
```

##### setJson

写入Json类型

+ key
+ value

```javascript
new Storage().setJson(key, value);
```

##### get

获取string类型的存储值

+ key

```javascript
new Storage().get(key);
```

##### getJson

获取Json 类型的存储值

+ key

```javascript
new Storage().getJson(key);
```

##### remove

删除

+ key

```javascript
new Storage().remove(key);
```

### 13、<a id="system">System</a>

系统方法

##### isVersionToUpdate

是否有版本更新

+ serveV：服务器 version
+ serveB：服务器：build
+ isAndroid：安卓是否更新,默认：true
+ isIos：ios是否更新，默认：true

```javascript
new System().isVersionToUpdate(serveV, serveB, isAndroid, isIos);
```

### 14、<a id="theme">Theme</a>

主题设置

##### init

初始化设置

+ themeAll：所有主题样式json
+ defaultName：默认主题样式名称

```javascript
  new Theme().init(themeAll, defaultName);
```

##### getType

获取当前主题类型

```javascript
new Theme().getType();
```

##### get

获取当前主题

```javascript
new Theme().get();
```

##### set

修改主题

+ themeAll
+ type

```javascript
new Theme().set(themeAll, type);
```

### 15、<a id="tools">Tools</a>

工具模块

##### isArray

判断是否为数组

+ value

```javascript
Tools.isArray(value);
// return false or true
```

##### isAmount

判断是否是金额

+ value

```javascript
Tools.isAmount(value);
// return false or true
```

##### isNum

判断是否是数字

+ value

```javascript
Tools.isNum(value);
// return false or true
```

##### isJson

判断是否是Json

+ value

```javascript
Tools.isJson(value);
// return false or true
```

##### isLastIndexOf

判断最后一个字符是否相等

+ str：string类型字符串
+ value：要判断的字符

```javascript
Tools.isLastIndexOf(str, value);
// return false or true
```

##### copy

深拷贝

+ value

```javascript
Tools.copy(value);
```

##### replaceWithJson

用json替换string中的值

+ value：string类型字符串
+ json：json类型

```javascript
Tools.replaceWithJson(value, json);
```

##### replaceOrSpliceToUrl

拼接或替换 转换为url

+ value
+ json

```javascript
Tools.replaceOrSpliceToUrl(value, json);
```

##### jsonToSearch

将json转换为search

+ json

```javascript
Tools.jsonToSearch(json);
```

##### arrayToSearch

将array数组转换为search +arr

```javascript
Tools.arrayToSearch(arr);
```

##### searchToJson

将search转换为json

+ value

```javascript
Tools.searchToJson(value);
```

##### getFromFirst

获取从前数几个字符

+ value
+ length：长度，默认：1

```javascript
Tools.getFromFirst(value, length = 1);
```

##### getFromLast

获取从后数几个字符

+ value
+ length

```javascript
Tools.getFromLast(value, length = 1);
```

##### selectArrayByParams

搜索数组，返回对比值

+ array：数组
+ params：参数
+ value：对比值

```javascript
Tools.selectArrayByParams(array, params, value);
```

##### selectArrayByArray

搜索数组，返回匹配一个或多个值

+ array
+ params
+ value

```javascript
Tools.selectArrayByArray(array, params, value);
```

##### JsonContrast

json 对比，返回true or false

+ jsonOne
+ jsonTwo

```javascript
Tools.JsonContrast(jsonOne, jsonTwo);
```

##### scientificCount

转换科学计数法

+ value

```javascript
Tools.scientificCount(value);
```

##### amountConversion

金额转换，三位一个逗号，1,000

+ value

```javascript
Tools.amountConversion(value);
```

##### amount

金额转换

+ value
+ params {}
    + convert：是否科学计数，默认true
    + min：最小小数位，默认 2 位
    + max：最大小数位，默认 4 位

```javascript
Tools.amount(value, params);
```

##### cutString

格式化字符串，将重中间文字替换

+ value：文字
+ count：左右保留个数，默认 10 位
+ unit：替换为，默认：...

```javascript
Tools.cutString(value, count = 10, unit = '...');
```

##### formatDate

格式化时间

+ date
+ unit：中间间隔显示，默认 -

```javascript
Tools.formatDate(date, unit = '-');
```

##### formatDateTimezoneOffset

格式化时间 并且削正时区偏差

+ date
+ unit

```javascript
Tools.formatDateTimezoneOffset(date, unit = '-');
```

##### shuffle

洗牌，打乱数组

+ arr

```javascript
Tools.shuffle(arr);
```

##### randomXY

生成随机坐标轴

+ rangeX：X轴参数 [起始数值，结束数值]
+ rangeY：Y轴参数 [起始数值，结束数值]
+ count：总共多少个
+ params：[]
    + areas：[0,0,0,0,0,0]
        + 分别代表 width，height，y轴top，x轴right，y轴Bottom，x轴left

```javascript
Tools.randomXY(arngeX = [], arngeY = [], count, params = {});
```

##### versionContrast

版本对比

+ newVersion
+ newBuild
+ version
+ build

```javascript
Tools.versionContrast(newVersion, newBuild, version, build);
```

### 16、<a id="umount">Unmount</a>

页面卸载

##### start

每次打开页面执行start

+ name：页面名称

```javascript
new Unmount().start(name);

// 或

this.unmount = new Unmount(name);
this.unmount.start();
```

##### end

每次关闭一个页面执行end

+ name

```javascript
new Unmount().end(name);

// 或

this.unmount = new Unmount(name);
this.unmount.end();
```

##### confirm

用于判断这个页面是否关闭

+ name

```javascript
new Unmount().confirm(name);

// 或

this.unmount = new Unmount(name);
this.unmount.confirm();

// 例：
if (this.unmount.confirm()) {
    //执行操作
}
```
