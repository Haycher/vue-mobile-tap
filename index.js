import { bindFunction, unbindFunction } from './src/event'

export default {
    install(Vue){
        Vue.directive('tap', {
            bind: bindFunction,
            componentUpdated: bindFunction,
            unbind: unbindFunction
        });
    }
}

export {
    bindFunction,
    unbindFunction
}