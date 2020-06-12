import control from "./control";
import headerBar from "./headerBar";
import page from "./page";
// import bottomBar from "./bottomBar";


export default {
    lastThis: control.lastThis,
    go: control.go,
    replace: control.replace,
    back: control.back,
    empty: control.empty,
    popToTop: control.popToTop,

    headerInit: headerBar.init,
    leftIcon: headerBar.left,

    // initPages: bottomBar.Pages,
    // initApp: bottomBar.App,

    pageForFade: page.forFade,
}
