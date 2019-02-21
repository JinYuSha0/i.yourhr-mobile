import './index.less'

import React, { Component } from 'react'

export default class CourseItem extends Component {
    render() {
        const { classtime, course, grade, level, teacher, text, total_fee, intro } = this.props
        return (
            <li className="course_item" data-course={course}>
                <div className="header">
                    <p>{course+text}</p>
                    {level ? <span className={"level_" + level}>{grade}</span> : null}
                </div>

                <div className="body">
                    <p className="time">{classtime}</p>
                    <div className="main">
                        <div className="teachers">
                            {
                                teacher.map((v, k) => {
                                    return (
                                        <div className="teacher" key={k}>
                                            <img src={v.image}/>
                                            <p>{v.name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="sale">
                            <div className="price_wrapper">
                                <span className="rmb">¥</span>
                                <span className="price">{total_fee}</span>
                            </div>

                            <div className="intro">{intro}</div>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}