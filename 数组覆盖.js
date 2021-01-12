function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args)
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                console.log(args);
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        // notify change
        return result
    })
})


let arr = [1, 2, 3]
arr.__proto__ = arrayMethods
arr.push(1)

