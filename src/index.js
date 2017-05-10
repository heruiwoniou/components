import Vue from 'vue/dist/vue.js'
import * as d3 from 'd3'
import Lodash from 'lodash'
import {Modal, close} from './components/modal'
import {Alert, Confirm} from './components/message'
/**
 * @namespace {Object} WebApi
 */
window.Vue = Vue
window.d3 = d3.__moduleExports
window._ = Lodash
export default {
  modal: Modal,
  close: close,
  alert: Alert,
  confirm: Confirm
}
