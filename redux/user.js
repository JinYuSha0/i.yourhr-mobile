import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const LOGINOUT = 'LOGINOUT'
export const LOGINOUT_AUTO = 'LOGINOUT_AUTO'
export const LOGINOUT_SUCCESS = 'LOGINOUT_SUCCESS'

export const SIGN_UP = 'SIGN_UP'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGN_UP_VALIDATE = 'SIGN_UP_VALIDATE'

export const CHANGE_USER_INFO = 'CHANGE_USER_INFO'

export const INITIAL_STATE = Immutable.fromJS({
    isLogin: false, //是否登录
    expiredTime: null, //过期时间
    userInfo: {
        nickName: null, //昵称
        sex: null, //性别 true男  false女
        headImg: null
    }
})

export default handleActions({
    [LOGIN_SUCCESS]: (state, {payload}) => (
        state.merge(payload).set('isLogin', true)
    ),
    [LOGINOUT_SUCCESS]: state => INITIAL_STATE,
    [SIGNUP_SUCCESS]: (state, {payload}) => (
        state.merge(payload).set('isLogin', true)
    ),
    [CHANGE_USER_INFO]: (state, {payload}) => (
        state.setIn(['userInfo', payload.k], payload.v)
    )
}, INITIAL_STATE)

export const login = createAction(LOGIN, (params) => (params))
export const loginFailure = createAction(LOGIN_FAILURE, (data) => (data))

export const signup = createAction(SIGN_UP, (params) => (params))
export const signupValidate = createAction(SIGN_UP_VALIDATE, (captcha) => (captcha))

export const logout = createAction(LOGINOUT)

export const changeUserInfo = createAction(CHANGE_USER_INFO, (info) => (info))