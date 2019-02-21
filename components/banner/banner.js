import './banner.less'

import React, { Component } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import Pagination from './pagination/Pagination'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

export default class extends Component {
    state = {
        index: 0,
        bannerData: window.bannerData
    }

    handleChangeIndex = index => {
        this.setState({ index })
    }

    render() {
        const { index, bannerData } = this.state
        return (
            <div className="content-banner">

                <AutoPlaySwipeableViews index={index} resistance={true} interval={5000} onChangeIndex={this.handleChangeIndex}>
                    {
                        bannerData.map((v, k) => {
                            return (
                                <a target="_blank" href={v.href} key={k}>
                                    <div className="item">
                                        <img  src={v.img}/>
                                    </div>
                                </a>
                            )
                        })
                    }
                </AutoPlaySwipeableViews>

                <Pagination dots={bannerData.length} index={index} onChangeIndex={this.handleChangeIndex} />
            </div>
        )
    }
}