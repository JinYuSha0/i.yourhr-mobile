import './swipeViewController.less'

import React, { Component } from 'react'

import { rem2px, addClass, removeClass, isParent } from '../../util/util'

export default class SwipeViewController extends Component {
    constructor(props) {
        super(props)
        this.width = rem2px(3)
        this.open = false    //是否展开
        this.elasticTmp = this.width

        this.startX = 0   //记录起始位置
        this.moveX = 0    //记录偏移量
        this.tmpX = 0     //记录上次偏移量
        this.nowX = 0     //记录现在的位置

        this.startY = 0
        this.moveY = 0
        this.tmpY = 0

        this._onTouch = this._onTouch.bind(this)
        this._closeSwipe = this._closeSwipe.bind(this)
    }

    async _onTouch(e) {
        switch (e.type) {
            case 'touchstart':
                removeClass(this.swipeView, 'swipe-view-close')
                removeClass(this.swipeController, 'swipe-controller-close')
                this.startX = e.targetTouches[0].clientX
                this.startY = e.targetTouches[0].clientY
                break
            case 'touchmove':
                this.moveX = e.targetTouches[0].clientX - this.startX
                const deltaX = this.moveX - this.tmpX
                this.tmpX = this.moveX

                if(this.moveX + this.nowX >= 0) {
                    this.now = 0
                    this.swipeView.style.transform = 'translate(' + this.now + 'px, 0px)'
                } else {
                    if(this.nowX + this.moveX < 0) {
                        if(Math.abs(this.nowX + this.moveX) <= this.width) {
                            this.swipeView.style.transform = 'translate(' + (this.nowX + this.moveX) + 'px, 0px)'
                        } else {
                            if(deltaX < 0) {
                                this.elasticTmp += Math.abs(deltaX)/26
                                this.swipeController.style.width = this.elasticTmp + 'px'
                                this.swipeView.style.transform = 'translate(' + (-this.elasticTmp) + 'px, 0px)'
                            } else {
                                //todo 收缩
                            }
                        }
                    }
                }
                break
            case 'touchend':
                addClass(this.swipeView, 'swipe-view-close')
                if(this.moveX >= 0) {
                    if(Math.abs(this.moveX) > this.width/5) {
                        this.nowX = 0
                        document.body.removeEventListener('touchstart', this._closeSwipe, true)
                        this.open = false
                    } else {
                        if(this.open) {
                            this.nowX = -this.width
                        }
                    }
                } else {
                    if(Math.abs(this.moveX) > this.width/5) {
                        this.nowX = -this.width
                        this.open = true

                        if(this.elasticTmp !== this.width) {
                            addClass(this.swipeController, 'swipe-controller-close')
                            this.elasticTmp = this.width
                            this.swipeController.style.width = this.width + 'px'
                        }

                    } else {
                        if(!this.open) {
                            this.nowX = 0
                        }
                    }
                }
                this.moveX = 0
                this.swipeView.style.transform = 'translate(' + this.nowX + 'px, 0px)'

                if(this.open) {
                    document.body.addEventListener('touchstart', this._closeSwipe, true)
                }
                break
        }
    }

    _closeSwipe(e) {
        if(!isParent(e.target, this.swipeView)) {
            this.open = false
            this.nowX = 0
            this.swipeView.style.transform = 'translate(' + this.nowX + 'px, 0px)'

            this.swipeController.style.width = this.width + 'px'
            document.body.removeEventListener('touchstart', this._closeSwipe, true)
        }
    }

    componentWillUnmount() {
        document.body.removeEventListener('touchstart', this._closeSwipe, true)
    }

    render() {
        const { course, order, children } = this.props
        return (
            <div className="swipe-view-controller">
                <div ref={swipeView => {this.swipeView = swipeView}}
                     className="swipe-view"
                     onTouchStart={this._onTouch}
                     onTouchMove={this._onTouch}
                     onTouchEnd={this._onTouch}>
                    {children}
                </div>

                <div data-cancel={order} data-class={course} className="swipe-controller" style={{width: rem2px(3)}} ref={swipeController => {this.swipeController = swipeController}}>
                    <span>取消预约</span>
                </div>
            </div>
        )
    }
}