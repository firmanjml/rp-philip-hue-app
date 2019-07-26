import React from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  View
} from "react-native";
import { connect } from "react-redux";
import { Button, Block, Text, Input } from "../../components";
import { theme } from "../../constants";
import { SetLampAttributes } from "../../redux/actions";


class EditBulbScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ height: 40, width: 80, justifyContent: "center" }}
        >
          <Image source={require("../../assets/icons/back.png")} />
        </TouchableOpacity>
      )
    };
  };


  state = {
    id: 0,
    bulbName: null,
    checked: false
  };

  componentWillMount() {
    this.setState({
      id: this.props.navigation.getParam("id", "1"),
      bulbName: this.props.navigation.getParam("name", "")
    });
  }

  renderLoadingModal() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.saving}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={this.props.saving}
              color="#00ff00" />
            <Text>Saving...</Text>
          </View>
        </View>
      </Modal>
    )
  }


  changeName = (value) => {
    this.setState({ bulbName: value })
  }

  saveBulbName() {
    this.props._changeLampName(this.state.id, {
      name: this.state.bulbName
    }, this.props.navigation)
  }


  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
    return (
      <Block style={backgroundcolor}>
        <Block container>
          <Text h1 bold style={[titlecolor, { textAlign: "left" }]}>Edit Bulb Info</Text>
          {this.renderLoadingModal()}
          <Block style={{ marginTop: 10 }}>
            <Text semibold paragraph style={[titlecolor, { marginTop: 20 }]}>Bulb Name</Text>
            <Input
              style={[styles.textInput, textcolor, bordercolor]}
              value={this.state.bulbName}
              onChangeText={this.changeName}
              returnKeyType={'done'}
            />
          </Block>
          <Block bottom flex={1} style={{ marginBottom: 10 }}>
            <Button
              gradient
              startColor="#0A7CC4"
              endColor="#2BDACD"
              onPress={() => this.saveBulbName()}>
              <Text center semibold white>Save</Text>
            </Button>
          </Block>

        </Block>
      </Block>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    saving: state.saving,
    lights: state.lights,
    nightmode: state.nightmode
  }
}


const mapDispatchToProps = dispatch => {
  return {
    _changeLampName(id, data, navigation) {
      return dispatch(SetLampAttributes(id, data, navigation));
    }
  };
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background
  },
  textInput: {
    height: 25,
    borderBottomWidth: 0.5,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "white",
    textAlign: "left",
    paddingBottom: 10
  },
  line: {
    marginTop: 10,
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: "#E1E3E8"
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBulbScreen);
