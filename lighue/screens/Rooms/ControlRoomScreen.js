import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { ColorPicker } from "react-native-color-picker";
import { connect } from "react-redux";
import { SetGroupState, SetLampState, GetAllLights } from "../../redux/actions";
import ToggleSwitch from "../../components/ToggleSwitch";
import Icon from "react-native-vector-icons";
import { ColorConversionToXY, HexColorConversionToXY } from "../../components/ColorConvert";
import { theme } from "../../constants";
import DialogInput from 'react-native-dialog-input';
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
    on: false,
    type: "",
    active: "Main",
    roomName: "",
    transitiontime: 0,
    dialogModal: false,
    dialogTransitionModal: false
  };

  componentWillMount() {
    this.setState({
      roomName: this.props.groups[this.props.navigation.getParam("id", "1")].name,
      id: this.props.navigation.getParam("id", "1"),
      type: this.props.navigation.getParam("class", "Other"),
      sat: this.props.groups[this.props.navigation.getParam("id", "1")].action.sat,
      bri: this.props.groups[this.props.navigation.getParam("id", "1")].action.bri,
      on: this.props.groups[this.props.navigation.getParam("id", "1")].action.on

    });
  }

  renderType(titlecolor, textcolor, bordercolor, nightmode, colors) {
    const { type } = this.state;
    return (
      <View>
        <Text style={[styles.textControl, titlecolor]}>Room Type</Text>
        <Input
          style={[styles.textInput, textcolor, bordercolor]}
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

  _renderModal() {
    return (
      <DialogInput
        isDialogVisible={this.state.dialogModal}
        title={"Color Control Advanced"}
        message={"Please enter hex code"}
        hintInput={"#ffffff"}
        submitInput={(hex) => {
          {
            this.setState({ dialogModal: false }),
              this.applyHexCode(hex)
          }
        }}
        closeDialog={() => this.setState({ dialogModal: false })}
      />
    )
  }

  applyHexCode(hex) {
    if (validator.isHexColor(hex)) {
      this.props._changeGroupStateByID(this.state.id, {
        xy: HexColorConversionToXY(hex)
      })
    }
    else {
      Alert.alert(
        'Incorrect input',
        'Make sure that the input is a hex code',
        [
          { text: "Ok", onPress: () => { } },
        ],
        { cancelable: false },
      );
    }
  }

  _renderTransitionModal() {
    return (
      <DialogInput
        isDialogVisible={this.state.dialogTransitionModal}
        title={"Change transition time"}
        message={"Please enter transition time. Default 0ms"}
        hintInput={"0"}
        submitInput={(transition) => {
          this.setState({
            dialogTransitionModal: false,
            transitiontime: transition
          })
        }}
        closeDialog={() => this.setState({ dialogTransitionModal: false })}
      />
    )
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
          <MenuOption value={3}>
            <Text h3>Modify Transition Time</Text>
          </MenuOption>
          <View style={styles.divider} />
          <MenuOption value={4}>
            <Text h3>Apply Hex Code</Text>
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

  renderView(textcolor) {
    const { lights, groups, navigation } = this.props;
    if (this.state.active == "Main") {
      return (
        <ColorPicker
          onColorChange={this.state.on ? this.changeColorGroupState : this.AlertUser}
          style={{ flex: 1 }}
          hideSliders={true}
        />
      );
    } else if (this.state.active == "ShowMoreInfo") {
      return (
        <ScrollView style={{ marginTop: 30 }}>
          {groups[this.state.id].lights.map((val, index) => (
            <View key={index} style={styles.bulbRow}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props._fetchAllLights();
                    setTimeout(() => {
                      navigation.navigate('ControlBulb', {
                        id: val
                      });
                    }, 700);
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon.Ionicons name="ios-bulb" size={25} style={{ alignSelf: 'center', marginRight: 10 }} color={theme.colors.gray} />
                    <Text style={[textcolor, { fontSize: 21, alignSelf: 'center' }]}>{lights[val].name.length > 15 ? lights[val].name.substring(0, 15) + "..." : lights[val].name}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BulbInfo', {
                      id: val
                    });
                  }}>
                  <Icon.Ionicons name="md-information-circle-outline" size={22} style={{ marginLeft: 15, alignSelf: 'center' }} color={theme.colors.gray} />
                </TouchableOpacity>
              </View>
              <ToggleSwitch
                offColor="#DDDDDD"
                onColor={theme.colors.secondary}
                isOn={this.props.lights[val].state.on}
                onToggle={(value) => {
                  this.props._changeLightState(val, {
                    "on": value,
                  })
                }}
              />
            </View>
          ))
          }
        </ScrollView>
      )
    }
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
    else if (value == 3) {
      this.setState({
        dialogTransitionModal: true
      })
    }
    else if (value == 4) {
      this.setState({
        dialogModal: true
      })
    }
  }

  changeColorGroupState = _.throttle((values) => {
    const i = this.props.bridgeIndex
    const bridgeip = this.props.bridgeip[i]
    const username = this.props.username[i]
    const url = this.props.cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${this.state.id}/action` : `https://api.meethue.com/bridge/${username}/groups/${this.state.id}/action`;
    const headers = this.props.cloud_enable === true ? { "Authorization": `Bearer ${this.props.cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
      url,
      method: 'PUT',
      headers,
      data: {
        xy: ColorConversionToXY(values),
        transitiontime: this.state.transitiontime
      }
    }, 600);
  });

  changeBrightnessState = _.throttle((value) => {
    const i = this.props.bridgeIndex
    const bridgeip = this.props.bridgeip[i]
    const username = this.props.username[i]
    const url = this.props.cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${this.state.id}/action` : `https://api.meethue.com/bridge/${username}/groups/${this.state.id}/action`;
    const headers = this.props.cloud_enable === true ? { "Authorization": `Bearer ${this.props.cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
      url,
      method: 'PUT',
      headers,
      data: {
        bri: _.round(value),
        transitiontime: this.state.transitiontime
      }
    }, 60);
  });

  changeSaturationState = _.throttle((value) => {
    const i = this.props.bridgeIndex
    const bridgeip = this.props.bridgeip[i]
    const username = this.props.username[i]
    const url = this.props.cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${this.state.id}/action` : `https://api.meethue.com/bridge/${username}/groups/${this.state.id}/action`;
    const headers = this.props.cloud_enable === true ? { "Authorization": `Bearer ${this.props.cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
      url,
      method: 'PUT',
      headers,
      data: {
        sat: _.round(value),
        transitiontime: this.state.transitiontime
      }
    }, 60);
  })

  AlertUser() {
    Alert.alert(
      'The lights is off',
      "Please turn on your lights first",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  render() {
    const { nightmode, _changeGroupStateByID } = this.props;
    const { colors } = theme;
    const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    const trackTintColor = nightmode ? "rgba(157, 163, 180, 0.10)" : "#DDDDDD"
    return (
      <Block style={backgroundcolor} >
        <Block flex={false} center row space="between" style={styles.header}>
          {this.renderBackButton()}
          {this.renderMenu()}
          {this._renderModal()}
          {this._renderTransitionModal()}
        </Block>
        <Block containerNoHeader>
          <View style={styles.titleRow}>
            <Text style={[styles.title, titlecolor]}>
              {this.state.roomName}
            </Text>
            <ToggleSwitch
              offColor="#DDDDDD"
              onColor={theme.colors.secondary}
              isOn={this.state.on}
              onToggle={(value) => {
                {
                  _changeGroupStateByID(this.state.id, {
                    "on": value,
                  }),
                    this.setState({
                      on: value
                    })
                }
              }}
            />
          </View>
          {this.renderType(titlecolor, textcolor, bordercolor, nightmode, colors)}
          <Text style={[styles.textControl, titlecolor, { marginBottom: 10 }]}>
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
            onValueChange={this.state.on ? this.changeBrightnessState : this.AlertUser}
          />
          <Text style={[styles.textControl, titlecolor, { marginBottom: 10 }]}>
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
            onValueChange={this.state.on ? this.changeSaturationState : this.AlertUser}
          />
          {this.renderView(textcolor)}
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
    nightmode: state.nightmode,
    cloud_enable: state.cloud_enable
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
