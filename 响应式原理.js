function observer (data){
    if(!data || Object.prototype.toString.call(data) !== '[object Object]') return
    
    Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key])
    })
    
}

function defineReactive(obj, key, value){
    Object.defineProperty(obj, key, {
        enumerable:true,
        configurable:true,
        get(){
            return value
        },
        set (newVal){
            if(value === newVal) return
            value = newVal
            cb(newVal)
        }
    })
}

function cb(){
    console.log('试图更新了~');
}

class Vue {
    constructor(option){
        this._data = option.data
        observer(this._data)
    }
    changeData (){
        this._data.test = 'change'
    }
}


let vue = new Vue({
    data: {
        test: "I am test."
    }
})

vue.changeData()
vue.changeData()

