// src/components/layout/AdminLayout.jsx
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
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Settings as ConfigIcon,
  Folder as ExpedienteIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AccountCircle as AccountCircleIcon,
  Help as HelpIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon, 
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { roleThemes, layoutConstants, palette } from "../../theme";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(!isMobile);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const adminTheme = roleThemes.admin;
  const primaryColor = palette.primary.main; // #133B6B

  const menuItems = [
    { 
      text: "Panel de control", 
      icon: <DashboardIcon />, 
      path: "/admin/dashboard",
      description: "Panel de control general",
    },
    { 
      text: "Usuarios", 
      icon: <UsersIcon />, 
      path: "/admin/users",
      description: "Gestión de usuarios y roles",
    },
    { 
      text: "Expedientes", 
      icon: <ExpedienteIcon />, 
      path: "/admin/config_expedientes",
      description: "Configuración de expedientes",
    },
    { 
      text: "Declaraciones", 
      icon: <AssignmentIcon />,
      path: "/admin/config_declaraciones",
      description: "Gestión de declaraciones",
    },
    { 
      text: "Reportes", 
      icon: <ReportsIcon />, 
      path: "/admin/reports",
      description: "Reportes y estadísticas",
    },
    { 
      text: "Configuración", 
      icon: <ConfigIcon />, 
      path: "/admin/config",
      description: "Configuración del sistema",
    },
    { 
      text: "Auditoria", 
      icon: <HistoryIcon />,
      path: "/admin/auditoria",
      description: "Registro de actividades del sistema",
    },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDesktopDrawerToggle = () => setOpen(!open);
  const handleLogout = () => { logout(); navigate("/login"); };
  const handleProfileMenuOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);
  const isActivePath = (path) => location.pathname.startsWith(path);

  const drawerWidth = open ? layoutConstants.drawerWidth : layoutConstants.collapsedDrawerWidth;

  const drawerContent = (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      bgcolor: primaryColor,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
      borderRight: `1px solid rgba(255, 255, 255, 0.1)`,
      // Scroll más discreto para el drawer
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '4px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.05)',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      },
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)',
    }}>
      {/* Header del Drawer */}
      <Box sx={{ 
        p: open ? 3 : 2,
        borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        bgcolor: 'transparent',
        display: 'flex',
        flexDirection: open ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        gap: open ? 2 : 0,
        minHeight: 80,
      }}>
        
        {open && (
          <Chip 
            label="Admin"
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: palette.text.primary,
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        )}
      </Box>

      {/* Menú Principal */}
      <Box sx={{ 
        flex: 1,
        p: open ? 2 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2,
            py: 1,
            color: palette.text.secondary,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          Administración
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
                  '&:last-child': { mb: 0 }
                }}
              >
                <Tooltip 
                  title={!open ? `${item.text} - ${item.description}` : ''} 
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive}
                    sx={{
                      minHeight: 48,
                      borderRadius: '8px',
                      px: open ? 2 : 1.5,
                      py: 1.5,
                      mx: open ? 0 : 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        borderLeft: `3px solid ${palette.secondary.main}`,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: palette.text.primary,
                        },
                        '& .MuiTypography-root': {
                          color: palette.text.primary,
                          fontWeight: 600,
                        }
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(2px)',
                        transition: 'all 0.2s',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: open ? 40 : 'auto',
                        color: isActive ? palette.text.primary : palette.text.secondary,
                        justifyContent: 'center',
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
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? palette.text.primary : palette.text.secondary,
                            letterSpacing: '0.2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: '0.75rem',
                            color: palette.text.secondary,
                            mt: 0.25,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer del Drawer */}
      <Box sx={{ 
        p: open ? 2 : 1.5,
        borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
        bgcolor: 'transparent',
      }}>
        {open ? (
          <Stack spacing={1.5}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ 
                color: palette.text.secondary,
                fontSize: '0.7rem',
                fontWeight: 500,
                display: 'block',
              }}>
                SICAG Admin v1.0
              </Typography>
            </Box>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: palette.text.primary,
                fontWeight: 600,
                fontSize: '0.85rem',
                py: 1,
                '&:hover': {
                  borderColor: palette.secondary.main,
                  color: palette.secondary.main,
                  bgcolor: 'rgba(0, 194, 209, 0.1)',
                },
              }}
            >
              Cerrar Sesión
            </Button>
          </Stack>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Cerrar sesión" placement="right">
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{
                  color: palette.text.secondary,
                  '&:hover': {
                    color: palette.secondary.main,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            
            <Typography variant="caption" sx={{ 
              color: palette.text.secondary,
              fontSize: '0.6rem',
              fontWeight: 500,
            }}>
              v1.0
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>

      {/* AppBar superior */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: primaryColor,
          color: palette.text.primary,
          width: "100%",
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Toolbar sx={{ 
          minHeight: `${layoutConstants.appBarHeight}px`,
          px: { xs: 2, sm: 3 },
        }}>
          {/* Lado izquierdo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: 1,
            gap: 2 
          }}>
            <IconButton
              color="inherit"
              onClick={isMobile ? handleDrawerToggle : handleDesktopDrawerToggle}
              edge="start"
              sx={{ 
                color: palette.text.primary,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo y título */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => navigate('/admin/dashboard')}
            >
              <Box sx={{ 
                width: 32, 
                height: 32,
                bgcolor: '#ffffff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: primaryColor,
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  A
                </Typography>
              </Box>
              
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  fontWeight: 700,
                  color: palette.text.primary,
                  fontSize: '1.25rem',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                SICAG
              </Typography>
              
              <Chip 
                label="ADMIN"
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: palette.text.primary,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 22,
                  display: { xs: 'none', md: 'flex' }
                }}
              />
            </Box>
            
            {/* Indicador de ruta actual */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              ml: 3,
              px: 2,
              py: 0.5,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  color: palette.text.primary,
                  fontSize: '0.8rem',
                }}
              >
                {menuItems.find(item => isActivePath(item.path))?.text || 'Dashboard'}
              </Typography>
            </Box>
          </Box>

          {/* Lado derecho */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Botón de notificaciones */}
            <Tooltip title="Ver todas las alertas">
              <IconButton
                color="inherit"
                sx={{ 
                  color: palette.text.secondary,
                  position: 'relative',
                  '&:hover': {
                    color: palette.text.primary,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <Badge 
                  badgeContent={5} 
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                      bgcolor: palette.accent.purple,
                      color: palette.text.primary
                    }
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
                alignSelf: 'center',
                mx: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            />
            
            {/* Perfil del usuario */}
            <Tooltip title="Mi perfil">
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={handleProfileMenuOpen}
              >
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography 
                    variant="body2" 
                    noWrap
                    sx={{ 
                      fontWeight: 600,
                      color: palette.text.primary,
                      fontSize: '0.9rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.nombre?.split(' ')[0] || 'Admin'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    noWrap
                    sx={{ 
                      color: palette.text.secondary,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    Administrador del Sistema
                  </Typography>
                </Box>
                
                <Avatar 
                  sx={{ 
                    width: 36,
                    height: 36,
                    bgcolor: '#ffffff',
                    color: primaryColor,
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    border: `2px solid ${palette.secondary.light}`,
                  }}
                >
                  {user?.nombre?.charAt(0) || 'A'}
                </Avatar>
                
                <ArrowDropDownIcon sx={{ color: palette.text.secondary, fontSize: 20 }} />
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
            borderRadius: '12px',
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ p: 2, bgcolor: primaryColor, borderBottom: `1px solid rgba(255, 255, 255, 0.1)` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 48,
                height: 48,
                bgcolor: '#ffffff',
                color: primaryColor,
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              {user?.nombre?.charAt(0) || 'A'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: palette.text.primary }}>
                {user?.nombre || 'Administrador'}
              </Typography>
              <Typography variant="caption" sx={{ color: palette.text.secondary, fontWeight: 500 }}>
                Administrador del Sistema
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              label={user?.instanciaNombre || 'CAAAREM'}
              size="small"
              icon={<LocationIcon />}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: palette.text.primary,
                fontWeight: 600,
              }}
            />
            <Chip 
              label="Admin"
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                borderColor: palette.secondary.main,
                color: palette.text.primary
              }}
            />
          </Box>
        </Box>
        
        <MenuItem 
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: primaryColor }} />
          </ListItemIcon>
          <ListItemText 
            primary="Mi Perfil"
            secondary="Información personal y preferencias"
            primaryTypographyProps={{ sx: { color: primaryColor } }}
            secondaryTypographyProps={{ sx: { color: 'rgba(19, 59, 107, 0.6)' } }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <HelpIcon sx={{ color: primaryColor }} />
          </ListItemIcon>
          <ListItemText 
            primary="Ayuda y Soporte"
            secondary="Documentación y contacto"
            primaryTypographyProps={{ sx: { color: primaryColor } }}
            secondaryTypographyProps={{ sx: { color: 'rgba(19, 59, 107, 0.6)' } }}
          />
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(19, 59, 107, 0.08)' }} />
        
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            py: 1.5, 
            px: 2,
            color: primaryColor,
            '&:hover': {
              bgcolor: 'rgba(0, 194, 209, 0.04)',
            }
          }}
        >
          <ListItemIcon sx={{ color: palette.accent.purple }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar Sesión"
            primaryTypographyProps={{ fontWeight: 600, sx: { color: palette.accent.purple } }}
          />
        </MenuItem>
      </Menu>

      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          "& .MuiDrawer-paper": {
            width: layoutConstants.drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            borderRight: `1px solid rgba(255, 255, 255, 0.1)`,
            bgcolor: primaryColor,
          },
        }}
        open={open}
      >
        {drawerContent}
      </Drawer>

      {/* Contenido principal con fondo claro y scroll más discreto */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 3.5, lg: 4 },
          mt: `${layoutConstants.appBarHeight}px`,
          width: { 
            xs: '100%',
            sm: open ? `calc(100% - ${layoutConstants.drawerWidth}px)` : `calc(100% - ${layoutConstants.collapsedDrawerWidth}px)`
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          bgcolor: "#f5f5f5",
          minHeight: 'calc(100vh - 64px)',
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          // Scroll más discreto para el contenido principal
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.25)',
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.15) transparent',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;