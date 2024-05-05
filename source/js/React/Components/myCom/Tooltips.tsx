import * as React from "react"
import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

const LightTooltip:any = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    color: "#FFFFFF",
    boxShadow: theme.shadows[4],
    fontSize: 18,
  },
}))

let HtmlTooltip:any = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))
export { HtmlTooltip, LightTooltip }
