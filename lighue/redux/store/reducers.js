import C from '../constants';
import { combineReducers } from 'redux';
import _ from 'lodash';

/** 
 * loading
 * * Redux reducer stores loading data to Redux state.
*/
export const loading = (state = false, action) => {
    if (action.type === C.CHANGE_LOADING) {
        return action.payload;
    } else {
        return state;
    }
}

/** 
 * nightmode
 * * Redux reducer stores nightmode data to Redux state.
*/
export const nightmode = (state = false, action) => {
    if (action.type === C.CHANGE_THEME) {
        return action.payload;
    } else {
        return state
    }
}

/** 
 * bridgeip
 * * Redux reducer stores bridge ip address data to Redux state.
*/
export const bridgeip = (state = '', action) => {
    switch (action.type) {
        case C.FETCH_BRIDGE_IP:
            return action.payload;
        case C.CHANGE_BRIDGE_IP:
            _state = action.payload;
            return _state;
        default:
            return state;
    }
}

/** 
 * username
 * * Redux reducer stores username data it recevied from the API to Redux state.
*/
export const username = (state = '', action) => {
    switch (action.type) {
        case C.FETCH_USERNAME:
            return action.payload;
        case C.CHANGE_USERNAME:
            _state = JSON.parse(JSON.stringify(state));
            _state.success.username = action.payload;
            return _state;
        default:
            return state;
    }
}

/** 
 * config
 * * Redux reducer stores config data it recevied from the API to Redux state.
*/
export const config = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_CONFIG:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        default:
            return state;
    }
}

/** 
 * groups
 * * Redux reducer stores group data it recevied from the API to Redux state
*/
export const groups = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_ALL_GROUPS:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        case C.FETCH_GROUP:
            _state = JSON.parse(JSON.stringify(state));
            _state[action.id] = action.payload;
            return _state;
        case C.CHANGE_GROUP_STATE:
            _state = JSON.parse(JSON.stringify(state));
            _.merge(_state[action.id].action, action.payload);
            return _state;
        case C.CREATE_GROUP:
            _state = JSON.parse(JSON.stringify(state));
            _state[action.id] = action.payload;
            return _state;
        case C.DELETE_GROUP:
            _state = JSON.parse(JSON.stringify(state));
            delete _state[payload]
            return _state;
        default:
            return state;
    }
}

/** 
 * lights
 * * Redux reducer stores light data it recevied from the API to Redux state
*/
export const lights = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_ALL_LIGHTS:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        case C.CHANGE_LIGHT_STATE:
            _state = JSON.parse(JSON.stringify(state));
            _state[action.id].state = action.payload;
            return _state;
        case C.DELETE_LIGHT:
            _state = JSON.parse(JSON.stringify(state));
            delete _state[payload]
            return _state;
        default:
            return state;
    }
}

export default combineReducers({
    bridgeip,
    config,
    groups,
    lights,
    loading,
    username,
    nightmode
});