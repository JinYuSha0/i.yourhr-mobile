import './index.less'
import { store } from '../../index'

import Toast from '../../components/toast'
import { addClass, hasClass, removeElem, removeClass, fetchGet, recursionGetAttr, ergodicGetElemByAttr, forbidScroll, allowScroll } from '../../util/util'
import Event from '../../util/event'
import { getLevel } from '../../redux/courses'

const url = '/getClassifyCourse'

export default class Classify {
    constructor() {
        this._classify = []
        this._classifyList = []
        this._classifyActive = []
        this._dataList = []

        this.init = this.init.bind(this)
        this.onClick = this.onClick.bind(this)
        this.createLevel = this.createLevel.bind(this)
        this.bindEvent.call(this)

        const classify = this.classify = document.getElementsByClassName('classify')

        //禁止底层滑动
        const switchWrapper = this.switchWrapper = document.getElementById('switch-wrapper')

        //关闭自己
        const closeSelf = this.closeSelf = () => {
            const _wrapper = wrapper || document.getElementsByClassName('classify')[0]
            header.removeEventListener('touchstart', touchBar, false)
            addClass(_wrapper, 'display-none')
            allowScroll()
        }

        //导航点击事件
        const touchBar = (e) => {
            if(!hasClass(classify[0], 'display-none')) {
                e.preventDefault()
                e.stopPropagation()
                closeSelf()
            }
        }
        const header = this.header = document.getElementsByClassName('header')[0]
        const bindBarEvent = () => {
            header.addEventListener('touchstart', touchBar, false)
        }

        if(classify.length) {
            forbidScroll()
            bindBarEvent()
            removeClass(classify[0], 'display-none')

            //todo 比较分类 init()
            return
        }

        const { courses } = store.getState()
        this.city_no = courses.getIn(['city', 'cityCode'])

        //禁止底层滑动
        forbidScroll()
        bindBarEvent()

        //添加遮罩层
        const wrapper = this.wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'classify')
        document.body.insertBefore(wrapper, document.body.childNodes[1])

        wrapper.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if(e.target === wrapper) {
                closeSelf()
            }
        }, false)

        //拉取第一级分类
        fetchGet(url, {type: 1, city_no: this.city_no}).then(({data}) => {
            if(data.status === 'success') {
                this._dataList[0] = data.list
                this.renderContent(data.list, wrapper)
            } else {
                throw new Error()
            }
        }).catch(e => {
            removeElem(this.wrapper)
            Toast('加载分类失败!', 2000, () => {closeSelf()})
        })
    }

    renderContent(data, node) {
        const content = document.createElement('div')
        content.setAttribute('class', 'content')

        const level1 = this.level1 = document.createElement('div')
        level1.addEventListener('click', this.onClick, false)


        level1.style.width = document.body.clientWidth + 'px'
        level1.setAttribute('class', 'level1')
        level1.setAttribute('data-level', 1)
        data.map((v, k) => {
            const classify = document.createElement('div')
            classify.setAttribute('data-classify', v.key)
            classify.innerHTML = '<p>' + v.text +'</p><b></b>'
            level1.appendChild(classify)
        })

        const levelWrapper = document.createElement('div')
        levelWrapper.setAttribute('class', 'level-wrapper')
        for(let i=2; i<=3; i++) {
            this.createLevel(levelWrapper, i)
        }

        //初始化分类
        const { courses } = store.getState()
        const levels = [],
            _levels = courses.getIn(['classify', 'levels'])
        if(_levels.length > 0) {
            _levels.map(v => {
                levels.push(v.key)
            })
        }
        this.init(levels.length > 0 ? levels : null)

        content.appendChild(level1)
        content.appendChild(levelWrapper)

        node.appendChild(content)
    }

    bindEvent() {
        this._listener = new Event()

        //记录各个等级的分类
        this._listener.on('click', (target, level) => {
            const _type = parseInt(target.getAttribute('data-classify'))
            this._classify[level-2] = _type
        })

        //切换active
        this._listener.on('click', (target, level) => {
            removeClass(this._classifyActive[level-2], 'active')
            addClass(target, 'active')
            this._classifyActive[level-2] = target
        })

        //触发点击事件
        this._listener.on('click', (target, level) => {
            if(level !== 4) {
                this.getLevel(level, parseInt(target.getAttribute('data-classify')))
            } else {
                const classifyList = []
                this._classify.map((v, k) => {
                    this._dataList[k].map(v2 => {
                        if(v2.key === v) {
                            if(v2.hasOwnProperty('num')) delete v2.num
                            classifyList.push(v2)
                        }
                    })
                })
                store.dispatch(getLevel(classifyList))
                this.closeSelf()
            }
        })

        //移除下级
        this._listener.on('click', (target, level) => {
            if(level === 2) {
                removeElem(this._classifyList[1])
                const levelWrapper = document.getElementsByClassName('level-wrapper')[0]
                this.createLevel(levelWrapper, 3)
            }
        })
    }

    async onClick(e) {
        const {attr, elem} = await recursionGetAttr(e.target, 'data-classify')
        const target = elem
        const level = parseInt(target.parentNode.getAttribute('data-level')) + 1

        //active选择再次点击失效排除第三级
        if(this._classifyActive[level-2] === target && level !== 4) return
        this._listener.emit('click', target, level)
    }

    getLevel(type, key) {
        return new Promise((resolve, reject) => {
            let classifyDom = this._classifyList[type-2]

            //新建dom
            if(classifyDom.childNodes.length > 0) {
                const parentNode = classifyDom.parentNode
                removeElem(classifyDom)
                const classifyList = document.createElement('ui')
                classifyList.setAttribute('data-level', type)
                classifyList.setAttribute('class', 'level')
                classifyList.addEventListener('click', this.onClick, false)
                parentNode.insertBefore(classifyList, parentNode.childNodes[type-2])
                this._classifyList[type-2] = classifyList
                classifyDom = classifyList
            }

            //填充dom
            fetchGet(url, {type, key, city_no: this.city_no}).then(({data}) => {
                if(data.status === 'success') {
                    this._dataList[type-1] = data.list

                    if(type === 2) {
                        classifyDom.style.backgroundColor = 'rgba(241, 241, 241, 0.28)'
                        classifyDom.style.borderRight = '1px solid #eeeeee'
                    }
                    data.list.map((v, k) => {
                        const item = document.createElement('li')
                        const text = document.createElement('p')
                        text.innerHTML = v.text
                        item.appendChild(text)
                        const num = document.createElement('span')
                        num.innerHTML = v.num
                        item.appendChild(num)
                        item.setAttribute('data-classify', v.key)
                        classifyDom.appendChild(item)
                    })
                    resolve()
                }
            }).catch(e => {
                Toast('加载分类失败!', 2000)
                reject(e)
            })
        })
    }

    createLevel(parentNode, level) {
        const classifyList = document.createElement('ui')
        classifyList.setAttribute('data-level', level)
        classifyList.setAttribute('class', 'level')
        classifyList.addEventListener('click', this.onClick, false)
        this._classifyList[level-2] = classifyList
        parentNode.appendChild(classifyList)
    }

    async init(_classify) {
        const classify = _classify ? _classify : [1]

        let tmp = null
        if(classify.length === 3) {
            //记录第三级选项
            tmp = classify[classify.length-1]
            classify.pop()
        }

        const renderLevel = () => {
            classify.map((v, k) => {
                this._classify.push(v)
            })

            return Promise.all(classify.map((v, k) => {
                return this.getLevel(k+2, v)
            }))
        }

        await renderLevel()

        if(tmp !== null) {
            this._classify.push(tmp)
        }

        this._classify.map(async (v, k) => {
            if(k === 0) {
                const elem = ergodicGetElemByAttr(this.level1, 'data-classify', v)
                this._classifyActive.push(elem)
                addClass(elem, 'active')
            } else {
                const elem = ergodicGetElemByAttr(this._classifyList[k-1], 'data-classify', v)
                this._classifyActive.push(elem)
                addClass(elem, 'active')
            }
        })

    }
}