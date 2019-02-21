import './popup.less'

import React, { Component } from 'react'
import { delay, addClass, removeClass } from '../../util/util'

export default class Popup extends Component {
    async _onClose() {
        removeClass(this.popup, 'fadeInUp')
        addClass(this.popup, 'fadeOutDown')
        await delay(500)
        this.props.onClose()
    }

    render() {
        const { children, title, footer } = this.props
        return (
            <div className="modal-popup animated fadeInUp" ref={popup => {this.popup = popup}}>
                <div className="popup-title">
                    {title}
                    <span className="close-btn" onTouchTap={this._onClose.bind(this)}/>
                </div>

                <div className="popup-inner">{children}</div>

                {footer}
            </div>
        )
    }
}