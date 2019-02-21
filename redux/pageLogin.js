import Immutable, { Map } from 'immutable'
import { URL } from '../config/constants'
import { createAction, handleActions } from 'redux-actions'

import { LOGIN_FAILURE } from './user'

export const CLEAR_VALIDATE = 'CLEAR_VALIDATE'
export const CLEAR_VALIDATE_BY_FIELD = 'CLEAR_VALIDATE_BY_FIELD'
export const CAPTCHA_REQUIRED = 'CAPTCHA_REQUIRED'
export const CAPTCHA_FRESH = 'CAPTCHA_FRESH'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CHANGE_MODAL = 'CHANGE_MODAL'
export const FORGET = 'FORGET'
export const VIEW_CHANGE = 'VIEW_CHANGE'
export const FORGET_VALIDATE = 'FORGET_VALIDATE'

export const INITIAL_STATE = Immutable.fromJS({
    validate: {
        name: {visible: false, message: null},
        phone: {visible: false, message: null},
        password: {visible: false, message: null},
        captcha: {visible: false, message: null}
    },
    captcha: {require: false, url: URL + '/getCodeImage'},
    modal: {
        modal: null,
        visible: false,
        hidden: true,
        viewArr: [],
        tmp: null,
    }
})

export default handleActions({
    [LOGIN_FAILURE]: (state, {payload}) => (
        state.set('validate', INITIAL_STATE.get('validate').merge(Immutable.fromJS(payload)))
    ),
    [CLEAR_VALIDATE_BY_FIELD]: (state, {payload}) => (
        state.setIn(['validate', payload, 'visible'], false)
    ),
    [CLEAR_VALIDATE]: (state) => (
        state.set('validate', INITIAL_STATE.get('validate'))
    ),
    [CAPTCHA_REQUIRED]: (state, {payload}) => (
        state.set('captcha', state.get('captcha').merge(payload))
    ),
    [CAPTCHA_FRESH]: (state) => (
        state.setIn(['captcha', 'url'], URL + '/getCodeImage?t=' + new Date().getTime())
    ),
    [OPEN_MODAL]: (state, {payload}) => (
        state.setIn(['modal', 'visible'], true).setIn(['modal', 'hidden'], false).setIn(['modal', 'modal'], payload)
    ),
    [CHANGE_MODAL]: (state, {payload}) => (
        state.set('modal', state.get('modal').merge(Map(payload)))
    ),
    [VIEW_CHANGE]: (state, {payload}) => (
        state.setIn(['modal', 'viewArr'], payload)
    ),
}, INITIAL_STATE)


export const clearValidate = createAction(CLEAR_VALIDATE)
export const clearValidateByField = createAction(CLEAR_VALIDATE_BY_FIELD, (field) => (field))
export const captchaRequired = createAction(CAPTCHA_REQUIRED, (data) => (data))
export const captchaRefresh = createAction(CAPTCHA_FRESH)
export const openModal = createAction(OPEN_MODAL, (modal) => (modal))
export const changeModal = createAction(CHANGE_MODAL, (data) => (data))
export const forget = createAction(FORGET, (data) => (data))
export const viewChange = createAction(VIEW_CHANGE, (viewArr) => (viewArr))
export const forgetValidate = createAction(FORGET_VALIDATE, (data) => (data))

