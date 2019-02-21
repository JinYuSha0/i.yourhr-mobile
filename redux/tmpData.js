import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const GET_MINE_DATA = 'GET_MINE_DATA'
export const GET_MINE_COURSE_DATA = 'GET_MINE_COURSE_DATA'
export const UPDATE_ALL_MINE_DATE = 'UPDATE_ALL_MINE_DATE'
export const CANCEL_ORDER = 'CANCEL_ORDER'

export const INITIAL_STATE = Immutable.fromJS({
    mineData: {
        update: true,
        timestamp: null,
        myCourseNum: 0,  //我的课程数
        message: 0,  //信息
        credit: 0,  //积分
    },
    mineCourseData: {
        update: true,
        timestamp: null,
        endNum: 0,
        list: []
    }
})

export default handleActions({
    [GET_MINE_DATA]: (state, {payload}) => (
        state.merge(payload).setIn(['mineData', 'update'], false).setIn(['mineData', 'timestamp'], new Date().getTime())
    ),
    [GET_MINE_COURSE_DATA]: (state, {payload}) => (
        state.merge(payload).setIn(['mineCourseData', 'update'], false).setIn(['mineCourseData', 'timestamp'], new Date().getTime())
    ),
    [UPDATE_ALL_MINE_DATE]: (state, {payload}) => (
        state.setIn(['mineData', 'update'], true).setIn(['mineCourseData', 'update'], true)
    ),
    [CANCEL_ORDER]: (state, {payload}) => (
        state.updateIn(['mineCourseData', 'list'], list => list.filter(x => (x.get('course') !== payload)))
    )
}, INITIAL_STATE)

export const getMineData = createAction(GET_MINE_DATA, (data) => (data))
export const getMineCourseData = createAction(GET_MINE_COURSE_DATA, (data) => (data))
export const updateAllMineDate = createAction(UPDATE_ALL_MINE_DATE)
export const cancelOrder = createAction(CANCEL_ORDER, (course) => (course))