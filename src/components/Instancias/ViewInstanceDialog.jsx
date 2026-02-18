// src/pages/superadmin/components/ViewInstanceDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Avatar,
  Chip,
  Box
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const ViewInstanceDialog = ({ open, onClose, instance }) => {
  if (!instance) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <VisibilityIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Detalles de la Instancia
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: instance.colors.primary }}>
              {instance.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography fontWeight="bold">{instance.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {instance.code}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2">{instance.description}</Typography>

          <Chip
            label={instance.status}
            sx={{
              bgcolor: `${instance.colors.primary}20`,
              color: instance.colors.primary,
              width: 'fit-content'
            }}
          />

          <Typography variant="body2">
            👤 Administrador: {instance.admin}
          </Typography>

          <Typography variant="body2">
            📧 Email: {instance.email}
          </Typography>

          <Typography variant="body2">
            📅 Creada: {instance.created}
          </Typography>

          <Typography variant="body2">
            👥 Usuarios: {instance.users}
          </Typography>

          <Typography variant="body2">
            📚 Certificaciones: {instance.certifications}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInstanceDialog;
