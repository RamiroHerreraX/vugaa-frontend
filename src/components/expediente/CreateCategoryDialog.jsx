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
} from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { IconSelector, IconPreview } from './IconComponents';

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f5f7fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
};

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
          
          {/* Selector de íconos */}
          <IconSelector 
            value={category.icon}
            onChange={(newIcon) => setCategory({...category, icon: newIcon})}
          />

          {/* Vista previa del ícono */}
          <IconPreview icon={category.icon} />
          
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