import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Modal } from "react-native";
import { ColorPicker } from "react-native-color-picker";

import { connect } from "react-redux";
import { SetGroupState } from "../../redux/actions";
import ToggleSwitch from "../../components/ToggleSwitch";
import Icon from 'react-native-vector-icons';

import {
  ColorConversionToXY
} from "../../components/ColorConvert";
import { theme } from "../../constants";

import { Block, Input, Text } from "../../components";

import Slider from "react-native-slider";

import axios from "axios";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

// kau tak tukar ControlBulb to ControlRoomScreen
class ControlRoomScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    id: null,
    sat: null,
    bri: null,
    satPer: null,
    briPer: null,
    type: null
  };

  componentWillMount() {
    this.setState({ id: this.props.navigation.getParam("id", "NO-ID") });
  }

  componentDidMount() {
    this.calculatePercentage(
      "bri",
      this.props.groups[this.state.id].action.bri
    );
    this.calculatePercentage(
      "sat",
      this.props.groups[this.state.id].action.sat
    );
    this.setState({
      type: this.props.groups[this.state.id].class == null ? "Other" : this.props.groups[this.state.id].class,
      sat: this.props.groups[this.state.id].action.sat,
      bri: this.props.groups[this.state.id].action.bri
    });
  }

  renderType() {
    const {type} = this.state;
    return (
      <View>
        <Text style={[styles.textControl, textcolor]}>Type</Text>
        <Input
          style={[styles.textInput, titlecolor, bordercolor]}
          editable={false}
          value={type}
          placeholderTextColor={nightmode ? colors.gray2 : colors.black}
        />
      </View>
    )
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
          <MenuOption value={1}>
            <Text h3>Show More Info</Text>
          </MenuOption>
          <View style={styles.divider} />
          <MenuOption value={2}>
            <Text h3>Edit Room</Text>
          </MenuOption>
          <View style={styles.divider} />
        </MenuOptions>
      </Menu>
    )
  }

  changeColorGroupState = values => {
    const {
      bridgeip,
      username,
      bridgeIndex,
      groups,
      _changeGroupStateByID
    } = this.props;

    if (!groups[this.state.id].action.on) {
      _changeGroupStateByID(this.state.id, {
        on: true
      });
    }
    axios({
      method: "PUT",
      url: `http://${bridgeip[bridgeIndex]}/api/${
        username[bridgeIndex]
        }/groups/${this.state.id}/action`,
      data: { xy: ColorConversionToXY(values) }
    });
  };

  changeSatGroupState = values => {
    const {
      bridgeip,
      username,
      bridgeIndex,
      groups,
      _changeGroupStateByID
    } = this.props;

    if (!groups[this.state.id].action.on) {
      _changeGroupStateByID(this.state.id, {
        on: true
      });
    }
    axios({
      method: "PUT",
      url: `http://${bridgeip[bridgeIndex]}/api/${
        username[bridgeIndex]
        }/groups/${this.state.id}/action`,
      data: { sat: values }
    });
    this.calculatePercentage("sat", values);
  };

  changeBriGroupState = (values) => {
    const {
      bridgeip,
      username,
      bridgeIndex,
      groups,
      _changeGroupStateByID
    } = this.props;

    if (!groups[this.state.id].action.on) {
      _changeGroupStateByID(this.state.id, {
        on: true
      });
    }
    axios({
      method: "PUT",
      url: `http://${bridgeip[bridgeIndex]}/api/${
        username[bridgeIndex]
        }/groups/${this.state.id}/action`,
      data: { bri: values }
    });
    // in axios, state kena tukar to action api, sbb in group api, bri sat and on is 
    // dalam action punya object
    this.calculatePercentage("bri", values);
  };

  calculatePercentage = (arg, values) => {
    let result = Math.round((values * 100) / 254);
    if (result == 0) {
      if (arg == "sat") {
        this.setState({ satPer: 1 });
      } else {
        this.setState({ briPer: 1 });
      }
    } else {
      if (arg == "sat") {
        this.setState({ satPer: result });
      } else {
        this.setState({ briPer: result });
      }
    }
  };

  onGroupLights = boolean => {
    this.props._changeGroupStateByID(this.state.id, {
      on: boolean
    });
  };

  renderBriSlider() {
    const { nightmode } = this.props;
    const trackTintColor = nightmode ? "rgba(157, 163, 180, 0.10)" : "#DDDDDD";
    return (
      <Slider
        minimumValue={1}
        maximumValue={254}
        style={{ height: 19 }}
        thumbStyle={styles.thumb}
        trackStyle={{ height: 10, borderRadius: 10 }}
        minimumTrackTintColor={theme.colors.secondary}
        maximumTrackTintColor={trackTintColor}
        value={this.state.bri}
        onValueChange={this.changeBriGroupState}
      />
    );
  }

  renderSatSlider() {
    const { nightmode } = this.props;
    const trackTintColor = nightmode ? "rgba(157, 163, 180, 0.10)" : "#DDDDDD";
    return (
      <Slider
        minimumValue={1}
        maximumValue={254}
        style={{ height: 19 }}
        thumbStyle={styles.thumb}
        trackStyle={{ height: 10, borderRadius: 10 }}
        minimumTrackTintColor={theme.colors.secondary}
        maximumTrackTintColor={trackTintColor}
        value={this.state.sat}
        onValueChange={this.changeSatGroupState}
      />
    );
  }

  renderColorPicker() {
    return (
      <ColorPicker
        onColorChange={this.changeColorGroupState}
        style={{ flex: 1 }}
        hideSliders={true}
      // color={ConvertXYtoHex(this.props.lights[this.state.id].state.xy[0], this.props.lights[this.state.id].state.xy[1], 254)}
      // color={this.state.color}
      />
    );
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
      this.props.navigation.navigate("MoreRoomInfo");
    } else if (value == 2) {
      this.props.navigation.navigate("EditRoom");
    }
  }

  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const backgroundcolor = {
      backgroundColor: nightmode ? colors.background : colors.backgroundLight
    };
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    const bordercolor = {
      borderColor: nightmode ? colors.white : colors.gray2
    };
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
            {this.renderToggleButton()}
          </View>
          {this.renderType()}
          <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>
            Brightness
            </Text>
          {this.renderBriSlider()}
          <Text style={[styles.textPer, textcolor]}>
            {this.state.briPer}%
            </Text>
          <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>
            Saturation
            </Text>
          {this.renderSatSlider()}
          <Text style={[styles.textPer, textcolor]}>
            {this.state.satPer}%
            </Text>
          {this.renderColorPicker()}
        </Block>
      </Block>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _changeGroupStateByID(id, data) {
      return dispatch(SetGroupState(id, data));
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
  textInput: {
    height: 30,
    borderBottomWidth: 0.5,
    borderRadius: 0,
    borderWidth: 0,
    textAlign: "left",
    paddingBottom: 10
  },
  header: {
    marginTop: 30,
    paddingHorizontal: theme.sizes.base * 2,
  },
  thumb: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    borderRadius: theme.sizes.base,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: theme.colors.secondary
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
