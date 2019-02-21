import React, { Component } from 'react'
import { getScrollTop } from '../../util/util'

export default class PullScrollRefresh extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className="pullRefresh" ref={(pullRefresh) => {this.pullRefresh = pullRefresh}}>
                {this.props.children}
            </div>
        )
    }
}