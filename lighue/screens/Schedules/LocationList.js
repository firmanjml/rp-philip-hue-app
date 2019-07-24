import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, Dimensions, Platform } from 'react-native'
import { Block, Text, Card, Badge } from '../../components';
import { theme, constant } from '../../constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons';

const { width } = Dimensions.get('window');

class LocationList extends Component {
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

    state = {
        selected: "Home"
    }

    renderListRoom() {
        const { groups, nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                // style={{ paddingVertical: theme.sizes.base * 2 }}
                style={{ paddingVertical: theme.sizes.base }}>
                <Block flex={false} row space="between" style={[styles.categories, marginTop]}>
                    {
                        Object.entries(groups).length === 0 && groups.constructor === Object ?
                            <Block middle center>
                                <Text h3 style={textcolor}>
                                    No Rooms created
                                    </Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ roomModal: false })}>
                                    <Text h3 style={{ marginTop: 5, color: '#20D29B' }}>Go Back</Text>
                                </TouchableOpacity>
                            </Block>
                            :
                            Object.keys(groups).map(val => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => this.redirectionRoom(val)}>
                                    <Card center middle shadow style={styles.category}>
                                        <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                                            {
                                                constant.room_class.indexOf(groups[val].class) > -1
                                                    ?
                                                    <Image style={{ width: constant.class_base64[groups[val].class].width, height: constant.class_base64[groups[val].class].height }} source={{ uri: constant.class_base64[groups[val].class].uri }} />
                                                    :
                                                    <Image style={{ width: constant.class_base64["Other"].width, height: constant.class_base64["Other"].height }} source={{ uri: constant.class_base64["Other"].uri }} />
                                            }
                                        </Badge>
                                        <Text medium height={30} style={styles.roomText}>{groups[val].name.length > 12 ? groups[val].name.substring(0, 12) + "..." : groups[val].name}</Text>
                                        <Text gray caption>{groups[val].lights ? groups[val].lights.length : '0'} bulbs</Text>
                                    </Card>
                                </TouchableOpacity>
                            ))
                    }
                </Block>
            </ScrollView>
        )
    }

    renderListBulb() {
        const { lights, nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                // style={{ paddingVertical: theme.sizes.base * 2 }}
                style={{ paddingVertical: theme.sizes.base }}>
                <Block flex={false} column style={[styles.categories, marginTop]}>
                    {
                        Object.entries(lights).length === 0 && groups.constructor === Object ?
                            <Block middle center>
                                <Text h1 style={textcolor}>No Bulb is found</Text>
                            </Block>
                            :
                            Object.keys(lights).map(val => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => this.redirectionBulb(val)}>
                                    <Block flex={false} row space="between" style={{ marginTop: 30, marginBottom: 10 }}>
                                        <Text h2 style={[styles.textControl, textcolor]}>{lights[val].name}</Text>
                                        <Text h2 style={[styles.textControl, textcolor]}>></Text>
                                    </Block>
                                </TouchableOpacity>
                            ))
                    }
                </Block>
            </ScrollView>
        )
    }

    locationList = {
        Home: {
            selected: true
        },
        Room: {
            selected: false
        },
        Bulb: {
            selected: false
        }
    };

    updateLocation = (val) => {
        this.setState({ selected: val })
        if (val == "Home") {
            this.locationList["Home"].selected = true
            this.locationList["Room"].selected = false
            this.locationList["Bulb"].selected = false
        }
        else if (val == "Room") {
            this.locationList["Home"].selected = false
            this.locationList["Room"].selected = true
            this.locationList["Bulb"].selected = false
        }
        else {
            this.locationList["Home"].selected = false
            this.locationList["Room"].selected = false
            this.locationList["Bulb"].selected = true
        }
        this.forceUpdate()
    }

    renderLocationList() {
        const { locationList } = this;
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            Object.keys(locationList).map(val => (
                <TouchableOpacity
                    key={val}
                    style={[styles.roundLocation, {
                        borderColor: locationList[val].selected ? colors.secondary : 'white',
                        backgroundColor: locationList[val].selected ? colors.secondary : null
                    }]}
                    onPress={() => this.updateLocation(val)}>
                    <Text style={[textcolor, { alignSelf: 'center' }]}>{val}</Text>
                </TouchableOpacity>
            )))
    }


    renderListOrText(titlecolor) {
        const { selected } = this.state;
        if (selected == "Home") {
            return (
                <Text style={[titlecolor, { fontSize: 40, marginTop: 15 }]} bold>Have your own home being scheduled.</Text>
            )
        }
        else if (selected == "Room") {
            return (
                <View style={{ marginTop: 10 }}>
                    {this.renderListRoom()}
                </View>
            )
        }
        else if (selected == "Bulb") {
            return (
                <View>
                    {this.renderListBulb()}
                </View>
            )
        }
    }

    renderSaveButton(textcolor) {
        if (this.state.selected == "Home") {
            return (
                <Block bottom style={{ marginBottom: 20, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={styles.saveRound}
                        onPress={() => this.redirectHome()}>
                        <View style={{justifyContent : 'space-between', flexDirection : 'row'}}>
                            <Text style={[{alignSelf : 'center'},textcolor]}>Save  </Text>
                            <Icon.Ionicons name="ios-arrow-forward" style={{alignSelf : 'center'}} size={25} color={theme.colors.gray} />
                        </View>
                    </TouchableOpacity>
                </Block>
            )
        }
    }

    redirectHome() {
        this.props.navigation.state.params.returnData("Home")
        this.props.navigation.goBack()
    }

    redirectionRoom = (val) => {
        const { navigation } = this.props;
        navigation.state.params.returnData("room", val)
        navigation.goBack()
    }

    redirectionBulb = (val) => {
        const { navigation } = this.props;
        navigation.state.params.returnData("bulb", val)
        navigation.goBack()
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <View style={styles.rowLocation}>
                        {this.renderLocationList()}
                    </View>
                    {this.renderListOrText(titlecolor)}
                    {this.renderSaveButton(textcolor)}
                </Block>
            </Block>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        groups: state.groups,
        lights: state.lights
    }
}

export default connect(
    mapStateToProps,
    null
)(LocationList)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    rowLocation: {
        flexDirection: 'row'
    },
    roundLocation: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 100
    },
    saveRound: {
        borderWidth: 1,
        borderRadius: 20,
        width: 65,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 30,
        textAlign: 'center'
    },
    categories: {
        flexWrap: 'wrap',
        marginBottom: theme.sizes.base * 3.5,
    },
    category: {
        minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    },
    roomText: {
        fontSize: (width <= 350) ? 9 : (width < 380) ? 12 : 14
    },
});