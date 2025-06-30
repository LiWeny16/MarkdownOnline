import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MagicImg from "@Com/myCom/MagicImg";
import { useImage } from "@Mobx/Image";
import { observer } from "mobx-react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import LR from "@Com/myCom/Layout/LR";
import MyBox from "@Com/myCom/Layout/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteDBAll, openDB, cursorDelete } from "@App/db.js";
import { getTheme } from "@App/config/change";

// THEME
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
  },
});

const TemporaryDrawer = observer(() => {
  const image = useImage();
  const [drawerState, setDrawerState] = React.useState(false);
  const [openConfirmDelState, setOpenConfirmDelState] = React.useState(false);
  const currentTheme = getTheme();

  function handleDeleteImg() {
    setOpenConfirmDelState(true);
  }

  // 删除单个图片
  async function handleDeleteSingleImg(uuid: string) {
    try {
      const db = await openDB("md_content", 2);
      cursorDelete(db, "users_img", "uuid", uuid);
      // 刷新图片列表
      setTimeout(() => {
        image.refreshImages();
      }, 100); // 稍微延迟确保删除操作完成
    } catch (error) {
      console.error("删除图片失败:", error);
    }
  }

  React.useEffect(() => {
    setDrawerState(image.displayState);
  }, [image.displayState]);

  // 获取响应式的图片列表
  const imgSrc = image.getImages();

  return (
    <>
      <Dialog
        open={openConfirmDelState}
        onClose={() => {
          setOpenConfirmDelState(false);
        }}
        style={{ zIndex: 9999 }}
      >
        <DialogTitle id="alert-dialog-title">{"Ready to delete all the images?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you have clicked the "yes" button, your pictures and your text will be deleted!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenConfirmDelState(false);
              deleteDBAll("md_content");
              // 刷新图片列表而不是重新加载页面
              image.refreshImages();
            }}
          >
            YES
          </Button>
          <Button
            onClick={() => {
              setOpenConfirmDelState(false);
            }}
            autoFocus
          >
            NO
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor={"bottom"}
        open={drawerState}
        elevation={16}
        onClose={() => {
          image.hidden();
        }}
      >
        <div style={{ height: "60vh", overflow: "auto" }}>
          <div>
            <ThemeProvider theme={theme}>
              <MyBox>
                <LR space={[90]}>
                  <MyBox min={1} move={{ x: "5vw" }}>
                    <p>图片管理器</p>
                    <Tooltip
                      title={
                        <div>
                          管理粘贴上传的图片
                          <ul style={{ margin: "2px" }}>
                            <li>按住Ctrl点击图片插入</li>
                            <li>双击图片放大预览</li>
                            <li>按住Alt点击图片复制图片</li>
                          </ul>
                        </div>
                      }
                    >
                      <IconButton>
                        <HelpOutlineIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </MyBox>
                  <MyBox>
                    <Tooltip title="删除全部图片和储存的文字">
                      <IconButton onClick={handleDeleteImg}>
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </MyBox>
                </LR>
              </MyBox>
            </ThemeProvider>
          </div>

          <Divider style={{ marginBottom: "1.3vh" }} />

          {/* 响应式图片列表 */}
          {imgSrc.length > 0 ? (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
              padding: "0 1rem 1rem 1rem"
            }}>
              {imgSrc.map((value) => (
                <div 
                  key={value.uuid} 
                  style={{ 
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: currentTheme === "light" ? "#f9f9f9" : "#2a2a2a",
                    borderRadius: "8px",
                    padding: "1rem",
                    transition: "all 0.2s ease",
                    border: `1px solid ${currentTheme === "light" ? "#e0e0e0" : "#404040"}`,
                  }}
                >
                  {/* 删除按钮 */}
                  <Tooltip title="删除此图片">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSingleImg(value.uuid)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: currentTheme === "light" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
                        color: "#f44336",
                        zIndex: 10,
                        width: "24px",
                        height: "24px"
                      }}
                    >
                      <CloseIcon style={{ fontSize: "16px" }} />
                    </IconButton>
                  </Tooltip>
                  
                  {/* 图片组件 */}
                  <div style={{ 
                    width: "100%", 
                    display: "flex", 
                    justifyContent: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <MagicImg 
                      magic={0} 
                      src={value.imgBase64} 
                      uuid={value.uuid} 
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "4px"
                      }}
                    />
                  </div>
                  
                  {/* 图片信息 */}
                  <div style={{
                    fontSize: "12px",
                    color: currentTheme === "light" ? "#666" : "#999",
                    textAlign: "center",
                    wordBreak: "break-all"
                  }}>
                    UUID: {value.uuid}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 1rem",
              color: currentTheme === "light" ? "#999" : "#666",
              textAlign: "center"
            }}>
              <HelpOutlineIcon style={{ 
                fontSize: "48px", 
                marginBottom: "1rem",
                opacity: 0.5
              }} />
              <h3 style={{ margin: "0 0 0.5rem 0", fontWeight: "normal" }}>
                暂无图片
              </h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                请粘贴图片到编辑器中，图片将自动保存到此处
              </p>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
});

export default TemporaryDrawer;