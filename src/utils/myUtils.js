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