import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
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
  Stack
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as CertificationsIcon,
  Folder as ExpedienteIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AssignmentTurnedIn as AuditIcon,
  Gavel as DeclaracionesIcon2,
  Help as HelpIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from "../../context/AuthContext";;

const drawerWidth = 240;
const collapsedDrawerWidth = 72;

// Colores institucionales (exactamente los mismos que CommitteeLayout)
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#133B6B',    // Azul medio
  accent: '#3A6EA5',       // Celeste/cyan para acentos
  light: 'rgba(13, 42, 77, 0.08)',  // Versión transparente del primary
  lightAccent: 'rgba(0, 194, 209, 0.1)', // Versión transparente del accent
  drawerBg: '#133B6B',     // Fondo del drawer unificado en azul oscuro
};

// Tema para el layout principal (adaptado de CommitteeLayout)
const theme = {
  primary: institutionalColors.primary,
  secondary: institutionalColors.secondary,
  accent: institutionalColors.accent,
  sidebar: institutionalColors.drawerBg,
  active: 'rgba(255, 255, 255, 0.15)',
  text: '#FFFFFF',
  icon: 'rgba(255, 255, 255, 0.8)',
  appBarBg: `linear-gradient(135deg, ${institutionalColors.primary} 0%, ${institutionalColors.secondary} 100%)`,
  hoverBg: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.1)',
  grayLight: '#f8fafc',
  grayMedium: 'rgba(255, 255, 255, 0.7)',
  darkBlue: institutionalColors.primary
};

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const themeMUI = useTheme();
  const isMobile = useMediaQuery(themeMUI.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(!isMobile);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  // Función para verificar si la ruta está activa
  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { text: 'PANEL DE CONTROL', icon: <DashboardIcon />, path: '/dashboard', description: 'Panel de control general' },
    { text: 'EXPEDIENTE', icon: <ExpedienteIcon />, path: '/dashboard/expediente', description: 'Gestión de expedientes' },
    { text: 'CERTIFICADOS', icon: <CertificationsIcon />, path: '/dashboard/certificaciones', description: 'Certificaciones y documentos' },
    { text: 'DECLARACIÓN', icon: <DeclaracionesIcon2 />, path: '/dashboard/declaraciones', description: 'Declaraciones aduanales' },
    { text: 'AUDITORIA', icon: <AuditIcon />, path: '/dashboard/auditoria-agente', description: 'Auditoría y cumplimiento' },
    
  ];

  // drawerContent con los colores y estilos del CommitteeLayout
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
        <Avatar
          sx={{
            width: open ? 48 : 40,
            height: open ? 48 : 40,
            bgcolor: "white",
            color: theme.primary,
            fontSize: open ? "1.2rem" : "1rem",
            fontWeight: "bold",
            border: "3px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {user?.name?.charAt(0) || "U"}
        </Avatar>

        {open && (
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "white",
                lineHeight: 1.2,
                fontSize: "1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {user?.name?.split(" ")[0] || "Usuario"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                display: "block",
                fontWeight: 500,
              }}
            >
              {user?.role === 'agente' ? 'Agente Aduanal' : 
               user?.role === 'profesionista' ? 'Profesionista' : 
               user?.role === 'empresario' ? 'Empresario' : 'Usuario'}
            </Typography>
          </Box>
        )}

        {open && (
          <Chip
            label="SICAG"
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 20,
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
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          Funcionalidades
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
                      minHeight: 56,
                      borderRadius: "8px",
                      px: open ? 2 : 1.5,
                      py: 2,
                      mx: open ? 0 : 0.5,
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        borderLeft: `3px solid ${theme.accent}`,
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                        },
                        "& .MuiListItemIcon-root": {
                          color: theme.accent,
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
                        color: isActive ? theme.accent : "rgba(255, 255, 255, 0.8)",
                        justifyContent: "center",
                        mr: open ? 2 : 0,
                      }}
                    >
                      {item.icon}
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
                SICAG v1.0
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
          zIndex: themeMUI.zIndex.drawer + 1,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
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
              onClick={() => navigate("/dashboard")}
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
                    color: theme.primary,
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
                label={user?.role === 'agente' ? 'AGENTE' : 
                       user?.role === 'profesionista' ? 'PROFESIONISTA' : 
                       user?.role === 'empresario' ? 'EMPRESARIO' : 'USUARIO'}
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
                to="/dashboard/notificaciones"
                sx={{
                  color: "white",
                  position: "relative",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Badge
                  
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
                    {user?.name?.split(" ")[0] || "Usuario"}
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
                    {user?.role === 'agente' ? 'Agente Aduanal' : 
                     user?.role === 'profesionista' ? 'Profesionista' : 
                     user?.role === 'empresario' ? 'Empresario' : 'Usuario'}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "white",
                    color: theme.primary,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {user?.name?.charAt(0) || "U"}
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
                color: theme.primary,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "white" }}
              >
                {user?.name || "Usuario"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}
              >
                {user?.role === 'agente' ? 'Agente Aduanal' : 
                 user?.role === 'profesionista' ? 'Profesionista' : 
                 user?.role === 'empresario' ? 'Empresario' : 'Usuario'}
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
                bgcolor: theme.accent,
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <MenuItem
          component={Link}
          to="/dashboard/perfil"
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: theme.primary }} />
          </ListItemIcon>
          <ListItemText
            primary="Mi Perfil"
            secondary="Información personal y preferencias"
          />
        </MenuItem>

        <MenuItem
          component={Link}
          to="/sitemap"
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <HelpIcon sx={{ color: theme.primary }} />
          </ListItemIcon>
          <ListItemText
            primary="Ayuda y Soporte"
            secondary="Documentación y contacto"
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
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: "12px",
          },
        }}
      >
        <MenuItem onClick={handleSettingsMenuClose}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: theme.primary }} />
          </ListItemIcon>
          <ListItemText primary="Preferencias" />
        </MenuItem>
        <MenuItem onClick={handleSettingsMenuClose}>
          <ListItemIcon>
            <NotificationsIcon sx={{ color: theme.primary }} />
          </ListItemIcon>
          <ListItemText primary="Notificaciones" />
        </MenuItem>
        <MenuItem onClick={handleSettingsMenuClose}>
          <ListItemIcon>
            <EmailIcon sx={{ color: theme.primary }} />
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
              ? drawerWidth
              : collapsedDrawerWidth,
          },
          flexShrink: { sm: 0 },
          zIndex: themeMUI.zIndex.drawer,
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
              width: drawerWidth,
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
                ? drawerWidth
                : collapsedDrawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: institutionalColors.drawerBg,
              transition: themeMUI.transitions.create("width", {
                easing: themeMUI.transitions.easing.sharp,
                duration: themeMUI.transitions.duration.standard,
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
          mt: "64px",
          width: {
            xs: "100%",
            sm: open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${collapsedDrawerWidth}px)`,
          },
          ml: { xs: 0, sm: "auto" },
          transition: themeMUI.transitions.create(["width", "margin"], {
            easing: themeMUI.transitions.easing.sharp,
            duration: themeMUI.transitions.duration.standard,
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

export default MainLayout;