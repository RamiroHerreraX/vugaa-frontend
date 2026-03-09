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
import { alpha } from "@mui/material/styles";
import { Description as DescriptionIcon } from "@mui/icons-material";
import { crearDocumentoPlantillaParaAdmin } from "../../services/documentoExpediente";
import { useAuth } from "../../context/AuthContext";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  warning: "#f39c12",
  error: "#e74c3c",
  success: "#27ae60",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
};

// Opciones de renovación
const renovacionOptions = [
  { label: "No requiere renovación", value: 0 },
  { label: "30 días (mensual)", value: 30 },
  { label: "60 días (bimestral)", value: 60 },
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
  "JPEG",
  "GIF",
  "MP4",
  "MP3",
];

// Opciones de etiquetas
const etiquetasOptions = [
  "Finanzas",
  "Legal",
  "Académico",
  "RRHH",
  "Administrativo",
  "Técnico",
  "Contractual",
  "Identificación",
  "Certificación",
  "Otro",
];

const CreateDocumentDialogAdmin = ({ open, onClose, onSuccess, apartadoId, apartado }) => {
  const { user } = useAuth();
  const pendingSuccess = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [documento, setDocumento] = useState({
    nombreArchivo: "",
    renovacion: 0,
    descripcion: "",
    etiquetas: [],
    formatoEsperado: [],
  });

  useEffect(() => {
    if (open) {
      setDocumento({
        nombreArchivo: "",
        renovacion: 0,
        descripcion: "",
        etiquetas: [],
        formatoEsperado: [],
      });
      setError(null);
    }
  }, [open, apartadoId, apartado, user]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    // Validaciones
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
        idInstancia: user?.instanciaId,
      };

      // Usar el nuevo método para admin
      const response = await crearDocumentoPlantillaParaAdmin(payload);

      pendingSuccess.current = {
        idDocumento: response.idDocumento || response.id_documento || response.id,
        ...payload,
        etiquetas: documento.etiquetas,
        formatoEsperado: documento.formatoEsperado,
      };

      handleClose();
    } catch (err) {
      console.error("❌ Error detallado al crear documento:", err);
      console.error("Status:", err.response?.status);
      console.error("Status Text:", err.response?.statusText);
      console.error("Response data:", err.response?.data);
      console.error("Request config:", err.config);

      let errorMessage = "Error al crear el documento";

      if (err.response?.status === 403) {
        errorMessage = "No tienes permisos para crear documentos en esta categoría. Verifica que tengas rol de administrador.";
      } else if (err.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
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
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "90vh"
        }
      }}
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

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre del Archivo *"
            value={documento.nombreArchivo}
            onChange={(e) =>
              setDocumento({ ...documento, nombreArchivo: e.target.value })
            }
            error={!documento.nombreArchivo && error?.includes('nombre')}
            helperText={
              !documento.nombreArchivo && error?.includes('nombre') ? "Campo requerido" : ""
            }
            disabled={loading}
          />

          {/* Renovación */}
          <FormControl fullWidth>
            <InputLabel id="renovacion-label">Período de Renovación</InputLabel>
            <Select
              labelId="renovacion-label"
              value={documento.renovacion}
              label="Período de Renovación"
              onChange={(e) =>
                setDocumento({ ...documento, renovacion: e.target.value })
              }
              disabled={loading}
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
            disabled={loading}
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
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
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
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
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

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ color: institutionalColors.textSecondary }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!documento.nombreArchivo?.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
            "&:disabled": {
              bgcolor: alpha(institutionalColors.primary, 0.5),
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Creando...
            </>
          ) : (
            "Crear Documento"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDocumentDialogAdmin;