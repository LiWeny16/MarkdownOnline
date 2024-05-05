import * as React from "react"
import Collapse from "@mui/material/Collapse"
import { TransitionProps } from "@mui/material/transitions"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import SettingsIcon from "@mui/icons-material/Settings"
import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/x-tree-view/TreeItem"
// import { useSpring, animated } from "@react-spring/web"
// import AddBoxIcon from "@mui/icons-material/AddBox"
// import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox"
import ContrastIcon from "@mui/icons-material/Contrast"
import EditIcon from "@mui/icons-material/Edit"
import { styled, alpha } from "@mui/material/styles"
import { Box, Divider } from "@mui/material"
function TransitionComponent(props: TransitionProps) {
  // const style = useSpring({
  //   to: {
  //     opacity: props.in ? 1 : 0,
  //     transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
  //   },
  // })

  return (
    // 这里太大了，不用了！
    // <animated.div style={style}>
    <Collapse {...props} />
    // </animated.div>
  )
}
const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color:
    theme.palette.mode === "light"
      ? theme.palette.grey[800]
      : theme.palette.grey[200],

  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: "0.89rem",
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: "80%",
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.primary.main, 0.45)
        : theme.palette.primary.dark,
    color: theme.palette.mode === "dark" && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
}))

const CustomTreeItem = React.forwardRef(
  (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
    // @ts-ignore
    <StyledTreeItem
      {...props}
      slots={{ groupTransition: TransitionComponent, ...props.slots }}
      ref={ref}
    />
  )
)

export default function SettingsRoute() {
  return (
    <>
      <Box
        className="transparent-scrollbar"
        sx={{
          overflow: "scroll",
          flex: "0 0 30%",
          minHeight: 20,
          overflowX: "hidden",
          borderRight: "solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <SimpleTreeView
          aria-label="customized"
          defaultExpandedItems={["1_x"]}
          slots={{
            // expandIcon: AddBoxIcon,
            // collapseIcon: IndeterminateCheckBoxIcon,
            endIcon: SettingsIcon,
          }}
          sx={{
            userSelect: "none",
            minHeight: 270,
            maxWidth: 300,
          }}
        >
          <CustomTreeItem
            slots={{
              // expandIcon: AddBoxIcon,
              // collapseIcon: IndeterminateCheckBoxIcon,
              endIcon: EditIcon,
            }}
            onClick={() => {
              let targetElement = document.getElementById(
                "settings_1_x"
              ) as HTMLElement
              targetElement.scrollIntoView()
            }}
            itemId="1_x"
            label="基础设置"
          >
            <CustomTreeItem
              slots={{
                endIcon: ContrastIcon,
              }}
              onClick={() => {
                let targetElement = document.getElementById(
                  "settings_1_1"
                ) as HTMLElement
                targetElement.scrollIntoView()
              }}
              itemId="1_2"
              label="主题设置"
            />
            <CustomTreeItem
              slots={{
                endIcon: EditIcon,
              }}
              onClick={() => {
                let targetElement = document.getElementById(
                  "settings_1_2"
                ) as HTMLElement
                targetElement.scrollIntoView()
              }}
              itemId="1_3"
              label="编辑器设置"
            />
          </CustomTreeItem>
          {/* <Divider sx={{ my: 0.5 }} /> */}
          <CustomTreeItem itemId="2_x" label="高级设置">
            <CustomTreeItem itemId="2_2" label="导出设置" />
            <CustomTreeItem itemId="2_3" label="Mermaid设置" />
          </CustomTreeItem>
          {/* <CustomTreeItem itemId="8" label="高级设置">
            <CustomTreeItem itemId="10" label="导出设置" />
            <CustomTreeItem itemId="11" label="导出设置" />
            <CustomTreeItem itemId="12" label="导出设置" />
          </CustomTreeItem> */}
        </SimpleTreeView>
      </Box>
    </>
  )
}
