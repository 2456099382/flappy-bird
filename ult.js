function creatEl(element, classArr, styleObj) {
    var ele = document.createElement(element);
    for (var i = 0; i < classArr.length; i++) {
        ele.classList.add(classArr[i]);
    }
    for (var j in styleObj) {
        ele.style[j] = styleObj[j];
    }
    return ele;
}


function setlocal(key, value) {
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

function getLocal(key) {
    var value = localStorage.getItem(key);
    if (value === null) { return null };
    if (value[0] === '[' || value[0] === '{') {
        value = JSON.parse(value);
        return value;
    }

    return value;
}