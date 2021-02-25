import React, {Component} from 'react';
import {TouchableHighlight, ScrollView, View, RefreshControl} from 'react-native';
import Theme from "../Theme";

export default class PageSlide extends Component {
    #css = new Theme().get();

    constructor(props) {
        /**
         *  log
         *  style           样式
         *  onRefresh       刷新操作
         *  refreshing      刷新loading
         *  loading         显示loading
         *  onPaging        分页执行
         */
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.log) {
            console.log('nextProps', nextProps);
            console.log('nextState', nextState);
        }
        if (!nextProps) nextProps = {};
        if (!nextState) nextState = {};
        const props = {};
        if (nextProps.style !== nextState.style) props['style'] = nextProps.style;
        if (nextProps.refreshing !== nextState.refreshing) props['refreshing'] = nextProps.refreshing;
        if (nextProps.loading !== nextState.loading) props['loading'] = nextProps.loading;
        if (this.props.log) console.log('PageIcon', props);
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0
    }


    render() {
        const css = this.#css,
            props = this.props ?? {};
        let loadingView = <View/>;
        if (typeof props.loading === "boolean" && props.loading) loadingView = <View/>;

        return <ScrollView onLayout={(event) => {
            this.setState({height: event['nativeEvent']['layout'].height});
        }} onScroll={event => {
            const nativeEvent = event['nativeEvent'];
            let currHeight = this.state.height + nativeEvent['contentOffset'].y,
                totalHeight = nativeEvent['contentSize'].height;
            if ((totalHeight - 1) < currHeight && props.loading) {
                if (typeof props.onPaging === "function") props.onPaging();
            }
        }} refreshControl={
            <RefreshControl refreshing={props.refreshing ?? false} onRefresh={() => {
                if (typeof props.onRefresh === "function") props.onRefresh();
            }}/>
        }>
            <TouchableHighlight activeOpacity={1} style={{minHeight: this.state.height ?? css.height}}>
                <View style={props.style ?? {}}>
                    {props.children}
                    {loadingView}
                </View>
            </TouchableHighlight>
        </ScrollView>
    }

}
