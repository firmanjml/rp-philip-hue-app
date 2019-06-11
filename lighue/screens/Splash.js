import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Block, Text } from '../components';
import { theme, constant } from '../constants';

import { connect } from 'react-redux'
import Layout from '../constants/Layout';
import AppIntroSlider from 'react-native-app-intro-slider';

import { GetAllLights, GetAllGroups } from '../redux/actions'

var interval;
class Splash extends Component {
    static navigationOptions = {
        header: null
    }

    componentWillMount() {
        interval = setInterval(() => {
            this.props._fetchAllLights();
            this.props._fetchAllGroups()
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval);
    }

    _renderItem = (item) => {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.white : colors.gray3}
        return (
            <Block style={backgroundcolor}>
                <Block container style={styles.slide}>
                    <Image 
                        resizeMethod='auto'
                        source={item.image}
                        style={styles.image} />
                </Block>
                <Block marginTop={20} margin={[0, theme.sizes.base * 3]}>
                    <Text style={[styles.title,titlecolor]}>{item.title}</Text>
                    <Text medium style={[styles.text,textcolor]}>{item.text}</Text>
                </Block>
            </Block>
        );
    }
    _onDone = () => {
        this.props.navigation.navigate("ListRoom");
    }
    render() {
        return <AppIntroSlider renderItem={this._renderItem} slides={constant.splash_slider} onDone={this._onDone} bottomButton />;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllLights() {
            return dispatch(GetAllLights())
        },
        _fetchAllGroups: () => dispatch(GetAllGroups()),

    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Splash)

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center'
    },
    imageBlock: {
        marginTop: 20
    },
    image: {
        width: Layout.window.width,
        height: Layout.window.height / 2.5,
        resizeMode: 'contain'
    },
    title: {
        textAlign: 'left',
        fontWeight: '200',
        fontSize: 30
    },
    text: {
        marginTop: 20,
        textAlign: 'left',
        fontSize: 15,
    }
});