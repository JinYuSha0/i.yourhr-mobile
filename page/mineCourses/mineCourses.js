import './mineCourses.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { enter, leave } from '../../redux/navigation'
import { getMineCourseData, cancelOrder, updateAllMineDate } from '../../redux/tmpData'
import { fetchPost, recursionGetAttr } from '../../util/util'

import SaveScrollTop from '../../components/saveScrollTop'
import SwipeViewController from '../../components/swipeViewController/swipeViewController'
import Toast from '../../components/toast'
import Modal from '../../components/modal/modal'
import Loading from '../../components/loading/loading'
import { history } from "../../index"

class Item extends Component {
    render() {
        const { order_no, city_no, total_fee, course, days, text, type, address } = this.props
        return (
            <SwipeViewController order={order_no} course={course}>
                <li className="m-course-item" data-course={course} data-cityCode={city_no}>
                    <div className="item-title-row">
                        <h3 className="item-title">{text}</h3>
                        <span className={type ? "item-after pay" : "item-after no-pay"}>{type ? '已交费' : '未交费'}</span>
                    </div>

                    <div className="item-subtitle">
                        {'报名号：' + order_no.substr(0, 5) + '，金额：' + total_fee + '，上课地点：' + address}
                    </div>

                    <div className="item-desc">
                        {'上课时间：' + days}
                    </div>
                </li>
            </SwipeViewController>
        )
    }
}

class PageMineCourses extends Component {
    state = {
        loading: false,
    }

    async componentWillMount() {
        this.props.enterTodo({path: '/mine/courses', name: '我的课程'})

        const { tmp, getMineCourseDataTodo } = this.props

        if(tmp.getIn(['mineCourseData', 'update'])) {
            try {
                const { data } = await fetchPost('/findMyCourse')
                if(data.status === 'success') {
                    const { endNum, list } = data
                    getMineCourseDataTodo({mineCourseData: {endNum, list}})
                }
                else {
                    throw new Error('加载信息失败,请稍后再试')
                }
            } catch (e) {
                Toast(e.message, 1500, () => {
                    if(e.name !== 'ExceptError') {
                        this.props.leaveTodo()
                    }
                })
            }
        }

        this.setState({loading: true})
    }

    async _eventAgent(ev) {
        try {
            ev.persist()
            const {attr, elem} = await recursionGetAttr(ev.target, 'data-course'),
                cityCode = elem.getAttribute('data-cityCode')
            if(attr && cityCode) {
                history.push({pathname: '/course/' + attr + '/?c=' + cityCode})
            }
        } catch (e) {
            ev.preventDefault()
            const {attr, elem} = await recursionGetAttr(ev.target, 'data-cancel')
            const course = elem.getAttribute('data-class')

            if(attr) {
                new Modal('取消预约', '取消预约'+course+'?', (ev, close) => {
                    this._cancelOrder(attr, course, () => {close(ev)})
                })
            }
        }
    }

    async _cancelOrder(order_no, course, close) {
        const { updateAllMineDateTodo, cancelOrderTodo } = this.props
        try {
            const { data } = await fetchPost('/deleteOrders', {order_no})
            if(data.status === 'success') {
                updateAllMineDateTodo()
                cancelOrderTodo(course)
                close()
            } else {
                throw new Error(data.message)
            }
        } catch (e) {
            Toast(e.message, 1500, () => {})
        }
    }

    render() {
        const { loading } = this.state,
            data = this.props.tmp.get('mineCourseData'),
            list = data.get('list').toJS()

        return (
            <SaveScrollTop scrollItem={'@@scrollTop|PageMineCourses'} getSwitchWrapper={() => {return document.getElementById('switch-wrapper')}}>
                <div className="layout-body PageMineCourses">
                    {
                        loading ? <div className="m-course">
                            {
                                list.length > 0 ? <ul className="m-course-list" onTouchTap={this._eventAgent.bind(this)}>
                                    {
                                        list.map((v) => {
                                            return <Item key={v.order_no} {...v}/>
                                        })
                                    }
                                </ul> : <h2 className="m-no-course">近期没有课程,快去预约吧:)</h2>
                            }
                            <div className="timeout-course">历史课程共{data.get('endNum')}个</div>
                        </div> : <Loading/>
                    }
                </div>
            </SaveScrollTop>
        )
    }
}

export default connect(
    ({ tmp }) => ({ tmp }),
    (dispatch) => bindActionCreators({
        enterTodo: enter,
        leaveTodo: leave,
        getMineCourseDataTodo: getMineCourseData,
        cancelOrderTodo: cancelOrder,
        updateAllMineDateTodo: updateAllMineDate,
    }, dispatch)
)(PageMineCourses)