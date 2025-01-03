import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { command, state } from 'ccstate';
import { useGet, useLastLoadable, useSet } from 'ccstate-react';
import { authed$, logout$, user$ } from '../atoms/auth';
import { Avatar, Button, FormControlLabel, Menu, MenuItem, Switch, Tooltip } from '@mui/material';
import React, { HTMLAttributes } from 'react';
import {
  autoRefresh$,
  refresh$,
  setShowDetailNumber$,
  showDetailNumber$,
  updateAutoRefresh$,
} from '../atoms/preference';
import { navigate$ } from '../atoms/route';
import MenuIcon from '@mui/icons-material/Menu';

const MENU_ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/budget', label: 'Budget' },
  { path: '/cash_flows', label: 'Cash Flows' },
  { path: '/investments', label: 'Investments' },
  { path: '/irr', label: 'IRR' },
];

const anchorElUser$ = state<null | HTMLElement>(null);
const handleOpenUserMenu$ = command(({ set }, event: React.MouseEvent<HTMLElement>) => {
  set(anchorElUser$, event.currentTarget);
});
const handleCloseUserMenu$ = command(({ set }) => {
  set(anchorElUser$, null);
});

const anchorElNav$ = state<null | HTMLElement>(null);
const handleOpenNavMenu$ = command(({ set }, event: React.MouseEvent<HTMLElement>) => {
  set(anchorElNav$, event.currentTarget);
});
const handleCloseNavMenu$ = command(({ set }) => {
  set(anchorElNav$, null);
});

function UserBox() {
  const handleOpenUserMenu = useSet(handleOpenUserMenu$);
  const handleCloseUserMenu = useSet(handleCloseUserMenu$);
  const anchorElUser = useGet(anchorElUser$);
  const logout = useSet(logout$);
  const _user = useLastLoadable(user$);
  const _authed = useLastLoadable(authed$);
  const showDetailNumber = useGet(showDetailNumber$);
  const updateShowDetailNumber = useSet(setShowDetailNumber$);
  const autoRefresh = useGet(autoRefresh$);
  const updateAutoRefresh = useSet(updateAutoRefresh$);

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
  const navigate = useSet(navigate$);
  const handleOpenNavMenu = useSet(handleOpenNavMenu$);
  const handleCloseNavMenu = useSet(handleCloseNavMenu$);
  const anchorElNav = useGet(anchorElNav$);
  const refresh = useSet(refresh$);

  return (
    <Box sx={{ flexGrow: 1 }} {...props}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {MENU_ITEMS.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{item.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={() => {
                refresh();
              }}
            >
              <Typography textAlign="center">Refresh</Typography>
            </Button>
          </Box>
          <UserBox />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
