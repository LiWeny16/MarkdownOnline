import React from 'react';
import { BoxProps } from '@mui/material';
interface ScrollableBoxProps extends BoxProps {
}
declare const ScrollableBox: React.ForwardRefExoticComponent<Omit<ScrollableBoxProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export default ScrollableBox;
