import { combineReducers  } from 'redux'
import { routerReducer } from 'react-router-redux'
import { loadingBarReducer } from 'react-redux-loading-bar'

import userReducer from './user'
import pageLoginReducer from './pageLogin'
import navigationReducer from './navigation'
import coursesReducer from './courses'
import tmpDataReducer from './tmpData'

export default combineReducers({
    loadingBar: loadingBarReducer,
    router: routerReducer,
    navigation: navigationReducer,
    user: userReducer,
    login: pageLoginReducer,
    courses: coursesReducer,
    tmp: tmpDataReducer,
})