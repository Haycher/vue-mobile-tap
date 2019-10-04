# mobile tap event for vue.js

## Install
```
npm i vue-mobile-tap
```

## Project setup
```JavaScript
import Vue from 'vue'
import Tap from 'vue-mobile-tap'
Vue.use(Tap)


new Vue({
    render: h => h(App)
}).$mount('#app')
```

## Examples for common situation

```html
<template>
    <div id="app" v-tap="tapApp">
        <div class="btn" v-tap="tapBtn">button</div>
    </div>
</template>
```
```JavaScript
export default {
    methods:{
        tapBtn(touchStartEvent, touchEndEvent){
            console.log('I am first')
        },
        tapApp(touchStartEvent, touchEndEvent){
            console.log('I am second')
        }
    }
}
```

## Examples for once situation

```html
<template>
    <div id="app">
        <div class="btn" v-tap.once="tapBtn">button</div>
    </div>
</template>
```
```JavaScript
export default {
    methods:{
        tapBtn(touchStartEvent, touchEndEvent){
            console.log('I run only once')
        }
    }
}
```

## Examples for stopPropagation situation

```html
<template>
    <div id="app" v-tap="tapApp">
        <div class="btn" v-tap.stop="tapBtn">button</div>
    </div>
</template>
```
```JavaScript
export default {
    methods:{
        tapBtn(touchStartEvent, touchEndEvent){
            console.log('I am first')
        },
        tapApp(touchStartEvent, touchEndEvent){
            console.log('I can not run when btn was clicked.')
        }
    }
}
```

## Touch is not supported, tap event is click event
```JavaScript
export default {
    methods:{
        tapBtn(touchStartEvent, touchEndEvent){
            console.log(touchStartEvent) //clickEvent
            console.log(touchEndEvent) //undefined
        }
    }
}
```

## Contact
The project's website is located at https://github.com/Haycher/vue-mobile-tap.git 
Author: Haycher, Lyu (spring_falling@163.com)