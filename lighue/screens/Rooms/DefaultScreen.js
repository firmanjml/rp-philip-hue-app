import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl, Platform } from 'react-native'
import { Card, Badge, Block, Text } from '../../components';
import { theme, constant } from '../../constants';
import Icon from 'react-native-vector-icons';
import ToggleSwitch from "../../components/ToggleSwitch";
import { connect } from 'react-redux';
<<<<<<< HEAD
import { SetLampState } from '../../redux/actions'
import { GetAllGroups, GetAllLights, GetSchedules } from '../../redux/actions';
=======
import { GetAllGroups, GetAllLights, GetSchedules, SearchForNewLights, GetConfig } from '../../redux/actions';
>>>>>>> d465b9ae7651dfaf37bd41d8613a6a9deeec3a08

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

const { height, width } = Dimensions.get('window');

var interval;
class DefaultScreen extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        active: 'Rooms',
        categories: [],
        refreshing: false
    }

    componentWillMount() {
        this.props._fetchAllLights();
        this.props._fetchAllGroups();
        this.props._fetchAllSchedules();
        this.props._fetchAllConfig();
        interval = setInterval(() => {
            this.props._fetchAllLights();
            this.props._fetchAllGroups();
            this.props._fetchAllSchedules();
            this.props._fetchAllConfig();
        }, 5000)
    }

    renderTab(tab, backgroundcolor) {
        const { active } = this.state, isActive = active === tab;
        return (
            <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => {
                    this.setState({ active: tab })
                }}
                style={[
                    styles.tab,
                    backgroundcolor,
                    isActive ? styles.active : null
                ]}>
                <Text size={16} bold gray={!isActive} secondary={isActive}>
                    {tab}
                </Text>
            </TouchableOpacity>
        )
    }

    renderMenu(tab) {
        if (this.state.active === 'Rooms') {
            return (
                <Menu onSelect={value => this.onMenuRoomSelect(value)}>
                    <MenuTrigger>
                        <Icon.Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text h3>Create new room</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text h3>Debug mode</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={3}><Text h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
        else if (this.state.active === "Lights") {
            return (
                <Menu onSelect={value => this.onMenuLightSelect(value)}>
                    <MenuTrigger>
                        <Icon.Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text h3>Search for new bulb</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text h3>Demo mode</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={3}><Text h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
        else if (this.state.active === "Schedules") {
            return (
                <Menu onSelect={value => this.onMenuScheduleSelect(value)}>
                    <MenuTrigger>
                        <Icon.Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text h3>Add Schedules</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
        else if (this.state.active === "Scenes") {
            return (
                <Menu onSelect={value => this.onMenuSceneSelect(value)}>
                    <MenuTrigger>
                        <Icon.Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text h3>Add Scenes</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
    }

<<<<<<< HEAD
    displayLayout() {
        const { navigation, groups, nightmode, lights } = this.props;
        const { colors } = theme;
        const refreshtextcolor = nightmode ? colors.white : colors.black
        const textcolor = { color: nightmode ? colors.white : colors.black }
=======
    displayLayout(textcolor, refreshtextcolor) {
        const { navigation, groups } = this.props;
>>>>>>> d465b9ae7651dfaf37bd41d8613a6a9deeec3a08
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }

        if (this.state.active === 'Rooms') {
            return (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ paddingVertical: theme.sizes.base }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            title={"Swipe to refresh...."}
                            titleColor={refreshtextcolor}
                            onRefresh={async () => {
                                this.setState({ refreshing: true })
                                await this.props._fetchAllGroups();
                                setTimeout(() => {
                                    this.setState({ refreshing: false })
                                }, 800);
                            }} />
                    }>
                    <Block flex={false} row space="between" style={[styles.categories, marginTop]}>
                        {
                            Object.entries(groups).length === 0 && groups.constructor === Object ?
                                <Block middle center>
                                    <Text h1 bold style={[textcolor]}>
                                        No Room created
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('AddRoom');
                                        }}>
                                        <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Add Rooms</Text>
                                    </TouchableOpacity>
                                </Block>
                                :
                                Object.keys(groups).map(val => (
                                    <TouchableOpacity
                                        key={val}
                                        onPress={() => {
                                            navigation.navigate('ControlRoom', {
                                                id: val,
                                                class: groups[val].class > -1 ? groups[val].class : "Other"
                                            });
                                        }}>
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
        } else if (this.state.active === "Lights") {
            return (
<<<<<<< HEAD
                Object.entries(lights).length === 0 && lights.constructor === Object ?
                    <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text h1 bold style={[textcolor]}>No light is found.</Text>
                        <TouchableOpacity
                            onPress={() => console.log("Search for new bulb")}>
                            <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Search for new lights</Text>
                        </TouchableOpacity>
                    </Block>
                    :
                    Object.keys(lights).map(val => (
                        <Block flex={false} row space="between" style={styles.row}>
                            <TouchableOpacity
                                key={val}
                                onPress={() => {
                                    navigation.navigate('BulbInfo', {
                                        id: val
                                    });
                                }}>
                                 <View style={styles.lampRow}>
                                <Text style={{color: 'white', marginHorizontal: 30, marginBottom: 10, fontSize: 14}}>{lights[val].name}</Text>
                                </View>
                            </TouchableOpacity>
                            <ToggleSwitch
                                offColor="#DDDDDD"
                                onColor={theme.colors.secondary}
                                isOn={lights[val].state.on}
                                onToggle={(toggleState) => this.props._changeLightState(val, { on: toggleState })}
                            />
                        </Block>
                    ))
=======
                <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text h1 bold style={[textcolor]}>
                        No lights is found.
                </Text>
                    <TouchableOpacity
                        onPress={() => console.log("Search for new bulb")}>
                        <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Search for new lights</Text>
                    </TouchableOpacity>
                </Block>
>>>>>>> d465b9ae7651dfaf37bd41d8613a6a9deeec3a08
            )
        } else if (this.state.active === "Schedules") {
            return (
                <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text h1 bold style={[textcolor]}>
                        No schedules created.
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddSchedules');
                        }}>
                        <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Add schedules</Text>
                    </TouchableOpacity>
                </Block>
            )
        } else {
            return (
                <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
<<<<<<< HEAD
                    <Text h1 bold style={textcolor}>
                        No scenes created.
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddScenes');
                        }}>
                        <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Add scenes</Text>
                    </TouchableOpacity>
                </Block>
=======
                <Text h1 bold style={textcolor}>
                    No scenes created.
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SceneLocationListScreen');
                    }}>
                    <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Add scenes</Text>
                </TouchableOpacity>
            </Block>
>>>>>>> d465b9ae7651dfaf37bd41d8613a6a9deeec3a08
            )
        }
    }

    onMenuRoomSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('PostUpdate', {
                meta: {
                    timer: 5000,
                    nav: "ListRoom"
                }
            });
        } else if (value == 2) {
            this.props.navigation.navigate('TestScreen');
        } else if (value == 3) {
            this.props.navigation.navigate('Settings');
        }
    }

    onMenuScheduleSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('AddSchedules');
        } else if (value == 2) {
            this.props.navigation.navigate('Settings');
        }
    }

    onMenuLightSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('SearchBulbScreen');
        } else if (value == 2) {
            this.props.navigation.navigate("LightDemo")
        } else if (value == 3) {
            this.props.navigation.navigate("Settings")
        }
    }

    onMenuSceneSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate("AddScenes")
        } else if (value == 2) {
            this.props.navigation.navigate("Settings")
        }
    }

    render() {
        const tabs = ['Rooms', 'Lights', 'Schedules', 'Scenes'];
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const refreshtextcolor = nightmode ? colors.white : colors.black
        return (
            <Block style={backgroundcolor}>
                <Block flex={false} center row space="between" style={styles.header}>
                    <Text h1 style={[textcolor, { fontWeight: 'bold' }]}>Explore</Text>
                    {this.renderMenu(this.state.active)}
                </Block>
                <Block flex={false} row style={[styles.tabs, backgroundcolor]}>
<<<<<<< HEAD
                    {tabs.map(tab => this.renderTab(tab))}
                </Block>
                {this.displayLayout()}
=======
                    {tabs.map(tab => this.renderTab(tab, backgroundcolor))}
                </Block>
                {this.displayLayout(textcolor, refreshtextcolor)}
>>>>>>> d465b9ae7651dfaf37bd41d8613a6a9deeec3a08
            </Block>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllGroups: () => dispatch(GetAllGroups()),
        _fetchAllLights: () => dispatch(GetAllLights()),
        _fetchAllSchedules: () => dispatch(GetSchedules()),
<<<<<<< HEAD
        _changeLightState(id, data) {
            return dispatch(SetLampState(id, data));
        }
=======
        _searchBulb: () => dispatch(SearchForNewLights()),
        _fetchAllConfig: () => dispatch(GetConfig())
>>>>>>> d465b9ae7651dfaf37bd41d8613a6a9deeec3a08
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        groups: state.groups,
        lights: state.lights,
        nightmode: state.nightmode
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background
      },
    header: {
        marginTop: 50,
        paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
        height: theme.sizes.base * 2.2,
        width: theme.sizes.base * 2.2,
    },
    tabs: {
        marginTop: 30,
        justifyContent: 'space-between',
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: theme.sizes.base,
        marginHorizontal: theme.sizes.base * 2,
    },
    tab: {
        paddingBottom: theme.sizes.base
    },
    active: {
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 3,
    },
    categories: {
        flexWrap: 'wrap',
        paddingHorizontal: theme.sizes.base * 2,
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
    divider: {
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    lampRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
      }




})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultScreen);