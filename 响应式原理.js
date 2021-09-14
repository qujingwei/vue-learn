class Observe {
    constructor(value){
        this.value = value
        this.walk()
    }

    walk(){
        Object.keys(this.value).forEach(key => {
            defineReactive(this.value, key)
        })
    }
}

function observe(value){
    if (typeof value !== 'object') return
    return new Observe(value)
}

function defineReactive(obj, key, value = obj[key]){
    observe(value)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get (){
            console.log(111);
            return value
        },
        set (newVal){
            if(value === newVal) return
            console.log(222);
            value = newVal
        }
    })
}


let obj = {
    a:1,
    obj:{
        b:2
    }
}
observe(obj)