import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MagicImg from "@Com/myCom/MagicImg";
import { useImage } from "@Mobx/Image";
import { observer } from "mobx-react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import LR from "@Com/myCom/Layout/LR";
import MyBox from "@Com/myCom/Layout/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { readAllMemoryImg } from "@App/memory/memory";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteDBAll } from "@App/db.js";

// THEME
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
  },
});

const TemporaryDrawer = observer(() => {
  const image = useImage();
  const [drawerState, setDrawerState] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState<Array<any>>([]);
  const [openConfirmDelState, setOpenConfirmDelState] = React.useState(false);

  function handleDeleteImg() {
    setOpenConfirmDelState(true);
  }

  React.useEffect(() => {
    readAllMemoryImg().then((list) => {
      setImgSrc(list);
    });
  }, []);

  React.useEffect(() => {
    setDrawerState(image.displayState);
  }, [image.displayState]);

  return (
    <>
      <Dialog
        open={openConfirmDelState}
        onClose={() => {
          setOpenConfirmDelState(false);
        }}
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
              window.location.reload();
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

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {imgSrc.length > 0 &&
              imgSrc.map((value) => (
                <div key={value.uuid} style={{ flex: "1 0 calc(50% - 1rem)" }}>
                  <MagicImg magic={0} src={value.imgBase64} uuid={value.uuid} />
                </div>
              ))}
          </div>
        </div>
      </Drawer>
    </>
  );
});

export default TemporaryDrawer;