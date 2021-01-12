const compiler = require('vue-template-compiler')

const tpl = `<div class="main" :class="bindClass">
<div>{{text}}</div>
<div>hello world</div>
<div v-for="(item, index) in list">
    <p>{{item.name}}</p>
    <p>{{item.value}}</p>
    <p>{{index}}</p>
    <p>---</p>
</div>
<div v-if="text">
    {{text}}
</div>
<div v-else></div>
</div>`
console.log(compiler.compile(tpl));