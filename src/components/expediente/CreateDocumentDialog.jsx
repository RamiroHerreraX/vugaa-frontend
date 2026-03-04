import React, { useState, useEffect, useRef } from "react";
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
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";
import { crearDocumentoPlantilla } from "../../services/documentoExpediente";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  warning: "#f39c12",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
};


const CreateDocumentDialog = ({
  open,
  onClose,
  onSuccess,
  apartadoId,
  apartado,
}) => {
  const pendingSuccess = useRef(null); // Guardamos resultado mientras se cierra el modal

  const [requiereHoras, setRequiereHoras] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [documento, setDocumento] = useState({
    nombreArchivo: "",
    horasRequeridas: 0,
    periodoRevision: 0,
    requiereValidacion: false,
    observaciones: "",
   
  });

  // Resetear formulario cuando se abre
  useEffect(() => {
    if (open) {
      setRequiereHoras(false);
      setDocumento({
        nombreArchivo: "",
        horasRequeridas: 0,
        periodoRevision: 0,
        requiereValidacion: false,
        observaciones: "",
       
      });
      setError(null);
    }
  }, [open]);

  const handleClose = () => {
    onClose(); // Cerramos modal inmediatamente
  };

  const handleSave = async () => {
    if (!documento.nombreArchivo?.trim()) {
      setError("El nombre del archivo es requerido");
      return;
    }

    if (!apartadoId) {
      setError("No se puede crear el documento: falta ID de apartado.");
      console.log(apartadoId);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombreArchivo: documento.nombreArchivo,
        horasRequeridas: requiereHoras ? documento.horasRequeridas : 0,
        periodoRevision: documento.periodoRevision,
        requiereValidacion: documento.requiereValidacion,
        observaciones: documento.observaciones || "",
        idApartado: apartadoId,
        fechaCarga: new Date().toISOString(), // Aseguramos fecha si el backend lo requiere
      };
      console.log(payload)
      const response = await crearDocumentoPlantilla(payload);

      // Guardamos el resultado mientras el modal se cierra
      pendingSuccess.current = {
        id_documento: response.id_documento || response.id,
        ...payload,
      };

      // Cerramos modal
      handleClose();
    } catch (err) {
      console.error("Error al crear documento:", err);
      setError(err.response?.data?.message || "Error al crear el documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
      disableEscapeKeyDown={loading}
      TransitionProps={{
        onExited: () => {
          // Ejecutamos onSuccess después de cerrar el modal
          if (pendingSuccess.current && onSuccess) {
            onSuccess(apartadoId, pendingSuccess.current);
            pendingSuccess.current = null;
          }
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">Nuevo Documento</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            label="Nombre del Archivo *"
            value={documento.nombreArchivo}
            onChange={(e) =>
              setDocumento({ ...documento, nombreArchivo: e.target.value })
            }
            error={!documento.nombreArchivo && error}
            helperText={
              !documento.nombreArchivo && error ? "Campo requerido" : ""
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={requiereHoras}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRequiereHoras(checked);
                  if (!checked)
                    setDocumento({ ...documento, horasRequeridas: 0 });
                }}
              />
            }
            label="¿Requiere cumplir horas?"
          />

          {requiereHoras && (
            <TextField
              fullWidth
              type="number"
              label="Horas Requeridas"
              value={documento.horasRequeridas}
              onChange={(e) =>
                setDocumento({
                  ...documento,
                  horasRequeridas: parseInt(e.target.value) || 0,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">hrs</InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            fullWidth
            type="number"
            label="Periodo de Revisión"
            value={documento.periodoRevision}
            onChange={(e) =>
              setDocumento({
                ...documento,
                periodoRevision: parseInt(e.target.value) || 0,
              })
            }
            helperText="Días (0 = sin revisión)"
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Observaciones"
            value={documento.observaciones}
            onChange={(e) =>
              setDocumento({ ...documento, observaciones: e.target.value })
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={documento.requiereValidacion}
                onChange={(e) =>
                  setDocumento({
                    ...documento,
                    requiereValidacion: e.target.checked,
                  })
                }
              />
            }
            label="Requiere Validación"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!documento.nombreArchivo?.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Crear Documento"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDocumentDialog;
