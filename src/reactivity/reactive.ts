import { track, trigger } from "./effect"
export enum ReactiveEnum {
    IS_REACTIVE = '_v_isReactive',
    IS_READONLY = '_v_is_readonly'
}



export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            if (key === ReactiveEnum.IS_REACTIVE) {
                return true
            }
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
            if (key === ReactiveEnum.IS_READONLY) {
                return true
            }
            return target[key]
        },
        set(target, key, value) {
            console.warn('readonly can not be setted')
            return true
        }
    })
}

export function isReactive(value: any) {
    return !!value[ReactiveEnum.IS_REACTIVE]
}

export function isReadonly(value: any) {
    return !!value[ReactiveEnum.IS_READONLY]
}