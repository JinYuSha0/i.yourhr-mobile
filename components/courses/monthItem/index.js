import './index.less'

import React, { Component } from 'react'

export default class MonthItem extends Component {
    render() {
        const { month } = this.props
        return (
            <div className="month_item">{month}</div>
        )
    }
}