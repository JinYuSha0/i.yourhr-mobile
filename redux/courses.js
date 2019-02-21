import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const GET_ALL_COURSE = 'GET_ALL_COURSE'
export const GET_ALL_COURSE_SUCCESS = 'GET_ALL_COURSE_SUCCESS'
export const GET_COURSE_FAILURE = 'GET_COURSE_FAILURE'

export const GET_LEVEL = 'GET_LEVEL'
export const GET_CLASSIFY = 'GET_CLASSIFY'
export const GET_CLASSIFY_SUCCESS = 'GET_CLASSIFY_SUCCESS'

export const CHANGE_CITY = 'CHANGE_CITY'

export const INITIAL_STATE = Immutable.fromJS({
    city: {
        cityName: window.cityInfo.cityName || '未知',
        cityCode: window.cityInfo.cityCode || '257'
    },
    classify: {
        levels: [],
        error: false,
        loading: false,
        courses: {
            level: null,
            coursesList: []
        }
    },
    courses: {
        error: false,
        loading: false,
        coursesList: []
    }
})

export default handleActions({
    [GET_ALL_COURSE]: (state) => (
        state.setIn(['courses', 'loading'], false)
    ),
    [GET_ALL_COURSE_SUCCESS]: (state, {payload}) => (
        state.setIn(['courses', 'loading'], true).setIn(['courses', 'error'], false).setIn(['courses', 'coursesList'], payload)
    ),
    [GET_COURSE_FAILURE]: (state, {payload}) => (
        state.setIn([payload, 'loading'], true).setIn([payload, 'error'], true)
    ),
    [GET_LEVEL]: (state, {payload}) => (
        state.setIn(['classify', 'levels'], payload)
    ),
    [GET_CLASSIFY]: (state) => (
        state.setIn(['classify', 'loading'], false)
    ),
    [GET_CLASSIFY_SUCCESS]: (state, {payload}) => (
        state.setIn(['classify', 'loading'], true).setIn(['classify', 'error'], false).setIn(['classify', 'courses', 'level'], payload.level).setIn(['classify', 'courses', 'coursesList'], payload.coursesList)
    ),
    [CHANGE_CITY]: (state, {payload}) => (
        INITIAL_STATE.setIn(['city', 'cityCode'], payload.cityCode).setIn(['city', 'cityName'], payload.cityName)
    )
}, INITIAL_STATE)

export const getAllCourse = createAction(GET_ALL_COURSE)
export const getAllCourseSuccess = createAction(GET_ALL_COURSE_SUCCESS, (data) => (data))
export const getCourseFailure = createAction(GET_COURSE_FAILURE)

export const getLevel = createAction(GET_LEVEL, (levels) => (levels))
export const getClassify = createAction(GET_CLASSIFY, (level) => (level))

export const changeCity = createAction(CHANGE_CITY, (city) => (city))