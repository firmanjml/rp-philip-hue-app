import C from '../constants'
import { combineReducers } from 'redux'

export const loading = (state = false, action) => {
    if (action.type === C.CHANGE_LOADING) {
        return action.payload;
    } else {
        return state
    }
}

export const bridgeip = (state = '', action) => {
    switch (action.type) {
        case C.FETCH_BRIDGE_IP: 
            return action.payload;
        case C.CHANGE_BRIDGE_IP:
            _state = action.payload;
            return _state;
        default:
            return state
    }
}

export const username = (state = '', action) => {
    switch(action.type) {
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

export const config = (state = {}, action) => {
    switch(action.type) {
        case C.FETCH_CONFIG:
            _state = JSON.parse(JSON.stringify(state))
            _state = action.payload
            return _state;
        default:
            return state;
    }
}

export const groups = (state = [], action) => {
    switch(action.type) {
        case C.FETCH_ALL_GROUPS:
            _state = JSON.parse(JSON.stringify(state))
            _state = action.payload
            return _state;
        default:
            return state;
    }
}

export const lights = (state = [], action) => {
    switch(action.type) {
        case C.FETCH_ALL_LIGHTS:
            _state = JSON.parse(JSON.stringify(state))
            _state = action.payload
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
    username
})