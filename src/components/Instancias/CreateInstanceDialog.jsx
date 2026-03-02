import React from "react";
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
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import { FiberNew as NewIcon } from "@mui/icons-material";

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  background: '#f8f9fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
};

const CreateInstanceDialog = ({ open, onClose }) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${institutionalColors.lightBlue}`,
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ pb: 1, bgcolor: institutionalColors.background }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: institutionalColors.lightBlue,
              color: institutionalColors.primary,
              width: 40,
              height: 40,
            }}
          >
            <NewIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: institutionalColors.primary }}>
              Crear Nueva Instancia
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              Complete la información requerida
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider sx={{ borderColor: institutionalColors.lightBlue }} />

      <DialogContent sx={{ py: 4 }}>
        <Grid container spacing={3}>

          {/* Nombre */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Nombre *
            </Typography>
            <TextField fullWidth size="small" />
          </Grid>

          {/* Código */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Código *
            </Typography>
            <TextField fullWidth size="small" />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Descripción
            </Typography>
            <TextField fullWidth multiline rows={3} size="small" />
          </Grid>

          {/* Colores */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Primario
            </Typography>
            <TextField type="color" fullWidth size="small" />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Secundario
            </Typography>
            <TextField type="color" fullWidth size="small" />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Acento
            </Typography>
            <TextField type="color" fullWidth size="small" />
          </Grid>

          {/* Admin */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Nombre del Administrador
            </Typography>
            <TextField fullWidth size="small" />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Email del Administrador
            </Typography>
            <TextField fullWidth size="small" type="email" />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider sx={{ borderColor: institutionalColors.lightBlue }} />

      {/* ACTIONS */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: institutionalColors.background }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2,
            bgcolor: institutionalColors.primary,
            '&:hover': {
              bgcolor: institutionalColors.secondary,
            }
          }}
        >
          Crear Instancia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInstanceDialog;