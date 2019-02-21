import './daysSelect.less'

import React, { Component } from 'react'
import { RadioItem } from '../../components/radio/radio'
import { getTimeByNum, getDaysByNum } from '../../util/util'

export default class DaysSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            selectArr: props.day > 0 ? getDaysByNum(props.day) : [],
        }
    }

    handleSwitch = () => {
        this.setState({ open: !this.state.open })
    }

    onChange = (index) => {
        const { times, onChange, checked } = this.props

        let selectArr = []
        if (!checked) {
            times.map(v => {
                selectArr.push(v.time)
            })
        }
        this.setState({ selectArr })
        onChange(index)
    }

    onItemChange = (e) => {
        const { onChange, id } = this.props,
            { selectArr } = this.state,
            time = parseInt(e.target.getAttribute('data-time')),
            index = selectArr.indexOf(time)
        let newSelectArr = null

        if(index >= 0) {
            newSelectArr = selectArr.filter(v => {
               return v !== time
            })
        } else {
            selectArr.push(time)
            newSelectArr = selectArr
        }

        this.setState({ selectArr: newSelectArr })

        if(newSelectArr.length > 0) {
            let num = 0
            newSelectArr.map(v => {
                num += v
            })
            onChange(id, num)
        } else {
            onChange(id)
        }
    }

    render() {
        const { open, selectArr } = this.state
        const { children, id, times, checked } = this.props
        return (
            <div className="daysSelect">
                <div className="clearfix">
                    <span className={open ? "drop dropUp" : "drop dropDown"} onTouchTap={this.handleSwitch}/>

                    <div className="radioWrapper">
                        <RadioItem
                            id={id}
                            checked={checked}
                            onChange={this.onChange}>
                            {children}
                        </RadioItem>
                    </div>
                </div>

                {
                    open ? <ul className="timeList" onTouchTap={this.onItemChange}>
                        {
                            times.map(v => (
                                <li key={v.time} data-time={v.time} className={selectArr.indexOf(v.time) >= 0 ? "timeItem onSelect" : "timeItem"}>{getTimeByNum(v.time)}</li>
                            ))
                        }
                    </ul> : null
                }
            </div>
        )
    }
}