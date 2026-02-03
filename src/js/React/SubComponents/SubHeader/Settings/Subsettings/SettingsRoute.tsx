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
import ContrastIcon from "@mui/icons-material/Contrast"
import EditIcon from "@mui/icons-material/Edit"
import MicIcon from "@mui/icons-material/Mic"
import { styled, alpha } from "@mui/material/styles"
import { Box, Divider } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import GTranslateIcon from "@mui/icons-material/GTranslate"
import RestoreIcon from "@mui/icons-material/Restore"
import { useTranslation } from "react-i18next"
function TransitionComponent(props: TransitionProps) {
  return (
    // 这里太大了，不用了！
    <Collapse {...props} />
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
export { CustomTreeItem }

export default function SettingsRoute() {
  // 在组件中使用 useTranslation 钩子
  const { t } = useTranslation()
  function linkToView(id: string) {
    let targetElement = document.getElementById(id) as HTMLElement
    targetElement.scrollIntoView()
  }
  return (
    <>
      <Box
        className="transparent-scrollbar"
        sx={{
          overflow: "scroll",
          flex: { xs: "0 0 35%", sm: "0 0 32%", md: "0 0 28%", lg: "0 0 25%" },
          minWidth: "180px",
          maxWidth: "280px",
          minHeight: 20,
          overflowX: "hidden",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <SimpleTreeView
          aria-label="customized"
          defaultExpandedItems={["1_x", "2_x"]}
          slots={{
            endIcon: SettingsIcon,
          }}
          sx={{
            userSelect: "none",
            minHeight: 270,
            maxWidth: 280,
            width: "100%",
          }}
        >
          <CustomTreeItem
            slots={{
              endIcon: EditIcon,
            }}
            onClick={() => {
              linkToView("settings_1_x")
            }}
            itemId="1_x"
            label={t("t-basic-settings")}
          >
            <CustomTreeItem
              slots={{
                endIcon: ContrastIcon,
              }}
              onClick={() => {
                linkToView("settings_1_1")
              }}
              itemId="1_1"
              label={t("t-theme-settings")}
            />
            <CustomTreeItem
              slots={{
                endIcon: GTranslateIcon,
              }}
              onClick={() => {
                linkToView("settings_1_2")
              }}
              itemId="1_2"
              label={t("t-language-settings")}
            />
            <CustomTreeItem
              slots={{
                endIcon: EditIcon,
              }}
              onClick={() => {
                linkToView("settings_1_3")
              }}
              itemId="1_3"
              label={t("t-editor-settings")}
            />
            <CustomTreeItem
              slots={{
                endIcon: MicIcon,
              }}
              onClick={() => {
                let targetElement = document.getElementById(
                  "settings_1_4"
                ) as HTMLElement
                targetElement.scrollIntoView()
              }}
              itemId="1_4"
              label={t("t-speech-to-text")}
            />
          </CustomTreeItem>
          <CustomTreeItem
            onClick={() => {
              linkToView("settings_2_x")
            }}
            itemId="2_x"
            label={t("t-advanced-settings")}
          >
            <CustomTreeItem
              onClick={() => {
                linkToView("settings_2_1")
              }}
              itemId="2_1"
              label={t("t-export-settings")}
            />
            <CustomTreeItem
              onClick={() => {
                linkToView("settings_2_2")
              }}
              itemId="2_2"
              label={t("t-mermaid-settings")}
            />
            <CustomTreeItem
              slots={{
                endIcon: ImageIcon,
              }}
              onClick={() => {
                linkToView("settings_2_3")
              }}
              itemId="2_3"
              label={t("t-image-settings")}
            />
            <CustomTreeItem
              slots={{
                endIcon: RestoreIcon,
              }}
              onClick={() => {
                linkToView("settings_2_7")
              }}
              itemId="2_7"
              label={t("t-reset-initialization")}
            />
          </CustomTreeItem>
        </SimpleTreeView>
      </Box>
    </>
  )
}
