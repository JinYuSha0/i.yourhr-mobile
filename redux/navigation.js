import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const INITIAL_STATE = Immutable.fromJS([])

export const ENTER = 'ENTER'
export const LEAVE = 'LEAVE'
export const LEAVE_SUCCESS = 'LEAVE_SUCCESS'

export default handleActions({
    [ENTER]: (state, {payload}) => {
        if(state.size > 20) {
            state.shift()
        }

        if(state.size > 0 && payload.path === state.get(state.size-1).path) {
            return state
        }

        return state.push(payload)
    },
    [LEAVE_SUCCESS]: state => state.pop(),
}, INITIAL_STATE)

export const enter = createAction(ENTER, (page) => (page))
export const leave = createAction(LEAVE)
export const leaveSuccess = createAction(LEAVE_SUCCESS)