import { store } from '../index'
import { List } from 'immutable'
import  { call, put } from 'redux-saga/effects';
import { history } from '../index'
import { fetchPost, delay, getUrlParams } from '../util/util'
import { SignUpCaptcha, switchAnimate } from '../page/login/login'

import { loginFailure } from '../redux/user'
import { leave } from '../redux/navigation'
import { captchaRequired, captchaRefresh, openModal, changeModal, viewChange } from '../redux/pageLogin'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { LOGIN_SUCCESS, SIGNUP_SUCCESS, LOGINOUT_SUCCESS } from '../redux/user'

import Toast from '../components/toast'

function* login({payload}) {
    yield put(showLoading())
    try {
        const res = yield call(fetchPost, '/login', { ...payload })
        yield put(hideLoading())
        if(res.data.status === 'success') {
            yield put({ type: LOGIN_SUCCESS, payload: res.data.data })
        } else {
            const { login } = store.getState()
            if(res.data.validate.captcha && res.data.validate.captcha.require) {
                yield put(captchaRequired({require: true}))
            }
            if(login.getIn(['captcha', 'require'])) {
                yield put(captchaRefresh())
            }
            yield put(loginFailure(res.data.validate))
        }
    } catch (e) {
        yield put(hideLoading())
        Toast(e.message, 2000)
    }
}

function* loginSuccess() {
    const params = getUrlParams()
    if('redirect' in params) {
        Toast('登录成功', 1500, () => {
            window.location.href = params['redirect']
        })
    } else {
        Toast('登录成功', 1500, () => {
            store.dispatch(leave())
        })
    }
}

function* loginOut() {
    yield put(showLoading())
    try {
        const res = yield call(fetchPost, '/exitLogin', {})
        yield put(hideLoading())
        if(res.data.status === 'success') {
            Toast('退出成功', 1500, () => {
                store.dispatch({ type: LOGINOUT_SUCCESS })
                history.push('/')
            })
        }
    } catch (e) {
        yield put(hideLoading())
        yield put({ type: LOGINOUT_SUCCESS })
        history.push('/')
    }
}

function* logoutAuto() {
    yield put(hideLoading())
    Toast('登陆过期', 1500, () => {
        store.dispatch({ type: LOGINOUT_SUCCESS })
        history.push('/login')
    })
}

function* signup({payload}) {
    yield put(showLoading())
    try {
        const res = yield call(fetchPost, '/signup', { step: 1, info: {...payload} })
        yield put(hideLoading())
        if(res.data.status === 'success') {
            yield put(changeModal({modal: null, visible: false, hidden: true, tmp: { phone: payload.phone }}))
            yield put(openModal(SignUpCaptcha))
            return
        }
        if(res.data.validate) {
            yield put(loginFailure(res.data.validate))
            return
        }
        if(res.data.message) {
            Toast(res.data.message, 1500)
        }
    } catch (e) {
        yield put(hideLoading())
        Toast(e.message, 2000)
    }
}

function* signupValidate({payload}) {
    try {
        if(payload.captcha.length === 6) {
            yield put(showLoading())
            const res = yield call(fetchPost, '/signup', { step: 2, ...payload })
            yield put(hideLoading())
            if(res.data.status === 'success') {
                yield put({ type: SIGNUP_SUCCESS, payload: res.data.data })
                return
            }
            Toast(res.data.message, 1500)
            return
        }
        Toast('请输入正确的短信验证码', 1500)
    } catch (e) {
        yield put(hideLoading())
        Toast(e.message, 2000)
    }
}

function* signupSuccess() {
    Toast('注册成功', 1500, () => {
        store.dispatch(leave())
    })
}

function* forget({payload}) {
    const { data, now, next } = payload
    const { login } = store.getState()

    if(!(/^1[3456789]\d{9}$/.test(data.phone))) {
        Toast('请输入正确的手机号码', 1500)
        return
    }

    if(login.getIn(['captcha', 'require']) && data.captcha.length !== 4 ) {
        Toast('请输入正确的验证码', 1500)
        return
    }

    try {
        yield put(showLoading())
        const res = yield call(fetchPost, '/findBackPassword', { step: 1, ...data })
        yield put(hideLoading())
        if(res.data.status === 'success') {
            yield put(viewChange(login.getIn(['modal', 'viewArr']).push(next)))
            switchAnimate(now, next)
            return
        }
        if(res.data.captcha && res.data.captcha.require) {
            yield put(captchaRequired({require: true}))
        }
        if(res.data.message) {
            if(login.getIn(['captcha', 'require'])) {
                yield put(captchaRefresh())
            }
            Toast(res.data.message, 1500)
        }
    } catch (e) {
        yield put(hideLoading())
        Toast(e.message, 2000)
    }
}

function* forgetValidate({payload}) {
    const { newPassword, captcha } = payload

    if(newPassword.length < 6) {
        Toast('请输入6位数以上的密码', 1500)
        return
    }

    if(captcha.length != 6) {
        Toast('请输正确的短信验证码', 1500)
        return
    }

    yield put(showLoading())
    try {
        const res = yield call(fetchPost, '/findBackPassword', { step: 2, ...payload })
        yield put(hideLoading())
        if(res.data.status === 'success') {
            Toast('修改密码成功', 1500)
            yield put(viewChange(List([])))
            yield put(captchaRequired({require: true}))
            yield put(changeModal({ visible: false }))
            yield delay(500)
            yield put(changeModal({ modal: null, hidden: true }))
            return
        }
        if(res.data.message) {
            Toast(res.data.message, 1500)
        }
    } catch (e) {
        Toast(e.message, 2000)
    }
}

module.exports = {
    login: login,
    loginSuccess: loginSuccess,
    loginOut: loginOut,
    logoutAuto: logoutAuto,
    signup: signup,
    signupValidate: signupValidate,
    signupSuccess: signupSuccess,
    forget: forget,
    forgetValidate: forgetValidate,
}