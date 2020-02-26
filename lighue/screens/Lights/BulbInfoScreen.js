import React from "react";
import {
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Button, Block, Text } from "../../components";
import { theme } from "../../constants";
import { Entypo } from '@expo/vector-icons';
import { DeleteLight, GetAllLights } from "../../redux/actions";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

class BulbInfoScreen extends React.Component {

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
    id: 0,
    name: "",
    type: "",
    manufacturername: "",
    modelid: "",
    uniqueid: "",
    swversion: ""

  };

  // retrieve id from navigation props
  componentWillMount() {
    this.setState({
      id: this.props.navigation.getParam("id", "1")
    });
  }

  componentDidMount() {
    this.setState({
      name: this.props.lights[this.state.id].name,
      type: this.props.lights[this.state.id].type,
      manufacturername: this.props.lights[this.state.id].manufacturername,
      modelid: this.props.lights[this.state.id].modelid,
      uniqueid: this.props.lights[this.state.id].uniqueid,
      swversion: this.props.lights[this.state.id].swversion
    })
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
          this.props._DeleteLight(this.state.id, this.props.navigation)
        }
      }],
      { cancelable: false }
    );
  }

  renderMenu() {
    return (
      <Menu onSelect={value => this.onMenuLampSelect(value)}>
        <MenuTrigger>
          <Entypo
            name="dots-three-horizontal"
            size={25}
            color={theme.colors.gray}
          />
        </MenuTrigger>
        <MenuOptions style={{ padding: 15 }}>
          <MenuOption value={1}>
            <Text h3>Edit Bulb Name</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    )
  }


  onMenuLampSelect(value) {
    console.log("BulbInfo", "press menu " + value);
    if (value == 1) {
      // edit lamp
      this.props.navigation.navigate('EditBulb', {
        id: this.state.id,
        name: this.props.lights[this.state.id].name
      })
    }
  }

  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
    return (
      <Block style={backgroundcolor}>
        <Block container style={{ marginBottom: 20 }}>
          <Block flex={false} row space="between">
            <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Bulb Info</Text>
            {this.renderMenu()}
          </Block>
          <ScrollView>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Name</Text>
              <Text style={[styles.text, textcolor]}>{this.state.name}</Text>
              <View style={styles.divider} />
            </Block>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Type</Text>
              <Text style={[styles.text, textcolor]}>{this.state.type}</Text>
              <View style={styles.divider} />
            </Block>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Manufacturer</Text>
              <Text style={[styles.text, textcolor]}>{this.state.manufacturername}</Text>
              <View style={styles.divider} />
            </Block>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Model Id</Text>
              <Text style={[styles.text, textcolor]}>{this.state.modelid}</Text>
              <View style={styles.divider} />
            </Block>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Mac Address</Text>
              <Text style={[styles.text, textcolor]}>{this.state.uniqueid}</Text>
              <View style={styles.divider} />
            </Block>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Software Version</Text>
              <Text style={[styles.text, textcolor]}>{this.state.swversion}</Text>
              <View style={styles.divider} />
            </Block>
            <Block bottom flex={1}>
              <Button
                onPress={() => this.alertUserDeletion()}>
                <Text center semibold white>Delete Bulb</Text>
              </Button>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    _DeleteLight(id, navigation) {
      return dispatch(DeleteLight(id, navigation))
    },
    _fetchAllLights: () => dispatch(GetAllLights()),
  }
}
const mapStateToProps = (state) => {
  return {
    lights: state.lights,
    nightmode: state.nightmode
  }
}

const styles = StyleSheet.create({
  row: {
    marginTop: 20,
  },
  text: {
    marginTop: 10
  },
  divider: {
    marginTop: 10,
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: "#E1E3E8"
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BulbInfoScreen);