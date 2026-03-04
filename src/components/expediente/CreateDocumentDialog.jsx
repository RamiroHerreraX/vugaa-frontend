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
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
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

// Opciones de renovación
const renovacionOptions = [
  { label: "30 días (mensual)", value: 30 },
  { label: "90 días (trimestral)", value: 90 },
  { label: "180 días (semestral)", value: 180 },
  { label: "365 días (anual)", value: 365 },
  { label: "730 días (bianual)", value: 730 },
];

// Opciones de Formato Esperado
const formatosOptions = [
  "PDF",
  "DOCX",
  "XLSX",
  "PPTX",
  "TXT",
  "CSV",
  "PNG",
  "JPG",
];

// Opciones de etiquetas
const etiquetasOptions = [
  "Finanzas",
  "Legal",
  "Académico",
  "RRHH",
  "Administrativo",
  "Otro",
];

const CreateDocumentDialog = ({ open, onClose, onSuccess, apartadoId }) => {
  const pendingSuccess = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [documento, setDocumento] = useState({
    nombreArchivo: "",
    renovacion: "",
    descripcion: "",
    etiquetas: [],
    formatoEsperado: [],
  });

  useEffect(() => {
    if (open) {
      setDocumento({
        nombreArchivo: "",
        renovacion: "",
        descripcion: "",
        etiquetas: [],
        formatoEsperado: [],
      });
      setError(null);
    }
  }, [open]);

  const handleClose = () => onClose();

  const handleSave = async () => {
    if (!documento.nombreArchivo?.trim()) {
      setError("El nombre del archivo es requerido");
      return;
    }

    if (!apartadoId) {
      setError("No se puede crear el documento: falta ID de apartado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombreArchivo: documento.nombreArchivo,
        periodoRevision: documento.renovacion || 0,
        descripcion: documento.descripcion || "",
        etiquetas: documento.etiquetas.join(","), 
        formatoEsperado: documento.formatoEsperado.join(","), 
        idApartado: apartadoId,
      };

      const response = await crearDocumentoPlantilla(payload);

      pendingSuccess.current = {
        id_documento: response.id_documento || response.id,
        ...payload,
      };

      handleClose();
    } catch (err) {
      console.error("Error al crear documento:", err);
      setError(
        err.response?.data?.message || "Error al crear el documento"
      );
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

          {/* Renovación */}
          <FormControl fullWidth>
            <InputLabel id="renovacion-label">Renovación</InputLabel>
            <Select
              labelId="renovacion-label"
              value={documento.renovacion}
              label="Renovación"
              onChange={(e) =>
                setDocumento({ ...documento, renovacion: e.target.value })
              }
            >
              {renovacionOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Descripción"
            value={documento.descripcion}
            onChange={(e) =>
              setDocumento({ ...documento, descripcion: e.target.value })
            }
          />

          {/* Etiquetas */}
          <FormControl fullWidth>
            <InputLabel id="etiquetas-label">Etiquetas</InputLabel>
            <Select
              labelId="etiquetas-label"
              multiple
              value={documento.etiquetas}
              onChange={(e) =>
                setDocumento({
                  ...documento,
                  etiquetas: e.target.value,
                })
              }
              input={<OutlinedInput label="Etiquetas" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {etiquetasOptions.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Formato Esperado */}
          <FormControl fullWidth>
            <InputLabel id="formato-label">Formato Esperado</InputLabel>
            <Select
              labelId="formato-label"
              multiple
              value={documento.formatoEsperado}
              onChange={(e) =>
                setDocumento({
                  ...documento,
                  formatoEsperado: e.target.value,
                })
              }
              input={<OutlinedInput label="Formato Esperado" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {formatosOptions.map((formato) => (
                <MenuItem key={formato} value={formato}>
                  {formato}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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