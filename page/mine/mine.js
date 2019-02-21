import './mine.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../../redux/user'
import { enter, leave } from '../../redux/navigation'
import { getMineData } from '../../redux/tmpData'
import { history } from '../../index'
import { Link } from 'react-router-dom'
import { fetchPost } from '../../util/util'

import Toast from '../../components/toast'
import Loading from '../../components/loading/loading'
import CellGroup from '../../components/cell-group/cell-group'

class PageMine extends Component {
    state = {
        loading: false,
        cells: [
            {name: '我的课程', todo: (e) => {
                e.preventDefault()
                history.push({pathname: '/mine/courses'})
            }},
            {name: '修改信息', todo: (e) => {
                e.preventDefault()
                history.push({pathname: '/mine/changeUserInfo'})
            }},
            {name: '退出登录', todo: (e) => {
                e.preventDefault()
                this.props.logoutTodo()
            }},
        ]
    }

    async componentWillMount() {
        const { user, tmp, enterTodo, leaveTodo, getMineDataTodo } = this.props

        const isLogin = user.get('isLogin')
        if(!isLogin) {
            history.push({pathname: '/'})
            return
        }

        enterTodo({path: '/mine/index', name: '我的'})

        if(tmp.getIn(['mineData', 'update'])) {
            try {
                const { data } = await fetchPost('/findMyInfo')
                if(data.status === 'success') {
                    getMineDataTodo({mineData: {...data.info}})
                } else {
                    throw new Error('加载信息失败,请稍后再试。')
                }
            } catch (e) {
                Toast(e.message, 1500, () => {
                    if(e.name !== 'ExceptError') {
                        leaveTodo()
                    }
                })
            }
        }

        this.setState({loading: true})
    }

    render() {
        const { loading } = this.state,
            user = this.props.user.get('userInfo'),
            info = this.props.tmp.get('mineData')

        return (
            <div className="layout-body PageMine">
                {
                    loading ? <div>
                        <div className="content-header">
                            <div className="info">
                                <div className="headImg-container">
                                    <img src="http://image.yourhr.com.cn/static/images/teacher/zy.png"/>
                                </div>
                                <div className="info-container">
                                    <p className="nickName">{user.get('nickName')}</p>
                                    <span className={user.get('sex') ? 'sex boy' : 'sex girl'}></span>
                                </div>
                            </div>
                        </div>

                        <div className="content-body">
                            <div className="asset">
                                <Link to="/mine/courses" className="item">
                                    <span>{info.get('myCourseNum')}</span>
                                    <span>课程</span>
                                </Link>
                                <Link to="#" className="item">
                                    <span>0</span>
                                    <span>消息</span>
                                </Link>
                                <Link to="#" className="item">
                                    <span>{info.get('credit')}</span>
                                    <span>积分</span>
                                </Link>
                            </div>

                            <div className="btn-group">
                                <CellGroup cells={this.state.cells}/>
                            </div>
                        </div>
                    </div> : <Loading/>
                }
            </div>
        )
    }
}

export default connect(
    ({ user, tmp }) => ({ user, tmp }),
    (dispatch) => bindActionCreators({
        logoutTodo: logout,
        enterTodo: enter,
        leaveTodo: leave,
        getMineDataTodo: getMineData,
    }, dispatch)
)(PageMine)