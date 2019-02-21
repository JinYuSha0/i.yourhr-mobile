import './changeUserInfo.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Toast from '../../components/toast'
import Modal from '../../components/modal/modal'
import ActionSheet from '../../components/actionSheet/actionSheet'
import CellGroup from '../../components/cell-group/cell-group'

import { enter } from '../../redux/navigation'
import { changeUserInfo } from '../../redux/user'
import { fetchPost } from '../../util/util'

class PageChangeInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            cells: []
        }
        this._renderCells = this._renderCells.bind(this)
        this._changeNickName = this._changeNickName.bind(this)
        this._changeSex = this._changeSex.bind(this)
    }

    _renderCells() {
        const userInfo = this.props.user.get('userInfo')
        this.setState({
            cells: [
                {name: '昵称', desc: userInfo.get('nickName'), todo: (e) => {
                    e.preventDefault()
                    new Modal('修改昵称', '请输入新的昵称', this._changeNickName, true, userInfo.get('nickName'))
                }},
                {name: '性别', desc: userInfo.get('sex') ? '男' : '女', todo: (e) => {
                    e.preventDefault()
                    new ActionSheet('请选择性别', [
                        {name: '男', value: true, todo: this._changeSex},
                        {name: '女', value: false, todo: this._changeSex},
                    ])
                }}
            ]
        })
    }

    async _changeNickName(ev, close, nickName) {
        if(!!nickName) {
            if(nickName.length > 16) {
                Toast('昵称最大长度为16位', 1500)
                return
            }
            if(nickName !== this.props.user.getIn(['userInfo', 'nickName'])) {
                try {
                    const { data } = await fetchPost('/updateMyInfo', {type: 1, nickName})
                    if(data.status === 'success') {
                        await this.props.changeUserInfoTodo({k: 'nickName', v: nickName})
                        this._renderCells()
                        close()
                    } else {
                        throw new Error('修改信息失败')
                    }
                } catch (e) {
                    Toast(e.message, 1500, ()=>{})
                }
            } else {
                Toast('新旧昵称不能相同', 1500)
            }
        } else {
            Toast('请输入新的昵称', 1500)
        }
    }

    async _changeSex(ev, close, sex) {
        if(sex === this.props.user.getIn(['userInfo', 'sex'])) {
            close(ev)
            return
        }

        try {
            const { data } = await fetchPost('/updateMyInfo', {type: 2, sex})
            if(data.status === 'success') {
                await this.props.changeUserInfoTodo({k: 'sex', v: sex})
                this._renderCells()
                close()
            } else {
                throw new Error('修改信息失败')
            }
        } catch (e) {
            Toast(e.message, 1500, ()=>{})
        }
    }

    componentWillMount() {
        this.props.enterTodo({path: '/changeUserInfo', name: '修改用户信息'})
    }

    componentDidMount() {
        this._renderCells()
    }

    render() {
        return (
            <div className="layout-body PageChangeUserInfo">
                <CellGroup cells={this.state.cells}/>
            </div>
        )
    }
}

export default connect(
    ({ user }) => ({ user }),
    (dispatch) => bindActionCreators({
        enterTodo: enter,
        changeUserInfoTodo: changeUserInfo,
    }, dispatch)
)(PageChangeInfo)