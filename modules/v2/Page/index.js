import PageRender from "./PageRender";
import PageHeader from "./PageHeader";
import PageIcon from "./PageIcon";
import PageText from "./PageText";
import PageSlide from "./PageSlide";


export default class Page {
    constructor() {
    }

    static Render = PageRender;
    static Header = PageHeader;
    static Icon = PageIcon;
    static Text = PageText;
    static Slide = PageSlide;


}
