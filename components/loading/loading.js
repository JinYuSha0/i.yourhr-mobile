import './loading.less'

import React, { Component } from 'react'

export default class Loading extends Component {
    render() {
        return (
            <div className="layout-loading">
                <div className="animation"></div>
            </div>
        )
    }
}