import React, { useState } from 'react';

const DraggableBox = (props:any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e:any) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e:any) => {
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      if (newX < 0) {
        newX = 0;
      } else if (newX > window.innerWidth - 100) {
        newX = window.innerWidth - 100;
      }

      if (newY < 0) {
        newY = 0;
      } else if (newY > window.innerHeight - 100) {
        newY = window.innerHeight - 100;
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="draggable-box"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {props.children}
    </div>
  );
};

export default DraggableBox;