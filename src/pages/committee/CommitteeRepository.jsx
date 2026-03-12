// src/pages/committee/CommitteeRepository.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CreateNewFolder as CreateNewFolderIcon,
  CloudUpload as CloudUploadIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Gavel as GavelIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const colors = {
  primary: {
    dark: '#0D2A4D',
    main: '#133B6B',
    light: '#3A6EA5'
  },
  secondary: {
    main: '#00A8A8',
    light: '#00C2D1'
  },
  accents: {
    blue: '#0099FF',
    purple: '#6C5CE7'
  },
  status: {
    warning: '#00C2D1',
    error: '#0099FF',
    info: '#3A6EA5',
    success: '#00A8A8'
  },
  text: {
    primary: '#0D2A4D',
    secondary: '#3A6EA5'
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    subtle: '#f5f7fa'
  }
};

const CommitteeRepository = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Estructura de carpetas del repositorio del comité
  const [folderStructure, setFolderStructure] = useState({
    '/': {
      name: 'Raíz',
      type: 'folder',
      items: [
        { id: 1, name: 'Estatutos', type: 'folder', path: '/estatutos', items: [
          { id: 11, name: 'Artículo 88-90.pdf', type: 'file', size: '245 KB', modified: '15/01/2026', icon: <PdfIcon /> },
          { id: 12, name: 'Reglamento Interno.pdf', type: 'file', size: '180 KB', modified: '15/01/2026', icon: <PdfIcon /> },
        ]},
        { id: 2, name: 'Actas de Reuniones', type: 'folder', path: '/actas', items: [
          { id: 21, name: 'Acta 2026-01-15.pdf', type: 'file', size: '320 KB', modified: '15/01/2026', icon: <PdfIcon /> },
          { id: 22, name: 'Acta 2026-01-08.pdf', type: 'file', size: '298 KB', modified: '08/01/2026', icon: <PdfIcon /> },
          { id: 23, name: 'Acta 2025-12-20.pdf', type: 'file', size: '415 KB', modified: '20/12/2025', icon: <PdfIcon /> },
        ]},
        { id: 3, name: 'Resoluciones', type: 'folder', path: '/resoluciones', items: [
          { id: 31, name: 'Resolución 001-2026.pdf', type: 'file', size: '156 KB', modified: '10/01/2026', icon: <PdfIcon /> },
          { id: 32, name: 'Resolución 002-2026.pdf', type: 'file', size: '142 KB', modified: '12/01/2026', icon: <PdfIcon /> },
        ]},
        { id: 4, name: 'Acuerdos con Instituciones', type: 'folder', path: '/acuerdos', items: [
          { id: 41, name: 'Convenio SAT 2026.pdf', type: 'file', size: '890 KB', modified: '05/01/2026', icon: <PdfIcon /> },
          { id: 42, name: 'Memorándum CAAAREM.pdf', type: 'file', size: '234 KB', modified: '03/01/2026', icon: <PdfIcon /> },
        ]},
        { id: 5, name: 'Lineamientos Operativos', type: 'folder', path: '/lineamientos', items: [
          { id: 51, name: 'Procedimiento Revisión v2.pdf', type: 'file', size: '567 KB', modified: '01/01/2026', icon: <PdfIcon /> },
          { id: 52, name: 'Guía de Validación.pdf', type: 'file', size: '432 KB', modified: '01/01/2026', icon: <PdfIcon /> },
        ]},
        { id: 6, name: 'Minutas de Validación', type: 'folder', path: '/minutas', items: [
          { id: 61, name: 'Minuta 2026-01-14.pdf', type: 'file', size: '178 KB', modified: '14/01/2026', icon: <PdfIcon /> },
          { id: 62, name: 'Minuta 2026-01-13.pdf', type: 'file', size: '203 KB', modified: '13/01/2026', icon: <PdfIcon /> },
        ]},
      ]
    }
  });

  // Función para navegar por las carpetas
  const navigateTo = (path) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const goBack = () => {
    if (currentPath !== '/') {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
      setCurrentPath(parentPath);
    }
  };

  // Obtener elementos de la carpeta actual
  const getCurrentItems = () => {
    if (currentPath === '/') {
      return folderStructure['/'].items;
    }
    
    const pathParts = currentPath.split('/').filter(p => p);
    let current = folderStructure['/'];
    
    for (const part of pathParts) {
      const folder = current.items.find(item => item.type === 'folder' && item.name.toLowerCase() === part);
      if (folder) {
        current = folder;
      } else {
        return [];
      }
    }
    
    return current.items || [];
  };

  const currentItems = getCurrentItems();

  // Obtener breadcrumbs
  const getBreadcrumbs = () => {
    if (currentPath === '/') return [{ name: 'Repositorio del Comité', path: '/' }];
    
    const parts = currentPath.split('/').filter(p => p);
    const breadcrumbs = [{ name: 'Raíz', path: '/' }];
    let currentPathBuild = '';
    
    parts.forEach(part => {
      currentPathBuild += `/${part}`;
      breadcrumbs.push({ name: part, path: currentPathBuild });
    });
    
    return breadcrumbs;
  };

  const handleFileClick = (item) => {
    if (item.type === 'folder') {
      navigateTo(item.path);
    } else {
      setSelectedFile(item);
    }
  };

  const handleUpload = () => {
    setUploadDialog(false);
    setNotification({
      show: true,
      type: 'success',
      message: 'Documento subido exitosamente'
    });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setNewFolderDialog(false);
      setNewFolderName('');
      setNotification({
        show: true,
        type: 'success',
        message: 'Carpeta creada exitosamente'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    }
  };

  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: colors.background.subtle
    }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FolderOpenIcon sx={{ color: colors.primary.main }} />
          Repositorio del Comité
        </Typography>
        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
          Documentos internos, actas, resoluciones y lineamientos del Comité de Cumplimiento
        </Typography>
      </Box>

      {/* Barra de herramientas */}
      <Paper elevation={1} sx={{ p: 1.5, mb: 2, border: `1px solid ${colors.primary.light}20` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.text.secondary }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: colors.primary.light }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Subir documento">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => setUploadDialog(true)}
                  sx={{
                    borderColor: colors.primary.light,
                    color: colors.primary.main,
                    '&:hover': { borderColor: colors.primary.main }
                  }}
                >
                  Subir
                </Button>
              </Tooltip>
              
              <Tooltip title="Nueva carpeta">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CreateNewFolderIcon />}
                  onClick={() => setNewFolderDialog(true)}
                  sx={{
                    borderColor: colors.primary.light,
                    color: colors.primary.main,
                    '&:hover': { borderColor: colors.primary.main }
                  }}
                >
                  Nueva Carpeta
                </Button>
              </Tooltip>
              
              <Tooltip title="Descargar todo">
                <IconButton size="small" sx={{ color: colors.text.secondary }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Breadcrumbs */}
      <Paper elevation={0} sx={{ p: 1, mb: 2, bgcolor: 'transparent' }}>
        <Breadcrumbs aria-label="breadcrumb">
          {getBreadcrumbs().map((crumb, index) => (
            <Link
              key={crumb.path}
              component="button"
              variant="body2"
              onClick={() => navigateTo(crumb.path)}
              sx={{
                cursor: 'pointer',
                color: index === getBreadcrumbs().length - 1 ? colors.primary.main : colors.text.secondary,
                fontWeight: index === getBreadcrumbs().length - 1 ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': {
                  color: colors.primary.main,
                  textDecoration: 'underline'
                }
              }}
            >
              {index === 0 && <HomeIcon sx={{ fontSize: 16 }} />}
              {crumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Paper>

      {/* Notificación */}
      {notification.show && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      {/* Grid de archivos */}
      <Paper elevation={1} sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 2,
        border: `1px solid ${colors.primary.light}20`
      }}>
        {currentPath !== '/' && (
          <Card 
            variant="outlined"
            sx={{ 
              mb: 1,
              cursor: 'pointer',
              borderColor: colors.primary.light,
              '&:hover': { bgcolor: colors.background.subtle }
            }}
            onClick={goBack}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArrowBackIcon sx={{ color: colors.primary.main }} />
                <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                  ...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={1}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  borderColor: selectedFile?.id === item.id ? colors.primary.main : colors.primary.light,
                  bgcolor: selectedFile?.id === item.id ? 'rgba(19, 59, 107, 0.04)' : 'transparent',
                  '&:hover': { 
                    borderColor: colors.primary.main,
                    bgcolor: 'rgba(19, 59, 107, 0.04)'
                  }
                }}
                onClick={() => handleFileClick(item)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      color: item.type === 'folder' ? colors.primary.main : colors.text.secondary,
                      fontSize: '2rem'
                    }}>
                      {item.type === 'folder' ? <FolderIcon fontSize="large" /> : item.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Tooltip title={item.name}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          color: colors.primary.dark,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.name}
                        </Typography>
                      </Tooltip>
                      
                      {item.type === 'file' && (
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {item.size} • {item.modified}
                        </Typography>
                      )}
                    </Box>
                    
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget);
                      }}
                      sx={{ color: colors.text.secondary }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredItems.length === 0 && (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <FolderOpenIcon sx={{ fontSize: 60, color: colors.primary.light, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.text.secondary }}>
              Carpeta vacía
            </Typography>
            <Typography variant="caption" sx={{ color: colors.primary.light }}>
              No hay documentos en esta ubicación
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Diálogo de subida */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: colors.primary.dark }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon sx={{ color: colors.primary.main }} />
            Subir Documento
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            p: 4, 
            border: `2px dashed ${colors.primary.light}`,
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: colors.background.subtle,
            cursor: 'pointer',
            '&:hover': { borderColor: colors.primary.main }
          }}>
            <UploadIcon sx={{ fontSize: 48, color: colors.primary.light, mb: 2 }} />
            <Typography variant="body1" sx={{ color: colors.primary.dark, mb: 1 }}>
              Arrastra y suelta archivos aquí
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              o haz clic para seleccionar
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            sx={{ bgcolor: colors.primary.main }}
          >
            Subir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo nueva carpeta */}
      <Dialog open={newFolderDialog} onClose={() => setNewFolderDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: colors.primary.dark }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreateNewFolderIcon sx={{ color: colors.primary.main }} />
            Nueva Carpeta
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="Nombre de la carpeta"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateFolder}
            disabled={!newFolderName.trim()}
            sx={{ bgcolor: colors.primary.main }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {}}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Descargar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Renombrar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Compartir</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {}} sx={{ color: colors.status.error }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: colors.status.error }} /></ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CommitteeRepository;