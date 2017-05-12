import messageBase from './Message.vue'
let MessageConstructor = Vue.extend(messageBase)
let alerts = {}

/**
 * alert message
 * @function alert
 * @memberof WebApi
 * @param {Object/String} options - alert参数对象/消息
 * @param {string} options.title - 标题
 * @param {number} options.width - 宽度
 * @param {number} options.height - 高
 * @param {number} options.titleHeight - 标题高
 * @param {string} options.background - 背景
 * @param {number} options.message - 消息内容
 * @param {number} options.borderRadius - 圆角
 * @param {number} options.bottomHeight - 底部按钮框高度
 * @return {promise} promise - promise.then(resolve,reject)
 */
function AlertFactory (options = {}) {
  let instance
  let defaultOptions = _.defaultsDeep(_.isPlainObject(options)
    ? options
    : {
      message: options
    }, {
      name: Math.round(Math.random() * 1000),
      message: '',
      title: '消息',
      width: 400,
      height: 200,
      background: 'white',
      titleHeight: 60,
      bottomHeight: 60,
      borderRadius: 8
    })
  instance = new MessageConstructor({
    el: document.createElement('div'),
    propsData: defaultOptions
  })
  document
    .body
    .appendChild(instance.$el)
  alerts[defaultOptions.name] = instance

  return new Promise(function (resolve, reject) {
    instance
      .open()
      .then(function (cmd) {
        instance
          .$el
          .parentNode
          .removeChild(instance.$el)
        instance.$destroy()
        delete alerts[defaultOptions.name]
        resolve(cmd)
      })
  })
}

/**
 * confirm message
 * @function confirm
 * @memberof WebApi
 * @param {Object/String} options - confirm参数对象/消息
 * @param {string} options.title - 标题
 * @param {number} options.width - 宽度
 * @param {number} options.height - 高
 * @param {number} options.message - 消息内容
 * @param {number} options.bottomHeight - 底部按钮框高度
 * @param {number} options.titleHeight - 标题高
 * @param {string} options.background - 背景
 * @param {number} options.borderRadius - 圆角
 * @return {promise} promise - promise.then(resolve,reject)
 */
function ConfirmFactory (options = {}) {
  let instance
  let defaultOptions = _.assign({
    name: Math.round(Math.random() * 1000),
    message: '',
    title: '消息',
    width: 400,
    height: 200,
    background: 'white',
    titleHeight: 60,
    bottomHeight: 60,
    borderRadius: 8,
    buttons: [
      {
        cls: 'sure',
        cmd: 'sure',
        txt: '确认'
      }, {
        cls: 'cancel',
        cmd: 'cancel',
        txt: '取消'
      }
    ]
  }, _.isPlainObject(options)
    ? options
    : {
      message: options
    })
  instance = new MessageConstructor({
    el: document.createElement('div'),
    propsData: defaultOptions
  })
  document
    .body
    .appendChild(instance.$el)
  alerts[defaultOptions.name] = instance

  return new Promise(function (resolve, reject) {
    instance
      .open()
      .then(function (cmd) {
        instance
          .$el
          .parentNode
          .removeChild(instance.$el)
        instance.$destroy()
        delete alerts[defaultOptions.name]
        resolve(cmd)
      })
  })
}

export const Alert = AlertFactory
export const Confirm = ConfirmFactory
