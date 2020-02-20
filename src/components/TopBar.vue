<template>
    <header class="top-bar" :class="{right: !showBack && !$slots.left && $slots.right}">
        <slot name="left"></slot>
        <i class="el-icon-arrow-left top-bar-go-back"
           @tap="$router.go(-1)"
           v-if="showBack"></i>
        <span class="top-bar-title ellipsis">{{title}}</span>
        <slot name="right"></slot>
    </header>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "TopBar",
        props: {
            title: {
                type: String
            },
            showBack: {
                type: Boolean
            }
        },
        computed: mapState(['userInfo'])
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    .top-bar {
        @include size(100%, 1.95rem);
        @include fixed(0, 0);
        @include flex(row, space-between, center);

        background-color: $theme;
        color: #fff;
        padding: 0 .55rem 0 .4rem;
        box-sizing: border-box;
        z-index: 2;
    }

    .right{
        justify-content: flex-end;
    }

    .top-bar-go-back {
        font-size: 1.25rem;
    }

    .top-bar-title {
        @include size(50%);
        @include absolute(50%, 50%);
        transform: translate(-50%, -50%);
        font-size: 0.8rem;
        font-weight: bold;
        display: block;
        text-align: center;
    }

    .top-bar-login {
        font-size: 0.65rem;
    }
</style>