import React, {PureComponent} from 'react';
import {TouchableHighlight, View, ScrollView, RefreshControl} from 'react-native';

import theme from '../theme';
import popup from '../popup';

export default class PageSlide extends PureComponent {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.state = {
            // children: props.children,
            style: props.style,
            slideStyle: props.slideStyle,
            onRefresh: props.onRefresh,
            onPaging: props.onPaging,
            refreshing: props.refreshing,
            log: props.log ?? false,
            loadingPaging: props.loadingPaging ?? false,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // console.log(nextProps);
        // console.log(nextState);
        // console.log(nextContext);
        if (nextProps.loadingPaging !== nextState.loadingPaging) this.setState({loadingPaging: nextProps.loadingPaging});
        if (nextProps.onPaging !== nextState.onPaging) this.setState({onPaging: nextProps.onPaging});
        return true;
    }

    render() {
        let loadingView = <View/>;
        if (this.state.loadingPaging) loadingView = popup.loading.small();
        return <ScrollView style={this.state.slideStyle ?? {}}
                           onScroll={(event) => {
                               let currHeight = this.state.height + event['nativeEvent']['contentOffset'].y,
                                   totalHeight = event['nativeEvent']['contentSize'].height;
                               if ((totalHeight - 1) < currHeight && this.state.loadingPaging) {
                                   if (typeof this.state.onPaging === 'function') this.state.onPaging();
                               }
                           }}
                           onLayout={(event) => this.setState({height: event['nativeEvent']['layout'].height})}
                           refreshControl={
                               <RefreshControl refreshing={this.state.refreshing ?? false} onRefresh={() => {
                                   if (typeof this.state.onRefresh === 'function') this.state.onRefresh();
                               }}/>}>
            <TouchableHighlight activeOpacity={1} style={{minHeight: this.state.height}}>
                <View style={this.state.style ?? {}}>
                    {this.props.children}
                    {loadingView}
                </View>
            </TouchableHighlight>
        </ScrollView>
    }
}
