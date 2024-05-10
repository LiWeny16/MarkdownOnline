import React from 'react';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import KeyboardIcon from '@mui/icons-material/Keyboard';

function ShortcutExample() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <KeyboardIcon />
      <Typography variant="body1" component="span" style={{ margin: '0 4px' }}>
        Ctrl + C
      </Typography>
    </div>
  );
}

export default ShortcutExample;