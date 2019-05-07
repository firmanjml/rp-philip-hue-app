import C from './constants';
import axios from 'axios';
import { persistor } from './store';
import { Constants } from 'expo';
import { Alert } from 'react-native';

export const changeLoading = visibility => ({
    type: C.CHANGE_LOADING,
    payload: visibility
})

export const fetchBridgeIp = (navigation, isManual = false, bridgeip) => async (dispatch) => {
    dispatch(changeLoading(true));
    if (isManual) {
        await axios({
            url: `http://${bridgeip}/api/nouser/config`,
            method: 'GET'
        }).then((res) => {
            if (res.data.modelid === "BSB001") {
                dispatch({
                    type: C.FETCH_BRIDGE_IP,
                    payload: bridgeip
                })
                navigation.navigate('LinkButton');
            } else {
                throw Error('Invalid IP');
            }
        }).catch((error) => {
            setTimeout(() => {
                Alert.alert(
                    'IP address you entered cannot be reached',
                    "Please try again",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 500);
        }).then(() => {
            dispatch(changeLoading(false));
        });
    } else {
        await axios({
            // url: 'https://discovery.meethue.com',
            url: 'https://api.myjson.com/bins/1eqhrc',
            method: 'GET'
        }).then((res) => {
            dispatch({
                type: C.FETCH_BRIDGE_IP,
                payload: res.data[0].internalipaddress
            })
        }).catch((error) => {
            dispatch(changeLoading(false));
            console.log(error)
        }).then(() => {
            dispatch(changeLoading(false));
        });
    }
}

export const createUser = (username = '') => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api`,
        method: 'POST',
        data: {
            devicetype: `Lighue#${Constants.deviceName}`
        }
    }).then((res) => {
        if (res.data[0].success) {
            dispatch({
                type: C.FETCH_USERNAME,
                payload: res.data[0].success.username
            });
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
}

export const fetchConfig = (config = {}) => async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/config`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_CONFIG,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
}

export const fetchAllGroups = (groups = []) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_GROUPS,
            payload: Object.values(res.data)
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
}

export const fetchAllLights = (lights = []) => async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_LIGHTS,
            payload: Object.values(res.data)
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
}