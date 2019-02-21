"use strict"

//rem大小
window.rem = parseFloat(window.getComputedStyle(document.documentElement)["fontSize"])

/*----- 样式 -----*/
import './static/style/index.less'

/*调试*/
//import 'vconsole'

/*----- 库 -----*/
import 'whatwg-fetch'
import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { ConnectedRouter } from 'react-router-redux'
import { fetchGet, getQueryString, removeElem } from './util/util'
injectTapEventPlugin() //touch事件

/*----- 依赖 -----*/
import createStore from './redux/createStore'
import rootReducer from './redux/reducer'
import rootSaga from './sagas/index'
import reduxPersist from './config/redux-persist'

/*----- 组件 -----*/
import Header from './components/header/header'
import Footer from './components/footer/footer'
import LoadingBar from './components/loadingBar/loadingBar'

/*----- 分页 -----*/
import PageIndex from './page/index/index'
import PageLogin from './page/login/login'
import PageMine from './page/mine/mine'
import PageMinCourses from './page/mineCourses/mineCourses'
import PageCity from './page/city/city'
import PageError from './page/error/error'
import PageClassify from './page/classify/classify'
import PageCourse from './page/course/course'
import PageChangeInfo from './page/changeUserInfo/changeUserInfo'

/*----- action -----*/
import { changeCity } from './redux/courses'

export const store = createStore(rootReducer, rootSaga)
export const history = createHistory()

class App extends Component {
    constructor() {
        super()
        this.state = { rehydrated: false }
    }

    componentWillMount() {
        // persist
        persistStore(store, reduxPersist, async () => {
            //从参数获取city_no
            if(!!history.location.search) {
                const cityCode = getQueryString('c'),
                    { courses } = store.getState()

                if(!!cityCode && courses.getIn(['city', 'cityCode']) != cityCode) {
                    const { data } = await fetchGet('/findCityName', {city_no: cityCode})
                    if(data.status === 'success' && !!data.city) {
                        store.dispatch(changeCity({cityCode, cityName: data.city}))
                    }
                }
            }

            this.setState({ rehydrated: true })
            this.switchWrapper.style.height = document.body.clientHeight + 'px'
            const loader = document.getElementById('loader')
            removeElem(loader)

            window.addEventListener('resize', () => {
                this.switchWrapper.style.height = document.body.clientHeight + 'px'
            })
        })
    }

    render() {
        const { rehydrated } = this.state
        return (
            <div className="app">
                {
                    rehydrated ? <Provider store={store}>
                        <ConnectedRouter history={history}>
                            <div className="layout">
                                <LoadingBar/>

                                <Header/>

                                <div id="switch-wrapper" ref={(switchWrapper) => {this.switchWrapper = switchWrapper}}>
                                    <Switch>
                                        <Route exact path="/" component={PageIndex}/>
                                        <Route exact path="/course" component={PageIndex}/>
                                        <Route path="/login" component={PageLogin}/>
                                        <Route path="/mine/index" component={PageMine}/>
                                        <Route path="/mine/courses" component={PageMinCourses}/>
                                        <Route path="/mine/changeUserInfo" component={PageChangeInfo}/>
                                        <Route path="/city" component={PageCity}/>
                                        <Route path="/course/:id" component={PageCourse}/>
                                        <Route path="/classify/:one/:tow/:three" component={PageClassify}/>
                                        <Route path="*" component={PageError}/>
                                    </Switch>

                                    <Footer/>
                                </div>
                            </div>
                        </ConnectedRouter>
                    </Provider> : null
                }
            </div>
        )
    }
}

const root = document.getElementById('app-wrapper')

render(<App/>, root)