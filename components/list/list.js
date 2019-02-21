import './list.less'

import React, { Component } from 'react'

export default class List extends Component {
    render() {
        const { header, children, noPaddingLeft } = this.props
        return (
            <div className="c-list">
                {
                    header ? <div className="list-header">{header}</div> : null
                }

                <ul className="list-body">
                    {
                        !!children && children.length > 0 ? children.map((v, k) => {
                            return <li className={noPaddingLeft ? "list-item noPaddingLeft" : "list-item"} key={k}>
                                <span className="list-inline">{v}</span>
                            </li>
                        }) : <li className="list-item">
                            <span className="list-inline">{children}</span>
                        </li>
                    }
                </ul>
            </div>
        )
    }
}