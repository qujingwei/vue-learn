function Person (){}

Person.prototype = {
    sayName (){
        console.log('My name is Java');
    }
}

let p = new Person()
Person.prototype.sayName = function(){
    console.log('My name is JS');
}
p.sayName()