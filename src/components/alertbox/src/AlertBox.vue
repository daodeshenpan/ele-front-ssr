<template>
    <transition name="fade-in-out">
        <div class="alert-box"
             v-show="show">
            <i class="alert-box-header el-icon-warning-outline" v-if="type === 'warning'"></i>
            <i class="alert-box-header el-icon-circle-check" v-if="type === 'success'"></i>
            <p class="alert-box-content">{{content}}</p>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "AlertBox",
        props: {
            show: Boolean,
            type: String,
            content: String
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    .alert-box {
        @include fixed(50%, 50%);
        @include size(45%);
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, .7);
        border-radius: 5px;
        text-align: center;
        color: #fff;
        z-index: 9;
    }

    .alert-box-header {
        margin-top: 10%;
        padding: 0 5%;
        font-size: 2rem;
    }

    .alert-box-content {
        font-size: .75rem;
        margin: 10% 0;
        padding: 0 5%;
    }
</style>