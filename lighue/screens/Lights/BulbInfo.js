import React from "react";
import {
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { Button, Block, Text } from "../../components";
import { theme } from "../../constants";
import Icon from 'react-native-vector-icons';
import { DeleteLight } from "../../redux/actions";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

class bulbInfoScreen extends React.Component {

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
    id: null
  };

  // retrieve id from navigation props
  componentWillMount() {
    this.setState({
      id: this.props.navigation.getParam("id", "NO-ID")
    });
  }

  alertUserDeletion() {
    Alert.alert(
      'Are you sure?',
      "This will delete the light from the bridge",
      [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }, {
        text: "OK",
        onPress: () => {
          this.props._deleteLight(this.state.id, this.props.navigation)
        }
      }],
      { cancelable: false }
    );
  }

  renderMenu() {
    return (
      <Menu onSelect={value => this.onMenuLampSelect(value)}>
        <MenuTrigger>
          <Icon.Entypo
            name="dots-three-horizontal"
            size={25}
            color={theme.colors.gray}
          />
        </MenuTrigger>
        <MenuOptions style={{ padding: 15 }}>
          <MenuOption value={1}>
            <Text h3>Edit Lamp</Text>
          </MenuOption>
          <View style={styles.divider} />
          </MenuOptions>
      </Menu>
    )
  }


  onMenuLampSelect(value) {
    console.log("BulbInfo", "press menu " + value);
    if (value == 1) {
      // edit lamp
      this.props.navigation.navigate("EditBulb");
    } 
  }

  render() {
    const { id } = this.state;
    const { lights, nightmode } = this.props;
    const { colors } = theme;
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
    return (
      <Block style={backgroundcolor}>
      <Block container>
      {this.renderMenu()}
          <Text h1 bold color={"white"} style={{ textAlign: "left" }}>Bulb Info</Text>
          <Block style={{ marginTop: 10 }}>

            <Text semibold paragraph white style={{ marginTop: 20 }}>Name</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{lights[id].name}</Text>
            <View style={styles.line} />
            <Text semibold paragraph white style={{ marginTop: 10 }}>Type</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{lights[id].type}</Text>
            <View style={styles.line} />
            <Text semibold paragraph white style={{ marginTop: 10 }}>Manufacturer</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{lights[id].manufacturername}</Text>
            <View style={styles.line} />
            <Text semibold paragraph white style={{ marginTop: 10 }}>Model Id</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{lights[id].modelid}</Text>
            <View style={styles.line} />
            <Text semibold paragraph white style={{ marginTop: 10 }}>Mac Address</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{lights[id].uniqueid}</Text>
            <View style={styles.line} />
            <Text semibold paragraph white style={{ marginTop: 10 }}>Software Version</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{lights[id].swversion}</Text>
            <View style={styles.line} />
          </Block>

          <Button
            gradient
            startColor="#C40A0A"
            endColor="#E86241"
            onPress={this.alertUserDeletion}>
            <Text center semibold white>Delete Bulb</Text>
          </Button>

        </Block>
      </Block>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    _deleteLight(id, navigation) {
      return dispatch(DeleteLight(id, navigation))
    }
  }
}
const mapStateToProps = (state) => {
  return {
    lights: state.lights,
    nightmode: state.nightmode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(bulbInfoScreen);

const styles = StyleSheet.create({
  lampRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },
  line: {
    marginTop: 10,
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: "#E1E3E8"
}
});

