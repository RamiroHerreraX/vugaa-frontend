import React, { useState } from "react";
import {
  Box,
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
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { FiberNew as NewIcon } from "@mui/icons-material";
import { crearInstancia } from "../../services/Instancia";

const defaultForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  estado: "ACTIVE",
  activa: true,
  colorPrimario: "#1976d2",
  colorSecundario: "#ff9800",
  colorAcento: "#4caf50",
  adminNombre: "",
  adminEmail: "",
};

const CreateInstanceDialog = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  // Para mensaje temporal

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleCrear = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const newInstance = await crearInstancia(form);

      if (onCreated) {
        onCreated(newInstance);
      }

      setForm(defaultForm);

      // cerrar inmediatamente SIN timeout
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              width: 40,
              height: 40,
            }}
          >
            <NewIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Crear Nueva Instancia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete la información para registrar una nueva instancia
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>
              Nombre *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>
              Código *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.codigo}
              onChange={(e) => handleChange("codigo", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>
              Estado
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={form.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
              >
                <MenuItem value="ACTIVE">Activa</MenuItem>
                <MenuItem value="INACTIVE">Inactiva</MenuItem>
                <MenuItem value="SUSPENDED">Suspendida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Color Primario</Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              value={form.colorPrimario}
              onChange={(e) => handleChange("colorPrimario", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Color Secundario</Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              value={form.colorSecundario}
              onChange={(e) => handleChange("colorSecundario", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Color Acento</Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              value={form.colorAcento}
              onChange={(e) => handleChange("colorAcento", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">
              Nombre del Administrador
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.adminNombre}
              onChange={(e) => handleChange("adminNombre", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Email del Administrador</Typography>
            <TextField
              fullWidth
              size="small"
              type="email"
              value={form.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Descripción</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          type="button"
          variant="contained"
          onClick={handleCrear}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Crear Instancia"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInstanceDialog;
