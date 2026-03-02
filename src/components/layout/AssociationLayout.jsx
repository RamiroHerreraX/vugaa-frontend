// src/layouts/CommitteeLayout.jsx
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
  Gavel as ReviewIcon,
  Folder as ExpedienteIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { roleThemes, layoutConstants } from "../../theme";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#133B6B',    // Azul medio
  accent: '#3A6EA5',       // Celeste/cyan para acentos
  light: 'rgba(13, 42, 77, 0.08)',  // Versión transparente del primary
  lightAccent: 'rgba(0, 194, 209, 0.1)', // Versión transparente del accent
  drawerBg: '#133B6B',     // Fondo del drawer unificado en azul oscuro
};

const CommitteeLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // COLORES del tema comité - Usando colores institucionales
  const primaryColor = institutionalColors.primary;
  const secondaryColor = institutionalColors.secondary;
  const accentColor = institutionalColors.accent;

  // MENÚ PRINCIPAL - Solo rutas que existen
  const menuItems = [
    {
      text: "PANEL DE CONTROL",
      icon: <DashboardIcon />,
      path: "/association/dashboard",
      description: "Panel de control general",
      badge: 0,
    },
    {
      text: "EXPEDIENTE",
      icon: <ExpedienteIcon />,
      path: "/association/expediente",
      description: "Control de documentos",
      badge: 0,
    },
    {
      text: "CONTROL ASOCIADOS",
      icon: <ReviewIcon />,
      path: "/association/control-asociados",
      description: "Revisión de certificaciones",
      badge: 0,
    },
    {
      text: "AUDITORÍA",
      icon: <HistoryIcon />,
      path: "/association/audit",
      description: "Registro de auditoría",
      badge: 0,
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

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // Función para verificar si la ruta está activa
  const isActivePath = (path) => {
    if (path === "/association/dashboard") {
      return location.pathname === "/association/dashboard";
    }
    if (path === "/association/review") {
      return (
        location.pathname.startsWith("/association/review") ||
        location.pathname.startsWith("/association/document")
      );
    }
    return location.pathname.startsWith(path);
  };

  // Contenido del drawer unificado en azul
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: institutionalColors.drawerBg,
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
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          Navegación
        </Typography>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);
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
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        borderLeft: `3px solid ${accentColor}`,
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                        },
                        "& .MuiListItemIcon-root": {
                          color: accentColor,
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                          fontWeight: 600,
                        },
                        "& .MuiListItemText-secondary": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(2px)",
                        transition: "all 0.2s",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: open ? 40 : "auto",
                        color: isActive ? accentColor : "rgba(255, 255, 255, 0.8)",
                        justifyContent: "center",
                        mr: open ? 2 : 0,
                      }}
                    >
                      {item.badge > 0 ? (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          size="small"
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.6rem",
                              height: 16,
                              minWidth: 16,
                            },
                          }}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.text}
                        secondary={item.description}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: "0.85rem",
                            fontWeight: isActive ? 600 : 500,
                            color: "white",
                            letterSpacing: "0.2px",
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

                    {open && item.badge > 0 && (
                      <Chip
                        label={item.badge}
                        size="small"
                        color="error"
                        sx={{
                          ml: "auto",
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      />
                    )}
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
                  fontWeight: 500,
                  display: "block",
                }}
              >
                SICAG Asociado v1.0
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.65rem",
                  display: "block",
                }}
              >
                Región: {user?.region || "Todas"}
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
                fontWeight: 600,
                fontSize: "0.85rem",
                py: 1,
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
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
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
                fontWeight: 500,
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
      {/* AppBar superior - Con colores institucionales */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${institutionalColors.primary} 0%, ${institutionalColors.secondary} 100%)`,
          color: "white",
          width: "100%",
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
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
              onClick={() => navigate("/committee/dashboard")}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "white",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: primaryColor,
                    fontWeight: 800,
                    fontSize: "1rem",
                  }}
                >
                  S
                </Typography>
              </Box>

              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "1.25rem",
                  display: { xs: "none", sm: "block" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                SICAG
              </Typography>

              <Chip
                label="ASOCIACIÓN"
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
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
                borderRadius: "6px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
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
            {/* Botón de notificaciones */}
            <Tooltip title="Alertas y notificaciones">
              <IconButton
                color="inherit"
                component={Link}
                to="/association/alerts"
                sx={{
                  color: "white",
                  position: "relative",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Badge
                  badgeContent={8}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.6rem",
                      height: 16,
                      minWidth: 16,
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
                bgcolor: "rgba(255, 255, 255, 0.2)",
              }}
            />

            {/* Perfil del usuario */}
            <Tooltip title="Mi perfil">
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
                      fontWeight: 600,
                      color: "white",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name?.split(" ")[0] || "Miembro"}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    Asociación Aduanal 
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "white",
                    color: primaryColor,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {user?.name?.charAt(0) || "C"}
                </Avatar>

                <ArrowDropDownIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menú de perfil */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 280,
            borderRadius: "12px",
            overflow: "hidden",
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
                width: 48,
                height: 48,
                bgcolor: "white",
                color: primaryColor,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0) || "C"}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "white" }}
              >
                {user?.name || "Miembro Comité"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}
              >
                Comité de Cumplimiento
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              label={user?.region || "Todas"}
              size="small"
              icon={<LocationIcon />}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
            <Chip
              label="Activo"
              size="small"
              sx={{
                bgcolor: accentColor,
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <MenuItem
          component={Link}
          to="/association/profile"
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: primaryColor }} />
          </ListItemIcon>
          <ListItemText
            primary="Mi Perfil"
            secondary="Información personal y preferencias"
          />
        </MenuItem>

        <Divider />

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
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>

      {/* Menú de configuración */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: "12px",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: primaryColor }} />
          </ListItemIcon>
          <ListItemText primary="Preferencias" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <NotificationsIcon sx={{ color: primaryColor }} />
          </ListItemIcon>
          <ListItemText primary="Notificaciones" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EmailIcon sx={{ color: primaryColor }} />
          </ListItemIcon>
          <ListItemText primary="Configuración de correo" />
        </MenuItem>
      </Menu>

      {/* Drawer (Barra lateral) - Unificado en azul */}
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
              bgcolor: institutionalColors.drawerBg,
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
              bgcolor: institutionalColors.drawerBg,
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

export default CommitteeLayout;