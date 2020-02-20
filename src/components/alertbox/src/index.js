import Vue from 'vue';
import AlertBox from './AlertBox';

// 默认数据
const defaults = {
    type: 'warning',
    content: '提示内容',
    show: false,
    duration: '2000'
};

// 构建子类
const AlertBoxConstructor = Vue.extend(AlertBox);

// 添加关闭方法
AlertBoxConstructor.prototype._close = function () {
    let vm = this;
    // 显示关闭动画
    vm.show = false;

    vm.$el.addEventListener('transitionend', () => {
        // 清除子类实例的DOM
        if (vm.$el && vm.$el.parentNode) {
            vm.$el.parentNode.removeChild(vm.$el);
        }
        // 清除子类实例
        vm.$destroy();
    }, {once: true});
};

// $alert方法
export default function (option = {}) {
    if (this.$isServer) return;
    // 混合数据
    option = Object.assign(defaults, option);

    let body = document.body;

    // 创建子类实例
    let instance = new AlertBoxConstructor({
        // 挂在内存中新建的一个空div元素中
        el: document.createElement('div'),
        // 创建实例时用的数据
        data: option
    });
    // $el子类实例使用的根DOM元素
    body.appendChild(instance.$el);

    // 显示开启动画
    instance.show = true;

    // 设置关闭定时器
    setTimeout(function () {
        // 调用子类实例的关闭方法
        instance._close();
    }, option.duration);
};