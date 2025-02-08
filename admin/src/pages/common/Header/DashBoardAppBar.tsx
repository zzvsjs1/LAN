import { Divider, IconButton, List, Toolbar, Typography, } from '@mui/material';
import { LanAppBar, LanDrawer, DrawerHeader } from './LanAppBarAndDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import { ChevronLeft } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { ThemeSwitchBtn } from '../ThemeSwitchBtn';
import React, { useState } from 'react';
import DrawerListItem from "./DrawerListItem";
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import HomeIcon from '@mui/icons-material/Home';
import NotificationBtn from "./NotificationBtn";

/**
 * Our version of app bar.
 * Contain drawer and the header.
 */
export default function DashBoardAppBar() {
  const [open, setOpen] = useState<boolean>(false);
  const drawerOpenChange = () => setOpen(prevState => !prevState);

  return (
    <>
      <LanAppBar position={'absolute'} open={open}>
        <Toolbar sx={{ pr: '24px' }}>
          {/* The left open button */}
          <IconButton
            size={'large'}
            edge={'start'}
            color={'inherit'}
            sx={{
              marginRight: '40px',
              // Allow hide this button
              ...(open && { display: 'none' })
            }}
            onClick={drawerOpenChange}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant={'h6'} noWrap={true} component={'div'}>
            Lan Admin Dashboard
          </Typography>

          {/* Fill the space. */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Hidden only on xs, flex when in md */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ThemeSwitchBtn />
            <NotificationBtn />
          </Box>
        </Toolbar>
      </LanAppBar>

      {/* The extent menu */}
      <LanDrawer
        variant={'permanent'}
        anchor={'left'}
        open={open}
      >
        <DrawerHeader>
          <IconButton
            onClick={drawerOpenChange}
          >
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {/* Three item for normal features. */}
          <DrawerListItem name={'Home'} path={'/'} icon={<HomeIcon />} isOpen={open} />
          <DrawerListItem name={'Users'} path={'/users'} icon={<AccountCircleIcon />} isOpen={open} />
          <DrawerListItem name={'Posts and replies'} path={'/post-and-reply'} icon={<ArticleIcon />} isOpen={open} />
        </List>

        <Divider />

        <List>
          {/* Two items for addition features. */}
          <DrawerListItem name={'Statistics'} path={'/statistics'} icon={<InsertChartIcon />} isOpen={open} />
          <DrawerListItem name={'Notification'} path={'/notification'} icon={<MailIcon />} isOpen={open} />
        </List>
      </LanDrawer>
    </>
  );
}