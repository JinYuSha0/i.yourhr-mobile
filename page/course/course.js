import './course.less'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tabs, Tab } from '../../components/tabs/tabs'
import SwipeableViews from 'react-swipeable-views'
import Teacher from '../../components/teacher/teacher'
import Address from '../../components/address/address'

import Loading from '../../components/loading/loading'
import Toast from '../../components/toast'
import Popup from '../../components/popup/popup'
import List from '../../components/list/list'
import { RadioItem } from '../../components/radio/radio'
import DaysSelect from '../../components/daysSelect/daysSelect'
import { enter, leave } from '../../redux/navigation'
import { updateAllMineDate } from '../../redux/tmpData'
import { fetchPost, fetchGet, ReactRenderInDom, addClass, removeClass, getQueryString } from '../../util/util'
import { history } from "../../index"

//预约popup内容
class OrderPopup extends Component {
    render() {
        const { course, local_id, days, _onAddressChange, _onDaysChange } = this.props
        return (
            <div className="order-popup" ref={popup => this.popup = popup}>
                {
                    !!course.cityRemark ? <div className="remark">预约备注：{course.cityRemark}</div> : null
                }

                <List header="选择上课地点">
                    {
                        course.addressList.map(v => (
                            <RadioItem
                                key={v.local_id}
                                id={v.local_id}
                                checked={v.local_id === local_id}
                                onChange={_onAddressChange}>
                                {v.localName}
                            </RadioItem>
                        ))
                    }
                </List>

                <List header="选择上课日期" noPaddingLeft={true}>
                    {
                        course.days.length > 0 ? course.days.map((v, k) => (
                            <DaysSelect
                                key={k}
                                id={k}
                                times={v.times}
                                day={days[k]}
                                checked={!!days[k]}
                                onChange={_onDaysChange}
                            >{v.day}</DaysSelect>
                        )) : <RadioItem checked={true}>上课日期待定(无需选择)</RadioItem>
                    }
                </List>

                <div className="text">预报名成功后，您可添加当地分校的微信号咨询提前交费事宜，或上课当天到现场交费，座位按交费先后顺序安排。暂时本系统未开通直接交费通道，如有疑问可致电4009632800（办公时间：每天9:00-17:30）</div>
            </div>
        )
    }
}

//底部预约条
class Order extends Component {
    _order(e) {
        e.preventDefault()
        if(this.props.user.get('isLogin')) {
            this.props._showOrder()
        } else {
            Toast('请先登录', 2000, () => {
                history.push('/login')
            })
        }
    }

    render() {
        const { course, hasOrder } = this.props
        return (
            <div className="course-order">
                <div className="info">
                    <div className="price">
                        <span>¥</span>
                        {course.total_fee}
                    </div>

                    <div className="other">
                        <p className="textbook_fee">{course.textbook_fee > 0 ? '已包含教材费:'+ course.textbook_fee : '免教材费'}</p>
                    </div>
                </div>

                {
                    !hasOrder ? <div className="launch" onTouchTap={this._order.bind(this)}>立即预约</div> :
                        <div className="launch unlunch">已经预约</div>
                }
            </div>
        )
    }
}

//滑动展示组件
class TabsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            introContent: null,
        }
        this._handleIndexChange = this._handleIndexChange.bind(this)
    }

    async componentDidMount() {
        const { introJson } = this.props.course
        if(!!introJson) {
            const json = await fetch(introJson).then((response) => {
                return response.json()
            })

            this.setState({ introContent: json.html })
        }
    }

    _handleIndexChange(index) {
        this.setState({index})
    }

    render() {
        const { index, introContent } = this.state,
            { course: {introImage, teacher, addressList} } = this.props

        return (
            <div className="course-tabs">
                <Tabs index={index} onChange={this._handleIndexChange}>
                    <Tab title="课程简介"/>
                    <Tab title="课程详情"/>
                </Tabs>

                <SwipeableViews animateHeight={false} index={index} onChangeIndex={this._handleIndexChange}>

                    <div className="tabs-view intro">
                        {
                            introContent ? <div className="intro-content" dangerouslySetInnerHTML={{__html: introContent}}/> : null
                        }

                        {
                            !!introImage ? <img alt="详情图片" src={introImage}/> : null
                        }
                    </div>

                    <div className="tabs-view details">
                        <h2 className="tit">老师介绍</h2>
                        {
                            teacher.map((v, k) => {
                                return <Teacher {...v} key={k}/>
                            })
                        }
                        <h2 className="tit">上课地点</h2>
                        {
                            addressList.map((v, k) => {
                                return <Address {...v} key={k}/>
                            })
                        }
                    </div>

                </SwipeableViews>
            </div>
        )
    }
}

//课程组件
class Course extends Component {
    constructor(props) {
        super(props)

        //初始化上课天数数组
        const days = []
        props.course.days.map(v => {
            days.push(0)
        })

        this.state = {
            show: false,
            local_id: null,
            days: days,
        }

        this.layout = document.getElementsByClassName('layout')[0]
        this.switchWrapper = document.getElementById('switch-wrapper')
        this._showOrder = this._showOrder.bind(this)
        this._closeOrder = this._closeOrder.bind(this)
        this._orderSuccess = this._orderSuccess.bind(this)

        this._onAddressChange = this._onAddressChange.bind(this)
        this._onDaysChange = this._onDaysChange.bind(this)
        this._orderConfirm = this._orderConfirm.bind(this)
    }

    _showOrder() {
        addClass(this.switchWrapper, 'forbidScroll')
        this.setState({show: true})
    }

    _closeOrder() {
        removeClass(this.switchWrapper, 'forbidScroll')
        this.setState({show: false})
    }

    _orderSuccess() {
        this.props.updateAllMineDateTodo()  //更新缓存数据
        this.props._orderSuccess()
        this._closeOrder()
    }

    _onAddressChange(local_id) {
        this.setState({local_id})
    }

    _onDaysChange(index, num) {
        const { course } = this.props
        const { days } = this.state

        let newDays = days
        if(num === void 0) {
            if(!!days[index]) {
                //取消选中
                newDays.splice(index, 1, 0)
            } else {
                //选中
                newDays.splice(index, 1, this._getAllDay(course.days[index].times))
            }
        } else {
            newDays.splice(index, 1, num)
        }

        this.setState({days: newDays})
    }

    _getAllDay = (timeArr) => {
        let allDay = 0

        timeArr.map(v => {
            allDay += v.time
        })

        return allDay
    }

    _noChoseDay = (days) => {
        let noChose = true

        days.map(v => {
            if(v!==0) noChose = false
        })

        return noChose
    }

    async _orderConfirm() {
        const { local_id, days } = this.state,
            info = this.props.course,
            { course } = info

        if(local_id === null) {
            Toast('请选择上课地点', 1000)
            return
        }

        if(!!info.days && info.days.length > 0 && this._noChoseDay(days)) {
            Toast('请选择上课日期', 1000)
            return
        }

        try {
            const { data } = await fetchPost('/addOrders', {course, local_id, days})
            if(data.status === 'success') {
                Toast(data.message, 2000, () => {
                    this._orderSuccess()
                })
            } else {
                throw new Error(data.message || '预约失败请稍后再试')
            }
        } catch (e) {
            Toast(e.message, 2000)
        }
    }

    render() {
        const { course, user, hasOrder } = this.props,
            { show, days, local_id } = this.state

        return (
            <div className="content">
                <div className="course-header">
                    <h1 className="title">{course.text}</h1>
                    <h2 className="time">{course.classtime}</h2>
                    {
                        course.remark ? <h2 className="remark">备注: {course.remark}</h2> : null
                    }
                </div>

                <TabsView course={course}/>

                <ReactRenderInDom parentNode={this.layout} id="order-bar">
                    <Order course={course} hasOrder={hasOrder} user={user} _showOrder={this._showOrder}/>
                </ReactRenderInDom>

                {
                    show ?  <ReactRenderInDom parentNode={this.layout}>
                        <Popup
                            title={course.text+'预约'}
                            onClose={this._closeOrder}
                            footer={<button className="btn-order" onTouchTap={this._orderConfirm}>立即预约</button>}>

                            <OrderPopup
                                course={course}
                                days={days}
                                local_id={local_id}
                                orderSuccess={this._orderSuccess}
                                _onAddressChange={this._onAddressChange}
                                _onDaysChange={this._onDaysChange}
                                _orderConfirm={this._orderConfirm}
                            />

                        </Popup>
                    </ReactRenderInDom> : null
                }
            </div>
        )
    }
}

//根组件
class PageCourse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            course: null,
            hasOrder: false,
        }
        this._orderSuccess = this._orderSuccess.bind(this)
    }

    async componentWillMount() {
        let city_no = this.props.courses.getIn(['city', 'cityCode']),
            cityName = this.props.courses.getIn(['city', 'cityName']),
            courseData = null

        const course = this.props.match.params.id,
            c = getQueryString('c')

        if(!!c && c != city_no) {
            city_no = c
            const {data} = await fetchGet('/findCityName', {city_no})
            if(data.status === 'success') {
                cityName = data.city
            }
        }

        try {
            const { data } = await fetchGet('/findCourseInfo', {city_no, course})
            if(data.status === 'success') {
                courseData = data
                this.props.enterTodo({path: history.location.pathname, name: cityName + ' - ' + courseData.course.course})
            } else {
                throw new Error('')
            }
        } catch (e) {
            this.props.enterTodo({path: history.location.pathname, name: '未知课程'})
            Toast('在' + cityName + '未找到该课程', 2000, () => {
                if(e.name !== 'ExceptError') {
                    this.props.leaveTodo()
                }
            })
            return
        }

        //弃用  判断有无预约
        /*try {
            const isLogin = this.props.user.get('isLogin')
            if(isLogin) {
                const { data } = await fetchPost('/isOrdersByCourse', {city_no, course})
                if(data.status === 'success') {
                    this.setState({hasOrder: data.hasOrder})
                }
            }
        } catch (e) {
            console.error(e)
        }*/

        this.setState({ loading: true, course: courseData.course })
    }

    componentDidMount() {
        const scrollWrapper = document.getElementById('switch-wrapper')

        setTimeout(() => {
            scrollWrapper.scrollTop = 0
        }, 0)
    }

    _orderSuccess() {
        this.setState({hasOrder: true})
    }

    render() {
        const { course, loading, hasOrder } = this.state
        return (
            <div className="layout-body PageCourse">
                {
                    loading ? <Course
                        course={course}
                        user={this.props.user}
                        hasOrder={hasOrder}
                        _orderSuccess={this._orderSuccess}
                        updateAllMineDateTodo={this.props.updateAllMineDateTodo}
                    /> : <Loading/>
                }
            </div>
        )
    }
}

export default connect(
    ({ user, courses }) => ({ user, courses }),
    (dispatch) => bindActionCreators({
        enterTodo: enter,
        leaveTodo: leave,
        updateAllMineDateTodo: updateAllMineDate,
    }, dispatch)
)(PageCourse)