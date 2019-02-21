export default class Event {
    constructor() {
        this._listener = []
    }

    on(eventName, callback) {
        let listener = this._listener[eventName] || []
        listener.push(callback)
        this._listener[eventName] = listener
    }

    emit(eventName) {
        const args = Array.prototype.slice.apply(arguments).slice(1),
            listener = this._listener[eventName]

        if(!Array.isArray(listener)) return;//自定义事件名不存在
        listener.forEach((callback) => {
            try {
                callback.apply(this, args);
            }catch(e) {
                console.error(e);
            }
        })
    }
}