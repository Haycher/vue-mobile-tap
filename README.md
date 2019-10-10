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

## Example for common situation

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
            console.log('I am first')
        },
        tapApp(){
            console.log('I am second')
        }
    }
}
</script>
```

## Example for once situation

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
            console.log('I run only once')
        }
    }
}
</script>
```

## Example for stopPropagation situation

```html
<template>
    <div id="app" v-tap="tapApp">
        <div class="btn" v-tap.stop="tapBtn">button</div>
    </div>
</template>
<script>
export default {
    methods:{
        tapBtn(){
            console.log('I am first')
        },
        tapApp(){
            console.log('I can not run when btn was clicked.')
        }
    }
}
</script>
```

## Example for pass arguments situation

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


## Notice! when touch event is not supported, the eventObj is different
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