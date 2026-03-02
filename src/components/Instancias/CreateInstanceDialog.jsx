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
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import { FiberNew as NewIcon } from "@mui/icons-material";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f8f9fa',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#2c3e50',  // Texto principal
  textSecondary: '#7f8c8d', // Texto secundario
  success: '#27ae60',      // Verde para éxito
  warning: '#f39c12',      // Naranja para advertencias
  error: '#e74c3c',        // Rojo para errores
  info: '#3498db',         // Azul para información
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
              Complete la información para registrar una nueva instancia
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider sx={{ borderColor: institutionalColors.lightBlue }} />

      <DialogContent sx={{ py: 4, bgcolor: 'white' }}>
        <Grid container spacing={3}>
          {/* Nombre */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Nombre *
            </Typography>
            <TextField 
              fullWidth 
              size="small" 
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Código */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Código *
            </Typography>
            <TextField 
              fullWidth 
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Estado */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Estado
            </Typography>
            <FormControl fullWidth size="small">
              <Select 
                defaultValue="active"
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                <MenuItem value="active">Activa</MenuItem>
                <MenuItem value="inactive">Inactiva</MenuItem>
                <MenuItem value="suspended">Suspendida</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Activa */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Activa
            </Typography>
            <FormControl fullWidth size="small">
              <Select 
                defaultValue={true}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                <MenuItem value={true}>Sí</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Color Primario */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Color Primario
            </Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              defaultValue={institutionalColors.primary}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Color Secundario */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Color Secundario
            </Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              defaultValue={institutionalColors.secondary}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Color Acento */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Color Acento
            </Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              defaultValue={institutionalColors.success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Admin Nombre */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Nombre del Administrador
            </Typography>
            <TextField 
              fullWidth 
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Admin Email */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Email del Administrador
            </Typography>
            <TextField 
              fullWidth 
              size="small" 
              type="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Descripción
            </Typography>
            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider sx={{ borderColor: institutionalColors.lightBlue }} />

      {/* ACTIONS */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: institutionalColors.background }}>
        <Button 
          onClick={onClose} 
          variant="text" 
          sx={{ 
            textTransform: "none",
            color: institutionalColors.textSecondary,
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2,
            boxShadow: 2,
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