import * as React from "react"
import { styled } from "@mui/material/styles"
import Button, { ButtonProps } from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { blue, grey, pink, purple } from "@mui/material/colors"
// const BootstrapButton = styled(Button)({
//   boxShadow: 'none',
//   textTransform: 'none',
//   fontSize: 16,
//   padding: '6px 12px',
//   border: '1px solid',
//   lineHeight: 1.5,
//   backgroundColor: '#0063cc',
//   borderColor: '#0063cc',
//   fontFamily: [
//     '-apple-system',
//     'BlinkMacSystemFont',
//     '"Segoe UI"',
//     'Roboto',
//     '"Helvetica Neue"',
//     'Arial',
//     'sans-serif',
//     '"Apple Color Emoji"',
//     '"Segoe UI Emoji"',
//     '"Segoe UI Symbol"',
//   ].join(','),
//   '&:hover': {
//     backgroundColor: 'grey',
//     borderColor: '#0062cc',
//     boxShadow: 'none',
//   },
//   '&:active': {
//     boxShadow: 'none',
//     backgroundColor: '#0062cc',
//     borderColor: '#005cbf',
//   },
//   '&:focus': {
//     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
//   },
// });
const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  // color: "black",
  color:
    theme.palette.mode === "light"
      ? "rgb(55, 65, 81)"
      : "#FFFFFF",
  marginLeft: 10,
  fontFamily: ["electronicFont"].join(","),
  backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? grey[300] : "",
  },
}))

export default function CustomizedButtons(props: any) {
  return (
    // <BootstrapButton variant="contained" disableRipple>
    //   Bootstrap
    // </BootstrapButton>
    <ColorButton
      id="demo-customized-button"
      href={props.href ? props.href : undefined}
      aria-controls={props.open ? "demo-customized-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={props.open ? "true" : undefined}
      disableElevation
      // style={{ background: "white", color: "black" }}
      onClick={props.onClick}
      onMouseOver={props.onHover}
      endIcon={props.endIcon}
      startIcon={props.startIcon ? props.startIcon : undefined}
      variant="contained"
      // {...props}
    >
      {props.children}
    </ColorButton>
  )
}
