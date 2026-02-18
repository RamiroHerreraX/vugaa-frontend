// src/components/layout/UserLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { roleThemes, layoutConstants } from "../../theme";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(!isMobile);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const userTheme = roleThemes.user;
  const primaryColor = userTheme.primary;

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Mi Expediente",
      icon: <FolderIcon />,
      path: "/dashboard/expediente",
    },
    {
      text: "Certificaciones",
      icon: <SchoolIcon />,
      path: "/dashboard/certificaciones",
    },
    {
      text: "Documentos",
      icon: <DescriptionIcon />,
      path: "/dashboard/documentos",
    },
    {
      text: "Declaraciones",
      icon: <AssignmentIcon />,
      path: "/dashboard/declaraciones",
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  const getRoleDisplay = () => {
    switch(user?.rol) {
      case 'agente': return 'Agente Aduanal';
      case 'profesionista': return 'Profesionista';
      case 'empresario': return 'Empresario';
      default: return 'Usuario';
    }
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#ffffff" }}>
      {/* Header del Drawer */}
      <Box
        sx={{
          p: open ? 3 : 2,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          gap: open ? 2 : 0,
        }}
      >
        <Avatar
          sx={{
            width: open ? 48 : 40,
            height: open ? 48 : 40,
            bgcolor: primaryColor,
          }}
        >
          U
        </Avatar>

        {open && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: primaryColor }}>
              {user?.nombre || "Usuario"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#666" }}>
              {getRoleDisplay()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Menú */}
      <List sx={{ flex: 1, p: open ? 2 : 1 }}>
        {menuItems.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 2.5 : 1.5,
                    "&.Mui-selected": {
                      bgcolor: `${primaryColor}15`,
                      color: primaryColor,
                      "& .MuiListItemIcon-root": { color: primaryColor },
                    },
                    "&:hover": {
                      bgcolor: `${primaryColor}10`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: isActive ? primaryColor : "#666",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: open ? 2 : 1, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        {open ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ color: primaryColor, borderColor: primaryColor }}
          >
            Cerrar Sesión
          </Button>
        ) : (
          <Tooltip title="Cerrar sesión">
            <IconButton onClick={handleLogout} sx={{ color: primaryColor }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          color: primaryColor,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={isMobile ? handleDrawerToggle : handleDesktopDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Mi Portal VUGAA
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: "none", md: "block" } }}>
              {user?.nombre || "Usuario"}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: primaryColor, width: 36, height: 36 }}>
                {user?.nombre?.charAt(0) || "U"}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>Mi Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{
          width: { sm: open ? layoutConstants.drawerWidth : layoutConstants.collapsedDrawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : open}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              width: open ? layoutConstants.drawerWidth : layoutConstants.collapsedDrawerWidth,
              boxSizing: "border-box",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: `${layoutConstants.appBarHeight}px`,
          bgcolor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;