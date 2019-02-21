import './city.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { enter, leave } from '../../redux/navigation'
import { changeCity } from '../../redux/courses'

import Toast from '../../components/toast'
import Loading from '../../components/loading/loading'

import { fetchGet, recursionGetAttr } from '../../util/util'
import { history } from "../../index"

class PageCity extends Component {
    state = {
        loading: true,
        cityArr: []
    }

    async componentWillMount() {
        this.props.enterTodo({path: '/city', name: '更换地区'})

        try {
            const { data } = await fetchGet('/findAllCity')
            this.setState({ cityArr: data.list, loading: false })
        } catch (e) {
            Toast('加载地区失败', 2000, () => {
                history.push({pathname: '/'})
            })
        }
    }

    async changeCity(e) {
        e.stopPropagation()
        e.preventDefault()

        const { elem, attr } = await recursionGetAttr(e.target, 'data-city'),
            cityCode = attr,
            cityName = elem.innerHTML

        if(!!cityCode && !!cityName) {
            this.props.changeCityTodo({cityCode, cityName})
            this.props.leaveTodo()
            fetch(`/city/${cityCode}`, {method: 'GET', credentials: 'include'})
        }
    }

    render() {
        const { loading, cityArr } = this.state
        return (
            <div className="layout-body PageCity">
                {
                    loading ?  <Loading/> : <div className='city_list' onTouchTap={this.changeCity.bind(this)}>
                        {
                            Object.keys(cityArr).map((v, k) => {
                                return (
                                    <dl key={k} className="clearfix">
                                        <dt>{v}</dt>
                                        {
                                            cityArr[v].map((v, k) => {
                                                return (
                                                    <dd key={k} data-city={v.city_no}>{v.city}</dd>
                                                )
                                            })
                                        }
                                    </dl>
                                )
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    ({}) => ({}),
    (dispatch) => bindActionCreators({
        enterTodo: enter,
        changeCityTodo: changeCity,
        leaveTodo: leave,
    }, dispatch)
)(PageCity)