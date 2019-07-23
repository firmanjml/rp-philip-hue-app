import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { ColorPicker } from "react-native-color-picker";
import { connect } from "react-redux";
import { SetGroupState, SetLampState, GetAllLights } from "../../redux/actions";
import ToggleSwitch from "../../components/ToggleSwitch";
import Icon from "react-native-vector-icons";
import { ColorConversionToXY } from "../../components/ColorConvert";
import { theme } from "../../constants";
import _ from 'lodash';
import { Block, Input, Text } from "../../components";
import axios from 'axios';

import Slider from "react-native-slider";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";

// kau tak tukar ControlBulb to ControlRoomScreen
class ControlRoomScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    id: 0,
    sat: 0,
    bri: 0,
    type: "",
    active: "Main"
  };

  componentWillMount() {
    this.setState({
      id: this.props.navigation.getParam("id", "NO-ID"),
      type: this.props.navigation.getParam("class", "Other"),
      sat: this.props.groups[this.props.navigation.getParam("id", "NO-ID")].action.sat,
      bri: this.props.groups[this.props.navigation.getParam("id", "NO-ID")].action.bri
    });
  }

  renderType() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 };
    const { type } = this.state;
    return (
      <View>
        <Text style={[styles.textControl, textcolor]}>Room Type</Text>
        <Input
          style={[styles.textInput, titlecolor, bordercolor]}
          editable={false}
          value={type}
          placeholderTextColor={nightmode ? colors.gray2 : colors.black}
        />
      </View>
    );
  }

  renderBackButton() {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ height: 40, width: 80, justifyContent: "center" }}
      >
        <Image source={require("../../assets/icons/back.png")} />
      </TouchableOpacity>
    );
  }

  renderMenu() {
    return (
      <Menu onSelect={value => this.onMenuRoomSelect(value)}>
        <MenuTrigger>
          <Icon.Entypo
            name="dots-three-horizontal"
            size={25}
            color={theme.colors.gray}
          />
        </MenuTrigger>
        <MenuOptions style={{ padding: 15 }}>
          {this.renderMenuOption()}
          <View style={styles.divider} />
          <MenuOption value={2}>
            <Text h3>Edit Room Info</Text>
          </MenuOption>
          <View style={styles.divider} />
        </MenuOptions>
      </Menu>
    );
  }

  renderMenuOption() {
    if (this.state.active == "Main") {
      return (
        <MenuOption value={1}>
          <Text h3>Show Room Bulbs</Text>
        </MenuOption>
      );
    } else if (this.state.active == "ShowMoreInfo") {
      return (
        <MenuOption value={1}>
          <Text h3>Show Color Picker</Text>
        </MenuOption>
      );
    }
  }

  renderView() {
    const { lights, groups, navigation } = this.props;
    if (this.state.active == "Main") {
      return (
        <ColorPicker
          onColorChange={this.changeColorGroupState}
          style={{ flex: 1 }}
          hideSliders={true}
        />
      );
    } else if (this.state.active == "ShowMoreInfo") {
      return (
        (groups[this.state.id].lights.map(val => (
          <View style={{ marginTop: 30 }}>
            <View style={styles.bulbRow}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  key={val}
                  onPress={() => {
                    this.props._fetchAllLights();
                    setTimeout(() => {
                        navigation.navigate('ControlBulb', {
                            id: val
                        });
                    }, 700);
                  }}>
                  <Text style={{ color: 'white', fontSize: 21, alignSelf: 'center' }}>{lights[val].name.length > 15 ? lights[val].name.substring(0, 15) + "..." : lights[val].name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  key={val}
                  onPress={() => {
                    navigation.navigate('BulbInfo', {
                      id: val
                    })
                  }}>
                  <Icon.Ionicons name="ios-information-circle-outline" size={22} style={{ marginLeft: 10, alignSelf: 'center' }} color={theme.colors.gray} />
                </TouchableOpacity>
              </View>
              <ToggleSwitch
                offColor="#DDDDDD"
                onColor={theme.colors.secondary}
                isOn={lights[val].state.on}
                onToggle={(toggleState) => this.props._changeLightState(val, { on: toggleState })}
              />
            </View>
          </View>
        ))
        ))
    }
  }

  renderToggleButton() {
    return (
      <ToggleSwitch
        offColor="#DDDDDD"
        onColor={theme.colors.secondary}
        isOn={this.props.groups[this.state.id].action.on}
        onToggle={this.onGroupLights}
      />
    );
  }

  onMenuRoomSelect(value) {
    console.log("ControlRoomScreen", "press menu " + value);
    if (value == 1) {
      // show more Room Info
      if (this.state.active == "Main") {
        this.setState({
          active: "ShowMoreInfo"
        });
      } else if (this.state.active == "ShowMoreInfo") {
        this.setState({
          active: "Main"
        });
      }
    } else if (value == 2) {
      this.props.navigation.navigate("EditRoom", {
        id: this.state.id,
        roomName: this.props.groups[this.state.id].name,
        roomClass: this.props.groups[this.state.id].class
      });
    }
  }

  changeColorGroupState = _.throttle((values) => {
    axios({
      method: "PUT",
      url: `http://${this.props.bridgeip[this.props.bridgeIndex]}/api/${
        this.props.username[this.props.bridgeIndex]}/groups/${this.state.id}/action`,
      data: {
        on: true,
        xy: ColorConversionToXY(values)
      }
    })
  }, 50);

  changeBrightnessState = (value) => {
    console.log("changing")
    axios({
      method: "PUT",
      url: `http://${this.props.bridgeip[this.props.bridgeIndex]}/api/${
        this.props.username[this.props.bridgeIndex]}/groups/${this.state.id}/action`,
      data: {
        on: true,
        bri: value
      }
    })
  }

  changeSaturationState = (value) => {
    axios({
      method: "PUT",
      url: `http://${this.props.bridgeip[this.props.bridgeIndex]}/api/${
        this.props.username[this.props.bridgeIndex]}/groups/${this.state.id}/action`,
      data: {
        on: true,
        sat: value
      }
    })
  }

  render() {
    const { nightmode, _changeGroupStateByID } = this.props;
    const { colors } = theme;
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    const trackTintColor = nightmode ? "rgba(157, 163, 180, 0.10)" : "#DDDDDD"
    return (
      <Block style={backgroundcolor}>
        <Block flex={false} center row space="between" style={styles.header}>
          {this.renderBackButton()}
          {this.renderMenu()}
        </Block>
        <Block containerNoHeader>
          <View style={styles.titleRow}>
            <Text style={[styles.title, titlecolor]}>
              {this.props.groups[this.state.id].name}
            </Text>
            <ToggleSwitch
              offColor="#DDDDDD"
              onColor={theme.colors.secondary}
              isOn={this.props.groups[this.state.id].action.on}
              onToggle={(value) => {
                _changeGroupStateByID(this.state.id, {
                  "on": value,
                })
              }}
            />
          </View>
          {this.renderType()}
          <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>
            Brightness
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={254}
            step={10}
            style={{ height: 25 }}
            thumbStyle={styles.thumb}
            trackStyle={{ height: 15, borderRadius: 10 }}
            minimumTrackTintColor={colors.secondary}
            maximumTrackTintColor={trackTintColor}
            value={this.state.bri}
            onValueChange={this.changeBrightnessState}
          />
          <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>
            Saturation
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={254}
            step={10}
            style={{ height: 25 }}
            thumbStyle={styles.thumb}
            trackStyle={{ height: 15, borderRadius: 10 }}
            minimumTrackTintColor={colors.secondary}
            maximumTrackTintColor={trackTintColor}
            value={this.state.sat}
            onValueChange={this.changeSaturationState}
          />
          {this.renderView()}
        </Block>
      </Block >
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _changeGroupStateByID(id, data) {
      return dispatch(SetGroupState(id, data));
    },
    _changeLightState(id, data) {
      return dispatch(SetLampState(id, data))
    },
    _fetchAllLights() {
      return dispatch(GetAllLights())
    }
  };
};

const mapStateToProps = state => {
  return {
    lights: state.lights,
    groups: state.groups,
    bridgeIndex: state.bridgeIndex,
    bridgeip: state.bridgeip,
    username: state.username,
    nightmode: state.nightmode
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlRoomScreen);
// sbb ni refer to ControlRoomScreen class, and class name ni tadi is ControlBulb
// so that whys undefined
// these two kena same name

const styles = StyleSheet.create({
  lightPicker: {
    width: 10
  },
  divider: {
    borderBottomWidth: 0.5,
    borderColor: "#E1E3E8"
  },
  bulbRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10
  },
  textInput: {
    height: 30,
    borderBottomWidth: 0.5,
    borderRadius: 0,
    borderWidth: 0,
    textAlign: "left",
    paddingBottom: 10
  },
  header: {
    marginTop: 50,
    paddingHorizontal: theme.sizes.base * 2
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: theme.colors.secondary,
  },
  textPer: {
    textAlign: "right"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold"
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },
  textControl: {
    textAlign: "left"
  }
});
