import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
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
  Build as BuildIcon,
  Timeline as TimelineIcon,
  InsertDriveFile as FileIcon,
  Article as ArticleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',
  background: '#f5f7fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
};

// Opciones de íconos predefinidos
export const iconOptions = [
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

// ========================================
// Componente 1: IconSelector
// ========================================
export const IconSelector = ({ value, onChange, label = "Ícono", fullWidth = true }) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id="icon-select-label">{label}</InputLabel>
      <Select
        labelId="icon-select-label"
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
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
  );
};

// ========================================
// Componente 2: IconPreview
// ========================================
export const IconPreview = ({ icon, size = 48 }) => {
  const selectedIcon = iconOptions.find(opt => opt.value === icon) || iconOptions[0];

  return (
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
          width: size,
          height: size,
          fontSize: size > 48 ? '2rem' : '1.5rem'
        }}
      >
        {icon}
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
  );
};