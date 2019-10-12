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
    <div id="app" @click="clickApp">
        <div v-if="showTop" class="top" v-tap.prevent="tapTop">I'll hide when I'm clicked</div>
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
            console.log('Top hide now.')
        },
        clickApp(){ //It will not trigger when top hide.

        }
    }
}
</script>
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