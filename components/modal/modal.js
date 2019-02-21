import './modal.less'

import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { forbidScroll, allowScroll, removeClass, addClass, delay } from '../../util/util'

class Main extends Component {
    constructor(props) {
        super(props)
        this._unmount = this._unmount.bind(this)
    }

    componentDidMount() {
        const { needInput, inputDefaultValue } = this.props
        if(needInput) {
            if (!!inputDefaultValue) this.input.value = inputDefaultValue
            //效果不好  this.input.focus()
        }
    }

    _unmount(e) {
        this.props.unmount(e, this.actionSheet)
    }

    render() {
        const { title, desc, onOk, needInput } = this.props
        return(
            <div ref={actionSheet => this.actionSheet = actionSheet} className={needInput ? "modal-content modal-need-input animated bounceIn" : "modal-content animated bounceIn"}>
                <div className="modal-title">
                    <h2>{title}</h2>
                </div>

                <div className="modal-body">
                    <div className="modal-desc">
                        <p>{desc}</p>
                    </div>

                    {
                        needInput ? <div className="modal-input">
                            <label>
                                <input type="text" ref={input => {this.input = input}}/>
                            </label>
                        </div> : null
                    }
                </div>

                <div className="modal-footer">
                    <span onTouchTap={(e) => {this._unmount(e)}}>取消</span>
                    <span onTouchTap={needInput ? (e) => {onOk(e, this._unmount, this.input.value)} : (e) => {onOk(e, this._unmount)}}>确定</span>
                </div>
            </div>
        )
    }
}


export default class Modal extends Component {
    constructor(title, desc, onOk, needInput, inputDefaultValue) {
        super(title, desc, onOk)
        if(!title || !desc || !onOk) return
        forbidScroll()
        const modal = this.modal = document.createElement('div')
        modal.setAttribute('class', 'zy-modal')
        document.body.appendChild(modal)
        this._unmountSelf = this._unmountSelf.bind(this)
        ReactDom.render(
            <Main
                unmount={this._unmountSelf}
                title={title}
                desc={desc}
                onOk={onOk}
                needInput={!!needInput}
                inputDefaultValue={inputDefaultValue}
            />, this.modal
        )
    }

   async _unmountSelf(e, elem) {
       removeClass(elem, 'bounceIn')
       addClass(elem, 'bounceOut')
       await delay(300)
       ReactDom.unmountComponentAtNode(this.modal)
       document.body.removeChild(this.modal)
       allowScroll()
   }
}