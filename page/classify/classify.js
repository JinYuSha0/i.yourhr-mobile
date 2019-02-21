import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { history, store } from '../../index'
import { enter } from '../../redux/navigation'
import { getLevel, getClassify } from '../../redux/courses'
import { fetchPost } from '../../util/util'

import Toast from '../../components/toast'
import Courses from '../../components/courses'
import ControlBar from '../../components/controlBar'
import SaveScrollTop from '../../components/saveScrollTop'

class PageClassify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            levels: null
        }
    }

    async componentWillMount() {
        const path =  history.location.pathname,
            levels = this.props.courses.getIn(['classify', 'levels']),
            level = this.props.courses.getIn(['classify', 'courses', 'level']),
            jsonArray = this.getLevelsArray(this.props.match.params)

        let name = ''
        this.scrollItem = '@@scrollTop||PageClassify' + JSON.stringify(jsonArray)

        if(levels.length > 0) {
            this.setState({levels})
            name = this.getName(levels)
        } else {
            try {
                const {data} = await fetchPost('/getTextByArray', {jsonArray})
                if(data.status) {
                    this.props.getLevelTodo(data.list)
                    this.setState({levels: data.list})
                    name = this.getName(data.list)
                }
            } catch (e) {
                Toast('未知分类', 2000, () => {history.push({pathname: '/'})})
                return '未知分类'
            }
        }

        this.props.enterTodo({path, name})

        //防止重复渲染
        if(JSON.stringify(level) != JSON.stringify(jsonArray)) {
            this.props.getClassifyTodo(jsonArray)
        }
    }

    getName(levels) {
        const { courses } = store.getState(),
            cityName = courses.getIn(['city', 'cityName'])
        if(levels[levels.length-1].key !== 0) {
            return cityName + ' - ' + levels[levels.length-1].text
        } else {
            return cityName + ' - ' + levels[levels.length-2].text
        }
    }

    getLevelsArray(params) {
        let jsonArray = []
        for(let i in params) {
            jsonArray.push(parseInt(params[i]))
        }
        return jsonArray
    }

    render() {
        const coursesList = this.props.courses.getIn(['classify', 'courses', 'coursesList']),
            loading = this.props.courses.getIn(['classify', 'loading']),
            error = this.props.courses.getIn(['classify', 'error']),
            levels = this.state.levels
        return (
            <SaveScrollTop scrollItem={this.scrollItem} getSwitchWrapper={() => {return document.getElementById('switch-wrapper')}}>
                <div className="layout-body PageClassify">
                    {
                        levels ? <ControlBar levels={levels}/> : null
                    }
                    <Courses coursesList={coursesList} loading={loading} error={error} tryAgain={this.props.getClassifyTodo}/>
                </div>
            </SaveScrollTop>
        )
    }
}

export default connect(
    ({ courses }) => ({ courses }),
    (dispatch) => bindActionCreators({
        enterTodo: enter,
        getLevelTodo: getLevel,
        getClassifyTodo: getClassify,
    }, dispatch)
)(PageClassify)