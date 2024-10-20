import React from "react";
import { BoxProps } from "@mui/material/Box";
interface ScrollableBoxProps extends BoxProps {
    children: React.ReactNode;
}
declare function ScrollableBox({ children, sx, ...rest }: ScrollableBoxProps): import("react/jsx-runtime").JSX.Element;
export default ScrollableBox;
