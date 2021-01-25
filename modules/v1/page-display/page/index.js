import page_render from "./page_render";
import page_text from "./page_text";
import page_a from "./page_a";
import page_icon from './page_icon';
import page_slide from "./page_slide";
import page_switch from "./page_switch";
import tools from './tools';


export default {
    render: page_render,//页面最外层组件
    text: page_text,//简单的文本组件
    a: page_a,//简单的点击按钮
    icon: page_icon,//字体图标
    slide: page_slide,//滚动
    switch: page_switch,//开关


    tools: tools,
    initBarStyle: tools.initBarStyle,
    setBarStyle: tools.setBarStyle,
    getBarStyle: tools.getBarStyle,
    blur: tools.blur,
    start: tools.start,
    end: tools.end,
}
