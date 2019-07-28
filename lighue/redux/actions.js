import C from './constants';
import qs from 'qs';
import axios from 'axios';
import { Constants } from 'expo';
import { Alert } from 'react-native';
import { constant } from '../constants';


/** 
 * 
 * * Change loading state before rendering the information to screen.
 * @param {boolean} visibility This paramter takes in boolean data
*/
export const ChangeLoading = (visibility) => ({
    type: C.CHANGE_LOADING,
    payload: visibility
});

export const ChangeSaving = (visibility) => ({
    type: C.CHANGE_SAVING,
    payload: visibility
});

export const ChangeCloudState = (boolean) => ({
    type: C.CHANGE_CLOUD,
    payload: boolean
});

export const ChangeCloudToken = (code = '') => (dispatch) => {
    let b64 = constant.secret.basicToken;
    axios({
        url: `https://api.meethue.com/oauth2/token?code=${code}&grant_type=authorization_code`,
        method: "POST",
        headers: {
            'Authorization': `Basic ${b64}`
        }
    }).then((res) => {
        dispatch({
            type: C.CHANGE_CLOUD_TOKEN,
            payload: {
                token: res.data.access_token,
                refresh_token: res.data.refresh_token
            }
        });
        dispatch(ChangeCloudState(true));
    }).catch((error) => {
        // unauthroize 401, 400
        console.log(error);
    })
};

export const RefreshCloudToken = () => (dispatch, getState) => {
    let b64 = constant.secret.basicToken;
    axios({
        url: "https://api.meethue.com/oauth2/refresh?grant_type=refresh_token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${b64}`
        },
        data: qs.stringify({ 'refresh_token': getState().cloud.refresh_token })
    }).then((res) => {
        dispatch({
            type: C.CHANGE_CLOUD_TOKEN,
            payload: {
                token: res.data.access_token,
                refresh_token: res.data.refresh_token
            }
        });
    }).catch((error) => {
        // unauthroize 401, 400
        console.log(error);
    })
}

/** 
 * SwitchBridge
 * * Allow switching into multiple bridges
 * @param {number} index This paramter takes in the index of the bridge.
*/
export const SwitchBridge = (index = 0) => (dispatch) => {
    dispatch({
        type: C.CHANGE_BRIDGE,
        payload: index
    })
}

export const ChangeThemeMode = (boolean) => (dispatch) => {
    dispatch({
        type: C.CHANGE_THEME,
        payload: boolean
    })
}

/** 
 * Authentication
 * * Enable authentication 
 * @param {number} boolean This parameter takes in the boolean
*/
export const ChangeAuthentication = (boolean) => (dispatch) => {
    dispatch({
        type: C.CHANGE_AUTHENTICATION_STATE,
        payload: boolean
    })
}

/** 
 * Status
 * * Change status regards to connection of the Bridge
 * @param {number} boolean This parameter takes in the boolean
*/
export const ChangeStatus = (boolean) => (dispatch) => {
    dispatch({
        type: C.CHANGE_STATUS,
        payload: boolean
    })
}


/** 
 * Hardware Support
 * * Index "1" for Fingerprint (Android, iPhone 5s > iPhone 8), Index "2" for Face ID (iPhone X & newer)
 * @param {number} index This paramter takes in the index of hardware support
*/
export const ChangeHardwareSupport = (index = 0) => (dispatch) => {
    dispatch({
        type: C.CHANGE_HARDWARE_SUPPORT,
        payload: index
    })
}

/** 
 * GetBridgeIP
 * * Discover Bridge IP through NUPNP or set manual IP
 * * https://developers.meethue.com/develop/get-started-2/
 * @param {object} navigation This paramter takes in navigation props
 * @param {boolean} isManual This paramter takes in boolean data
 * @param {string} bridgeip This paramter takes in the bridge ip address if 'isManual' is true.
*/
export const GetBridgeIP = (navigation, isManual = false, bridgeip = '') => async (dispatch, getState) => {
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
                setTimeout(() => {
                    Alert.alert(
                        'Bridge is not supported',
                        "Use Bridge V1 only",
                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                        { cancelable: false }
                    );
                }, 500);
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
        })
    } else {
        await axios({
            url: 'https://discovery.meethue.com',
            method: 'GET'
        }).then((res) => {
            if (res.data.length > 0) {
                dispatch({
                    type: C.FETCH_BRIDGE_IP,
                    payload: res.data[0].internalipaddress
                })
            }
        })
    }
}

export const AddBridge = (bridgeip = "", navigation) => async (dispatch) => {
    await axios({
        url: `http://${bridgeip}/api/nouser/config`,
        method: 'GET'
    }).then((res) => {
        if (res.data.modelid === "BSB001") {
            dispatch({
                type: C.ADD_BRIDGE,
                payload: bridgeip
            })
            navigation.navigate('PairNewBridge');
        } else {
            Alert.alert(
                'Bridge is not supported',
                "Use Bridge V1 only",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
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
        // 
    });
}

export const DeleteBridge = (bridgeIndex) => (dispatch) => {
    dispatch({
        type: C.DELETE_BRIDGE,
        payload: bridgeIndex
    })
    dispatch({
        type: C.DELETE_USERNAME,
        payload: bridgeIndex
    })
}

/** 
 * GetAllLights
 * * Document 1.1 Get All Light
 * * https://developers.meethue.com/develop/hue-api/lights-api/#get-all-lights
*/
export const GetAllLights = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights` : `https://api.meethue.com/bridge/${username}/lights`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_LIGHTS,
            payload: res.data
        })
        dispatch(ChangeLoading(false))
    }).catch((error) => {
        dispatch(ChangeLoading(false))
    });
}

/** 
 * GetLightsAttributes&States
 * * Document 1.4. Get lamp attributes
 * * https://developers.meethue.com/develop/hue-api/lights-api/#get-attr-and-state
 * @param {number} lampID This paramter takes in the lamp ID.
*/
export const GetLightAtrributes = (lampID) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}` : `https://api.meethue.com/bridge/${username}/lights/${lampID}`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'GET',
        headers
    }).then(res => {
        if (res.data) {
            dispatch({
                type: C.FETCH_LIGHT,
                id: lampID,
                payload: res.data
            })
        } else {
            throw Error('An error has occur');
        }
    }).catch((error) => {
        console.log(error);
    }).then();
};


/** 
 * SearchForNewLights
 * * Document 1.3 Search For New Light
 * * https://developers.meethue.com/develop/hue-api/lights-api/#search-for-new-lights
*/
export const SearchForNewLights = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights` : `https://api.meethue.com/bridge/${username}/lights`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'POST',
        headers
    }).catch((error) => {
        console.log(error);
    })
};

/** 
 * SetLampState
 * * Document 1.6 Set Light State
 * * https://developers.meethue.com/develop/hue-api/lights-api/#set-light-state
 * @param {number} lampID This paramter takes in the light ID.
 * @param {object} lampData This paramter takes in the body argument of the request.
*/
export const SetLampState = (lampID, lampData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}/state` : `https://api.meethue.com/bridge/${username}/lights/${lampID}/state`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'PUT',
        headers,
        data: lampData
    }).then(res => {
        var payload = {};
        res.data.map((data) => {
            let key = Object.keys(data.success)[0].substring(Object.keys(data.success)[0].lastIndexOf('/') + 1);
            let value = Object.values(data.success)[0];
            payload[key] = value;
        })
        if (payload) {
            dispatch({
                type: C.CHANGE_LIGHT_STATE,
                id: lampID,
                payload: payload
            })
        } else {
            throw Error('An error has occur');
        }
    }).catch((error) => {
    }).then();
};

/** 
 * DeleteLight
 * * Document 1.7. Delete lights
 * * https://developers.meethue.com/develop/hue-api/lights-api/#del-lights
 * @param {number} lampID This paramter takes in the light ID.
*/
export const DeleteLight = (lampID) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}` : `https://api.meethue.com/bridge/${username}/lights/${lampID}`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    dispatch(ChangeSaving(true))
    axios({
        url,
        method: 'DELETE',
        headers
    }).then((res) => {
        if (res.data[0].success) {
            dispatch(ChangeSaving(false))
            dispatch({
                type: C.DELETE_LIGHT,
                payload: lampID
            })
            navigation.navigate("PostUpdate", {
                meta: {
                    title: "Successfully deleted!"
                }
            })
        } else if (res.data[0].error) {
            dispatch(ChangeSaving(true))
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    "Please try again",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 1000);
        }
    }).catch((error) => {
        dispatch(ChangeSaving(false))
        setTimeout(() => {
            Alert.alert(
                'Error',
                "Please try again",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }, 1000);
    }).then(

    )
};

/** 
 * GetAllGroups
 * * Document 2.1. Get all groups
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#get-all-groups
*/
export const GetAllGroups = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups` : `https://api.meethue.com/bridge/${username}/groups`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_GROUPS,
            payload: res.data
        })
        dispatch(ChangeLoading(false))
    }).catch((error) => {
    }).then();
};

/** 
 * CreateGroup
 * * Document 2.2. Create group
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#create-group
 * @param {object} groupData This parameter takes in the body argument of the request.
*/
export const CreateGroup = (groupData, navigation) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups` : `https://api.meethue.com/bridge/${username}/groups`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    dispatch(ChangeSaving(true))
    if (getState().status) {
        axios({
            url,
            method: 'POST',
            headers,
            data: groupData
        }).then(res => {
            if (res.data[0].success) {
                dispatch(ChangeSaving(false))
                dispatch({
                    type: C.CREATE_GROUP,
                    id: res.data[0].success.id,
                    payload: {
                        "name": groupData.name,
                        "lights": groupData.lights,
                        "type": groupData.type,
                        "action": {}
                    }
                })
                navigation.navigate("PostUpdate", {
                    meta: {
                        title: "Successfully added!"
                    }
                })
            } else if (res.data[0].error) {
                dispatch(ChangeSaving(false))
                setTimeout(() => {
                    Alert.alert(
                        'Error',
                        "Please check you input, such as selecting bulb that is not assigned to any room yet.",
                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                        { cancelable: false }
                    );
                }, 1000);
            }
        }).catch((error) => {
            dispatch(ChangeSaving(false))
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    "Please try again",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 1000);
        }).then(

        )
    }
    else {
        dispatch(ChangeSaving(false))
        Alert.alert(
            'No connection to Philips Hue Bridge',
            "Please try to reconnect",
            [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: "Reconnect",
                onPress: () => dispatch(GetConfig())
            }],
            { cancelable: true }
        );
    }
};

/** 
 * GetGroupAtrributes
 * * Document 2.3. Get group attributes
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#get-group-attr
 * @param {number} groupID This paramter takes in the group ID.
*/
export const GetGroupAtrributes = (groupID) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}` : `https://api.meethue.com/bridge/${username}/groups/${groupID}`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'GET',
    }).then(res => {
        if (res.data) {
            dispatch({
                type: C.FETCH_GROUP,
                id: groupID,
                payload: payload
            })
        } else {
            throw Error('An error has occur');
        }
    })
};

/** 
 * SetGroupAttributes
 * * Document 2.5 Set Light Attributes
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#set-group-attr
 * @param {number} groupID This paramter takes in the light ID.
 * @param {object} groupData This paramter takes in the body argument of the request.
*/
export const SetGroupAttributes = (groupID, groupData, navigation) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}` : `https://api.meethue.com/bridge/${username}/groups/${groupID}`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    dispatch(ChangeSaving(true));
    axios({
        url,
        method: 'PUT',
        headers,
        data: groupData
    }).then(res => {
        var payload = {};
        res.data.map((data) => {
            let key = Object.keys(data.success)[0].substring(Object.keys(data.success)[0].lastIndexOf('/') + 1);
            let value = Object.values(data.success)[0];
            payload[key] = value;
        })
        if (payload) {
            dispatch(ChangeSaving(false));
            dispatch({
                type: C.CHANGE_GROUP_ATTR,
                id: groupID,
                payload: payload
            })
            navigation.navigate('ControlRoom', {
                id: groupID
            });
        } else {
            dispatch(ChangeSaving(false))
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    "Please check your input",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 1000);
        }
    }).catch((error) => {
        dispatch(ChangeSaving(false))
        setTimeout(() => {
            Alert.alert(
                'Error',
                "Please try again",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }, 1000);
    })
};

/** 
 * SetGroupState
 * * Document 2.5. Set group state
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#set-gr-state
 * @param {number} groupID This paramter takes in the group ID.
 * @param {object} groupData This paramter takes in the body argument of the request.
*/
export const SetGroupState = (groupID, groupData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}/action` : `https://api.meethue.com/bridge/${username}/groups/${groupID}/action`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'PUT',
        headers,
        data: groupData
    }).then(res => {
        var payload = {};
        res.data.map((data) => {
            let key = Object.keys(data.success)[0].substring(Object.keys(data.success)[0].lastIndexOf('/') + 1);
            let value = Object.values(data.success)[0];
            payload[key] = value;
        })
        if (payload) {
            dispatch({
                type: C.CHANGE_GROUP_STATE,
                id: groupID,
                payload: payload
            })
        }
    })
};

/** 
 * DeleteGroup
 * * Document 2.6. Delete Group
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#del-group
 * @param {number} groupID This paramter takes in the group ID.
*/
export const DeleteGroup = (groupID, navigation) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}` : `https://api.meethue.com/bridge/${username}/groups/${groupID}`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    dispatch(ChangeSaving(true))
    axios({
        url,
        method: 'DELETE',
        headers
    }).then((res) => {
        if (res.data[0].success) {
            dispatch(ChangeSaving(false))
            navigation.navigate("PostUpdate", {
                meta: {
                    title: "Successfully deleted!"
                }
            })
            dispatch({
                type: C.DELETE_GROUP,
                payload: groupID
            })
        }
    }).catch((error) => {
        dispatch(ChangeSaving(false))
        setTimeout(() => {
            Alert.alert(
                'Error',
                "Please try again",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }, 1000);
    })
};

/** 
 * CreateUser
 * * Document 7.1. Create user
 * * https://developers.meethue.com/develop/hue-api/7-configuration-api/#create-user
 * @param {number} i This paramter takes in the index of the bridge.
*/
export const CreateUser = (i = 0) => (dispatch, getState) => {
    const bridgeip = getState().bridgeip[i];

    axios({
        url: `http://${bridgeip}/api`,
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
            dispatch(ChangeStatus(true));
        }
    })
};

/** 
 * GetConfig
 * * Document 7.2. Get configuration
 * * Also acts as a check Status and get all information
 * * https://developers.meethue.com/develop/hue-api/7-configuration-api/#get-configuration 
*/
export const GetConfig = (initialCheck = false) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/config` : `https://api.meethue.com/bridge/${username}/config`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };


    if (initialCheck) {
        dispatch(ChangeLoading(true))
    }
    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_CONFIG,
            payload: res.data
        })
        dispatch(ChangeStatus(true))
        dispatch(ChangeLoading(false))
        dispatch(GetAllGroups());
        dispatch(GetAllLights());
        dispatch(GetSchedules());
    }).catch((error) => {
        dispatch(ChangeLoading(false))
        dispatch(ChangeStatus(false))
    })
}

/** 
 * SetLampAttributes
 * * Document 1.5 Set Light Attributes
 * * https://developers.meethue.com/develop/hue-api/lights-api/#set-light-state
 * @param {number} lampID This paramter takes in the light ID.
 * @param {object} lampData This paramter takes in the body argument of the request.
*/
export const SetLampAttributes = (lampID, lampData, navigation) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}` : `https://api.meethue.com/bridge/${username}/lights/${lampID}`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    dispatch(ChangeSaving(true));
    axios({
        url,
        method: 'PUT',
        headers,
        data: lampData
    }).then(res => {
        var payload = {};
        res.data.map((data) => {
            let key = Object.keys(data.success)[0].substring(Object.keys(data.success)[0].lastIndexOf('/') + 1);
            let value = Object.values(data.success)[0];
            payload[key] = value;
        })
        if (payload) {
            dispatch(ChangeSaving(false));
            dispatch({
                type: C.CHANGE_LIGHT_ATTR,
                id: lampID,
                payload: payload
            })
            navigation.navigate('ControlBulb', {
                id: lampID
            });
        } else {
            dispatch(ChangeSaving(false))
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    "Please check your input",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 1000);
        }
    }).catch((error) => {
        dispatch(ChangeSaving(false))
        setTimeout(() => {
            Alert.alert(
                'Error',
                "Please try again",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }, 1000);
    })
};


/** 
 * GetSchedules
 * * Document 3.1. Get schedules
 * * https://developers.meethue.com/develop/hue-api/3-schedules-api/#get-all-schedules 
*/
export const GetSchedules = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/schedules` : `https://api.meethue.com/bridge/${username}/schedules`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_SCHEDULES,
            payload: res.data
        })
    });
};

/** 
 * CreateSchedules
 * * Document 3.2. Create schedules
 * * https://developers.meethue.com/develop/hue-api/3-schedules-api/#create-schedule
 * @param {object} scheduleData This parameter takes in the body argument of the request.
*/
export const CreateSchedules = (scheduleData, navigation) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/schedules` : `https://api.meethue.com/bridge/${username}/schedules`;
    const headers = getState().cloud_enable === true ? { "Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

    dispatch(ChangeSaving(true));
    if (getState().status) {
        axios({
            url,
            method: 'POST',
            headers,
            data: JSON.stringify(scheduleData)
        }).then(res => {
            if (res.data[0].success) {
                dispatch(ChangeSaving(false));
                dispatch({
                    type: C.CREATE_SCHEDULE,
                    id: res.data[0].success.id,
                    payload: JSON.stringify(scheduleData)
                })
                navigation.navigate("PostUpdate", {
                    meta: {
                        title: "Successfully added!"
                    }
                })
            } else if (res.data[0].error) {
                dispatch(ChangeSaving(false));
                Alert.alert(
                    'Error',
                    "Please check your input",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }
        }).catch((error) => {
            dispatch(ChangeSaving(false))
            setTimeout(() => {
                Alert.alert(
                    'Error',
                    "Please try again",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 1000);
        })
    }
    else {
        dispatch(ChangeSaving(false));
        Alert.alert(
            'No connection to Philips Hue Bridge',
            "Please try to reconnect",
            [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: "Reconnect",
                onPress: () => dispatch(GetConfig())
            }],
            { cancelable: true }
        );
    }
};