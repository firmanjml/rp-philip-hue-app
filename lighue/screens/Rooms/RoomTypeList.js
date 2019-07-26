import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native'
import { Block, Text, Card, Badge } from '../../components';
import { theme, constant } from '../../constants';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

class RoomTypeList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../../assets/icons/back.png')} />
                </TouchableOpacity>
        }
    }

    renderList() {
        return (
            Object.keys(constant.class_base64).map(val => (
                <TouchableOpacity
                    key={val}
                    onPress={() => {
                        this.props.navigation.state.params.returnData(val)
                        this.props.navigation.goBack()
                    }}
                >
                    <Card center middle shadow style={styles.category}>
                        <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                            <Image style={{ width: constant.class_base64[val].width, height: constant.class_base64[val].height }} source={{ uri: constant.class_base64[val].uri }} />
                        </Badge>
                        <Text medium height={30} style={styles.roomText}>{val}</Text>
                    </Card>
                </TouchableOpacity>
            )))
    }


    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <View style={styles.header}>
                    <Text h1 bold style={[titlecolor, { marginTop: 25, marginBottom : 10 }]}>Choose room type</Text>
                </View>
                <ScrollView>
                    <Block flex={false} row space="between" style={[styles.categories, { marginTop: 20 }]}>
                        {this.renderList()}
                    </Block>
                </ScrollView>
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
)(RoomTypeList)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    header: {
        marginTop: 50,
        paddingHorizontal: theme.sizes.base * 2,
    },
    roomText: {
        fontSize: (width <= 350) ? 9 : (width < 380) ? 12 : 14
    },
    textSetting: {
        fontSize: 24,
        color: 'black',
        alignSelf: "center"
    },
    categories: {
        flexWrap: 'wrap',
        paddingHorizontal: theme.sizes.base * 2,
        marginBottom: theme.sizes.base * 3.5
    },
    category: {
        minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    }
});