import './teacher.less'

import React, { Component } from 'react'

import { loadImage } from '../../util/util'

export default class Teacher extends Component {
    render() {
        const { uid, image, intro, name, t_no } = this.props
        return (
            <div className="c-teacher">
                <div className="teacher-header">
                    <div className="people">
                        <img src={image}/>
                        <h2>{name}</h2>
                    </div>

                    <a className="weibo" target="_blank" href={"https://www.weibo.com/u/" + uid}></a>
                </div>

                <p className="teacher-intro">{intro}</p>
            </div>
        )
    }
}