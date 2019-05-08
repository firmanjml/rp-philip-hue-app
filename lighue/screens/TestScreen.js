import React, { Component } from 'react'
import { Text, StyleSheet, View, Button } from 'react-native'
import { connect } from 'react-redux'
import { fetchAllGroups, changeGroupStateByID, addGroup } from '../redux/actions'
import Spinner from "react-native-loading-spinner-overlay";

const mapStateToProps = state => {
    return {
        groups: state.groups,
        loading: state.loading
    }
}

const mapDispatchToprops = (dispatch, ownProps) => {
    return {
        _fetchAllGroups() {
            return () => dispatch(fetchAllGroups); 
        },
        _changeGroupStateByID(id, data) {
            return dispatch(changeGroupStateByID(id, data));
        },
        _addGroup(data) {
            return dispatch(addGroup(data));
        }
    }
}

class TestScreen extends Component {

    componentWillMount() {
        // // before calling get group api
        // console.log(this.props.groups);

        // this.props._fetchAllGroups()();
        // // after calling get group api
        // console.log(this.props.groups[0].name);
        this.props._fetchAllGroups()();
    }

    test() {
        this.props._addGroup({
            "name": "Living room",
            "class": "Living room",
            "lights": [
                "1"
            ],
            "type": "LightGroup"
        })
        console.log(this.props.groups)
    }

    render() {
        // Example 
        return(
            <View style={styles.container}>
            <Spinner visible={this.props.loading} />
            <View>
                <Text style={{ fontSize: 20 }}>{this.props.groups[0].name}</Text>
                <View style={styles.manualButton}>
                    <Button
                        title="Test"
                        onPress={() => this.test()}
                    />
                </View>
            </View>
        </View>
        )
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

export default connect(
    mapStateToProps,
    mapDispatchToprops
)(TestScreen)
