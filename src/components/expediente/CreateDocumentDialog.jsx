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

const renovacionOptions = [
  { label: "30 días (mensual)", value: 30 },
  { label: "90 días (trimestral)", value: 90 },
  { label: "180 días (semestral)", value: 180 },
  { label: "365 días (anual)", value: 365 },
  { label: "730 días (bianual)", value: 730 },
];

const formatosOptions = ["PDF", "DOCX", "XLSX", "PPTX", "TXT", "CSV", "PNG", "JPG"];

const etiquetasOptions = [
  "Finanzas",
  "Legal",
  "Académico",
  "RRHH",
  "Administrativo",
  "Otro",
];

// Select múltiple con botón "Listo" para cerrar el menú
const MultiSelectWithDone = ({ labelId, label, value, onChange, options }) => {
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
              <Chip key={val} label={val} />
            ))}
          </Box>
        )}
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
            error={!documento.nombreArchivo && !!error}
            helperText={
              !documento.nombreArchivo && error ? "Campo requerido" : ""
            }
          />

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

          <MultiSelectWithDone
            labelId="etiquetas-label"
            label="Etiquetas"
            value={documento.etiquetas}
            onChange={(e) =>
              setDocumento({ ...documento, etiquetas: e.target.value })
            }
            options={etiquetasOptions}
          />

          <MultiSelectWithDone
            labelId="formato-label"
            label="Formato Esperado"
            value={documento.formatoEsperado}
            onChange={(e) =>
              setDocumento({ ...documento, formatoEsperado: e.target.value })
            }
            options={formatosOptions}
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