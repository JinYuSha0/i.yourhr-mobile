import { put, take, takeLatest, takeEvery } from 'redux-saga/effects';

import { LEAVE } from '../redux/navigation'
import { leave } from './navigationSage'

import { LOGIN, LOGIN_SUCCESS, LOGINOUT, LOGINOUT_AUTO, SIGN_UP, SIGN_UP_VALIDATE, SIGNUP_SUCCESS } from '../redux/user'
import { FORGET, FORGET_VALIDATE } from '../redux/pageLogin'
import { login, loginSuccess, loginOut, logoutAuto, signup, signupValidate, signupSuccess, forget, forgetValidate } from './userSaga'

import { GET_ALL_COURSE, GET_LEVEL, GET_CLASSIFY, CHANGE_CITY } from '../redux/courses'
import { getAllCourse, getLevel, getClassify, changeCity } from '../sagas/courseSaga'

// 当action触发时，执行特定saga
export default function* root() {
    yield [
        takeEvery(LEAVE, leave),

        takeLatest(LOGIN, login),
        takeLatest(LOGIN_SUCCESS, loginSuccess),
        takeLatest(LOGINOUT, loginOut),
        takeLatest(LOGINOUT_AUTO, logoutAuto),
        takeLatest(SIGN_UP, signup),
        takeLatest(SIGN_UP_VALIDATE, signupValidate),
        takeLatest(SIGNUP_SUCCESS, signupSuccess),
        takeLatest(FORGET, forget),
        takeLatest(FORGET_VALIDATE, forgetValidate),

        takeLatest(GET_ALL_COURSE, getAllCourse),
        takeLatest(GET_LEVEL, getLevel),
        takeLatest(GET_CLASSIFY, getClassify),
        takeLatest(CHANGE_CITY, changeCity),

    ];
}
