<template>
  <modal :title="title"
         :borderRadius="borderRadius"
         :titleHeight="titleHeight"
         :background="background"
         :width="width"
         :height="height"
         src=""
         ref="modal">
    <div class="vue-alert">
      <div class="vue-alert-message"
           :style="messageStyle">
        <table>
          <tr>
            <td>{{ message }}</td>
          </tr>
        </table>
      </div>
      <div class="vue-alert-button-panel"
           :style="buttonPanelStyle">
        <button v-for="button in buttons"
                @click="close(button.cmd)"
                :class="button.cls"
                v-text="button.txt"></button>
      </div>
    </div>
  </modal>
</template>
<script>
import modal from '../modal/modal.vue'
export default {

  components: { modal },

  props: {
    title: String,
    background: {
      type: String,
      default: 'white'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
    borderRadius: {
      type: Number,
      default: 8
    },
    titleHeight: {
      type: Number,
      default: 60
    },
    bottomHeight: {
      type: Number,
      default: 60
    },
    message: {
      type: String,
      default: '无消息!'
    },
    buttons: {
      type: Array,
      default () {
        return [
          { cls: 'sure', cmd: 'sure', txt: '确认' }
        ]
      }
    }
  },
  computed: {
    messageStyle () {
      return {
        height: this.height - this.titleHeight - this.bottomHeight + 'px'
      }
    },
    buttonPanelStyle () {
      return {
        height: this.bottomHeight + 'px',
        lineHeight: this.bottomHeight + 'px'
      }
    }
  },
  methods: {
    open () {
      return this.$refs.modal.open()
    },
    close (cmd) {
      this.$refs.modal.close(cmd)
    }
  }
}
</script>
<style lang="sass">
.vue-alert {
    height: 100%;
    position: relative;
    .vue-alert-message {
        table {
            table-layout: fixed;
            height: 100%;
            width: 100%;
            td {
                padding: 0 20px;
                text-indent: 32px;
            }
        }
    }

    .vue-alert-button-panel {
        text-align: right;
        padding: 0 20px;
    }
}
</style>
