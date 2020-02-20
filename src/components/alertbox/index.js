import alert from './src/index';

export default {
    install(Vue) {
        Vue.prototype.$alert = alert;
    },
};