import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl, Platform } from 'react-native'
import { Card, Badge, Block, Text } from '../../components';
import { theme, constant } from '../../constants';
import Icon from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { GetAllGroups, GetAllLights, GetSchedules } from '../../redux/actions';
import { persistor } from "../../redux/store";
import { Updates } from 'expo';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider,
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
        interval = setInterval(() => {
            this.props._fetchAllLights();
            this.props._fetchAllGroups();
            this.props._fetchAllSchedules();
        }, 5000)
    }

    renderTab(tab) {
        const { active } = this.state, isActive = active === tab;
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }

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
    }

    displayLayout() {
        const { navigation, groups, nightmode } = this.props;
        const { colors } = theme;
        const refreshtextcolor = nightmode ? colors.white : colors.black
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }
        var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';
        
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
                                    <Text h1 style={textcolor}>No Room Created</Text>
                                </Block>
                                :
                                Object.keys(groups).map(val => (
                                    <TouchableOpacity
                                        key={val}
                                        onPress={() => {
                                            navigation.navigate('EditRoom', {
                                                id: val
                                            });
                                        }}>
                                        <Card center middle shadow style={styles.category}>
                                            <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                                                {
                                                    constant.room_class.indexOf(groups[val].class) > -1
                                                        ?
                                                        <Image style={{width: constant.class_base64[groups[val].class].width, height: constant.class_base64[groups[val].class].height}} source={{uri: constant.class_base64[groups[val].class].uri}}/>
                                                        :
                                                        <Image style={{width: constant.class_base64["Other"].width, height: constant.class_base64["Other"].height}} source={{uri: constant.class_base64["Other"].uri}}/>
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
                <Block style={{ paddingHorizontal: theme.sizes.base * 2 }}>
                    <Text center h3 style={[textcolor, marginTop]}>
                        Lights won't be available at all.
                    </Text>
                    <Text paragraph style={textcolor} center>Please don't try again later</Text>
                    <Text paragraph style={textcolor} center>Call 9126920 for more information</Text>
                </Block>
            )
        } else if (this.state.active === "Schedules") {
            return (
                <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text h3 style={[textcolor]}>
                        No Schedules created
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddSchedules');
                        }}>
                        <Text h3 style={{ marginTop : 5, color: '#20D29B' }}>Add Schedules</Text>
                    </TouchableOpacity>
                </Block>
            )
        } else {
            return (
                <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems : 'center', justifyContent : 'center' }}>
                    <Text h3 style={textcolor}>
                        No Scenes created
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddScenes');
                        }}>
                        <Text h3 style={{ marginTop : 5, color: '#20D29B' }}>Add Scenes</Text>
                    </TouchableOpacity>
                </Block>
            )
        }
    }

    onMenuRoomSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('AddRoom');
        } else if (value == 2) {
            this.props.navigation.navigate('TestScreen');
        } else if (value == 3) {
            this.props.navigation.navigate('Settings');
        }
    }

    onMenuLightSelect(value) {
        if (value == 1) {
            // search new bulb
            // this.props.navigation.navigate('');
            console.log("Press bulb")
        } else if (value == 2) {
            this.props.navigation.navigate("LightDemo")
        } else if (value == 3) {
            this.props.navigation.navigate("Settings")
        }
    }

    render() {
        const tabs = ['Rooms', 'Lights', 'Schedules', 'Scene'];
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <MenuProvider>
                <Block style={backgroundcolor}>
                    <Block flex={false} center row space="between" style={styles.header}>
                        <Text h1 style={[textcolor, { fontWeight: 'bold' }]}>Explore</Text>
                        {this.renderMenu(this.state.active)}
                    </Block>
                    <Block flex={false} row style={[styles.tabs, backgroundcolor]}>
                        {tabs.map(tab => this.renderTab(tab))}
                    </Block>
                    {this.displayLayout()}
                </Block>
            </MenuProvider>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllGroups: () => dispatch(GetAllGroups()),
        _fetchAllLights: () => dispatch(GetAllLights()),
        _fetchAllSchedules: () => dispatch(GetSchedules())
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
})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultScreen);