# mobile tap event for vue.js

## Install
```
npm i vue-mobile-tap
```

## Project setup
### Register a global custom directive called `v-tap`
```JavaScript
import Vue from 'vue'
import Tap from 'vue-mobile-tap'
Vue.use(Tap)


new Vue({
    render: h => h(App)
}).$mount('#app')
```

### register a locally instead directive called `v-tap`
```html
<script>
import { bindFunction, unbindFunction } from 'vue-mobile-tap'
export default {
    directives: {
        tap: {
            inserted: bindFunction,
            unbind: unbindFunction
        }
    }
}
</script>
```

## Usage

### Simple example
```html
<template>
    <div id="app" v-tap="tapApp">
        <div class="btn" v-tap="tapBtn">button</div>
    </div>
</template>
<script>
export default {
    methods:{
        tapBtn(){
            console.log('I was trigger first.')
        },
        tapApp(){
            console.log('I was triggered later.')
        }
    }
}
</script>
```

### `v-tap.once`
#### `v-tap.once` handler will only trigger once

```html
<template>
    <div id="app">
        <div class="btn" v-tap.once="tapBtn">button</div>
    </div>
</template>
<script>
export default {
    methods:{
        tapBtn(){
            console.log('I trigger only once')
        }
    }
}
</script>
```

### `v-tap.stop`
#### <code>event.stopPropagation()</code>

```html
<template>
    <div id="app" v-tap="tapApp">
        <button v-tap.stop="tapBtn">click me</button>
    </div>
</template>
<script>
export default {
    methods:{
        tapBtn(){
            console.log('I was clicked.')
        },
        tapApp(){ //It will not trigger when button was clicked.
            
        }
    }
}
</script>
```

### `v-tap.prevent`
#### <code>event.preventDefault()</code>
#### It also prevents point-through event happen | 防止点透事件触发

```html
<template>
    <div id="app">
        <!-- bottom_div and top_div is not the parent-child relationship, but top_div show on the top of bottom_div.
        If do not prevent top_div's default touchend event, the point-through event will happen. -->
        <!-- bottom_div 和 top_div 没有父子关系, 但是 top_div 在 bottom_div 的上面显示。
        如果不阻止 top_div 的 touchend 事件，bottom_div 的 click 事件会在 top_div 消失后触发。 -->
        <div class="bottom_div" @click="clickBottom"></div>
        <div class="top_div" v-tap.prevent="tapTop" v-if="showTop">I'll hide when I'm clicked</div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            showTop: true
        }
    },
    methods:{
        tapTop(){
            this.showTop = false;
            console.log('top_div hide now.')
        },
        clickBottom(){ //It will not trigger when top_div hide.
            console.log('bottom_div was clicked')
        }
    }
}
</script>
<style>
    #app{
        position: relative;
    }
    .bottom_div{
        background: #e3e3e3;
        height: 200px;
    }
    .top_div{
        position: absolute;
        width: 72%;
        left: 14%;
        top: 75px;
        font-size: 16px;
        line-height: 50px;
        background: #0a9;
        color: #fff;
        text-align: center;
        border-radius: 3px;
    }
</style>
```

### `v-tap="[tapBtn, args...]"`
#### Example for pass arguments

```html
<template>
    <div id="app" v-tap="tapApp">
        <div class="btn" v-tap="[tapBtn, arg1, arg2, arg3]">button</div>
    </div>
</template>
<script>
export default {
    methods:{
        tapBtn(eventObj, arg1, arg2, arg3){
            console.log(eventObj)// {touchstartEvent: touchstartEvent, touchendEvent: touchendEvent}
        }
    }
}
</script>
```
### Notice
#### when touch event is not supported, tap event handler arguments[0] is different
```html
<template>
    <div id="app">
        <div class="btn" v-tap="tapBtn">button</div>
    </div>
</template>
<script>
export default {
    methods:{
        tapBtn(eventObj){
            console.log(eventObj) // {clickEvent: clickEvent}
        }
    }
}
</script>
```

## Contact
The project's website is located at https://github.com/Haycher/vue-mobile-tap.git 
Author: Haycher, Lyu (spring_falling@163.com)