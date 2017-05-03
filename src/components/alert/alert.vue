<template>
    <modal :title="title"
           :borderRadius="borderRadius"
           :titleHeight="titleHeight"
           :width="width"
           :height="height"
           ref="modal">
        <div class="modal-alert">
            <p>
                {{ message }}
            </p>
            <div class="button-panel">
                <button @click="close">确认</button>
            </div>
        </div>
    </modal>
</template>
<script>
import modal from '../modal/modal.vue';
export default {

    components: { modal },

    data() {
        return {
            width: 400,
            height: 200
        }
    },
    props: {
        title: String,
        borderRadius: {
            type: Number,
            default: 8
        },
        titleHeight: {
            type: Number,
            default: 60
        },
        message: {
            type: String,
            default: '无消息!'
        }
    },
    methods: {
        open(){
            return this.$refs.modal.open();
        },
        close() {
            this.$refs.modal.close('sure');
        }
    }
}
</script>
