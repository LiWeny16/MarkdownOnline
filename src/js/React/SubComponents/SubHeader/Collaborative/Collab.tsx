import React, { useCallback, useEffect, useState } from "react";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Dialog from "@mui/material/Dialog";
import CachedIcon from "@mui/icons-material/Cached";
import DevicesIcon from "@mui/icons-material/Devices";
import gsap from "gsap";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Badge,
} from "@mui/material";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
import realTimeColab from "@App/share/colab/realTimeColab";
import { replaceMonacoAll } from "@App/text/replaceText";
import FileIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import TextIcon from "@mui/icons-material/TextFields";
import ClipboardIcon from "@mui/icons-material/ContentPaste";
import ScrollableBox from "@Root/js/React/Components/myCom/Layout/ScrollBox";
import { settingsBodyContentBoxStyle } from "../Settings/Subsettings/SettingsBody";
import LR from "@Root/js/React/Components/myCom/Layout/LR";
import kit from "bigonion-kit";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import { readClipboard, writeClipboard } from "@App/text/clipboard";
import alertUseArco from "@App/message/alert";

const url = "wss://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run";

export default function Settings(props: any) {
  const buttonStyle = {
    borderRadius: "12px",
    borderColor: "#e0e0e0",
  };
  const { t } = useTranslation();
  const theme = getTheme();

  const [msgFromSharing, setMsgFromSharing] = useState<string | null>(null);
  const [fileFromSharing, setFileFromSharing] = useState<Blob | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedButton, setSelectedButton] = useState<"file" | "text" | "clip" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setSelectedButton("file");
    }
  };
  const handleTextSelect = () => {
    setSelectedText(getMdTextFromMonaco());
    setSelectedButton("text");
  };

  const handleSendFile = (targetUserId: string) => {
    if (selectedFile) {
      realTimeColab.sendFileToUser(targetUserId, selectedFile);
      alert(`文件 ${selectedFile.name} 已发送！`);
      setSelectedFile(null); // 清除选中文件
      setSelectedButton(null); // 清除角标
    } else {
      alert("未选择文件！");
    }
  };

  // 搜索同WIFI下用户逻辑
  async function handleClickSearch() {
    setLoading(true);
    try {
      if (!realTimeColab.isConnected()) {
        await realTimeColab.connect(url, setMsgFromSharing, setFileFromSharing, setConnectedUserIds);
      }
      realTimeColab.broadcastSignal({
        type: "discover",
        id: realTimeColab.getUniqId(),
      });
      await kit.sleep(500);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleClickRippleBox = useCallback(
    (event: { currentTarget: any; clientX: number; clientY: number }) => {
      const box = event.currentTarget;

      const createRipple = (delay: number, scale: number) => {
        const rippleElement = document.createElement("div");
        box.appendChild(rippleElement);

        const boundingRect = box.getBoundingClientRect();
        const size = Math.max(boundingRect.width, boundingRect.height);
        const xPos = event.clientX - boundingRect.left - size / 2;
        const yPos = event.clientY - boundingRect.top - size / 2;

        gsap.set(rippleElement, {
          width: size,
          height: size,
          x: xPos,
          y: yPos,
          borderRadius: "50%",
          opacity: 1,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          position: "absolute",
          pointerEvents: "none",
          transform: "scale(0)",
        });

        gsap.fromTo(
          rippleElement,
          { scale: 0, opacity: 1 },
          {
            scale: scale,
            opacity: 0,
            duration: 2.2,
            ease: "power2.out",
            delay: delay,
            onComplete: () => {
              rippleElement.remove();
            },
          }
        );
      };

      createRipple(0, 2);
      createRipple(0.2, 2);
    },
    []
  );

  const handleClickOtherClients = async (
    _e: React.MouseEvent,
    targetUserId: string
  ) => {
    const message = getMdTextFromMonaco()
    try {
      await realTimeColab.connectToUser(targetUserId);
      console.log(`Connected to user ${targetUserId}`);
      if (selectedButton === "file" && selectedFile) {
        await realTimeColab.sendFileToUser(targetUserId, selectedFile);
      } else if (selectedButton === "text" && selectedText) {
        await realTimeColab.sendMessageToUser(targetUserId, selectedText);
      } else if (selectedButton === "clip") {
        let clipText = readClipboard()
        await realTimeColab.sendMessageToUser(targetUserId, await clipText);
      }
      else {
        await realTimeColab.sendMessageToUser(targetUserId, message);
      }
      console.log(`Message sent to user ${targetUserId}`);
    } catch (error) {
      console.error(`Failed to send message to user ${targetUserId}:`, error);
    }
  };

  useEffect(() => {
    if (props.open) {
      realTimeColab
        .connect(
          url,
          (incomingMsg: string | null) => {
            // 当接收到新消息时，显示对话框以便用户决定是否接受
            setMsgFromSharing(incomingMsg);
            setOpenDialog(true);
          },
          (incomingFile: Blob | null) => {
            setFileFromSharing(incomingFile);
            setOpenDialog(true);
          },
          setConnectedUserIds
        )
        .catch((err) => {
          console.error("Failed to connect:", err);
        });
    }

    return () => {
      // 组件卸载时断开连接，通知其他用户
      realTimeColab.disconnect(setMsgFromSharing, setFileFromSharing);
    };
  }, [props.open]);

  const handleAcceptMessage = () => {
    try {
      if (msgFromSharing) {
        if (msgFromSharing) {
          // writeClipboard(msgFromSharing)
          alertUseArco("成功收到文本", 2000, { kind: "success" })
          replaceMonacoAll(window.monaco, window.editor, msgFromSharing);
        } else {
          replaceMonacoAll(window.monaco, window.editor, msgFromSharing);
        }
      } else if (fileFromSharing) {
        const blob = new Blob([fileFromSharing]);
        // 生成文件名（可根据需求自定义）
        const fileName = realTimeColab.fileMetaInfo.name
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        // 自动触发下载（或其他处理方式）
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 释放 URL 对象
        URL.revokeObjectURL(url);

      }
      setOpenDialog(false);
      kit.sleep(500).then(() => {
        setFileFromSharing(null);
        setMsgFromSharing(null);
      })
    } catch (error) {
      console.error("Failed to accept message:", error);
    }
  };

  const handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    props.onClick(e);
    props.closeAll();
  };

  return (
    <>
      <Dialog
        hideBackdrop={true}
        fullScreen={false}
        maxWidth={false}
        open={props.open}
        onClose={handleCloseAll}
        sx={{
          height: "100svh",
          width: "100svw",
        }}
      >
        <Box
          sx={{
            height: "67svh",
            width: "55svw",
            display: "flex",
            background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
            padding: "24px",
            flexDirection: "column",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              display: "flex",
              gap: "12px",
            }}
          >
            {/* 文件按钮 */}
            <Badge
              color="primary"
              badgeContent={selectedButton === "file" ? 1 : 0}
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  top: "-2px", // 向上移动
                  right: "-2px", // 向右移动
                },
              }}
            >
              <Button
                variant="outlined"
                sx={buttonStyle}
                startIcon={<FileIcon />}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                文件
              </Button>
            </Badge>
            <input
              id="file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />


            <Button disabled variant="outlined" startIcon={<FolderIcon />} sx={buttonStyle}>
              文件夹
            </Button>
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  top: "-2px", // 向上移动
                  right: "-2px", // 向右移动
                },
              }}
              color="primary"
              badgeContent={selectedButton === "text" ? 1 : 0}
              overlap="circular"
            >
              <Button onClick={handleTextSelect} variant="outlined" startIcon={<TextIcon />} sx={buttonStyle}>
                Markdown文本
              </Button>
            </Badge>
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  top: "-2px", // 向上移动
                  right: "-2px", // 向右移动
                },
              }}
              color="primary"
              badgeContent={selectedButton === "clip" ? 1 : 0}
              overlap="circular"
            >
              <Button onClick={() => { setSelectedButton("clip") }} variant="outlined" startIcon={<ClipboardIcon />} sx={buttonStyle}>
                剪贴板
              </Button>
            </Badge>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-start",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Box sx={{ mb: "10px" }}>
              <LoadingButton
                sx={buttonStyle}
                onClick={handleClickSearch}
                endIcon={<CachedIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                搜索同WIFI下用户
              </LoadingButton>
            </Box>
            <Divider />
            <Box
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-start",
                flexDirection: "column",
                display: "flex",
              }}
            >
              <ScrollableBox
                sx={{ userSelect: "none", width: "100%", height: "100%" }}
              >
                {connectedUserIds.map((value, index) => (
                  <Box
                    sx={{
                      ...settingsBodyContentBoxStyle,
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    key={index}
                    onClick={(e) => {
                      handleClickRippleBox(e);
                      handleClickOtherClients(e, value);
                    }}
                  >
                    <LR ali="center" jus="center" space={[5]}>
                      <Box
                        sx={{ height: "100%" }}
                        className="FLEX ALI-CEN JUS-CEN"
                      >
                        <DevicesIcon />
                      </Box>
                      <p>{value}</p>
                    </LR>
                    <span
                      className="ripple"
                      style={{
                        background: "transparent",
                        position: "absolute",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        transform: "scale(0)",
                      }}
                    ></span>
                  </Box>
                ))}
              </ScrollableBox>
              <Box className="FLEX ALI-CEN JUS-CEN">
                <p style={{ color: "#8B8A8A" }}>你的ID: {realTimeColab.getUniqId()}</p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        hideBackdrop={true}
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          kit.sleep(500).then(() => {
            setFileFromSharing(null);
            setMsgFromSharing(null);
          })
        }}
      >
        <DialogTitle>✨新分享</DialogTitle>
        <DialogContent>
          <DialogContentText>您有来自外部的消息，是否接受？</DialogContentText>

          {msgFromSharing ? <Box
            sx={{
              width: "100%", // 设置宽度
              height: 300, // 限制高度
              overflow: "auto", // 使内容可滚动
              padding: 2, // 内边距
              border: "1px solid #ccc", // 边框
              borderRadius: "4px", // 圆角
              backgroundColor: "#f9f9f9", // 背景色
              whiteSpace: "pre-wrap", // 保留换行符和空格
              fontFamily: "monospace", // 字体
              fontSize: 14, // 字体大小
            }}
          >
            {msgFromSharing}
          </Box> : <></>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              kit.sleep(500).then(() => {
                setFileFromSharing(null);
                setMsgFromSharing(null);
              })

            }}
            color="secondary"
          >
            拒绝
          </Button>
          <Button onClick={handleAcceptMessage} color="primary" autoFocus>
            接受
          </Button>
        </DialogActions>
      </Dialog>

      <ScreenShareIcon />
      <Typography>{t("t-collaborative-office")}</Typography>
    </>
  );
}
