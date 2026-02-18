// src/pages/superadmin/components/CreateInstanceDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { FiberNew as NewIcon } from '@mui/icons-material';

const CreateInstanceDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <NewIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Crear Nueva Instancia
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Nombre" size="small" required />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Código" size="small" required />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo">
                <MenuItem value="academic">Área Académica</MenuItem>
                <MenuItem value="department">Departamento</MenuItem>
                <MenuItem value="program">Programa</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Descripción" size="small" />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Administrador" size="small" required />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button variant="contained" onClick={onClose}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInstanceDialog;
