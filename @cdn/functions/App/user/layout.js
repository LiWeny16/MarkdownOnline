export function isElementOverflow(element) {
    return (element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth);
}
