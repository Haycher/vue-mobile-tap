const touchSupport = !!document && 'ontouchend' in document;
const passiveSupport = checkPassive();

function checkPassive(){//检测浏览器是否支持passive
    let support = false;
    try{
        var option = Object.defineProperty({},'passive',{
            get(){
                return support = true;
            }
        });
        window.addEventListener('passive-test', null, option);
    }catch(e){
        console.log(e);
    }
    return support;
}

function bind(el, eventName, handler, modifiers){
    el.addEventListener(eventName, handler, getOptions(modifiers));
}

function unbind(el, eventName, handler, modifiers){
    el.removeEventListener(eventName, handler, getOptions(modifiers));
}

function getOptions(modifiers){
    if(passiveSupport) {
        return {
            capture: false, // 冒泡阶段触发
            once: modifiers.once || false,    // 是否单次监听
            passive: modifiers.passive === undefined ? modifiers.passive : true   // 让阻止默认行为(preventDefault()) 失效
        }
    }else{
        return false;
    }
}

function Init(vueHandler, modifiers){
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.doOnce = false;
    this.startEvent = null;
    this.startHandler = function(event){
        if(modifiers.stop){
            event.stopPropagation();
        }
        this.startEvent = event;
        let e = event.touches[0];
        this.startX = e.clientX;
        this.startY = e.clientY;
    }
    this.endHandler = function(event){
        if(!passiveSupport && modifiers.once && this.doOnce){
            return;
        }
        if(modifiers.stop){
            event.stopPropagation();
        }
        let e = event.changedTouches[0];
        this.endX = e.clientX;
        this.endY = e.clientY;
        if(Math.sqrt(this.endX - this.startX) + Math.sqrt(this.endY - this.startY) < 50){
            this.doOnce = true;
            vueHandler(this.startEvent, event);
        }
    }
    this.clickHandler = function(event){
        if(!passiveSupport && modifiers.once && this.doOnce){
            return;
        }
        if(modifiers.stop){
            event.stopPropagation();
        }
        this.doOnce = true;
        vueHandler(event);
    }
}


function bindFunction(el, binding){
    let vueHandler = binding.value || function (){};
    el.__tapEvent = new Init(vueHandler, binding.modifiers)
    if(touchSupport){
        bind(el, 'touchstart', el.__tapEvent.startHandler, binding.modifiers)
        bind(el, 'touchend', el.__tapEvent.endHandler, binding.modifiers)
    }else{
        bind(el, 'click', el.__tapEvent.clickHandler, binding.modifiers)
    }
}

function unbindFunction(el, binding){
    if(touchSupport){
        unbind(el, 'touchstart', el.__tapEvent.startHandler, binding.modifiers)
        unbind(el, 'touchend', el.__tapEvent.endHandler, binding.modifiers)
    }else{
        unbind(el, 'click', el.__tapEvent.clickHandler, binding.modifiers)
    }
}

export {
    bindFunction,
    unbindFunction
}