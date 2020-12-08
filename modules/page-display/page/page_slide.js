import React, {PureComponent} from 'react';
import {TouchableHighlight, View, ScrollView, RefreshControl} from 'react-native';

import theme from '../theme';

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

    //
    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     if (nextProps.children === this.state.children &&
    //         nextProps.refreshing === this.state.refreshing &&
    //         nextProps.loadingPaging === this.state.loadingPaging &&
    //         nextProps.onPaging === this.state.onPaging &&
    //         JSON.stringify(nextProps.style) === JSON.stringify(this.state.style) &&
    //         JSON.stringify(nextProps.slideStyle) === JSON.stringify(this.state.slideStyle)) return false;
    //     if (this.state.log) {
    //         console.log('children', nextProps.children === this.state.children);
    //         console.log('refreshing', nextProps.refreshing === this.state.refreshing);
    //         console.log('loadingPaging', nextProps.loadingPaging === this.state.loadingPaging);
    //         console.log('style', JSON.stringify(nextProps.style) === JSON.stringify(this.state.style));
    //         console.log('slideStyle', JSON.stringify(nextProps.slideStyle) === JSON.stringify(this.state.slideStyle));
    //         console.log('==================================');
    //     }
    //     this.setState({
    //         children: nextProps.children,
    //         style: nextProps.style ?? this.state.style,
    //         slideStyle: nextProps.slideStyle ?? this.state.slideStyle,
    //         refreshing: nextProps.refreshing,
    //         loadingPaging: nextProps.loadingPaging,
    //         onPaging: nextProps.onPaging,
    //     });
    //     return true;
    // }

    render() {
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
                               <RefreshControl refreshing={this.state.refreshing ?? false}
                                               onRefresh={() => {
                                                   if (typeof this.state.onRefresh === 'function') this.state.onRefresh();
                                               }}/>}>
            <TouchableHighlight activeOpacity={1} style={{minHeight: this.state.height}}>
                <View style={this.state.style ?? {}}>
                    {this.props.children}
                </View>
            </TouchableHighlight>
        </ScrollView>
    }
}
