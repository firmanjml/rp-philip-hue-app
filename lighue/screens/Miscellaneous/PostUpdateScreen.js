import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Block, Text } from '../../components';
import { theme, constant } from '../../constants';
import { connect } from 'react-redux'
import Layout from '../../constants/Layout';
import { DangerZone } from 'expo';
import tick from '../../assets/lottie/676-done';
import _ from 'lodash';
const { Lottie } = DangerZone;

class PostUpdateScreen extends Component {
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
    animation: null
  };

  componentDidMount() {
    this.animation1.play()
  }

  async componentWillMount() {
    const { timer, nav } = this.props.navigation.getParam("meta", {});
    const delay = timer === undefined ? 1000 : timer;
    const navPath = nav === undefined ? "ListRoom" : nav;
    _.delay(() => this.props.navigation.navigate(navPath), delay);
  }

  renderLottie() {
    return (
      <Block style={styles.slide}>
        {tick &&
          <Lottie
            ref={animation1 => {
              this.animation1 = animation1;
            }}
            speed={1}
            source={tick}
            loop={false}
          />}
      </Block>
    )
  }

  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
    const titlecolor = { color: nightmode ? colors.white : colors.black }
    const { title } = this.props.navigation.getParam("meta", {});
    const header = title === undefined ? "empty" : title;
    
    return (
      <Block style={backgroundcolor}>
        <Block container>
          <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>{header}</Text>
          {this.renderLottie()}
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nightmode: state.nightmode,
    hardwareSupport: state.hardwareSupport
  }
}

export default connect(
  mapStateToProps,
  null
)(PostUpdateScreen)

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    textAlign: 'left',
    fontWeight: '200',
    fontSize: 30
  },
  text: {
    marginTop: 20,
    textAlign: 'left',
    fontSize: 15,
  }
});