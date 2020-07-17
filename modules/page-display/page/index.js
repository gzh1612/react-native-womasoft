import page_render from "./page_render";
import page_text from "./page_text";
import page_a from "./page_a";
import page_icon from './page_icon';
import page_scroll from "./page_scroll";

export default {
    render: page_render,//页面最外层组件
    text: page_text,//简单的文本组件
    a: page_a,//简单的点击按钮
    icon: page_icon,//字体图标
    scroll: page_scroll,//滚动
}
