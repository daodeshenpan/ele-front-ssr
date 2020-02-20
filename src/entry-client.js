import Vue from 'vue';
import {createApp} from './app'

import '@/utils/rem'
import '@/utils/gesture'
import '@/assets/css/reset.css'
import '@/assets/css/base.scss'
import '@/assets/css/font.css'
import '@/assets/css/transition.css'

Vue.mixin({
    beforeMount() {
        const {asyncData} = this.$options;
        if (asyncData) {
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route
            });
        }
    }
});

Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const {asyncData} = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next)
        } else {
            next()
        }
    }
});

const {app, router, store} = createApp();

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
    app.$mount('#app');
});