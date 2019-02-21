import './header.less'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { leave } from '../../redux/navigation'
import Classify from '../../components/classify'
import { transition } from '../../util/util'

class Header extends Component{
    render() {
        const { router, user, navigation, leaveTodo } = this.props
        const nowPage = navigation.get(navigation.size-1)
        return (
           <div className="layout-header">
               {
                   ['/', '/course'].indexOf(router.location.pathname) >= 0 ? <Main user={user}/> : <Return leaveTodo={leaveTodo} nowPage={nowPage}/>
               }
            </div>
        )
    }
}

class Main extends Component {
    _toTop() {
        const switchWrapper = document.getElementById('switch-wrapper'),
            top = switchWrapper.scrollTop
        transition(top, 0, 800, (v) => {
            switchWrapper.scrollTop = v
        })
    }

    render() {
        const {user} = this.props
        return (
            <div className="header">
                <div className="logo" onTouchTap={this._toTop}></div>
                <div className="btns">
                        <span className="classes" onTouchTap={() => {new Classify()}} >
                            <i className="iconfont">&#xe620;</i>筛选
                        </span>
                    <span className="split"></span>
                    <span className="user">
                            {
                                !user.get('isLogin') ?
                                    <Link to="/login">
                                        <i className="iconfont">&#xe637;</i>登录
                                    </Link>:
                                    <Link to="/mine/index">
                                        <i className="iconfont">&#xe637;</i>{user.get('userInfo').get('nickName')}
                                    </Link>
                            }
                        </span>
                </div>
            </div>
        )
    }
}

class Return extends Component {
    goBack() {
        this.props.leaveTodo()
    }

    render() {
        const { nowPage } = this.props
        return (
            <div className="header">
                <i className="iconfont goBack" onClick={this.goBack.bind(this)}>&#xe615;</i>
                <div className="title">{nowPage ? nowPage.name : ''}</div>
            </div>
        )
    }
}

export default connect(
    ({ router, user, navigation }) => ({ router, user, navigation }),
    (dispatch) => bindActionCreators({
        leaveTodo: leave
    }, dispatch)
)(Header)