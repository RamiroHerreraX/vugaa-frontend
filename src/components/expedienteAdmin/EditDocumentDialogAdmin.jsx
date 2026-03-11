import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Edit as EditIcon } from "@mui/icons-material";
import { editarDocumento } from "../../services/documentoExpediente";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  warning: "#f39c12",
  error: "#e74c3c",
  success: "#27ae60",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
};

const renovacionOptions = [
  { label: "No requiere renovación", value: 0 },
  { label: "30 días (mensual)", value: 30 },
  { label: "60 días (bimestral)", value: 60 },
  { label: "90 días (trimestral)", value: 90 },
  { label: "180 días (semestral)", value: 180 },
  { label: "365 días (anual)", value: 365 },
  { label: "730 días (bianual)", value: 730 },
];

const formatosOptions = [
  "PDF", "DOCX", "XLSX", "PPTX", "TXT",
  "CSV", "PNG", "JPG", "JPEG", "GIF", "MP4", "MP3",
];

const etiquetasOptions = [
  "Finanzas", "Legal", "Académico", "RRHH", "Administrativo",
  "Técnico", "Contractual", "Identificación", "Certificación", "Otro",
];

// Componente Select múltiple con botón "Listo"
const MultiSelectWithDone = ({ labelId, label, value, onChange, options, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        multiple
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => (
              <Chip key={val} label={val} size="small" />
            ))}
          </Box>
        )}
        disabled={disabled}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}

        {/* Botón para cerrar el menú */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": { bgcolor: institutionalColors.secondary },
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Listo
          </Button>
        </Box>
      </Select>
    </FormControl>
  );
};

const EditDocumentDialogAdmin = ({
  open,
  onClose,
  onSuccess,           // ✅ prop unificada (antes era onUpdated en el modal)
  documento,
  apartadoId,
  apartado,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedDocumento, setEditedDocumento] = useState(null);

  // Inicializar form cuando llega el documento
  useEffect(() => {
    if (documento && open) {
      setEditedDocumento({
        idDocumento: documento.idDocumento || documento.id,
        nombreArchivo: documento.nombreArchivo || "",
        renovacion: documento.periodoRevision ?? documento.renovacion ?? 0,
        descripcion: documento.descripcion || "",
        etiquetas: documento.etiquetas
          ? typeof documento.etiquetas === 'string'
            ? documento.etiquetas.split(",").filter(Boolean)
            : Array.isArray(documento.etiquetas) ? documento.etiquetas : []
          : [],
        formatoEsperado: documento.formatoEsperado
          ? typeof documento.formatoEsperado === 'string'
            ? documento.formatoEsperado.split(",").filter(Boolean)
            : Array.isArray(documento.formatoEsperado) ? documento.formatoEsperado : []
          : [],
      });
      setError(null);
    }
  }, [documento, open]);

  // Limpiar al cerrar
  useEffect(() => {
    if (!open) {
      setEditedDocumento(null);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleUpdate = async () => {
    if (!editedDocumento?.nombreArchivo?.trim()) {
      setError("El nombre del archivo es requerido");
      return;
    }
    if (!apartadoId) {
      setError("No se puede actualizar el documento: falta ID de apartado.");
      return;
    }
    if (!editedDocumento?.idDocumento) {
      setError("No se puede actualizar el documento: falta ID del documento.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombreArchivo: editedDocumento.nombreArchivo.trim(),
        periodoRevision: editedDocumento.renovacion || 0,
        descripcion: editedDocumento.descripcion || "",
        etiquetas: editedDocumento.etiquetas.join(","),
        formatoEsperado: editedDocumento.formatoEsperado.join(","),
        idApartado: apartadoId,
      };

      const updated = await editarDocumento(editedDocumento.idDocumento, payload);

      // ✅ Construimos el objeto actualizado combinando la respuesta del servidor
      // con los valores locales (arrays sin join) para que el padre los muestre bien
      const documentoActualizado = {
        ...documento,                         // base: preservar campos que el back no devuelve
        ...updated,                           // sobrescribir con respuesta del servidor
        idDocumento: editedDocumento.idDocumento,
        nombreArchivo: payload.nombreArchivo,
        periodoRevision: payload.periodoRevision,
        descripcion: payload.descripcion,
        etiquetas: editedDocumento.etiquetas,           // array para el render
        formatoEsperado: editedDocumento.formatoEsperado, // array para el render
        activo: documento.activo,             // preservar estado activo/inactivo
      };

      // ✅ Llamamos onSuccess ANTES de cerrar — el padre actualiza el estado al instante
      if (onSuccess) {
        onSuccess(apartadoId, documentoActualizado);
      }

      handleClose();

    } catch (err) {
      console.error("❌ Error al actualizar documento:", err);

      let errorMessage = "Error al actualizar el documento";
      if (err.response?.status === 403) {
        errorMessage = "No tienes permisos para editar este documento.";
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

  if (!editedDocumento) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px", maxHeight: "90vh" } }}
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">Editar Documento</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre del Archivo *"
            value={editedDocumento.nombreArchivo}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, nombreArchivo: e.target.value })
            }
            error={!editedDocumento.nombreArchivo && error?.includes('nombre')}
            helperText={
              !editedDocumento.nombreArchivo && error?.includes('nombre')
                ? "Campo requerido"
                : ""
            }
            disabled={loading}
          />

          <FormControl fullWidth>
            <InputLabel id="renovacion-label">Período de Renovación</InputLabel>
            <Select
              labelId="renovacion-label"
              value={editedDocumento.renovacion}
              label="Período de Renovación"
              onChange={(e) =>
                setEditedDocumento({ ...editedDocumento, renovacion: e.target.value })
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
            value={editedDocumento.descripcion}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, descripcion: e.target.value })
            }
            disabled={loading}
          />

          {/* Etiquetas con botón Listo */}
          <MultiSelectWithDone
            labelId="etiquetas-label"
            label="Etiquetas"
            value={editedDocumento.etiquetas}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, etiquetas: e.target.value })
            }
            options={etiquetasOptions}
            disabled={loading}
          />

          {/* Formato Esperado con botón Listo */}
          <MultiSelectWithDone
            labelId="formato-label"
            label="Formato Esperado"
            value={editedDocumento.formatoEsperado}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, formatoEsperado: e.target.value })
            }
            options={formatosOptions}
            disabled={loading}
          />
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
          onClick={handleUpdate}
          variant="contained"
          disabled={!editedDocumento.nombreArchivo?.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
            "&:disabled": { bgcolor: alpha(institutionalColors.primary, 0.5) },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDocumentDialogAdmin;