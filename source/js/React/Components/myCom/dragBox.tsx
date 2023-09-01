import React, { useState } from 'react';  
  
const ResizableBox = () => {  
  const [width, setWidth] = useState(200); // 设置初始宽度为200px  
  
  const handleDrag = (event:any) => {  
    // 处理拖拽事件，根据鼠标移动的距离来动态改变宽度  
    const newWidth = width + event.movementX;  
    setWidth(newWidth);  
  };  
  
  return (  
    <div  
      style={{ width: `${width}px`, border: '1px solid black', padding: '10px' }}  
      draggable="true"  
      onDrag={handleDrag}  
    >  
      {/* 这里可以添加盒子的内容 */}  
      Resizable Box  
    </div>  
  );  
};  
  
export default ResizableBox;  