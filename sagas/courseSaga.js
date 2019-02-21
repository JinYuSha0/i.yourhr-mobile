import  { put } from 'redux-saga/effects'
import { store, history } from "../index"
import { fetchGet } from '../util/util'

import { getAllCourseSuccess, getCourseFailure, GET_CLASSIFY_SUCCESS } from '../redux/courses'
import Toast from '../components/toast'

export function* getAllCourse() {
    const { courses } = store.getState()
    try {
        const {data} = yield fetchGet('/findCourseList', {city_no: courses.getIn(['city', 'cityCode'])})
        if(data.status === 'success') {
            yield put(getAllCourseSuccess(data.courseList))
        }
    } catch (e) {
        yield put(getCourseFailure('courses'))
        Toast(e.message, 2000)
    }
}

export function* getLevel({payload}) {
    const levels = []
    payload.map(v => {
        levels.push(v.key)
    })
    history.push({pathname: '/classify/' + levels.join('/')})
}

export function* getClassify({payload}) {
    const { courses } = store.getState(),
        levels = courses.getIn(['classify', 'levels']),
        city_no = courses.getIn(['city', 'cityCode'])

    try {
        if(levels) {
            let type = levels.length,
                key = levels[type-1].key
            if(key === 0) {
                type -= 1
                key = levels[type-1].key
            }
            const { data } = yield fetchGet('/findCourseListClassify', {type, key, city_no})
            if(data.status === 'success') {
                yield put({type: GET_CLASSIFY_SUCCESS, payload: {coursesList: data.courseList, level: payload}})
            } else {
                throw new Error()
            }
        } else {
            throw new Error()
        }
    } catch (e) {
        yield put(getCourseFailure('classify'))
    }
}

export function* changeCity({payload}) {
    //todo post修改服务端session
}