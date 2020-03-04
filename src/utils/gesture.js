let startTime = 0, isMove = false;
let startX = 0, deltaX = 0, startY = 0, deltaY = 0;
let durationStep = 200;
let deltaXArray = [0], deltaYArray = [0], durationIndex = 0;

let tapEvent = new Event('tap');
let swipeEvent = new Event('swipe');
let swipeendEvent = new Event('swipeend');

document.addEventListener('touchstart', (e) => {
    // reassign
    startTime = 0, isMove = false;
    startX = 0, deltaX = 0, startY = 0, deltaY = 0;
    deltaXArray.length = 1, deltaYArray.length = 1 , durationIndex = 0;
    // tap
    startTime = Date.now();
    // swipe
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}, {passive: true});

document.addEventListener('touchmove', (e) => {
    let durationTime = Date.now() - startTime;
    // tap
    isMove = true;
    // swipe
    deltaX = e.touches[0].clientX - startX;
    deltaY = e.touches[0].clientY - startY;
    if (durationTime > durationStep * (durationIndex + 1)) {
        deltaXArray.push(deltaX);
        deltaYArray.push(deltaY);
        durationIndex++;
    }
    swipeEvent.$touches = e.touches;
    swipeEvent.$target = e.target;
    swipeEvent.$deltaX = deltaX;
    swipeEvent.$deltaY = deltaY;
    swipeEvent.$velocityX = (deltaX - deltaXArray[durationIndex]) / (durationTime - durationIndex * durationStep) * 1000;
    swipeEvent.$velocityY = (deltaY - deltaYArray[durationIndex]) / (durationTime - durationIndex * durationStep) * 1000;
    dispatchBubbleEvent(e.target, swipeEvent);
}, {passive: true});

document.addEventListener('touchend', (e) => {
    let durationTime = Date.now() - startTime;
    // tap
    if (durationTime < durationStep && !isMove) {
        tapEvent.$touches = e.changedTouches;
        tapEvent.$target = e.target;
        dispatchBubbleEvent(e.target, tapEvent);
    }
    // swipeend
    if (isMove) {
        swipeendEvent.$touches = e.changedTouches;
        swipeendEvent.$target = e.target;
        swipeendEvent.$deltaX = deltaX;
        swipeendEvent.$deltaY = deltaY;

        if (durationTime - durationIndex * durationStep <= durationStep) {
            swipeendEvent.$velocityX = (deltaX - deltaXArray[durationIndex]) / (durationTime - durationIndex * durationStep) * 1000;
            swipeendEvent.$velocityY = (deltaY - deltaYArray[durationIndex]) / (durationTime - durationIndex * durationStep) * 1000;
        } else {
            swipeendEvent.$velocityX = 0;
            swipeendEvent.$velocityY = 0;
        }

        dispatchBubbleEvent(e.target, swipeendEvent);
    }
    // reassign
    startTime = 0, isMove = false;
    startX = 0, deltaX = 0, startY = 0, deltaY = 0;
    deltaXArray.length = 1, deltaYArray.length = 1 , durationIndex = 0;
}, {passive: true});

function dispatchBubbleEvent(element, event) {
    do {
        element.dispatchEvent(event);
    } while ((element = element.parentElement));
}