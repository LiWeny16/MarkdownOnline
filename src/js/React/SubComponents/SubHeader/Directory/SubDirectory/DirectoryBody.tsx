import { getTheme } from '@App/config/change';
import { markdownParser } from '@Func/Init/allInit';
import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { getContentMap, renderContent } from './DirectoryContent';

export default function DirectoryBody({ activeId }: { activeId: string[] }) {
    const { i18n } = useTranslation();
    
    // 根据当前语言获取内容映射
    const currentLanguage = i18n.language || 'zh';
    const contentMap = getContentMap(currentLanguage);
    
    // 基于传入的 ids，选择需要展示的内容
    const sectionsToShow = activeId.map(id => contentMap[id]).filter(Boolean);
    const contentToShow = renderContent(sectionsToShow);
    
    return (
        <Box
            className="transparent-scrollbar"
            sx={{
                width: "100%",
                height: "100%",
                margin: "10px",
                overflowY: "scroll"
            }}>
            <Box className={
                " markdown-body " +
                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` + " transparent-scrollbar"
            }
                sx={{
                    ml: "10px",
                    backgroundColor: getTheme() === "light" ? "#F8FAFB" : "#393939"
                }}>
                {contentToShow.map((content: string, index: number) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: markdownParser().render(content) }} />
                ))}
            </Box>
        </Box>
    )
}
