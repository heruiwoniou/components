import modalbase from './modal.vue'
let ModalConstructor = Vue.extend(modalbase)
let modals = {}
/**
 * create modal
 * @function modal
 * @memberof WebApi
 * @param {Object} options - 弹框参数对象
 * @param {string} options.name - 窗体名称
 * @param {string} options.title - 标题
 * @param {number} options.width - 宽度
 * @param {number} options.height - 高
 * @param {number} options.titleHeight - 标题高
 * @param {boolean} options.draggable - 是否可拖拽
 * @param {object} options.padding - 边距
 * @param {number} options.padding.top - 上边距
 * @param {number} options.padding.right - 右边距
 * @param {number} options.padding.bottom - 下边距
 * @param {number} options.padding.left - 左边距
 * @param {object} options.offset - iframe偏移属性
 * @param {number} options.offset.left - ifrmae左偏移
 * @param {number} options.offset.top - iframe上偏移
 * @param {number} options.borderRadius - 圆角
 * @param {number} options.closeIconSize - 关闭按钮尺寸
 * @param {string} options.background - 背景
 * @param {string} options.backgroundImage - 中间框背景
 * @param {string} options.src - 地址
 * @return {promise} promise - promise.then(resolve,reject)
 */
function ModalFactory (options = {}) {
  let instance
  let defaultOptions = _.defaultsDeep(options, {
    name: Math.round(Math.random() * 1000),
    title: '',
    width: document.documentElement.offsetWidth,
    height: document.documentElement.offsetHeight,
    titleHeight: 60,
    draggable: true,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    offset: {
      top: 0,
      left: 0
    },
    closeIconSize: 20,
    borderRadius: 8,
    background: 'rgba(255,255,255,1)',
    backgroundImage: 'rgba(255,255,255,1)',
    src: '',
    titleAlign: 'center'
  })
  if (modals[defaultOptions.name]) {
    console.error('已存在相同命名的弹框 ' + defaultOptions.name)
  }
  instance = new ModalConstructor({
    el: document.createElement('div'),
    propsData: defaultOptions
  })

  if (options.el) {
    instance.placeholder = document.createElement('div')
    instance.placeholder.id = 'placeholder-' + instance._uid
    options
      .el
      .parentNode
      .insertBefore(instance.placeholder, options.el)
    instance
      .$refs
      .contentElement
      .appendChild(options.el)
    options.el.style.display = 'block'
  }

  document
    .body
    .appendChild(instance.$el)

  modals[defaultOptions.name] = instance
  return new Promise(function (resolve, reject) {
    instance
      .open()
      .then(function (cmd) {
        instance
          .$el
          .parentNode
          .removeChild(instance.$el)
        if (instance.placeholder) {
          var content = instance.$refs.contentElement.children[0]
          content.style.display = 'none'
          instance
            .placeholder
            .parentNode
            .insertBefore(content, instance.placeholder)
          instance
            .placeholder
            .parentNode
            .removeChild(instance.placeholder)
        }
        instance.$destroy()
        delete modals[defaultOptions.name]
        resolve(cmd)
      })
  })
}

/**
 * close all/single modal
 * @function close
 * @memberof WebApi
 * @param {object/string} options/cmd - 参数对象(当为对象且含name时,将对指定name窗体进行关闭)
 * @param {string} options.name - 窗体名称
 * @param {any} options.cmd - 返回参数
 */
export function close (options) {
  if (options && options.name) {
    modals[options.name].close(options.cmd || '')
  } else {
    _
      .forEach(modals, function (value, key) {
        modals[key].close(options || undefined)
      })
  }
}

export const Modal = ModalFactory
