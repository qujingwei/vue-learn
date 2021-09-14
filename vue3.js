let toProxy = new WeakMap()
let toRaw = new WeakMap()

let targetMap = new WeakMap()
let effectStack = []
//targetMap
// {
//   state:{
//     age:[effect1,effect2,effect3],
//     name:[]
//   }
// }
//收集依赖
function track(target,key){
    let effect = effectStack[effectStack.length - 1]
    if(effect){
        let depMap = targetMap.get(target)
        if(!depMap){
            targetMap.set(target,(depMap = new Map()))
        }
        let dep = depMap.get(key)
        if(!dep){
            depMap.set(key,(dep = new Set()))
        }
        dep.add(effect)
    }
}

//targetMap
// {
//   state:{
//     age:[effect],
//     name:[]
//   }
// }
//触发更新
function trigger(target,key){
    let depMap = targetMap.get(target)
    if(!depMap){
        return
    }

    let effects = new Set()
    let computedRunners = new Set()
    if(key){
        let deps = depMap.get(key)
        deps.forEach((e) => {
            if(e.computed){
                computedRunners.add(e)
            }else {
                effects.add(e)
            }
        })
    }
    effects.forEach((effect) => {effect()})
    computedRunners.forEach((computed) => {computed()})
}

function effect(fn,option = {}){
    let effect = createActiveEffect(fn,option)
    if(!effect.lazy){
        effect()
    }
    return effect
}
function createActiveEffect(fn,option){
    let effect = function (...args){
        if(effectStack.indexOf(effect) === -1){
            try {
                effectStack.push(effect)
                return fn(...args)
            }finally {
                effectStack.pop()
            }
        }
    }
    effect.deps = []
    effect.computed = option.computed
    effect.lazy = option.lazy
    return effect
}

function computed(fn){
    let runner = effect(fn,{computed:true,lazy:true})
    return {
        effect:runner,
        get value(){
            return runner()
        }
    }
}

let baseHandel = {
    get(target,key){
        let res = Reflect.get(target,key)
        //收集依赖
        track(target,key)
        return typeof res === 'object' ? reactive(res) : res
    },
    set(target,key,val){
        let res = Reflect.set(target,key,val)
        //触发更新
        trigger(target,key)
        return res
    }
}

function reactive(target) {
    let observed = toProxy.get(target)
    //判断缓存
    if(observed){
        return observed
    }
    if(toRaw.get(target)){
        return target
    }

    //之前是通过双向存储来实现的缓存，五一之后改成了Object.prototype来实现
    //Object.prototype更好，空间复杂度更低
    // if(Object.prototype.hasOwnProperty.call(target,'__v_reactive')){
    //     return target
    // }
    //设置代理
    observed = new Proxy(target,baseHandel)
    //设置缓存
    toProxy.set(target,observed)
    toRaw.set(observed,target)
    // Object.defineProperty(target,'__v_reactive',{
    //     configurable: true,
    //     value:observed
    // })
    return observed
}