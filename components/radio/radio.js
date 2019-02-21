import './radio.less'

import React, { Component } from 'react'

export class RadioItem extends Component {
    render() {
        const { children, id, checked, onChange } = this.props
        return (
            <div className="radio-item" onTouchTap={() => {onChange(id)}}>
                {children}
                <span className={checked ? "radio-check is-check" : "radio-check"}></span>
            </div>
        )
    }
}