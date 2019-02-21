import './index.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { store } from '../../index'
import { enter } from '../../redux/navigation'

import Banner from '../../components/banner/banner'
import ControlBar from '../../components/controlBar/index'
import Courses from '../../components/courses'
import SaveScrollTop from '../../components/saveScrollTop'

import { getAllCourse } from '../../redux/courses'

class PageIndex extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        store.dispatch(enter({path: '/', title: '首页'}))
        const { courses } = store.getState()
        if(courses.getIn(['courses', 'coursesList']).size === 0) {
            store.dispatch(getAllCourse())
        }
    }

    render() {
        const coursesList = this.props.courses.getIn(['courses', 'coursesList']),
            loading = this.props.courses.getIn(['courses', 'loading']),
            error = this.props.courses.getIn(['courses', 'error'])

        return (
            <SaveScrollTop scrollItem={'@@scrollTop|PageIndex'} getSwitchWrapper={() => {return document.getElementById('switch-wrapper')}}>
                <div className="layout-body PageIndex">
                    <Banner/>

                    <ControlBar/>

                    <Courses coursesList={coursesList} loading={loading} error={error} tryAgain={getAllCourse}/>

                </div>
            </SaveScrollTop>
        )
    }
}


export default connect(
    ({ courses }) => ({ courses })
)(PageIndex)