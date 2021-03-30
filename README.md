# react-native-womasoft

# 简介

# 安装初始化

# 说明文档

### 一、目录

##### 1、[Core](#user-content-core)

##### 2、[Emitter](#user-content-emitter)

##### 3、[Fetch](#user-content-fetch)

##### 4、[Files](#user-content-files)

##### 5、[Language](#user-content-language)

##### 6、[Loading](#user-content-loading)

##### 7、[Modal](#user-content-modal)

##### 8、[Nav](#user-content-nav)

##### 9、[Page](#user-content-page)

##### 10、[Popup](#user-content-popup)

##### 11、[Redux](#user-content-redux)

##### 12、[Storage](#user-content-storage)

##### 13、[System](#user-content-system)

##### 14、[Theme](#user-content-theme)

##### 15、[Tools](#user-content-tools)

##### 16、[Unmount](#user-content-umount)

## 二、项目搭建

### 1、创建项目

## 三、使用说明

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

获取权限存储内容

```javascript
new Fetch().getAuthValue();
```

根据名称搜索权限

```javascript
new Fetch().getAuthValueByName(name);
```

获取默认类型

```javascript
new Fetch().getType();
```

获取超时时间

```javascript
new Fetch().getTimeout();
```

getStatus

```javascript
new Fetch().getStatus();
```

getIsLog

```javascript
new Fetch().getIsLog();
```

写入默认权限  
用于登录成功后将token加入默认权限中

```javascript
new Fetch().setAuthValue(value);
```

权限 自定义  
可自定义多权限，配置多个权限token

```javascript
new Fetch().setAuthValueCustom(name, type, value);
```

写入类型

```javascript
new Fetch().setType(value);
```

### 4、<a id="files">Files</a>

### 5、<a id="language">Language</a>

### 6、<a id="nav">Nav</a>

### 7、<a id="page">Page</a>

### 8、<a id="popup">Popup</a>

### 9、<a id="redux">Redux</a>

### 10、<a id="storage">Storage</a>

### 11、<a id="system">System</a>

### 12、<a id="storage">Storage</a>

### 13、<a id="system">System</a>

### 14、<a id="theme">Theme</a>

### 15、<a id="tools">Tools</a>

### 16、<a id="umount">Unmount</a>
