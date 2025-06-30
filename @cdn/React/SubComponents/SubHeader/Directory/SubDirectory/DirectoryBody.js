import { jsx as _jsx } from "react/jsx-runtime";
import { getTheme } from '@App/config/change';
import { markdownParser } from '@Func/Init/allInit';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getContentMap, renderContent } from './DirectoryContent';
export default function DirectoryBody({ activeId }) {
    const { i18n } = useTranslation();
    // 根据当前语言获取内容映射
    const currentLanguage = i18n.language || 'zh';
    const contentMap = getContentMap(currentLanguage);
    // 基于传入的 ids，选择需要展示的内容
    const sectionsToShow = activeId.map(id => contentMap[id]).filter(Boolean);
    const contentToShow = renderContent(sectionsToShow);
    return (_jsx(Box, { className: "transparent-scrollbar", sx: {
            width: "100%",
            height: "100%",
            margin: "10px",
            overflowY: "scroll"
        }, children: _jsx(Box, { className: " markdown-body " +
                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` + " transparent-scrollbar", sx: {
                ml: "10px",
                backgroundColor: getTheme() === "light" ? "#F8FAFB" : "#393939"
            }, children: contentToShow.map((content, index) => (_jsx("div", { dangerouslySetInnerHTML: { __html: markdownParser().render(content) } }, index))) }) }));
}
