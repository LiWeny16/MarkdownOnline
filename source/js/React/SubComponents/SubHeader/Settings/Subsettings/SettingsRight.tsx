import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

const SettingsRight = () => {
  const [currentSetting, setCurrentSetting] = useState('编辑器设置');
  const [expandedPanel, setExpandedPanel] = useState('panel1');

  const handleSettingClick = (setting) => {
    setCurrentSetting(setting);
  };

  const handlePanelChange = (panel) => (event, newExpanded) => {
    setExpandedPanel(newExpanded ? panel : false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}>
        <Accordion expanded={expandedPanel === 'panel1'} onChange={handlePanelChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>基本设置</Typography>
          </AccordionSummary>
          <div>
            <ul>
              <li onClick={() => handleSettingClick('编辑器设置')}>编辑器设置</li>
              <li onClick={() => handleSettingClick('渲染设置')}>渲染设置</li>
            </ul>
          </div>
        </Accordion>

        <Accordion expanded={expandedPanel === 'panel2'} onChange={handlePanelChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>导出设置</Typography>
          </AccordionSummary>
          <div>
            <ul>
              <li onClick={() => handleSettingClick('导出样式设置')}>导出样式设置</li>
            </ul>
          </div>
        </Accordion>
      </div>

      <div style={{ flex: 1 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textPrimary">基本设置</Typography>
          <Typography color="textPrimary">{currentSetting}</Typography>
        </Breadcrumbs>

        <div>
          <h3>{currentSetting}</h3>
          {/* 在这里根据 currentSetting 显示对应的设置界面 */}
        </div>
      </div>
    </div>
  );
};

export default SettingsRight;