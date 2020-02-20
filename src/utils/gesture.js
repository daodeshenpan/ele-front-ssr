let startTime = 0, isMove = false;
let startX = 0, deltaX = 0, startY = 0, deltaY = 0;
let tapEvent = new Event('tap');
let swipeEvent = new Event('swipe');
let swipeendEvent = new Event('swipeend');

window.addEventListener('touchstart', (e) => {
    // tap
    startTime = Date.now();
    // swipe
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    let touchTime = Date.now() - startTime;
    // tap
    isMove = true;
    // swipe
    deltaX = e.touches[0].clientX - startX;
    deltaY = e.touches[0].clientY - startY;
    swipeEvent.$touches = e.touches;
    swipeEvent.$target = e.target;
    swipeEvent.$deltaX = deltaX;
    swipeEvent.$deltaY = deltaY;
    swipeEvent.$velocityX = deltaX / touchTime * 1000;
    swipeEvent.$velocityY = deltaY / touchTime * 1000;
    let element = e.target;
    do {
        element.dispatchEvent(swipeEvent);
    } while ((element = element.parentElement));
});

window.addEventListener('touchend', (e) => {
    let touchTime = Date.now() - startTime;
    // tap
    if (touchTime < 200 && !isMove) {
        tapEvent.$touches = e.changedTouches;
        tapEvent.$target = e.target;
        let element = e.target;
        do {
            element.dispatchEvent(tapEvent);
        } while ((element = element.parentElement));
    }
    // swipeend
    if (isMove) {
        swipeendEvent.$touches = e.changedTouches;
        swipeendEvent.$target = e.target;
        swipeendEvent.$deltaX = deltaX;
        swipeendEvent.$deltaY = deltaY;
        swipeendEvent.$velocityX = deltaX / touchTime * 1000;
        swipeendEvent.$velocityY = deltaY / touchTime * 1000;
        let element = e.target;
        do {
            element.dispatchEvent(swipeendEvent);
        } while ((element = element.parentElement));
    }
    // tap
    startTime = 0, isMove = false;
    // swipe
    startX = 0, deltaX = 0,startY = 0,deltaY = 0;
});