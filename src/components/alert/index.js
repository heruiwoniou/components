import Vue from 'vue/dist/vue.js';
import _ from 'lodash';
import alertbase from './alert.vue';
let alertConstructor = Vue.extend(alertbase);
let alerts = {};

function Alert(options = {}) {
    let instance;
    let defaultOptions = _.assign({
        name: Math.round(Math.random() * 1000),
        message: '',
        title: '消息',
        titleHeight: 60,
        borderRadius: 8
    }, _.isPlainObject(options)
        ? options
        : {
            message: options
        });
    instance = new alertConstructor({
        el: document.createElement('div'),
        propsData: defaultOptions
    });
    document
        .body
        .appendChild(instance.$el);
    alerts[defaultOptions.name] = instance;

    return new Promise(function (resolve, reject) {
        instance
            .open()
            .then(function (cmd) {
                instance
                    .$el
                    .parentNode
                    .removeChild(instance.$el);
                delete alerts[defaultOptions.name];
                resolve(cmd);
            });
    });
}

export default Alert