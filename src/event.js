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
            /**
             * 高版本的chrome浏览器当passive为true时，会使 event.preventDefault() 失效，使得 touch 事件响应更快
             * modifiers.prevent === true 会在事件handler中执行 event.preventDefault()；
             */
            passive: modifiers.prevent ? false : true
        }
    }else{
        return false;
    }
}

function analysisEvent(modifiers, event){
    //阻止 tap 事件向上冒泡
    if(modifiers.stop){
        event.stopPropagation();
    }

    //绑定 v-tap 指令的 Dom 对象如果在执行 tapHandler 之后会隐藏的话，有可能会触发该 Dom 下方的 Dom 所绑定的 click 事件
    //v-tap.prevent 会对 touchstart、touchend 事件执行 event.preventDefault(); 这样可以预防点透事件
    if(modifiers.prevent){
        event.preventDefault();
    }
}

function startHandler(event){
    let tapEvent = this.__tapEvent;
    analysisEvent(tapEvent.modifiers, event);
    tapEvent.touchstartEvent = event;
    let e = event.touches[0];
    tapEvent.startX = e.clientX;
    tapEvent.startY = e.clientY;
}

function endHandler(event){
    let tapEvent = this.__tapEvent;
    analysisEvent(tapEvent.modifiers, event);
    let e = event.changedTouches[0];
    tapEvent.endX = e.clientX;
    tapEvent.endY = e.clientY;
    const tapWidth = Math.abs(tapEvent.endX - tapEvent.startX)**2 + Math.abs(tapEvent.endY - tapEvent.startY)**2;
    const timeDiff = event.timeStamp - tapEvent.touchstartEvent.timeStamp;
    if(tapWidth < 80 && timeDiff < 600){
        tapEvent.vueHandler({
            touchstartEvent: tapEvent.touchstartEvent,
            touchendEvent: event
        }, ...tapEvent.args);
        if(tapEvent.modifiers.once){
            unbind(this, 'touchstart', startHandler, tapEvent.modifiers)
            unbind(this, 'touchend', endHandler, tapEvent.modifiers)
        }
    }
}

function clickHandler(event){
    let tapEvent = this.__tapEvent;
    analysisEvent(tapEvent.modifiers, event);
    tapEvent.vueHandler({
        clickEvent: event
    }, ...tapEvent.args);
    if(tapEvent.modifiers.once){
        unbind(this, 'click', clickHandler, tapEvent.modifiers)
    }
}

function bindFunction(el, binding){
    const bindType = typeof binding.value;
    el.__tapEvent = {
        modifiers: binding.modifiers,
        args: []
    }
    if(bindType === 'function'){
        el.__tapEvent.vueHandler = binding.value;
    }else if(Object.prototype.toString.call(binding.value) === '[object Array]'){
        el.__tapEvent.vueHandler = binding.value[0];
        for (let i = 1; i < binding.value.length; i++) {
            const arg = binding.value[i];
            el.__tapEvent.args.push(arg);
        }
    }else{
        el.__tapEvent.vueHandler = function (){};
        console.error('v-tap needs to bind a handler or an array of which the first item is a handler')
    }
    if(touchSupport){
        bind(el, 'touchstart', startHandler, binding.modifiers)
        bind(el, 'touchend', endHandler, binding.modifiers)
    }else{
        bind(el, 'click', clickHandler, binding.modifiers)
    }
}

function unbindFunction(el, binding){
    if(touchSupport){
        unbind(el, 'touchstart', startHandler, binding.modifiers)
        unbind(el, 'touchend', endHandler, binding.modifiers)
    }else{
        unbind(el, 'click', clickHandler, binding.modifiers)
    }
}

export {
    bindFunction,
    unbindFunction
}