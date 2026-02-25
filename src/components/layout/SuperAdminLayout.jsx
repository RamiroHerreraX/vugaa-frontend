// src/layouts/SuperAdminLayout.jsx
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
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Folder as ExpedienteIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  History as HistoryIcon,
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationIcon,
  Layers as LayersIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { roleThemes, layoutConstants } from  "../../theme";

// Colores institucionales para Super Admin (azules)
const institutionalColors = {
  primary: "#133B6B", // Azul oscuro principal
  secondary: "#133B6B", // Azul medio
  accent: "#e9e9e9", // Color para acentos
  notification: "#ef4444", // Rojo para notificaciones
  light: "rgba(13, 42, 77, 0.08)", // Versión transparente del primary
  lightAccent: "rgba(14, 15, 15, 0.1)", // Versión transparente del accent
  drawerBg: "#133B6B", // Fondo del drawer unificado en azul oscuro
  background: "#133B6B", // Fondo unificado para AppBar y Drawer
  textWhite: "#ffffff", // Texto blanco
  textWhiteSecondary: "rgba(255, 255, 255, 0.7)", // Texto blanco secundario
};

const SuperAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // COLORES AZULES PROFESIONALES - Usando institucionales
  const primaryColor = institutionalColors.primary;
  const secondaryColor = institutionalColors.secondary;
  const accentColor = institutionalColors.accent;
  const notificationColor = institutionalColors.notification;
  const background = institutionalColors.background;

  // MENÚ PRINCIPAL para Super Administrador - Solo acceso multi-sistema
  const menuItems = [
    {
      text: "DASHBOARD",
      icon: <DashboardIcon />,
      path: "/supera/dashboard",
      description: "Panel de control multi-sistema",
      // badge: 0,  // Eliminado
    },
    {
      text: "INSTANCIAS",
      icon: <LayersIcon />,
      path: "/supera/instancias",
      description: "Gestión de áreas y sistemas",
      // badge: 2,  // Eliminado
      highlight: true,
    },
    {
      text: "USUARIOS",
      icon: <UsersIcon />,
      path: "/supera/users",
      description: "Gestión de usuarios y roles",
      // badge: 3,  // Eliminado
    },
    {
      text: "EXPEDIENTES",
      icon: <ExpedienteIcon />,
      path: "/supera/expediente-config",
      description: "Configuración de expedientes",
      // badge: 0,  // Eliminado
    },
    {
      text: "REPORTES",
      icon: <ReportsIcon />,
      path: "/supera/reports",
      description: "Reportes y estadísticas",
      // badge: 5,  // Eliminado
    },
    {
      text: "AUDITORÍA",
      icon: <HistoryIcon />,
      path: "/supera/audit",
      description: "Registro de todas las instancias",
      // badge: 0,  // Eliminado
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

  // Función para verificar si la ruta está activa
  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  // Contenido del drawer unificado en azul para Super Admin
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: background,
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Header del Drawer - Unificado en azul */}
      <Box
        sx={{
          p: open ? 3 : 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          bgcolor: "transparent",
          display: "flex",
          flexDirection: open ? "row" : "column",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          gap: open ? 2 : 0,
          minHeight: 80,
        }}
      >
        <Avatar
          sx={{
            width: open ? 48 : 40,
            height: open ? 48 : 40,
            bgcolor: "white",
            color: primaryColor,
            fontSize: open ? "1.2rem" : "1rem",
            fontWeight: "bold",
            border: "3px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          SA
        </Avatar>

        {open && (
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
                fontSize: "1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {user?.name?.split(" ")[0] || "Supera"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                display: "block",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              Super Administrador
            </Typography>
          </Box>
        )}

        {open && (
          <Chip
            label="SUPERA"
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 800,
              fontSize: "0.7rem",
              height: 22,
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          />
        )}
      </Box>

      {/* Menú Principal - Con elementos en blanco sobre azul */}
      <Box
        sx={{
          flex: 1,
          p: open ? 2 : 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 800,
            fontSize: "0.7rem",
            letterSpacing: "1px",
            textTransform: "uppercase",
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            mt: 1,
          }}
        >
          Gestión Multi-Sistema
        </Typography>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);
            const isHighlight = item.highlight;

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  mb: 0.5,
                  "&:last-child": { mb: 0 },
                }}
              >
                <Tooltip
                  title={!open ? `${item.text} - ${item.description}` : ""}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive}
                    sx={{
                      minHeight: 48,
                      borderRadius: "8px",
                      px: open ? 2 : 1.5,
                      py: 1.5,
                      mx: open ? 0 : 0.5,
                      borderLeft: isHighlight ? "3px solid white" : "none",
                      background: isHighlight
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        borderLeft: `3px solid ${accentColor}`,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                        },
                        "& .MuiListItemIcon-root": {
                          color: accentColor,
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                          fontWeight: 700,
                        },
                        "& .MuiListItemText-secondary": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(3px)",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: open ? 40 : "auto",
                        color: isActive
                          ? accentColor
                          : "rgba(255, 255, 255, 0.8)",
                        justifyContent: "center",
                        mr: open ? 2 : 0,
                      }}
                    >
                      {/* Eliminado el Badge, mostramos solo el ícono */}
                      {item.icon}
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.text}
                        secondary={item.description}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: "0.85rem",
                            fontWeight: isActive ? 700 : 600,
                            color: "white",
                            letterSpacing: "0.1px",
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.6)",
                            mt: 0.25,
                          },
                        }}
                      />
                    )}

                    {/* Eliminado el Chip de badge al final */}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        {/* Espacio adicional para separación */}
        <Box sx={{ flex: 1 }} />
      </Box>

      {/* Footer del Drawer - Unificado en azul */}
      <Box
        sx={{
          p: open ? 2 : 1.5,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          bgcolor: "transparent",
        }}
      >
        {open ? (
          <Stack spacing={1.5}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  display: "block",
                }}
              >
                SICAG Multi-System v1.0
              </Typography>
              
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                py: 1,
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "white",
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Cerrar Sesión
            </Button>
          </Stack>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Cerrar sesión" placement="right">
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>

            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.6rem",
                fontWeight: 600,
              }}
            >
              v1.0
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* AppBar superior - MISMO COLOR AZUL que el Drawer */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: background,
          color: "white",
          width: "100%",
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${layoutConstants.appBarHeight}px`,
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Lado izquierdo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              gap: 2,
            }}
          >
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={
                isMobile ? handleDrawerToggle : handleDesktopDrawerToggle
              }
              edge="start"
              sx={{
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo y título */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => navigate("/supera/dashboard")}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "white",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: primaryColor,
                    fontWeight: 900,
                    fontSize: "1.2rem",
                  }}
                >
                  SA
                </Typography>
              </Box>

              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: "white",
                  fontSize: "1.4rem",
                  display: { xs: "none", sm: "block" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                SICAG
              </Typography>

              <Chip
                label="SUPERA"
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  height: 24,
                  display: { xs: "none", md: "flex" },
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              />
            </Box>

            {/* Indicador de ruta actual */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                ml: 3,
                px: 2,
                py: 0.5,
                bgcolor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "0.8rem",
                }}
              >
                {menuItems.find((item) => isActivePath(item.path))?.text ||
                  "Dashboard"}
              </Typography>
            </Box>
          </Box>

          {/* Lado derecho */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Botón de notificaciones globales - AHORA EN ROJO */}
            <Tooltip title="Alertas globales">
              <IconButton
                color="inherit"
                component={Link}
                to="/supera/alerts"
                sx={{
                  color: "white",
                  position: "relative",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Badge
                  badgeContent={12}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.6rem",
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Separador */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: 24,
                alignSelf: "center",
                mx: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            />

            {/* Perfil del Super Admin */}
            <Tooltip title="Mi perfil de Supera">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={handleProfileMenuOpen}
              >
                <Box
                  sx={{
                    textAlign: "right",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name?.split(" ")[0] || "Supera"}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    Super Administrador
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "white",
                    color: primaryColor,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {user?.name?.charAt(0) || "S"}
                </Avatar>

                <ArrowDropDownIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menú de perfil - Super Admin */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 300,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(13, 42, 77, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${institutionalColors.primary} 0%, ${institutionalColors.secondary} 100%)`,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "white",
                color: primaryColor,
                fontSize: "1.4rem",
                fontWeight: "bold",
                border: "3px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {user?.name?.charAt(0) || "S"}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {user?.name || "Super Administrador"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
              >
                Acceso Multi-Sistema
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={user?.region || "Todas las regiones"}
              size="small"
              icon={<LocationIcon />}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 700,
                mb: 0.5,
                "& .MuiChip-icon": { color: "white" },
              }}
            />
            <Chip
              label="Supera"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 700,
                mb: 0.5,
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            />
            <Chip
              label="5 instancias"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 700,
                mb: 0.5,
              }}
            />
          </Stack>
        </Box>

        <MenuItem
          component={Link}
          to="/supera/profile"
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon sx={{ color: primaryColor }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Mi Perfil"
            secondary="Perfil de Super Administrador"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem
          component={Link}
          to="/supera/instancias"
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon sx={{ color: primaryColor }}>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText
            primary="Gestión de Instancias"
            secondary="Administrar todas las áreas"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: "rgba(13, 42, 77, 0.1)" }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            color: "#dc2626",
            "&:hover": {
              bgcolor: "rgba(220, 38, 38, 0.04)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#dc2626" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            primaryTypographyProps={{ fontWeight: 700 }}
          />
        </MenuItem>
      </Menu>

      {/* Drawer (Barra lateral) - MISMO COLOR AZUL que el AppBar */}
      <Box
        component="nav"
        sx={{
          width: {
            sm: open
              ? layoutConstants.drawerWidth
              : layoutConstants.collapsedDrawerWidth,
          },
          flexShrink: { sm: 0 },
          zIndex: theme.zIndex.drawer,
        }}
      >
        {/* Drawer temporal para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: layoutConstants.drawerWidth,
              boxSizing: "border-box",
              bgcolor: background,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer permanente para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: open
                ? layoutConstants.drawerWidth
                : layoutConstants.collapsedDrawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: background,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            },
          }}
          open={open}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 3.5, lg: 4 },
          mt: `${layoutConstants.appBarHeight}px`,
          width: {
            xs: "100%",
            sm: open
              ? `calc(100% - ${layoutConstants.drawerWidth}px)`
              : `calc(100% - ${layoutConstants.collapsedDrawerWidth}px)`,
          },
          ml: { xs: 0, sm: "auto" },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          bgcolor: "#f8fafc",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default SuperAdminLayout;
