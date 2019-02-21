import './cell-group.less'

import React, { Component } from 'react'

export default class CellGroup extends Component {
    render() {
        const { cells } = this.props
        return (
            <div className="cell-group">
                {
                    cells.map((c, i) => {
                        return (
                            <a className="cell" key={i} onTouchTap={c.todo}>
                                <div className="cell_bd">
                                    <p>{c.name}</p>
                                </div>
                                <div className="cell_ft">
                                    {
                                        c.desc ? c.desc : null
                                    }
                                </div>
                            </a>
                        )
                    })
                }
            </div>
        )
    }
}