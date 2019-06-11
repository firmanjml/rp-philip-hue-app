import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Block, Text } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';

class CategoryList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../../assets/icons/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
        }
    }

    state = {
        task: ["Wake up", "Sleep", "I'm home", "I'm away", "Other"]
    }

    renderList() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        return (
            Object.keys(this.state.task).map(val => (
                <TouchableOpacity
                    key={val}
                    onPress={() => 
                        {this.props.navigation.state.params.returnData(this.state.task[val])
                        this.props.navigation.goBack()}}
                    >
                    <Block flex={false} row space="between" style={{ marginTop: 10, marginBottom : 30 }}>
                        <Text h3 bold style={[styles.textControl, textcolor]}>{this.state.task[val]}</Text>
                        <Text h3 bold style={[styles.textControl, textcolor]}>></Text>
                    </Block>
                </TouchableOpacity>
            )));
    }


    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Choose category</Text>
                    <Block style={{marginTop : 20}}>
                        {this.renderList()}
                    </Block>
                </Block>
            </Block>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
    }
}

export default connect(
    mapStateToProps,
    null
)(CategoryList)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
        fontSize: 24,
        color: 'black',
        alignSelf: "center"
    }
});