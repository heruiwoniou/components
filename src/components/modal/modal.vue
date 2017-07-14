<template>
  <div class="vue-modal">
    <div class="vue-modal-container" :style="styleContainer">
      <div class="vue-modal-content-background" :style="contentBackground">
        <div class="vue-modal-title" :style="styleTitle" ref="title">
          {{ title }}
          <a class="normal" v-if="resize && !status" href="javascript:;" :style="styleTitleFullToggle" @click="statusSwitch"></a>
          <a class="full" v-if="resize && status" href="javascript:;" :style="styleTitleFullToggle" @click="statusSwitch"></a>
          <a class="close" href="javascript:;" :style="styleTitleClose" @click="close">
            <svg height="100%" width="100%" :viewbox="'0 0' + closeIconSize + ' ' + closeIconSize ">
              <g>
                <path fill="none" stroke-width="2" stroke="#161616" :d="'M0,0L' + closeIconSize + ',' + closeIconSize"></path>
                <path fill="none" stroke-width="2" stroke="#161616" :d="'M' + closeIconSize + ',0L0,' + closeIconSize"></path>
              </g>
            </svg>
          </a>
        </div>
        <div class="vue-modal-status" :style="styleContent" v-show="moving">
          <svg t="1493353365923" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="20%" fill="rgba(0,0,0,.1)">
            <path d="M507.723027 639.47369C576.326639 639.47369 638.176327 582.659169 638.176327 512.574903 638.176327 442.490637 576.326639 385.676112 507.723027 385.676112 439.119415 385.676112 383.505198 442.490635 383.505198 512.574901 383.505198 582.659166 439.119415 639.47369 507.723027 639.47369Z" p-id="5967"></path>
            <path d="M333.10379 257.010049C320.464977 242.392432 318.039349 213.583993 330.933492 198.647214L482.381569 11.362984C495.339544-3.637628 516.021238-3.829125 528.91538 11.043822L690.840233 199.413203C703.734375 214.03082 703.734375 242.137102 690.840233 257.010049L333.10379 257.010049Z" p-id="5968"></path>
            <path d="M691.23233 771.300256C703.998808 782.024097 703.871143 804.480415 691.23233 815.204256L531.213346 1013.339991C518.255371 1024 497.701342 1024 484.934864 1013.339991L333.955618 815.204256C321.18914 804.480415 321.18914 782.151762 333.955618 771.427921L691.23233 771.300256Z" p-id="5969"></path>
            <path d="M825.863653 338.950803 1013.147882 486.148292C1028.084661 499.553093 1028.33999 521.319938 1013.530876 534.660907L825.352994 688.560797C810.799209 701.774101 783.580025 702.029431 768.770911 688.560797L768.770911 338.567816C768.770911 338.567816 810.990706 325.546001 825.863653 338.950803Z" p-id="5970"></path>
            <path d="M256.661324 691.369415C242.043707 704.710385 212.753558 704.582726 198.135941 691.369422L10.979377 534.405578C-3.702072 520.936944-3.702072 499.361596 11.234707 485.892962L196.859294 335.440022C211.476911 322.226717 241.979878 322.099048 256.661328 335.440017L256.661324 691.369415Z" p-id="5971"></path>
          </svg>
        </div>
        <div class="vue-modal-content" v-if="src!=''" v-show="!moving" :style="styleContent" ref="contentIframe">
          <iframe :src="src" frameborder="0" :style="iframeStyle"></iframe>
        </div>
        <div class="vue-modal-content content-element" v-if="src==''" v-show="!moving" :style="styleContent" ref="contentElement">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="vue-modal-background"></div>
  </div>
</template>
<script>
import mask from '../common/mask.js'
import draggable from '../common/draggable.js'
export default {
  mixins: [mask],
  data() {
    return {
      status: true, // true : normal , false : full

      distance: 10,
      offsetLeft: 0,
      offsetTop: 0,
      baseWidth: 50,
      baseHeight: 50,
      screenWidth: 0,
      screenHeight: 0,
      closeIconMinSize: 20,
      moving: false,
      moveOffset: {
        x: 0,
        y: 0
      },
      defaultWidth: 0,
      defaultHeight: 0
    }
  },

  props: {
    title: String,
    width: Number,
    height: Number,
    resize: {
      type: Boolean,
      defaualt: false
    },
    padding: {
      type: Object,
      default() {
        return {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      }
    },
    borderRadius: {
      type: Number,
      default: 8
    },
    draggable: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Object,
      default: function () {
        return {
          left: 0,
          top: 0
        }
      }
    },
    titleHeight: {
      type: Number,
      default: 60
    },
    titleAlign: {
      type: String,
      default: 'left'
    },
    closeIconSize: {
      type: Number,
      default: 20
    },
    background: {
      default: 'white',
      type: String
    },
    backgroundImage: {
      default: 'white',
      type: String
    },
    src: {
      default: 'about:blank;',
      type: String
    }
  },

  created() {
    this.closeIconSize = (this.closeIconSize < this.closeIconMinSize ? this.closeIconSize : this.closeIconMinSize)
    this.defaultWidth = this.width
    this.defaultHeight = this.height
  },
  mounted() {
    if (this.draggable) this.$nextTick(() => this.bindMove(this.$refs.title))
    this.resizeEvt = 'orientationchange' in window
      ? 'orientationchange'
      : 'resize'
    this.svgResizeHandler = this.svgResize.bind(this)
    window.addEventListener(this.resizeEvt, this.svgResizeHandler, false)
    this.$nextTick(this.svgResizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener(this.resizeEvt, this.svgResizeHandler)
  },
  computed: {
    styleTitleFullToggle() {
      let w = this.closeIconSize
      let d = (this.titleHeight - this.closeIconSize) / 2
      return {
        height: w + 'px',
        width: w + 'px',
        top: d + 'px',
        right: 2.5 * d + 'px'
      }
    },
    styleTitleClose() {
      let w = this.closeIconSize
      let d = (this.titleHeight - this.closeIconSize) / 2
      return {
        height: w + 'px',
        width: w + 'px',
        top: d + 'px',
        right: d + 'px'
      }
    },
    contentBackground() {
      return {
        backgroundImage: this.backgroundImage
      }
    },
    iframeStyle() {
      return {
        width: this.width - this.offset.left - this.padding.left - this.padding.right + 'px',
        height: this.height - this.titleHeight - this.offset.top - this.padding.top - this.padding.bottom + 'px',
        marginLeft: this.offset.left + 'px',
        marginTop: this.offset.top + 'px'
      }
    },
    styleTitle() {
      var i = this.resize ? 2 : 1
      return {
        height: this.titleHeight + 'px',
        paddingRight: this.titleHeight * i - (i - 1) * 1 / 3 * this.titleHeight - (i - 1) * 1 / 6 * this.titleHeight + 'px',
        lineHeight: this.titleHeight + 'px',
        textAlign: this.titleAlign,
        paddingLeft: (this.titleAlign === 'center' ? this.titleHeight : 30) + 'px'
      }
    },
    styleContent() {
      return {
        height: this.height - this.titleHeight - this.padding.top - this.padding.bottom + 'px',
        width: this.width - this.padding.left - this.padding.right + 'px'
      }
    },
    styleContainer() {
      return {
        height: this.height + 'px',
        width: this.width + 'px',
        marginLeft: (-this.width / 2 + this.moveOffset.x) + 'px',
        marginTop: (-this.height / 2 + this.moveOffset.y) - this.topOffset + 'px',
        paddingTop: this.padding.top + 'px',
        paddingRight: this.padding.right + 'px',
        paddingBottom: this.padding.bottom + 'px',
        paddingLeft: this.padding.left + 'px'
      }
    },
    runtimeWidth() {
      return this.width
    },
    runtimeHeight() {
      return this.height
    },
    topOffset() {
      var offset = this.screenHeight * 0.1
      return (this.screenHeight - this.height) / 2 - offset < 0 ? 0 : offset
    }
  },
  methods: {
    gPath({ width, height, normal = false, outer = false, topOffset }) {
      var wd = (width - 2 * this.borderRadius) / 3
      var hd = (height - 2 * this.borderRadius) / 3
      var d = normal ? 0 : ((outer ? -1 : 1) * this.distance)
      var dd = -1 * d
      topOffset = (topOffset === undefined ? this.topOffset : topOffset)
      return `M${(this.screenWidth - width) / 2} ${((this.screenHeight - height) / 2 - topOffset + this.borderRadius)}` +
        `q0,${-this.borderRadius} ${this.borderRadius},${-this.borderRadius}` +
        `c${wd},${d} ${wd * 2},${d} ${wd * 3},0` +
        `q${this.borderRadius},0 ${this.borderRadius},${this.borderRadius}` +
        `c${dd},${hd}, ${dd},${hd * 2} ,0,${hd * 3}` +
        `q0,${this.borderRadius} ${-this.borderRadius},${this.borderRadius}` +
        `c-${wd},${dd} -${wd * 2},${dd} -${wd * 3},0` +
        `q${-this.borderRadius},0 ${-this.borderRadius},${-this.borderRadius}` +
        `c${d},-${hd} ${d},-${hd * 2}, 0,-${hd * 3}`
    },
    svgResize() {
      var el = this.$el.querySelector('.vue-modal-background')
      this.screenWidth = el.offsetWidth
      this.screenHeight = el.offsetHeight

      if (this.status) {
        // when window's width less than width of modal
        if (this.screenWidth < this.defaultWidth || this.screenHeight < this.defaultHeight) {
          if (this.screenWidth < this.defaultWidth) {
            this.width = this.screenWidth
          } else {
            this.width = this.defaultWidth
          }
          if (this.screenHeight < this.defaultHeight) {
            this.height = this.screenHeight
          } else {
            this.height = this.defaultHeight
          }
          // window's width greater than width of modal
        } else {
          this.width = this.defaultWidth
          this.height = this.defaultHeight
        }
      } else {
        this.width = this.screenWidth
        this.height = this.screenHeight
      }

      // through the change of width to calc moveOffset
      if (this.screenWidth / 2 < this.width / 2 + Math.abs(this.moveOffset.x)) {
        this.moveOffset.x = 0
      }
      if (this.screenHeight / 2 < this.height / 2 + Math.abs(this.moveOffset.y) + Math.abs(this.topOffset)) {
        this.moveOffset.y = 0
      }


      this.svg
        .attr('width', this.screenWidth)
        .attr('height', this.screenHeight)
      this.path
        .attr('d', this.gPath({
          width: this.runtimeWidth, height: this.runtimeHeight, normal: true
        }))

      this.translateSVG()
    },
    svgAnimateStart() {
      var el = this.$el.querySelector('.vue-modal-background')
      this.screenWidth = el.offsetWidth
      this.screenHeight = el.offsetHeight
      this.svg = window.d3.select(el).append('svg')
        .attr('width', this.screenWidth)
        .attr('height', this.screenHeight)
      this.g = this.svg.append('g')
      this.path = this.g.append('path')
      this.svgAnimateOpen()
    },
    svgAnimateOpen() {
      this.path.attr('fill', this.background)
        .attr('d', this.gPath({ width: this.baseWidth, height: this.baseHeight, normal: true }))
        .style('opacity', '0')
        .transition()
        .duration(100)
        .attr('d', this.gPath({ width: this.baseWidth, height: this.baseHeight, normal: false, outer: false }))
        .transition()
        .delay(100)
        .duration(200)
        .ease(window.d3.easeExpIn)
        // .duration(500)
        // .ease(d3.easeElasticOut)
        .style('opacity', '1')
        .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: true }))
      setTimeout(() => {
        this.$el.className = 'vue-modal is-show'
      }, 400)
    },
    svgAnimateFull() {
      this.$el.className = 'vue-modal'
      return new Promise((resolve, reject) => {
        this.path
          .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: true }))
          .transition()
          .duration(100)
          .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: false, outer: false }))
          .transition()
          .delay(100)
          .duration(200)
          .ease(window.d3.easeExpOut)
          .attr('d', this.gPath({ width: this.screenWidth, height: this.screenHeight, normal: true, topOffset: 0 }))
        this.g
          .transition()
          .delay(200)
          .duration(200)
          .ease(window.d3.easeExpOut)
          .attr('transform', 'translate(0, 0)')
        setTimeout(() => {
          this.width = this.screenWidth
          this.height = this.screenHeight
          this.moveOffset.x = 0
          this.moveOffset.y = 0
          this.$el.className = 'vue-modal is-show'
          resolve()
        }, 300)
      })
    },
    svgAnimateNormal() {
      this.$el.className = 'vue-modal'
      var offset = this.screenHeight * 0.1
      var topOffset = (this.screenHeight - this.defaultHeight) / 2 - offset < 0 ? 0 : offset
      return new Promise((resolve, reject) => {
        this.path
          .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: true }))
          .transition()
          .duration(100)
          .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: false, outer: true }))
          .transition()
          .delay(100)
          .duration(200)
          .ease(window.d3.easeExpOut)
          .attr('d', this.gPath({ width: this.defaultWidth, height: this.defaultHeight, normal: true, topOffset }))
        setTimeout(() => {
          this.width = this.defaultWidth
          this.height = this.defaultHeight
          this.$el.className = 'vue-modal is-show'
          resolve()
        }, 300)
      })
    },
    svgAnimateEnd() {
      return new Promise((resolve, reject) => {
        this.path
          .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: true }))
          .transition()
          .duration(100)
          .attr('d', this.gPath({ width: this.runtimeWidth, height: this.runtimeHeight, normal: false, outer: true }))
          .transition()
          .delay(100)
          .duration(200)
          .ease(window.d3.easeExpOut)
          .style('opacity', '0')
          .attr('d', this.gPath({ width: this.baseWidth, height: this.baseHeight, normal: true }))
        setTimeout(() => {
          resolve()
        }, 300)
      })
    },
    translateSVG() {
      this.g.attr('transform', 'translate(' + this.moveOffset.x + ',' + this.moveOffset.y + ')')
    },
    statusSwitch() {
      this.status = !this.status
      if (this.status) {
        this.svgAnimateNormal()
      } else {
        this.svgAnimateFull()
      }
    },
    afterOpen() {
      return this.svgAnimateStart()
    },
    beforeClose() {
      this.$el.className = 'vue-modal'
      return this.svgAnimateEnd()
    },
    bindMove(el) {
      var dx,
        dy,
        ox,
        oy,
        maxw,
        maxh,
        minw,
        minh,
        movetimes,
        dh
      if (!el || !this.status) {
        return
      }
      draggable(el, {
        start: (e) => {
          movetimes = 0
          dh = document.documentElement.offsetHeight
          ox = this.moveOffset.x
          oy = this.moveOffset.y
          dx = e.pageX - ox
          dy = e.pageY - oy
          maxw = (document.documentElement.offsetWidth - this.width) / 2
          maxh = (dh - this.height) / 2 + this.topOffset
          minw = -1 * maxw
          minh = -1 * (dh - this.height) / 2 + this.topOffset
        },
        drag: (e) => {
          if (movetimes > 1) {
            this.moving = true
            if (e.pageX - dx < minw) {
              this.moveOffset.x = minw
            } else if (e.pageX - dx > maxw) {
              this.moveOffset.x = maxw
            } else {
              this.moveOffset.x = (e.pageX - dx)
            }
            if (e.pageY - dy < minh) {
              this.moveOffset.y = minh
            } else if (e.pageY - dy > maxh) {
              this.moveOffset.y = maxh
            } else {
              this.moveOffset.y = (e.pageY - dy)
            }
            this.translateSVG()
          } else {
            movetimes++
          }
        },
        end: () => {
          this.moving = false
        }
      })
    }
  }
}
</script>
<style lang="sass">
    html,
    body{
      height: 100%;
      padding: 0;
      margin: 0;
    }
    .vue-modal {
      *{
        box-sizing: border-box;   
      }
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .vue-modal-content-background{
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
      }
      .vue-modal-container{
        position:absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
      }
      .vue-modal-title{
        font-size: 18px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #161616;
        font-weight: bold;
        a{
          position: absolute;
          transition: transform .2s cubic-bezier(0.2,1,0.3,1); 
          &.close{
            transform: scale3d(0, 0, 0);
            font-size: 0;
            svg{
              display: inline-block;
              vertical-align: top;
            }
         }
          &.full{
            transform: scale3d(0, 0, 0);
            border: 2px solid #161616;
            border-radius: 2px;
          }
          &.normal{
            transform: scale3d(0, 0, 0);
            border-bottom: 2px solid #161616;
            border-radius: 2px;
          }
        }
      }
      .vue-modal-status{
        white-space: nowrap;
        text-align: center;
        &:before{
          content: '';
          height: 100%;
          width: 1px;
          display: inline-block;
          vertical-align: middle;
        }
        svg{
          display:inline-block;
        }
      }
      .vue-modal-content{
        overflow: hidden;
      }
      .vue-modal-content-background,
      .vue-modal-title,
      .vue-modal-content{
        opacity: 0;
        transition: opacity .2s ease-out;
      }
      &.is-show{
        .vue-modal-title,
        .vue-modal-content{
          opacity: 1;
        }
        .vue-modal-content-background{
          opacity: 1;
        }
        .vue-modal-title a.close{
          transform: scale3d(1, 1, 1);
        }
        .vue-modal-title a.full,.vue-modal-title a.normal{
          transform: scale3d(1, 1, 1);
        }
      }
      .vue-modal-background{
        position:fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
    .vue-mask {
      position:fixed;
      top: 0;
      left:0;
      bottom:0;
      right:0;
      background: black;
      opacity: .1;
    }
</style>
