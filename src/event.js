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
            passive: modifiers.passive === undefined ? modifiers.passive : true   // 让 preventDefault() 失效,让tap事件响应更快
        }
    }else{
        return false;
    }
}

function handlerController(el, event, type){
    let tapEvent = el.__tapEvent;
    if(tapEvent.modifiers.stop){//stop标记位用于阻止事件冒泡
        event.stopPropagation();
    }
    if(type === 'touchstart'){
        let e = event.touches[0];
        tapEvent.startX = e.clientX;
        tapEvent.startY = e.clientY;
        tapEvent.touchstartEvent = event;
        tapEvent.startTime = new Date().getTime();
    }else if(type === 'touchend'){
        let e = event.changedTouches[0];
        tapEvent.endX = e.clientX;
        tapEvent.endY = e.clientY;
        const tapWidth = Math.abs(tapEvent.endX - tapEvent.startX)**2 + Math.abs(tapEvent.endY - tapEvent.startY)**2;
        const timeDiff = new Date().getTime() - tapEvent.startTime;
        if(tapWidth < 50 && timeDiff < 600){
            tapEvent.vueHandler({
                touchstartEvent: tapEvent.touchstartEvent,
                touchendEvent: event
            }, ...tapEvent.args);
            if(tapEvent.modifiers.once){
                unbind(el, 'touchstart', startHandler, tapEvent.modifiers)
                unbind(el, 'touchend', endHandler, tapEvent.modifiers)
            }
        }
    }else{
        tapEvent.vueHandler({
            clickEvent: event
        }, ...tapEvent.args);
        if(tapEvent.modifiers.once){
            unbind(el, 'click', clickHandler, tapEvent.modifiers)
        }
    }
}

function startHandler(event){
    handlerController(this, event, 'touchstart')
}

function endHandler(event){
    handlerController(this, event, 'touchend')
}

function clickHandler(event){
    handlerController(this, event, 'click')
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
        console.error('v-tap needs to bind a function or an array of which the first item is a function')
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