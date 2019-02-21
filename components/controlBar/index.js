import './index.less'

import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class ControlBar extends Component {
    getCrumbs(levels) {
        if(!levels) return
        let crumbs = ''
        levels.map((v, k) => {
            if(k < levels.length-1) {
                crumbs += v.text+' > '
            } else {
                crumbs += v.text
            }
        })
        return crumbs
    }

    render() {
        const city = this.props.courses.get('city')
        const { levels } = this.props
        let crumbs = this.getCrumbs(levels)
        return (
            <div className="controlBar" style={levels ? {marginTop: 0} : null}>
                <div className="courseClassify">{levels ? crumbs : '所有课程'}</div>
                {
                    levels ? null : <div className="nowCity">
                        以下课程均属于:
                        <Link to="city">
                        <span className="city">
                            {city.get('cityName')}
                            <i className="iconfont">&#xe6a5;</i>
                        </span>
                        </Link>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    ({ courses }) => ({ courses })
)(ControlBar)