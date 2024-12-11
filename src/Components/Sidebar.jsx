import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Sidebar = ({ currentPage, setCurrentPage }) => {

const pages = [
  { id: 'home', label: 'Estoque', icon: <HomeOutlinedIcon /> },
  { id: 'entrada', label: 'Entrada', icon: <AddIcon /> },
  { id: 'saida', label: 'Saída', icon: <RemoveIcon /> }
]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e1e',
          color: 'white'
        },
      }}
    >
      <List>
        {pages.map((page) => (
          <ListItem key={page.id} disablePadding>
            <ListItemButton
              onClick={() => setCurrentPage(page.id)}
              selected={currentPage === page.id}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#333',
                },
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;