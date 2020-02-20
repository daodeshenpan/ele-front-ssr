import Vue from 'vue'
import App from './App.vue'
import {createRouter} from './router/index'
import {createStore} from './store/index'
import {sync} from 'vuex-router-sync'

import alertBox from '@/components/alertbox/index'

Vue.use(alertBox);

Vue.filter('toFixed2', function (num) {
    if (typeof num === 'number') {
        return num.toFixed(2);
    }
});

export function createApp() {
    const router = createRouter();
    const store = createStore();

    sync(store, router);

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });

    return {app, router, store}
}