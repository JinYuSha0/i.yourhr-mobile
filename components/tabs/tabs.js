import './tabs.less'

import React, { Component } from 'react'
import { recursionGetAttr } from '../../util/util'

export class Tabs extends Component {
    _getActiveBarLeft() {
        const { index, children } = this.props,
            width = document.body.clientWidth,
            childrenWidth = width/children.length,
            barWidth = childrenWidth*0.5,
            barLeft = (index*childrenWidth)+((childrenWidth-barWidth)/2)
        return {barWidth, barLeft}
    }

    async _onIndexChange(e) {
        e.stopPropagation()
        const { attr } = await recursionGetAttr(e.target, 'data-index'),
            { onChange } = this.props
        onChange(parseInt(attr))
    }

    render() {
        const { index } = this.props,
            { barWidth, barLeft } = this._getActiveBarLeft()
        return (
            <div className="tabs">
                <div className="tabs-container" onTouchTap={this._onIndexChange.bind(this)}>
                    {
                        this.props.children.map((v, k) => {
                            return (
                                <div data-index={k} className={k === index ? "tab-wrapper active" : "tab-wrapper"} key={k}>
                                    {v}
                                </div>
                            )
                        })
                    }
                </div>
                <span className="active-bar" style={{width: barWidth, left: barLeft}}/>
            </div>
        )
    }
}

export class Tab extends Component {
    render() {
        const { title } = this.props
        return (
            <div className="tab">
                {title}
            </div>
        )
    }
}

