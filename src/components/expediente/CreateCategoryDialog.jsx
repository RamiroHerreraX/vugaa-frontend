import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
} from '@mui/material';
import { 
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Gavel as GavelIcon,
  AttachMoney as AttachMoneyIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Build as BuildIcon,
  Timeline as TimelineIcon,
  InsertDriveFile as FileIcon,
  Article as ArticleIcon,
  Receipt as ReceiptIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f5f7fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
};

// Opciones de íconos predefinidos
const iconOptions = [
  { value: '📁', label: 'Carpeta', icon: <FolderIcon /> },
  { value: '📄', label: 'Documento', icon: <DescriptionIcon /> },
  { value: '👤', label: 'Persona', icon: <PersonIcon /> },
  { value: '💼', label: 'Trabajo', icon: <WorkIcon /> },
  { value: '🎓', label: 'Educación', icon: <SchoolIcon /> },
  { value: '🏢', label: 'Empresa', icon: <BusinessIcon /> },
  { value: '📋', label: 'Lista', icon: <AssignmentIcon /> },
  { value: '⚖️', label: 'Legal', icon: <GavelIcon /> },
  { value: '💰', label: 'Finanzas', icon: <AttachMoneyIcon /> },
  { value: '🛡️', label: 'Seguridad', icon: <SecurityIcon /> },
  { value: '📊', label: 'Estadísticas', icon: <TrendingUpIcon /> },
  { value: '🔧', label: 'Herramientas', icon: <BuildIcon /> },
  { value: '📈', label: 'Gráfico', icon: <TimelineIcon /> },
  { value: '📃', label: 'Archivo', icon: <FileIcon /> },
  { value: '📑', label: 'Artículo', icon: <ArticleIcon /> },
  { value: '🧾', label: 'Recibo', icon: <ReceiptIcon /> },
];

const CreateCategoryDialog = ({ open, onClose, onSave }) => {
  const [category, setCategory] = React.useState({
    name: '',
    description: '',
    icon: '📁',
    required: false,
    order: 1
  });

  React.useEffect(() => {
    if (open) {
      setCategory({
        name: '',
        description: '',
        icon: '📁',
        required: false,
        order: 1
      });
    }
  }, [open]);

  const handleSave = () => {
    if (!category.name) return;
    onSave({ ...category, id: Date.now() });
  };

  // Encontrar el ícono seleccionado para mostrar preview
  const selectedIcon = iconOptions.find(opt => opt.value === category.icon) || iconOptions[0];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FolderIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
            Nueva Categoría
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre de la Categoría *"
            value={category.name}
            onChange={(e) => setCategory({...category, name: e.target.value})}
            helperText="Ej: Documentación Personal"
          />
          
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={2}
            value={category.description}
            onChange={(e) => setCategory({...category, description: e.target.value})}
            helperText="Describe el propósito de esta categoría"
          />
          
          {/* Selector de íconos - ahora ocupa todo el ancho */}
          <FormControl fullWidth>
            <InputLabel id="icon-select-label">Ícono</InputLabel>
            <Select
              labelId="icon-select-label"
              value={category.icon}
              label="Ícono"
              onChange={(e) => setCategory({...category, icon: e.target.value})}
              renderValue={(selected) => {
                const icon = iconOptions.find(opt => opt.value === selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ fontSize: '1.2rem' }}>{selected}</Box>
                    <Typography variant="body2">{icon?.label}</Typography>
                  </Box>
                );
              }}
            >
              {iconOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ fontSize: '1.2rem' }}>{option.value}</Box>
                    <Typography variant="body2">{option.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Vista previa del ícono - con color por defecto */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            bgcolor: institutionalColors.background,
            borderRadius: 1,
            border: `1px solid ${institutionalColors.lightBlue}`
          }}>
            <Avatar
              sx={{
                bgcolor: institutionalColors.primary,
                width: 48,
                height: 48,
                fontSize: '1.5rem'
              }}
            >
              {category.icon}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: institutionalColors.textPrimary }}>
                Vista previa
              </Typography>
              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                {selectedIcon?.label}
              </Typography>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            label="Orden"
            type="number"
            value={category.order}
            onChange={(e) => setCategory({...category, order: parseInt(e.target.value)})}
            helperText="Número de orden en la lista"
            inputProps={{ min: 1 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={category.required}
                onChange={(e) => setCategory({...category, required: e.target.checked})}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: institutionalColors.primary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: institutionalColors.primary,
                  }
                }}
              />
            }
            label="Categoría Obligatoria"
          />
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} sx={{ color: institutionalColors.textSecondary }}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!category.name}
          sx={{
            bgcolor: institutionalColors.primary,
            '&:hover': { bgcolor: institutionalColors.secondary }
          }}
        >
          Crear Categoría
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;