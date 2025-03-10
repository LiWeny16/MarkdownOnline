import React, { useState } from "react"
import {
    Backdrop,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    styled
} from "@mui/material"
import { observer } from "mobx-react"
import { changeStates, getStates, getTheme } from "@App/config/change"
// ======= 占位翻译函数：实际翻译时，可换为浏览器翻译/其他翻译 API =======
function translate(text: string, fromLang: string, toLang: string): string {
    // 这里可以接入真正的翻译API
    // 暂时只做占位，返回原文
    return text
}

// ======= 示例组件 =======
export default observer(function VoiceTransModal(props: any) {
    // 上半部分：语音识别的文字
    const [speechResult, setSpeechResult] = useState("这是语音识别的结果")

    // 翻译结果
    const [translationResult, setTranslationResult] = useState("")

    // 语言选择
    const [fromLang, setFromLang] = useState("auto") // 检测语言
    const [toLang, setToLang] = useState("zh-CN")    // 简体中文
    const _position = {
        posx: window.document.body.clientWidth / 4,
        posy: window.document.body.clientHeight / 2.5
    }
    // 关闭弹窗
    const handleClose = () => {
        changeStates({
            unmemorable: {
                voicePanelState: false
            },
        })
    }

    // 点击 backdrop 关闭（如不需要点空白处关闭，可去掉 onClick）
    const handleBackdropClick = () => {
        handleClose()
    }

    // 阻止冒泡，防止点击内部内容也触发关闭
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    // 进行翻译
    const handleTranslate = () => {
        const result = translate(speechResult, fromLang, toLang)
        setTranslationResult(result)
    }

    // 可以使用 styled 或 sx 自定义样式。此处简单演示。
    const PanelBox = styled(Box)(({ theme }) => ({
        padding: "10px",
        width: "50svw",
        height: "50svh",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: _position.posy - window.document.body.clientHeight * 0.1,
        left: _position.posx - window.document.body.clientWidth * 0.02,
        borderRadius: "25px",
        boxShadow: "7px 6px 12px 7px rgb(0 0 0 / 21%)",
        backgroundColor: getTheme() === "light" ? "white" : "#333",
    }))

    const AreaBox = styled(Box)(({ theme }) => ({
        width: "100%",
        flex: 1,
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        boxSizing: "border-box",
    }))
    React.useEffect(() => {
        setSpeechResult(getStates().unmemorable.voiceData)
    }, [getStates().unmemorable.voiceData])
    return (
        <Backdrop
            invisible={true}
            open={props.open}
            onClick={handleBackdropClick}
            sx={{ zIndex: (theme) => theme.zIndex.drawer }}
        >
            <PanelBox onClick={stopPropagation}>
                {/* 上半部分：显示语音识别结果 */}
                <AreaBox>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {window?._speechData?.speechResult ?? ""}
                    </Typography>
                </AreaBox>

                {/* 中间：两个选择框（从(检测语言)->(简体中文)），可在此放翻译按钮 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "8px 0",
                        gap: "16px"
                    }}
                >
                    <FormControl size="small">
                        <Select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                            <MenuItem value="auto">检测语言</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="ja">日本語</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="body2">{"->"}</Typography>
                    <FormControl size="small">
                        <Select value={toLang} onChange={(e) => setToLang(e.target.value)}>
                            <MenuItem value="zh-CN">简体中文</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* 下半部分：翻译结果 */}
                <AreaBox>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {translationResult}
                    </Typography>
                </AreaBox>

                {/* 示例：可添加一个翻译按钮，也可以在中间的语言选择处进行翻译 */}
                <Box
                    sx={{
                        marginTop: "8px",
                        cursor: "pointer",
                        color: "blue",
                        userSelect: "none"
                    }}
                    onClick={handleTranslate}
                >
                    立即翻译
                </Box>
            </PanelBox>
        </Backdrop>
    )
})
