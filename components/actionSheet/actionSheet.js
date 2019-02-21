import './actionSheet.less'

import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { forbidScroll, allowScroll, delay, addClass, removeClass } from '../../util/util'

class Main extends Component {
    constructor(props) {
        super(props)
        this._unmount = this._unmount.bind(this)
    }

    _unmount(e) {
        this.props.unmount(e, this.actionSheet)
    }

    render() {
        const { title, dataList } = this.props
        return (
            <div className="actionSheet animated fadeInUp" ref={actionSheet => this.actionSheet = actionSheet}>
                <div className="cancel" onTouchTap={(e) => {this._unmount(e, this.actionSheet)}}>取消</div>

                <div className="main">
                    <div className="title">{title}</div>
                    {
                        dataList.map((d, k) => {
                            return <div className="sheet" onTouchTap={(e) => {d.todo(e, this._unmount, d.value)}} key={k}>{d.name}</div>
                        })
                    }
                </div>

            </div>
        )
    }
}

export default class ActionSheet extends Component {
    constructor(title, dataList) {
        super(title, dataList)
        if(!title || !dataList) return
        forbidScroll()
        const actionSheet = this.actionSheet = document.createElement('div')
        actionSheet.setAttribute('class', 'zy-actionSheet')
        document.body.appendChild(actionSheet)
        this._unmountSelf = this._unmountSelf.bind(this)
        ReactDom.render(
           <Main
               title={title}
               dataList={dataList}
               unmount={this._unmountSelf}
           />, this.actionSheet
        )
    }

    async _unmountSelf(e, ele) {
        if(!!e) e.preventDefault()
        removeClass(ele, 'fadeInUp')
        addClass(ele, 'fadeOutDown')
        await delay(300)
        ReactDom.unmountComponentAtNode(this.actionSheet)
        document.body.removeChild(this.actionSheet)
        allowScroll()
    }
}