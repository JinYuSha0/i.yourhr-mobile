import './login.less'

import React, { Component } from 'react'
import Immutable, { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { delay, removeClass, addClass, fetchGet } from '../../util/util'
import { enter, leave } from '../../redux/navigation'
import { login, loginFailure, signup, signupValidate } from '../../redux/user'
import { clearValidate, clearValidateByField, captchaRequired, captchaRefresh, openModal, changeModal, forget, viewChange, forgetValidate } from '../../redux/pageLogin'
import { history } from '../../index'

export const switchAnimate = async (now, next) => {
    removeClass(next, 'hidden')
    addClass(now, 'animated fadeOutLeft')
    addClass(next, 'animated fadeInRight')
    await delay(500)
    now.className = 'view hidden'
    next.className = 'view'
}

class SignUp extends Component {
    signup() {
        this.props.signup({
            name: this.name.value,
            phone: this.phone.value,
            password: this.password.value,
        })
    }
    render() {
        const name = this.props.validate.get('name')
        const phone = this.props.validate.get('phone')
        const password = this.props.validate.get('password')
        const { onfocus, modalOpen } = this.props
        return (
            <div className="view view-signup">
                <from className="login-box" action="/api/signup" method="POST" autoComplete="off" noValidate="novalidate">
                    <div className="group-inputs">
                        <div className="name input-wrapper">
                            <input placeholder="姓名" required type="text" maxLength="16" onFocus={onfocus.bind(this, 'name')} ref={name => { this.name = name }}/>
                            <Prompt visible={name.get('visible')}>{name.get('message')}</Prompt>
                        </div>
                        <div className="phone input-wrapper">
                            <input placeholder="手机号码" required type="text" maxLength="11" onFocus={onfocus.bind(this, 'phone')} ref={phone => { this.phone = phone }}/>
                            <Prompt visible={phone.get('visible')}>{phone.get('message')}</Prompt>
                        </div>
                        <div className="password input-wrapper">
                            <input placeholder="密码(不少于6位)" required type="password" maxLength="36" onFocus={onfocus.bind(this, 'password')} ref={password => { this.password = password }}/>
                            <Prompt visible={password.get('visible')}>{password.get('message')}</Prompt>
                        </div>
                    </div>
                    <div className="button-wrapper">
                        <button className="sign-button" type="submit" onTouchTap={this.signup.bind(this)}>立即注册</button>
                    </div>
                </from>
                <p className="agreement">
                    点击「注册」按钮，即代表你同意
                    <a href="http://ge.yourhr.com.cn/public/agreement.html" target="_blank">《中宜协议》</a>
                </p>
            </div>
        )
    }
}

class Login extends Component {
    login() {
        let params = {
            phone: this.phone.value,
            password: this.password.value,
        }
        params = this.props.captchaRequired ? Object.assign({}, params, {captcha: this.captcha.value}) : params
        this.props.login(params)
    }
    render() {
        const phone = this.props.validate.get('phone')
        const password = this.props.validate.get('password')
        const captcha = this.props.validate.get('captcha')
        const { onfocus, modalOpen, captchaRequired, captchaVisible, captchaUrl, isShowCaptcha, refreshCaptcha } = this.props
        return (
            <div className="view view-login">
                <from className="login-box" action="/api/login" method="POST" autoComplete="off" noValidate="novalidate">
                    <div className="group-inputs">
                        <div className="phone input-wrapper">
                            <input placeholder="手机号码" required type="text" maxLength="11" onFocus={onfocus.bind(this, 'phone')} ref={phone => { this.phone = phone }}/>
                            <Prompt visible={phone.get('visible')}>{phone.get('message')}</Prompt>
                        </div>
                        <div className="password input-wrapper" style={captchaVisible ? null : {borderBottom: 0}}>
                            <input placeholder="密码" required type="password" maxLength="36" onFocus={onfocus.bind(this, 'password')} onChange={isShowCaptcha} ref={password => { this.password = password }}/>
                            <Prompt visible={password.get('visible')}>{password.get('message')}</Prompt>
                        </div>
                        {
                            captchaRequired ?
                                <div className="captcha input-wrapper" style={captchaVisible ? {height: '1.333333333rem'} : null}>
                                    <input placeholder="验证码" required type="text" maxLength="4" onFocus={onfocus.bind(this, 'captcha')} ref={captcha => { this.captcha = captcha }}/>
                                    <Prompt visible={captcha.get('visible')}>{captcha.get('message')}</Prompt>
                                    <div className="captcha-container" onTouchTap={refreshCaptcha}>
                                        <img src={captchaUrl}/>
                                    </div>
                                </div> : null
                        }
                    </div>
                    <div className="button-wrapper">
                        <button className="login-button" type="submit" onTouchTap={this.login.bind(this)}>登录</button>
                    </div>
                </from>
                <div className="login-ques-wrapper">
                    <a className="fl">与格兰堂帐号通用</a>
                    <a className="fr" onTouchTap={modalOpen.bind(this, UnableLogin)}>无法登录?</a>
                </div>
            </div>
        )
    }
}

class Prompt extends Component {
    render() {
        const { children, visible } = this.props
        return (
            <label className={visible ? "l-error animated fadeInRight" : "l-error animated fadeOutRight"}>{children}</label>
        )
    }
}

class Modal extends Component {
    constructor(props) {
        super(props)
        this.nextView = this.nextView.bind(this)
        this.initView = this.initView.bind(this)
        this.upView = this.upView.bind(this)
        this.viewChange = this.props.viewChangeTodo.bind(this)
    }
    componentWillMount() {
        this.viewChange(List([]))
    }
    nextView(view) {
        const viewArr = this.props.viewArr
        this.viewChange(viewArr.push(view))
    }
    initView(view) {
        if(view) {
            this.viewChange(List([view]))
            return
        }
        this.viewChange(List([]))
    }
    upView = async () => {
        const viewArr = this.props.viewArr
        const now = viewArr.get(viewArr.size-1)
        const up = viewArr.get(viewArr.size-2)
        this.viewChange(viewArr.pop())
        removeClass(up, 'hidden')
        addClass(now, 'animated fadeOutRight')
        addClass(up, 'animated fadeInLeft')
        await delay(500)
        now.className = 'view hidden'
        up.className = 'view'
    }
    render() {
        const { Modal, viewArr, tmp, visible, hidden, modalClose, signupValidateTodo, captchaRequired, captchaUrl, refreshCaptcha, forgetTodo, forgetValidateTodo } = this.props
        return (
            <div className={visible ? "modal animated fadeInUp" : "modal animated fadeOutDown"} style={{display: hidden ? 'none' : ''}}>
                <div className="btn-groups">
                    <span className="btn-close" onTouchTap={modalClose}></span>
                    { viewArr.size > 1 ? <span className="btn-return" onTouchTap={this.upView}></span> : null }
                </div>
                <div className="modal-view">
                    {
                        Modal ? <Modal nextView={this.nextView} initView={this.initView} viewArr={viewArr} tmp={tmp} signupValidateTodo={signupValidateTodo} captchaRequired={captchaRequired} captchaUrl={captchaUrl} refreshCaptcha={refreshCaptcha} forgetTodo={forgetTodo} forgetValidateTodo={forgetValidateTodo}/> : null
                    }
                </div>
            </div>
        )
    }
}

class UnableLogin extends Component {
    componentDidMount() {
        this.props.initView(this.view_0)
    }
    switchView = (now, next) => {
        this.props.nextView(next)
        switchAnimate(now, next)
    }
    step1 () {
        const { captchaRequired, forgetTodo } = this.props
        const params = {
            data: {phone: this.phone.value},
            now: this.view_1,
            next: this.view_2,
        }
        if(captchaRequired) {
            params.data.captcha = this.captcha.value
        }
        forgetTodo(params)
    }
    step2() {
        const { forgetValidateTodo } = this.props
        const params = {
            phone: this.phone.value,
            captcha: this.m_captcha.value,
            newPassword: this.password.value,
        }
        forgetValidateTodo(params)
    }
    render() {
        const { captchaRequired, captchaUrl, refreshCaptcha } = this.props
        return (
            <div className="unable-login">
                <div data-view={0} className='view' ref={view_0 => {this.view_0 = view_0}}>
                    <div className="view-title">
                        <h1>无法登陆</h1>
                        <h2>我们提供两种方式帮你找回密码</h2>
                    </div>
                    <div className="view-content">
                        <div className="content">
                            <button className="blue-btn" onTouchTap={this.switchView.bind(this, this.view_0, this.view_1)}>找回密码</button>
                            <a className="blue-btn space" href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009632800&aty=0&a=0&curl=&ty=1">人工处理</a>
                        </div>
                    </div>
                </div>

                <div data-view={1} className='view hidden' ref={view_1 => {this.view_1 = view_1}}>
                    <div className="view-title">
                        <h1>找回密码</h1>
                        <h2>填写需要找回的帐号</h2>
                    </div>
                    <div className="view-content">
                        <div className="content">
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input type="text" placeholder="手机号码" maxLength={11} ref={phone => {this.phone = phone}}/>
                                    <a target="_blank" href="http://ge.yourhr.com.cn/public/captchaLose.html">收不到验证码?</a>
                                </div>
                                {
                                    captchaRequired ? <div className="input-wrapper">
                                        <img src={captchaUrl} onTouchTap={refreshCaptcha}/>
                                        <input type="text" placeholder="验证码" maxLength={4} ref={captcha => {this.captcha = captcha}}/>
                                    </div> : null
                                }
                            </div>
                            <button className="blue-btn" onTouchTap={this.step1.bind(this)}>获取验证码</button>
                        </div>
                    </div>
                </div>

                <div data-view={2} className='view hidden' ref={view_2 => {this.view_2 = view_2}}>
                    <div className="view-title">
                        <h1>重设密码</h1>
                        <h2>请输入新的密码以及手机短信验证码</h2>
                    </div>
                    <div className="view-content">
                        <div className="content">
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input type="text" maxLength={36} type="password" placeholder="新的密码" ref={password => {this.password = password}}/>
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" maxLength={6} placeholder="短信验证码" ref={m_captcha => {this.m_captcha = m_captcha}}/>
                                </div>
                            </div>
                            <button className="blue-btn" onTouchTap={this.step2.bind(this)}>重设密码</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class SignUpCaptcha extends Component {
    componentDidMount() {
        this.props.initView()
    }
    signupValidate() {
        this.props.signupValidateTodo({ captcha: this.captcha.value, phone: this.props.tmp.phone })
    }
    render() {
        const phone = this.props.tmp.phone
        return (
            <div data-view={0} className='view' ref={view_0 => {this.view_0 = view_0}}>
                <div className="view-title">
                    <h1>验证手机</h1>
                    <h2>请输入你手机收到的6位数短信验证码</h2>
                </div>
                <div className="view-content">
                    <div className="content">
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input type="text" defaultValue={phone} disabled="disabled"/>
                            </div>
                            <div className="input-wrapper">
                                <input type="text" maxLength={6} placeholder="验证码" ref={captcha => {this.captcha = captcha}}/>
                                <a target="_blank" href="http://ge.yourhr.com.cn/public/captchaLose.html">收不到验证码?</a>
                            </div>
                        </div>
                        <button className="blue-btn" onTouchTap={this.signupValidate.bind(this)}>注册成功</button>
                    </div>
                </div>
            </div>
        )
    }
}

const __validate = (params, validate, captchaVisible) => {
    const { phone, password, name, captcha } = params
    let pass = true
    return new Promise((resolve, reject) => {
        if(params.hasOwnProperty('phone') && !phone) {
            pass = false
            validate = validate.set('phone', Map({visible: true, message: '请填写手机号码'}))
        }
        if(params.hasOwnProperty('password') && !password) {
            pass = false
            validate = validate.set('password', Map({visible: true, message: '请填写密码'}))
        }
        if(params.hasOwnProperty('phone') && phone && !(/^1[3456789]\d{9}$/.test(phone))) {
            pass = false
            validate = validate.set('phone', Map({visible: true, message: '请填写正确的手机号码'}))
        }
        if(params.hasOwnProperty('password') && password && password.length < 6) {
            pass = false
            validate = validate.set('password', Map({visible: true, message: '请填写6位数以上的密码'}))
        }
        if(params.hasOwnProperty('password') && password && password.length > 36) {
            pass = false
            validate = validate.set('password', Map({visible: true, message: '请填写36位数以下的密码'}))
        }
        if(params.hasOwnProperty('name') && !name) {
            pass = false
            validate = validate.set('name', Map({visible: true, message: '请填写真实姓名'}))
        }
        if(params.hasOwnProperty('captcha') && !captcha && captchaVisible) {
            pass = false
            validate = validate.set('captcha', Map({visible: true, message: '请填写验证码'}))
        }
        if(params.hasOwnProperty('captcha') && captcha && captcha.length != 4 && captchaVisible) {
            pass = false
            validate = validate.set('captcha', Map({visible: true, message: '请填写正确的验证码'}))
        }
        if(pass) {
            resolve()
        } else {
            reject(validate)
        }
    })
}
class PageLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tab: 0,  //0登录 1注册
            captchaVisible: false,
        }
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
        this.onfocus = this.onfocus.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    componentWillMount() {
        const { user, login, enterTodo, clearValidateTodo, changeModalTodo, captchaRequiredTodo, captchaRefreshTodo } = this.props

        const isLogin = user.get('isLogin')
        if(isLogin) {
            history.push({pathname: '/'})
            return
        }

        enterTodo({path: '/login', name: '登录注册找回'})
        clearValidateTodo()
        changeModalTodo({ modal: null, visible: false, hidden: true })
        if(!login.getIn(['captcha', 'require'])) {
            fetchGet('/getCodeRequire').then(res => {
                const captcha = login.get('captcha')
                captchaRequiredTodo(captcha.merge(Immutable.fromJS(res.data.captcha)))
            }).catch(e => {
                console.error(e)
            })
        }
        captchaRefreshTodo()
    }

    componentDidMount() {
        const { user, leaveTodo } = this.props
        const isLogin = user.get('isLogin')
        if(isLogin) {
            leaveTodo()
        }
    }

    modalOpen(modal) {
        this.props.openModalTodo(modal)
    }

    modalClose = async () => {
        this.props.changeModalTodo({ visible: false })
        await delay(500)
        this.props.changeModalTodo({ hidden: true })
    }

    switchTab(tab) {
        this.props.clearValidateTodo()
        this.setState({ tab })
    }

    onfocus(field) {
        if(this.props.login.getIn(['validate', field, 'visible'])) {
            this.props.clearValidateByFieldTodo(field)
        }
    }

    isShowCaptcha() {
        if(this.props.login.getIn('validate', 'captcha', 'require')) {
            this.setState({ captchaVisible: true })
        }
    }

    login(params)  {
        const validate = this.props.login.get('validate')
        this.props.clearValidateTodo()
        __validate(params, validate, this.state.captchaVisible).then(() => {
            this.props.loginTodo(params)
        }).catch(e => {
            this.props.loginFailureTodo(e)
        })
    }

    signup(params) {
        const validate = this.props.login.get('validate')
        this.props.clearValidateTodo()
        __validate(params, validate, this.state.captchaVisible).then(() => {
            this.props.signupTodo(params)
        }).catch(e => {
            this.props.loginFailureTodo(e)
        })
    }

    render() {
        const { tab, captchaVisible } = this.state
        const { signupValidateTodo, captchaRefreshTodo, forgetTodo, viewChangeTodo, forgetValidateTodo } = this.props
        const modal = this.props.login.getIn(['modal', 'modal']),
            viewArr = this.props.login.getIn(['modal', 'viewArr']),
            tmp = this.props.login.getIn(['modal', 'tmp']),
            visible = this.props.login.getIn(['modal', 'visible']),
            hidden = this.props.login.getIn(['modal', 'hidden']),
            validate = this.props.login.get('validate'),
            captchaRequired = this.props.login.getIn(['captcha', 'require']),
            captchaUrl = this.props.login.getIn(['captcha', 'url'])

        return (
            <div className="layout-body PageLogin">
                <div className="index-main">
                    <div className="index-main-body">
                        <div className="index-header">
                            <h1 className="logo"></h1>
                            <h2 className="subtitle">中宜教育，你的公考培训专家</h2>
                        </div>
                        <div className="index-tab-navs">
                            <div className="navs-slider">
                                <span className={tab === 0 ? "active" : ""} onTouchTap={this.switchTab.bind(this, 0)}>登录</span>
                                <span className={tab === 1 ? "active" : ""} onTouchTap={this.switchTab.bind(this, 1)}>注册</span>
                                <div className="navs-slider-bar" style={{left: tab * 2 + 'rem'}}></div>
                            </div>
                        </div>
                        <div className="index-body">
                            {
                                tab === 0 ? <Login validate={validate} login={this.login} onfocus={this.onfocus} modalOpen={this.modalOpen} captchaRequired={captchaRequired} captchaVisible={captchaVisible} captchaUrl={captchaUrl} isShowCaptcha={this.isShowCaptcha.bind(this)} refreshCaptcha={captchaRefreshTodo}/> :
                                    <SignUp validate={validate} signup={this.signup} onfocus={this.onfocus} modalOpen={this.modalOpen}/>
                            }
                        </div>
                    </div>
                </div>

                <Modal Modal={modal} viewArr={viewArr} tmp={tmp} visible={visible} hidden={hidden} modalClose={this.modalClose} signupValidateTodo={signupValidateTodo} captchaRequired={captchaRequired} captchaUrl={captchaUrl} refreshCaptcha={captchaRefreshTodo} forgetTodo={forgetTodo} viewChangeTodo={viewChangeTodo} forgetValidateTodo={forgetValidateTodo} />
            </div>
        )
    }
}

export default connect(
    ({user, login}) => ({user, login}),
    (dispatch) => bindActionCreators({
        loginTodo: login,
        loginFailureTodo: loginFailure,
        clearValidateTodo: clearValidate,
        clearValidateByFieldTodo: clearValidateByField,
        captchaRequiredTodo: captchaRequired,
        captchaRefreshTodo: captchaRefresh,
        openModalTodo: openModal,
        changeModalTodo: changeModal,
        signupTodo: signup,
        signupValidateTodo: signupValidate,
        forgetTodo: forget,
        viewChangeTodo: viewChange,
        forgetValidateTodo: forgetValidate,
        enterTodo: enter,
        leaveTodo: leave,
    }, dispatch)
)(PageLogin)