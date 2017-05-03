import Vue from 'vue/dist/vue.js';
import _ from 'lodash';
import messageBase from './Message.vue';
let MessageConstructor = Vue.extend(messageBase);
let alerts = {};

function AlertFactory(options = {}) {
    let instance;
    let defaultOptions = _.assign({
        name: Math.round(Math.random() * 1000),
        message: '',
        title: '消息',
        width: 400,
        height: 200,
        background:'white',
        titleHeight: 60,
        bottomHeight: 60,
        borderRadius: 8
    }, _.isPlainObject(options)
        ? options
        : {
            message: options
        });
    instance = new MessageConstructor({
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
function ConfirmFactory(options = {}) {
    let instance;
    let defaultOptions = _.assign({
        name: Math.round(Math.random() * 1000),
        message: '',
        title: '消息',
        width: 400,
        height: 200,
        background:'white',
        titleHeight: 60,
        bottomHeight: 60,
        borderRadius: 8,
        buttons:[
            { cls: 'sure', cmd: 'sure', txt: '确认' },
            { cls: 'cancel', cmd: 'cancel', txt: '取消' }
        ]
    }, _.isPlainObject(options)
        ? options
        : {
            message: options
        });
    instance = new MessageConstructor({
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

export const Alert = AlertFactory;
export const Confirm = ConfirmFactory;