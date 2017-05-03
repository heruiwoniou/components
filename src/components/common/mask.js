export let maskManager = {
    zIndex: 5000,
    masks: [],
    mask: null,
    setDom() {
        if (!!!this.mask) {
            this.mask = document.createElement('div');
            this.mask.className = 'vue-mask';
        }
        if (document.querySelector('.vue-mask') == null) 
            document.body.appendChild(this.mask);
        this.mask.style.zIndex = this.zIndex + this.masks.length * 2 - 1;
    },
    setIndex(el, state) {
        el.style ?  el.style.zIndex = this.zIndex + this.masks.length * 2 - (state ? 1 : 0) :  undefined;
    },
    create(o) {
        this.setDom();
        this.masks.push(o._uid);
        this.setIndex(this.mask, true);
        this.setIndex(o.$el);
    },
    remove(o) {
        this.masks.splice(_.chain(this.masks).findIndex(o => o.id == o._uid).value(), 1);
        if(this.masks.length != 0){
            this.setIndex(this.mask, true);
        }else{
            this.mask.parentNode.removeChild(this.mask);
        }
    }
}
export default {
    data() {
        return {visible: false, zIndex: 0}
    },
    beforeDestroy() {
        this.$emit('beforeDestroy');
    },
    methods : {
        open() {
            return new Promise((resolve, reject) => {
                var handler = ()=>{
                    this.visible = true;
                    this.resolve = resolve;
                    this.reject = reject;
                    maskManager.create(this);
                    if(this.afterOpen) this.afterOpen();
                };
                if(this.beforeOpen) this.beforeOpen().then(handler);
                else handler()
            })
        },
        close(cmd) {
            var handler = ()=> {
                this.visible = false;
                maskManager.remove(this);
                var end = ()=>{
                    this.resolve(cmd);
                }
                if(this.afterClose) this.afterClose().then(end);
                else end();
            }
            if(this.beforeClose) this.beforeClose().then(handler);
            else handler();
        }
    }
}