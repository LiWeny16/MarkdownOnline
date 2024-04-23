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
import { useSpring, animated } from "@react-spring/web"
// import AddBoxIcon from "@mui/icons-material/AddBox"
// import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox"
import ContrastIcon from '@mui/icons-material/Contrast';
import EditIcon from "@mui/icons-material/Edit"
import { styled, alpha } from "@mui/material/styles"
import { Divider } from "@mui/material"
function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
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
    <StyledTreeItem
      {...props}
      slots={{ groupTransition: TransitionComponent, ...props.slots }}
      ref={ref}
    />
  )
)

export default function SettingsTop() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedItems={["1"]}
      slots={
        {
          // expandIcon: AddBoxIcon,
          // collapseIcon: IndeterminateCheckBoxIcon,
          endIcon: SettingsIcon,
        }
      }
      sx={{
        userSelect: "none",
        overflowX: "hidden",
        minHeight: 270,
        flexGrow: 1,
        maxWidth: 300,
      }}
    >
      <CustomTreeItem
        slots={{
          // expandIcon: AddBoxIcon,
          // collapseIcon: IndeterminateCheckBoxIcon,
          endIcon: EditIcon,
        }}
        itemId="1"
        label="基础设置"
      >
         <CustomTreeItem
          slots={{
            endIcon: ContrastIcon,
          }}
          itemId="2"
          label="主题设置"
        />
        <CustomTreeItem
          slots={{
            endIcon: EditIcon,
          }}
          itemId="3"
          label="编辑器设置"
          sx={{ fontSize: "0.5rem" }}
        />
        <CustomTreeItem itemId="5" label="Mermaid设置" />
      </CustomTreeItem>
      {/* <Divider sx={{ my: 0.5 }} /> */}
      <CustomTreeItem itemId="6" label="高级设置">
        <CustomTreeItem itemId="7" label="导出设置" />
      </CustomTreeItem>
    </SimpleTreeView>
  )
}
