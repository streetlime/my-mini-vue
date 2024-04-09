import { track, trigger } from "./effect"

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            track(target, key)
            return target[key]
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value)
            trigger(target, key)
            return res
        }
    })
}

export function readonly(raw) {
    return new Proxy(raw, {
        get(target, key) {
            return target[key]
        },
        set(target, key, value) {
            console.warn('readonly can not be setted')
            return true
        }
    })
}