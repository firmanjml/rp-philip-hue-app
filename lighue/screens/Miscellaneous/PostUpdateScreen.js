import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import { Block, Text } from '../../components';
import { theme } from '../../constants';
import { DangerZone } from 'expo';
import tick from '../../assets/lottie/tick.json';
import cross from '../../assets/lottie/cross.json';
import _ from 'lodash';
const { Lottie } = DangerZone;

export default class PostUpdateScreen extends React.Component {

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
      animation: null,
    };
  
    async componentWillMount() {
      const { timer, nav } = this.props.navigation.getParam("meta", {});
      const delay = timer === undefined ? 3000 : timer;
      const navPath = nav === undefined ? "ListRoom" : nav;
      _.delay(() => this.props.navigation.navigate(navPath), delay);
      this._playAnimation(); 
    }

    _playAnimation = () => {
      if (!this.state.animation) {
        this._loadAnimationAsync();
      } else {
        this.animation.reset();
        this.animation.play();
      }
    };
  
    _loadAnimationAsync = async () => {
      const { type } = this.props.navigation.getParam("meta", {});
      const anim = type === undefined ? tick : cross;
      this.setState({ animation: anim }, this._playAnimation);
    };

    render() {
      const { title } = this.props.navigation.getParam("meta", {});
      const header = title === undefined ? "empty" : title;
        return (
            <Block style={styles.container}>
              <Block flex={false} container top>
                <Text white h1>{header}</Text>
              </Block>
              <Block flex={false} middle>
                {this.state.animation &&
                    <Lottie
                      ref={animation => {
                        this.animation = animation;
                      }}
                      style={{
                        width: 400,
                        height: 400
                      }}
                      loop={false}
                      source={this.state.animation}
                    />}
                    </Block>
            </Block>
        )
    }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background
  }
})