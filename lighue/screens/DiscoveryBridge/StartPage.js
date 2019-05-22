import React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { GetBridgeIP } from '../../redux/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        loading: state.loading,
        bridgeip: state.bridgeip,
        username: state.username
    }
}

const mapDispatchToprops = (dispatch) => {
    return {
        _GetBridgeIP() {
            return () => dispatch(GetBridgeIP());
        }
    }
}


/**
 * StartPage
 * ! This class is deprecated, please do not use.
 */
class StartPage extends React.Component {

    componentWillMount() {
        if (!this.props.bridgeip) {
            this.props._GetBridgeIP()();
        }
        if (this.props.username) {
            this.props.navigation.navigate("viewUserName")
        }
    }

    pairButton = () => {
        if (!this.props.bridgeip) {
            this.props._GetBridgeIP()();
        }
        else {
            this.props.navigation.navigate("LinkButton")
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 20 }}>Searching for new bitches!</Text>
                <Text style={{ fontSize: 20, marginTop: 20 }}>Current Bridge IP : {this.props.bridgeip ? this.props.bridgeip : 'None'}</Text>
                {/* <Text style={{ fontSize: 20, marginTop: 20 }}>{this.props.loading ? "Searching.." : "Bridge Found!"}</Text> */}
                <View style={styles.searchButton}>
                    <Button
                        title="Pair Bridge"
                        onPress={this.pairButton}
                    />
                </View>
                <View style={styles.manualButton}>
                    <Button
                        title="Manual IP"
                        onPress={() => this.props.navigation.navigate("Controlbulb")}
                    />
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        marginTop: 50,
    },
    manualButton: {
        marginTop: 50
    }
});

export default connect(mapStateToProps, mapDispatchToprops)(StartPage);