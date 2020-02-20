<template>
    <div id="app">
        <transition :name="$route.meta.transitionName">
            <keep-alive>
                <router-view/>
            </keep-alive>
        </transition>
        <transition name="fade-in-out">
            <tab-bar v-show="!$route.meta.fullPage"/>
        </transition>
    </div>
</template>

<script>
    import TabBar from '@/components/TabBar'

    export default {
        name: 'App',
        components: {
            TabBar
        },
        beforeMount() {
            this.$store.dispatch('fetchUserInfo');
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    html, body, #app {
        @include size(100%, 100%);
    }

    #app {
        background-color: $background;
    }
</style>
