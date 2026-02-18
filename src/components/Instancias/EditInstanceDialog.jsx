// src/pages/superadmin/components/EditInstanceDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Stack
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const EditInstanceDialog = ({ open, onClose, instance }) => {
  const [formData, setFormData] = useState(instance);

  useEffect(() => {
    setFormData(instance);
  }, [instance]);

  if (!instance) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <EditIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Editar Instancia
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              size="small"
              value={formData?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              size="small"
              multiline
              rows={3}
              value={formData?.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Administrador"
              size="small"
              value={formData?.admin || ''}
              onChange={(e) => handleChange('admin', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button variant="contained" onClick={onClose}>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstanceDialog;
