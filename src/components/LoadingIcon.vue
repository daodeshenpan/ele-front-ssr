<template>
    <i class="el-icon-loading loading"></i>
</template>

<script>
    export default {
        name: "LoadingIcon"
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    .loading::before {
        @include absolute(50%, 50%);
        display: inline-block;
        animation: spin 1s linear 0s infinite;
    }

    @keyframes spin {
        0% {
            transform: translate(-50%, -50%) rotateZ(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotateZ(360deg);
        }
    }
</style>