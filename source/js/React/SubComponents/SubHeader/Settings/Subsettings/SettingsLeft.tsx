import * as React from "react"
import { styled } from "@mui/material/styles"
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion"
import ConstructionIcon from "@mui/icons-material/Construction"
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import SwitchTheme from "@Com/myCom/Switches/SwitchTheme"
import LR from "@Root/js/React/Components/myCom/Layout/LR"
import MyBox from "@Root/js/React/Components/myCom/Layout/Box"
import { LightTooltip } from "@Com/myCom/Tooltips"
import { Box } from "@mui/material"
import changeTheme, { getTheme } from "@App/theme/change"
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(2),
  },
  "& .MuiAccordionDetails-root": {
    padding: "0",
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}))

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>("panel1")

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>功能开关</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#ffddee",
                boxShadow: "rgb(216, 216, 216) 1vh 2vh 21px",
              },
              padding: "8px",
              borderRadius: "5px",
              boxShadow: "rgb(235 235 235) -7vh 3vh 21px",
            }}
          >
            <LR space={[80]}>
              <Box>
                <LightTooltip
                  style={{ width: "100" }}
                  title="编辑器主题"
                  placement="bottom"
                >
                  <Typography>主题切换</Typography>
                </LightTooltip>
              </Box>
              <SwitchTheme
                inputProps={{ "aria-label": "controlled" }}
                onChange={(e) => {
                  console.log(e.target.checked);
                  changeTheme(e.target.checked ? "dark" : "light")
                }}
              ></SwitchTheme>
            </LR>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>导出样式</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MyBox>
            <ConstructionIcon></ConstructionIcon>
            施工中.....
          </MyBox>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
