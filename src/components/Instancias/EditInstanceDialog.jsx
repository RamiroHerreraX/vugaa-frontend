import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const statusMapBackendToSelect = { ACTIVE: "active", INACTIVE: "inactive", MAINTENANCE: "suspended" };
const statusMapSelectToBackend = { active: "ACTIVE", inactive: "INACTIVE", suspended: "MAINTENANCE" };

const defaultForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  estado: "active",
  activa: true,
  colorPrimario: "#1976d2",
  colorSecundario: "#ff9800",
  colorAcento: "#4caf50",
  logoUrl: "",
  adminNombre: "",
  adminEmail: "",
};

const EditInstanceDialog = ({ open, onClose, instance, onSave }) => {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (instance && open) {
      setFormData({
        nombre: instance.nombre || "",
        codigo: instance.codigo || "",
        descripcion: instance.descripcion || "",
        estado: statusMapBackendToSelect[instance.estado?.toUpperCase()] || "active",
        activa: instance.activa ?? true,
        colorPrimario: instance.colorPrimario || "#1976d2",
        colorSecundario: instance.colorSecundario || "#ff9800",
        colorAcento: instance.colorAcento || "#4caf50",
        logoUrl: instance.logoUrl || "",
        adminNombre: instance.adminNombre || "",
        adminEmail: instance.adminEmail || "",
      });
    } else if (!open) setFormData(defaultForm);
  }, [instance, open]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!instance) return;
    const dataToSend = { ...instance, ...formData, estado: statusMapSelectToBackend[formData.estado] || formData.estado };
    if (onSave) requestAnimationFrame(() => onSave(dataToSend));
    onClose();
  };

  if (!instance) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <EditIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>Editar Instancia</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>Nombre *</Typography>
            <TextField fullWidth size="small" value={formData.nombre} onChange={e => handleChange("nombre", e.target.value)} />
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>Código *</Typography>
            <TextField fullWidth size="small" value={formData.codigo} onChange={e => handleChange("codigo", e.target.value)} />
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>Estado</Typography>
            <FormControl fullWidth size="small">
              <Select value={formData.estado} onChange={e => handleChange("estado", e.target.value)}>
                <MenuItem value="active">Activa</MenuItem>
                <MenuItem value="inactive">Inactiva</MenuItem>
                <MenuItem value="suspended">Suspendida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600}>Activa</Typography>
            <FormControl fullWidth size="small">
              <Select value={formData.activa} onChange={e => handleChange("activa", e.target.value === "true")}>
                <MenuItem value={true}>Sí</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}><Typography>Color Primario</Typography><TextField type="color" fullWidth size="small" value={formData.colorPrimario} onChange={e => handleChange("colorPrimario", e.target.value)} /></Grid>
          <Grid xs={12} md={4}><Typography>Color Secundario</Typography><TextField type="color" fullWidth size="small" value={formData.colorSecundario} onChange={e => handleChange("colorSecundario", e.target.value)} /></Grid>
          <Grid xs={12} md={4}><Typography>Color Acento</Typography><TextField type="color" fullWidth size="small" value={formData.colorAcento} onChange={e => handleChange("colorAcento", e.target.value)} /></Grid>
          <Grid xs={12}><Typography>Logo URL</Typography><TextField fullWidth size="small" value={formData.logoUrl} onChange={e => handleChange("logoUrl", e.target.value)} /></Grid>
          <Grid xs={12} md={6}><Typography>Admin Nombre</Typography><TextField fullWidth size="small" value={formData.adminNombre} onChange={e => handleChange("adminNombre", e.target.value)} /></Grid>
          <Grid xs={12} md={6}><Typography>Admin Email</Typography><TextField fullWidth type="email" size="small" value={formData.adminEmail} onChange={e => handleChange("adminEmail", e.target.value)} /></Grid>
          <Grid xs={12}><Typography>Descripción</Typography><TextField fullWidth multiline rows={3} size="small" value={formData.descripcion} onChange={e => handleChange("descripcion", e.target.value)} /></Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Guardar Cambios</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstanceDialog;
