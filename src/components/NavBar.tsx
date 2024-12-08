import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { $effect, $value, useGet, useLoadable, useSet } from "rippling";
import { authedAtom, logoutEffect, userAtom } from "../atoms/auth";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { HTMLAttributes } from "react";

const anchorElUserAtom = $value<null | HTMLElement>(null);
const handleOpenUserMenuEffect = $effect(
  (_, set, event: React.MouseEvent<HTMLElement>) => {
    set(anchorElUserAtom, event.currentTarget);
  }
);
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

  if (_authed.state !== "hasData" || _user.state !== "hasData") {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt={_user.data?.fullName}
            src={_user.data?.socialAccounts[0].avatarUrl}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem disabled>
          <Typography sx={{ textAlign: "center" }}>
            {_user.data?.fullName}
          </Typography>
        </MenuItem>
        <MenuItem onClick={logout}>
          <Typography sx={{ textAlign: "center" }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default function NavBar(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Box sx={{ flexGrow: 1 }} {...props}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Beancount
          </Typography>
          <UserBox />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
