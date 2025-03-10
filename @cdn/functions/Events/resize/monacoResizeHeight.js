/**
 * 监听页面高度变化, 自适应设置编辑器高度
 * */
export default function monacoResizeHeightEvent(setResizableHeight) {
    /**
     * 设置编辑器高度为视口高度
     * */
    const handleResizeHeight = () => {
        setResizableHeight(Math.floor(window.innerHeight * ((100 - 10) / 100)));
    };
    // 防抖设置
    //   const debounceHandleResize = debounce(handleResizeHeight, 1)
    window.addEventListener("resize", handleResizeHeight);
}
