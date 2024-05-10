import * as React from "react"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"

const MyPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}))

export default MyPaper
