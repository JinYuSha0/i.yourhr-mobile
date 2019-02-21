import React, { Component } from 'react'

export default class SaveScrollTop extends Component {
    constructor(props) {
        super(props)
        this._saveScrollTop = this._saveScrollTop.bind(this)
    }

    componentDidMount() {
        const { scrollItem, getSwitchWrapper } = this.props,
            scrollTop = parseInt(sessionStorage.getItem(scrollItem)),
            switchWrapper = getSwitchWrapper()

        if(scrollTop && switchWrapper.scrollHeight >= scrollTop) {
            switchWrapper.scrollTop = scrollTop
        } else {
            sessionStorage.setItem(scrollItem, 0)
            switchWrapper.scrollTop = scrollTop
        }

        switchWrapper.addEventListener('scroll', this._saveScrollTop, false)
    }

    componentWillUnmount() {
        this.props.getSwitchWrapper().removeEventListener('scroll', this._saveScrollTop, false)
    }

    _saveScrollTop() {
        const { scrollItem, getSwitchWrapper } = this.props
        sessionStorage.setItem(scrollItem, getSwitchWrapper().scrollTop)
    }

    render() {
        return this.props.children || null
    }
}