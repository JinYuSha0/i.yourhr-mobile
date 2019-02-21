import './index.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CourseItem from './item'
import Loading from '../../components/loading/loading'
import MonthItem from '../../components/courses/monthItem'

import {history, store} from '../../index'

import { recursionGetAttr, delay } from '../../util/util'

export default class Courses extends Component {
    async onTouchTap(e) {
        e.stopPropagation()
        try {
            const {attr, elem} = await recursionGetAttr(e.target, 'data-course')
            if(attr) history.push({pathname: '/course/' + attr})
        } catch (e) {
            console.warn(e)
        }
    }

    render() {
        const { coursesList, loading, error, tryAgain } = this.props
        return (
            <div className="courses">
                {
                    loading ? coursesList.length > 0 ? <div className="wrapper" onTouchTap={this.onTouchTap.bind(this)}>
                        {
                            coursesList.map((classify, c_key) => {
                                return (
                                    <div id={classify.key ? "classify_" + classify.key : 'classify_0'} className="courses_classify" key={c_key}>
                                        <strong className="title">{classify.title}</strong>

                                        <ul className="courses_list">
                                            {
                                                classify.list ? classify.list.map((list) => <CourseItem {...list} key={list.course}/>) : null
                                            }

                                            {
                                                classify['m-list'] ? classify['m-list'].map((mList, key) => {
                                                    return (<div key={key} className="m-list">
                                                        <MonthItem month={mList.month}/>

                                                        {
                                                            mList.list.map(list => <CourseItem {...list} key={list.course}/>)
                                                        }
                                                    </div>)
                                                }) : null
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div> : <NoCourses error={error} tryAgain={tryAgain}/> : <div className='loading_wrapper'><Loading/></div>
                }
            </div>
        )
    }
}

class NoCourses extends Component {
    render() {
        const { error, tryAgain } = this.props
        return (
            <div className="no_course">
                <h1>不好意思，没有找到课程:)</h1>
                {
                    error ? <span className="tryAgain" onClick={(e) => {
                        e.stopPropagation()
                        if(tryAgain) store.dispatch(tryAgain())
                    }}>点此重试</span> : null
                }
            </div>
        )
    }
}