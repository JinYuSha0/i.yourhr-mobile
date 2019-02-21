import './error.less'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../../index'
import { enter } from '../../redux/navigation'

export default class extends Component {
    componentWillMount() {
        store.dispatch(enter({path: '/404', name: '页面丢失'}))
    }

    render() {
        return (
            <div className="layout-body PageError">
                <div className="errorInfo">
                    <h1>页面丢失</h1>
                    <Link to="/">返回首页</Link>
                </div>
            </div>
        )
    }
}