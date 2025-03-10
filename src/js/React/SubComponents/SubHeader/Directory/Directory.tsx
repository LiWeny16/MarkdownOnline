import React from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import Dialog from "@mui/material/Dialog"
import { useTheme } from "@mui/material/styles"
import { Box, Divider, } from "@mui/material"
import { getTheme } from "@App/config/change"
import { useTranslation } from "react-i18next"
import DirectoryRoute from "./SubDirectory/DirectoryRoute"
import DirectoryBody from "./SubDirectory/DirectoryBody"
export default function Settings(props: any) {
    const [activeId, setActiveId] = React.useState<string[]>(["0_1"])
    const { t } = useTranslation()
    const theme = getTheme()
    return (
        <>
            <Dialog
                fullScreen={false}
                maxWidth={false}
                open={props.open}
                onClose={props.onClose}
                sx={{
                    height: "100vh",
                }}
            >
                <Box
                    className="transparent-scrollbar"
                    sx={{
                        background: theme === "light" ? "#F8FAFB" : "",
                        padding: "1rem",
                        height: "58vh",
                        width: "58vw",
                    }}
                >
                    <Box
                        className="transparent-scrollbar"
                        sx={{
                            height: "53vh",
                            display: "flex",
                            background: theme === "light" ? "#F8FAFB" : "",
                            padding: "5px",
                            flexDirection: "row",
                            borderRradius: "50px",
                            borderRadius: "5px",
                            overflow:"hidden"
                        }}
                    >
                        <DirectoryRoute setActiveId={setActiveId}></DirectoryRoute>
                        <DirectoryBody activeId={activeId}></DirectoryBody>
                    </Box>
                </Box>
            </Dialog>
            <SettingsIcon />

        </>
    )
}
