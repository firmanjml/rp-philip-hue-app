import C from './constants'
import axios from 'axios'
import { persistor } from './store'
import { Constants } from 'expo';

export const changeLoading = (visibility) => ({
    type: C.CHANGE_LOADING,
    payload: visibility
})

export const fetchBridgeIp = (isManual = false, bridgeip) => (dispatch) => {
    dispatch(changeLoading(true));
    if (isManual) {
        dispatch({
            type: C.FETCH_BRIDGE_IP,
            payload: bridgeip
        })
        dispatch(changeLoading(false))
    }
    else {
        axios({
            // url: 'https://discovery.meethue.com',
            url: 'https://api.myjson.com/bins/1eqhrc',
            method: 'GET'
        }).then((res) => {
            dispatch({
                type: C.FETCH_BRIDGE_IP,
                payload: res.data[0].internalipaddress
            });
        }).catch((error) => {
            dispatch(changeLoading(false));
            console.log(error)
        }).then(dispatch(changeLoading(false)));
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
        dispatch({
            type: C.FETCH_USERNAME,
            payload: res.data[0].success.username
        });
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
}

export const fetchAllGroups = (groups = {}) => async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_GROUPS,
            payload: res.data
        })
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

export const fetchAllLights = (lights = {}) => async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_LIGHTS,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
}