import React from "react";
import { Box } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useTranslation } from "react-i18next";
import { CustomTreeItem } from "../../Settings/Subsettings/SettingsRoute"; // 自定义树形节点组件
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

const treeData = [
    {
        id: "0_1",
        label: "前言"
    },
    {
        id: "1_x",
        label: "1.基础操作指南",
        children: [
            {
                id: "1_1",
                label: "段落",
            },
            {
                id: "1_2",
                label: "换行",
            },
            {
                id: "1_3",
                label: "加粗",
            },
            {
                id: "1_4",
                label: "斜体",
            },
            {
                id: "1_5",
                label: "居中",
            },
            {
                id: "1_6",
                label: "任意文本",
            },
            {
                id: "1_7",
                label: "导出PDF",
            },
        ],
    },
    {
        id: "2_x",
        label: "2.黑科技指南",
        children: [
            {
                id: "2_1",
                label: "语音转文字",
            },
            {
                id: "2_2",
                label: "✨AI智能助手",
            },
            {
                id: "2_3",
                label: "自动排版",
            },
            {
                id: "2_4",
                label: "文件管理器",
            },
            {
                id: "2_5",
                label: "图片上传",
            },
            {
                id: "2_6",
                label: "同步滚动",
            },
            {
                id: "2_7",
                label: "表情包超市",
            },
            {
                id: "2_8",
                label: "协同办公",
            },
            {
                id: "2_9",
                label: "表格速建",
            },
            {
                id: "2_10",
                label: "思维导图",
            },
            {
                id: "2_11",
                label: "双击定位",
            },
        ],
    },
    {
        id: "3_x",
        label: "3.智能提示指南",
        children: [
            {
                id: "3_1",
                label: "LaTex数学公式",
            },
            {
                id: "3_2",
                label: "智能提示",
            },
            {
                id: "3_3",
                label: "设置界面",
            },

        ],
    },
];


// 动态渲染树形组件
function renderTreeItems(items: any[], setActiveId: any, t: any) {
    return items.map((item: any) => (
        <CustomTreeItem
            key={item.id}
            itemId={item.id}
            label={t(item.label)}
            slots={{ endIcon: item.icon }}
            onClick={() => { if (item.id.slice(-1) != "x") { setActiveId([item.id]) } }}
        >
            {item.children && renderTreeItems(item.children, setActiveId, t)}
        </CustomTreeItem>
    ));
}

export default function DirectoryRoute(props: any) {
    const { t } = useTranslation();

    // const linkToView = (id: string) => {
    //     let targetElement = document.getElementById(id) as HTMLElement;
    //     if (targetElement) targetElement.scrollIntoView();
    // };

    return (
        <Box
            className="transparent-scrollbar"
            sx={{
                overflow: "scroll",
                flex: "0 0 35%",
                minHeight: 20,
                overflowX: "hidden",
                borderRight: "solid rgba(0, 0, 0, 0.12)",
            }}
        >
            <SimpleTreeView
                aria-label="customized"
                defaultExpandedItems={["1_x"]}
                slots={{
                    endIcon: HelpOutlineIcon,
                }}
                sx={{
                    userSelect: "none",
                    minHeight: 270,
                    maxWidth: 300,
                }}
            >
                {renderTreeItems(treeData, props.setActiveId, t)}
            </SimpleTreeView>
        </Box>
    );
}
