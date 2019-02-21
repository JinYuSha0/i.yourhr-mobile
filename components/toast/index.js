import './toast.less'

import { removeElem } from '../../util/util'

class Toast {
    constructor(content, ms, todo) {
        this.timer = null

        if(!content) return
        const toast = document.createElement('div')
        toast.setAttribute('class', 'zy_toast')
        const _content = document.createElement('div')
        _content.setAttribute('class', 'toast_content')
        _content.innerHTML = content
        toast.appendChild(_content)

        this.timer = setTimeout(() => {
            removeElem(toast)
            if(todo) todo()
        }, ms || 1000)

        toast.addEventListener('click', (e) => {
            e.stopPropagation()
            if(todo) {
                clearTimeout(this.timer)
                removeElem(toast)
                todo()
            }
        }, false)

        document.body.appendChild(toast)
    }
}

export default (content, ms, todo) => {new Toast(content, ms, todo)}