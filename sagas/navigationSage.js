import  { call, put } from 'redux-saga/effects'
import { leaveSuccess }  from '../redux/navigation'
import {history, store} from "../index"

export function* leave() {
    const { navigation } = store.getState()
    if(navigation.size > 1) {
        const upPage = navigation.get(navigation.size-2)
        yield put(leaveSuccess())
        history.push({pathname: upPage.path})
        //history.goBack()
    } else {
        history.push({pathname: '/'})
    }
}