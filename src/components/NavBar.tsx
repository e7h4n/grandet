import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { $effect, $value, useGet, useLoadable, useSet } from 'rippling';
import { authedAtom, logoutEffect, userAtom } from '../atoms/auth';
import { Avatar, Button, FormControlLabel, Menu, MenuItem, Switch, Tooltip } from '@mui/material';
import React, { HTMLAttributes } from 'react';
import {
  autoRefreshAtom,
  setShowDetailNumberEffect,
  showDetailNumberAtom,
  updateAutoRefreshEffect,
} from '../atoms/preference';
import { navigateEffect } from '../atoms/route';

const anchorElUserAtom = $value<null | HTMLElement>(null);
const handleOpenUserMenuEffect = $effect((_, set, event: React.MouseEvent<HTMLElement>) => {
  set(anchorElUserAtom, event.currentTarget);
});
const handleCloseUserMenuEffect = $effect((_, set) => {
  set(anchorElUserAtom, null);
});

function UserBox() {
  const handleOpenUserMenu = useSet(handleOpenUserMenuEffect);
  const handleCloseUserMenu = useSet(handleCloseUserMenuEffect);
  const anchorElUser = useGet(anchorElUserAtom);
  const logout = useSet(logoutEffect);
  const _user = useLoadable(userAtom);
  const _authed = useLoadable(authedAtom);
  const showDetailNumber = useGet(showDetailNumberAtom);
  const updateShowDetailNumber = useSet(setShowDetailNumberEffect);
  const autoRefresh = useGet(autoRefreshAtom);
  const updateAutoRefresh = useSet(updateAutoRefreshEffect);

  if (_authed.state !== 'hasData' || _user.state !== 'hasData') {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={_user.data?.fullName} src={_user.data?.socialAccounts[0].avatarUrl} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem disabled>
          <Typography sx={{ textAlign: 'center' }}>{_user.data?.fullName}</Typography>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={!showDetailNumber}
                onChange={(_, checked) => {
                  updateShowDetailNumber(!checked);
                }}
              />
            }
            label="Mask details"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Switch checked={autoRefresh} onChange={(_, checked) => updateAutoRefresh(checked)} />}
            label="Auto refresh"
          />
        </MenuItem>
        <MenuItem onClick={logout}>
          <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default function NavBar(props: HTMLAttributes<HTMLDivElement>) {
  const navigate = useSet(navigateEffect);

  return (
    <Box sx={{ flexGrow: 1 }} {...props}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => {
                navigate('/');
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => {
                navigate('/cash_flows');
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Cash Flows
            </Button>
            <Button
              onClick={() => {
                navigate('/investments');
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Investments
            </Button>
            <Button
              onClick={() => {
                navigate('/irr');
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              IRR
            </Button>
          </Box>
          <UserBox />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
