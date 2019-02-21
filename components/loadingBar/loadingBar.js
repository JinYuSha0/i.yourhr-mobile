import './loadingBar.less'

import React, { Component } from 'react'
import LoadingBar from 'react-redux-loading-bar'

export default class loadingBar extends Component {
    render() {
        return (
            <div className="layout-loadingBar">
                <LoadingBar className="bar"/>
            </div>
        )
    }
}