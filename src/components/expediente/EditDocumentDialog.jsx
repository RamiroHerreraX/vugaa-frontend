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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { editarDocumento } from "../../services/documentoExpediente";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
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
const MultiSelectWithDone = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
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

const EditDocumentDialog = ({ open, onClose, onUpdated, documento, apartadoId }) => {
  const [editedDocumento, setEditedDocumento] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documento) {
      setEditedDocumento({
        idDocumento: documento.idDocumento,
        nombreArchivo: documento.nombreArchivo || "",
        renovacion: documento.periodoRevision || "",
        descripcion: documento.descripcion || "",
        etiquetas: documento.etiquetas
          ? documento.etiquetas.split(",").filter(Boolean)
          : [],
        formatoEsperado: documento.formatoEsperado
          ? documento.formatoEsperado.split(",").filter(Boolean)
          : [],
      });
    }
  }, [documento]);

  if (!editedDocumento) return null;

  const handleUpdate = async () => {
    if (!editedDocumento.nombreArchivo?.trim()) return;

    try {
      setLoading(true);

      const payload = {
        nombreArchivo: editedDocumento.nombreArchivo,
        periodoRevision: editedDocumento.renovacion || 0,
        descripcion: editedDocumento.descripcion || "",
        etiquetas: editedDocumento.etiquetas.join(","),
        formatoEsperado: editedDocumento.formatoEsperado.join(","),
        idApartado: apartadoId,
      };

      await editarDocumento(editedDocumento.idDocumento, payload);

      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      alert("Error al actualizar el documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">Editar Documento</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>

          <TextField
            fullWidth
            label="Nombre del Archivo *"
            value={editedDocumento.nombreArchivo}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, nombreArchivo: e.target.value })
            }
          />

          <FormControl fullWidth>
            <InputLabel>Renovación</InputLabel>
            <Select
              value={editedDocumento.renovacion}
              label="Renovación"
              onChange={(e) =>
                setEditedDocumento({ ...editedDocumento, renovacion: e.target.value })
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
            value={editedDocumento.descripcion}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, descripcion: e.target.value })
            }
          />

          <MultiSelectWithDone
            label="Etiquetas"
            value={editedDocumento.etiquetas}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, etiquetas: e.target.value })
            }
            options={etiquetasOptions}
          />

          <MultiSelectWithDone
            label="Formato Esperado"
            value={editedDocumento.formatoEsperado}
            onChange={(e) =>
              setEditedDocumento({ ...editedDocumento, formatoEsperado: e.target.value })
            }
            options={formatosOptions}
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={!editedDocumento.nombreArchivo || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDocumentDialog;