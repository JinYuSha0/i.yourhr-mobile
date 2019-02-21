import { store } from '../index'
import { URL } from '../config/constants'
import { LOGINOUT_AUTO } from '../redux/user'
import React, { Component } from 'react'
import ReactDom from 'react-dom'

//预期的错误
class ExceptError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'ExceptError'
        this.message = msg
    }
}

//服务器的错误
class ServerError extends Error {
    constructor(msg, path, params) {
        super(msg)
        this.name = 'ServerError'
        this.message = msg

        //todo 即时反馈
        console.warn(path, JSON.stringify(params))
    }
}

//延迟
const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

//超时
const timeout = (ms, message) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(message)
        }, ms)
    })
}

//将秒转化成分:秒
const formatSec = (seconds) => {
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
}

//判断石否安卓
const isAndroid = () => {
    const u = navigator.userAgent
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
}

//判断是否ios
const isIos = () => {
    const u = navigator.userAgent
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

//判断是否某个元素的子元素
const isParent =  (obj, parentObj) =>{
    if(obj === parentObj) return false
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY'){
        if (obj == parentObj){
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}

//object转换成url参数
const objToUrlParams = (obj) => {
    if(obj) {
        let utlParams = '?'
        for (let i in obj) {
            utlParams += i + '=' + obj[i] + '&'
        }
        return utlParams.substr(0, utlParams.length - 1)
    }
    return ''
}

//fetchPost
const fetchPost = (url, params) => {
    const postPromise = new Promise((resolve, reject) => {
        fetch(URL + url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then((response) => {
            return response.json()
        }).then(async json => {
            if(json.code === 200) {
                resolve(json)
            } else if (json.code === 1002) {
                store.dispatch({ type: LOGINOUT_AUTO })
                throw new ExceptError('登录超时')
            } else {
                throw new ServerError(json.message + ',' + json.code, url, params)
            }
        }).catch(e => {
            if(e.name === 'ExceptError' || e.name === 'ServerError') {
                reject(e)
            } else {
                reject(new Error('请求服务器失败,请检查网络。'))
            }
        })
    })
    const timeoutPromise = timeout(5000, '请求超时')
    return Promise.race([postPromise, timeoutPromise])
}

//fetchGet
const fetchGet = (url, params) => {
    const getPromise = new Promise((resolve, reject) => {
        fetch(URL + url + objToUrlParams(params), {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            return response.json()
        }).then(json => {
            if(json.code === 200) {
                resolve(json)
            } else if (json.code === 1002) {
                store.dispatch({ type: LOGINOUT_AUTO })
                throw new ExceptError('登录过期')
            } else {
                throw new ServerError(json.message + ',' + json.code, url, params)
            }
        }).catch(e => {
            if(e.name === 'ExceptError' || e.name === 'ServerError') {
                reject(e)
            } else {
                console.log(e)
                reject(new Error('请求服务器失败,请检查网络。'))
            }
        })
    })
    const timeoutPromise = timeout(5000, '请求超时')
    return Promise.race([getPromise, timeoutPromise])
}

//浅拷贝
const shallowCopy = (obj) => {
    //对象拷贝
    if(typeof obj === 'object' && !(obj instanceof Array)) {
        var dst = {}
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                dst[prop] = obj[prop]
            }
        }
        return dst
    }

    //数组拷贝
    var arr = []
    for(var i in obj) {
        arr[i] = obj[i]
    }
    return arr
}

const hasClass = (elem, cls) => {
    if(elem) {
        return elem.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    } else {
        return false
    }
}

//移除类名
const removeClass = (elem, cls) => {
    if (hasClass(elem, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        elem.className = elem.className.replace(reg, '');
    }
}

//添加类名
const addClass = (elem, cls) => {
    if (!hasClass(elem, cls)) {
        elem.className += " " + cls;
    }
}

//删除元素
const removeElem = (elem) => {
    if(!elem) return
    const _parentElem = elem.parentNode
    if(_parentElem) {
        _parentElem.removeChild(elem)
    }
}

//过渡
const transition = (start, end, time, cb) => {
    const isBig = end > start
    const per = (end - start) / (time / 10);
    let value = start;

    let timing = self.setInterval(() => {
        if((isBig && value < end) || (!isBig && value > end)) {
            cb(value += per);
            return
        }
        cb(end)
        timing = window.clearInterval(timing);
    }, 10)
}

//递归获取父节点指定属性
const recursionGetAttr = (elem, attr) => {
    return new Promise((resolve, reject) => {
        const recursion = (elem, attr) => {
            if(!elem.getAttribute(attr)) {
                if(elem.parentNode.getAttribute) {
                    recursion(elem.parentNode, attr)
                } else {
                    reject('未找到属性')
                }
            } else {
                resolve({attr: elem.getAttribute(attr), elem})
            }
        }

        const recursionArr = (_elem, attrArray) => {
            let attr = null, elem = null
            attrArray.map(v => {
                if(_elem.getAttribute(v)) {
                    elem = _elem
                    attr = _elem.getAttribute(v)
                }
            })

            if(!!attr) {
                resolve({attr, elem})
            } else {
                if(elem.parentNode.getAttribute) {
                    recursionArr(elem.parentNode, attrArray)
                } else {
                    reject('未找到属性')
                }
            }
        }

        if(typeof attr === 'string') {
            recursion(elem, attr)
        } else {
            recursionArr(elem, attr)
        }
    })
}

//遍历返回属性等于指定值的子节点
const ergodicGetElemByAttr = (parentNode, attr, value) => {
    let _child = null
    if(parentNode.childNodes.length > 0) {
        try {
            parentNode.childNodes.forEach(child => {
                if(child.getAttribute(attr) == value) {
                    _child = child
                    throw new Error()
                }
            })
        } catch (e) {}
    }
    return _child
}

//将react组件渲染到指定dom节点内
class ReactRenderInDom extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { parentNode, children, id } = this.props
        if(!!parentNode && !!children) {
            this.wrapper = document.createElement('div')
            this.wrapper.setAttribute('class', 'ReactRenderInDom')
            if(id) this.wrapper.setAttribute('id', id)
            parentNode.appendChild(this.wrapper)
            this._render(children, this.wrapper)
        }
    }

    componentWillReceiveProps(nextProps) {
        const { children } = nextProps
        this._render(children, this.wrapper)
    }

    componentWillUnmount() {
        removeClass(document.getElementById('switch-wrapper'), 'forbidScroll')
        this.props.parentNode.removeChild(this.wrapper)
    }

    _render(children, wrapper) {
        ReactDom.render(children, wrapper)
    }

    render() {
        return null
    }
}

//获取网页get参数
const getQueryString = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return unescape(r[2])
    } else {
        return null
    }
}

//rem转px
const rem2px = (rem) => {
    return window.rem * rem
}

//禁止滚动
const forbidScroll = () => {
    addClass(document.body, 'forbidScroll')
}

const allowScroll = () => {
    removeClass(document.body, 'forbidScroll')
}

const getUrlParams = () => {
    const url = document.location.toString()
    const paramsObj = {}
    const arrUrl = url.split("?")
    const paramsStr = arrUrl[1]
    if(arrUrl[1]) {
        const arrParamsStr = paramsStr.split("&")
        arrParamsStr.map((v) => {
            const arr = v.split("=")
            paramsObj[arr[0]] = arr[1]
        })
    }
    return paramsObj
}

const getTimeByNum = (num) => {
    switch (num) {
        case 1:
            return '上午'
            break
        case 3:
            return '下午'
            break
        case 5:
            return '晚上'
            break
    }
}

const getDaysByNum = (num) => {
    switch (num) {
        case 4:
            return [1, 3]
            break
        case 6:
            return [1, 5]
            break
        case 8:
            return [3, 5]
            break
        case 9:
            return [1, 3, 5]
            break
        default:
            return [num]
            break
    }
}

module.exports = {
    ExceptError: ExceptError,
    delay: delay,
    formatSec: formatSec,
    isAndroid: isAndroid,
    isParent: isParent,
    isIos: isIos,
    fetchPost: fetchPost,
    fetchGet: fetchGet,
    shallowCopy: shallowCopy,
    hasClass: hasClass,
    removeClass: removeClass,
    addClass: addClass,
    removeElem: removeElem,
    transition: transition,
    recursionGetAttr: recursionGetAttr,
    ergodicGetElemByAttr: ergodicGetElemByAttr,
    ReactRenderInDom: ReactRenderInDom,
    getQueryString: getQueryString,
    rem2px: rem2px,
    forbidScroll: forbidScroll,
    allowScroll: allowScroll,
    getUrlParams: getUrlParams,
    getTimeByNum: getTimeByNum,
    getDaysByNum: getDaysByNum,
}