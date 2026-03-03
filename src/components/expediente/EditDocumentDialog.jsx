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
  FormControlLabel,
  Switch,
  Typography,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { editarDocumento } from "../../services/documentoExpediente";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  warning: "#f39c12",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
};

const estadosOptions = ["PENDIENTE", "EN_REVISION", "APROBADO", "RECHAZADO"];

const EditDocumentDialog = ({
  open,
  onClose,
  onUpdated, // 🔥 para refrescar lista
  documento,
  expedienteId,
  apartadoId,
  instanciaId,
}) => {
  const [editedDocumento, setEditedDocumento] = useState(null);
  const [requiereHoras, setRequiereHoras] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documento) {
      setEditedDocumento({ ...documento });
      setRequiereHoras(documento.horasRequeridas > 0);
    }
  }, [documento]);

  if (!editedDocumento) return null;

  const handleUpdate = async () => {
    if (!editedDocumento.nombreArchivo) return;

    try {
      setLoading(true);

      const payload = {
        ...editedDocumento,
        horasRequeridas: requiereHoras
          ? editedDocumento.horasRequeridas
          : 0,
        expediente: { idExpediente: expedienteId },
        apartado: apartadoId ? { idApartado: apartadoId } : null,
        instancia: { idInstancia: instanciaId },
      };

      await editarDocumento(editedDocumento.idDocumento, payload);

      if (onUpdated) onUpdated(); // 🔥 refresca lista
      onClose();
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      alert("Error al actualizar el documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">
            Editar Documento
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Nombre */}
          <TextField
            fullWidth
            label="Nombre del Archivo *"
            value={editedDocumento.nombreArchivo}
            onChange={(e) =>
              setEditedDocumento({
                ...editedDocumento,
                nombreArchivo: e.target.value,
              })
            }
          />

          {/* Switch requiere horas */}
          <FormControlLabel
            control={
              <Switch
                checked={requiereHoras}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRequiereHoras(checked);

                  if (!checked) {
                    setEditedDocumento({
                      ...editedDocumento,
                      horasRequeridas: 0,
                    });
                  }
                }}
              />
            }
            label="¿Requiere cumplir horas?"
          />

          {/* Campo horas */}
          {requiereHoras && (
            <TextField
              fullWidth
              type="number"
              label="Horas Requeridas"
              value={editedDocumento.horasRequeridas || 0}
              onChange={(e) =>
                setEditedDocumento({
                  ...editedDocumento,
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

          {/* Periodo revisión */}
          <TextField
            fullWidth
            type="number"
            label="Periodo de Revisión"
            value={editedDocumento.periodoRevision || 0}
            onChange={(e) =>
              setEditedDocumento({
                ...editedDocumento,
                periodoRevision: parseInt(e.target.value) || 0,
              })
            }
            helperText="Días (0 = sin revisión)"
          />

          {/* Estado */}
          <TextField
            fullWidth
            select
            label="Estado"
            value={editedDocumento.estado || "PENDIENTE"}
            onChange={(e) =>
              setEditedDocumento({
                ...editedDocumento,
                estado: e.target.value,
              })
            }
          >
            {estadosOptions.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>

          {/* Observaciones */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Observaciones"
            value={editedDocumento.observaciones || ""}
            onChange={(e) =>
              setEditedDocumento({
                ...editedDocumento,
                observaciones: e.target.value,
              })
            }
          />

          {/* Requiere validación */}
          <FormControlLabel
            control={
              <Switch
                checked={editedDocumento.requiereValidacion || false}
                onChange={(e) =>
                  setEditedDocumento({
                    ...editedDocumento,
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
        <Button onClick={onClose}>
          Cancelar
        </Button>

        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={!editedDocumento.nombreArchivo || loading}
        >
          {loading ? (
            <CircularProgress size={22} />
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDocumentDialog;