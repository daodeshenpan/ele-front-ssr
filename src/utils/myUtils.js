export const setLocalStorage = (key, value) => {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = key => {
    if (!key) return;
    return JSON.parse(localStorage.getItem(key));
};

export const removeLocalStorage = key => {
    if (!key) return;
    localStorage.removeItem(key);
};

export const throttle = (callback, delay) => {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(callback, delay);
    }
};
/**
 * 最后一个子元素滑动到视口的最下方时加载
 * @param element
 * @param offset {number} 视口到浏览器最下方的差值
 * @returns {boolean}
 */
export const checkLoad = (element, offset = 0) => {
    // 最后一个子元素
    let lastChild = element.children[element.children.length - 1];
    // 最后一个子元素距离文档顶部的距离
    let lastChildOffsetTop = accumulateOffsetTop(lastChild);

    return lastChildOffsetTop + offset < element.parentElement.clientHeight + element.parentElement.scrollTop;
};

export const accumulateOffsetTop = (element) => {
    let offsetTop = element.offsetTop;
    while ((element = element.offsetParent)) {
        offsetTop += element.offsetTop;
    }
    return offsetTop;
}

function compatibleScrollTop() {
    if (window.scrollY) {
        return window.scrollY;
    } else if (window.pageYOffset) {
        return window.pageYOffset;
    } else if (document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    } else if (document.body.scrollTop) {
        return document.body.scrollTop;
    }
}

export const addBufferMotion = (element, object, factor, interval, callback) => {
    clearInterval(element.timer);
    element.timer = setInterval(function () {
        var flag = true, key, value = 0, target = 0, step = 0;
        for (key in object) {
            if (key === 'opacity') {
                value = parseFloat(window.getComputedStyle(element).opacity) * 100;
                target = parseFloat(object.opacity) * 100;
            } else if (key === 'scrollTop') {
                value = element.scrollTop;
                target = parseInt(object.scrollTop);
            } else {
                value = parseInt(window.getComputedStyle(element)[key]);
                target = parseInt(object[key]);
            }
            step = target > value ? Math.ceil((target - value) * factor) : Math.floor((target - value) * factor);
            if (key === 'opacity') {
                element.style.opacity = (value + step) / 100;
            } else if (key === 'scrollTop') {
                element.scrollTop = value + step;
            } else if (key === 'zIndex') {
                element.style.zIndex = target;
            } else {
                element.style[key] = value + step + 'px';
            }
            if (Math.round(value) !== Math.round(target)) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timer);
            for (key in object) {
                if (key === 'opacity' || key === 'zIndex') {
                    element.style[key] = parseFloat(object[key]);
                } else if (key === 'scrollTop') {
                    element.scrollTop = parseFloat(object.scrollTop);
                } else {
                    element.style[key] = parseFloat(object[key]) + 'px';
                }
            }
            callback && callback();
        }
    }, interval)
}