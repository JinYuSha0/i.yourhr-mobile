import './footer.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'

class Footer extends Component {
    render() {
        const { router } = this.props
        return (
            ['', 'classify'].indexOf(router.location.pathname.split('/')[1]) >= 0 ?
            <div className="layout-footer">
                <p>ICP证编号：粤ICP备12001590号-1</p>
                <p>Copyright© 2017-{new Date().getFullYear()} 广东格兰堂投资咨询有限公司 版权所有</p>
            </div> : null
        )
    }
}

export default connect(
    ({ router }) => ({ router })
)(Footer)