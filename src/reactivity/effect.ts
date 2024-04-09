import { extend } from "./shared";
class ReactiveEffect {
    private _fn: any;
    public _scheduler: any;
    deps = []
    active = true
    onStop: (() => void) | null = null
    constructor(fn, public scheduler) {
        this._fn = fn
        this._scheduler = scheduler
    }
    run() {
        activeEffect = this
        return this._fn()
    }
    stop() {
        if (this.active) {
            cleanupDeps(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

function cleanupDeps(effect: any) {
    effect.deps.forEach((value: Set<any>) => {
        value.delete(effect)
    })
}


const taregtMap = new Map()
export function track(taregt, key) {
    let keyMap = taregtMap.get(taregt)
    if (!keyMap) {
        keyMap = new Map()
        taregtMap.set(taregt, keyMap)
    }
    let dep = keyMap.get(key)
    if (!dep) {
        dep = new Set()
        keyMap.set(key, dep)
    }
    if (!activeEffect) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}


export function trigger(taregt, key) {
    const dep = taregtMap.get(taregt).get(key)
    for (const effect of dep) {
        if (effect._scheduler) {
            effect._scheduler()
        } else {
            effect.run()
        }
    }
}



let activeEffect: any = null
export function effect(fn, options: any = {}) {
    const scheduler = options.scheduler
    const reactiveEffect = new ReactiveEffect(fn, scheduler)
    extend(reactiveEffect, options)
    reactiveEffect.run()
    const runner: any = reactiveEffect.run.bind(activeEffect)
    runner.activeEffect = reactiveEffect
    return runner
}

export function stop(runner) {
    // activeEffect.stop(runner)
    runner.activeEffect.stop(runner)

}

