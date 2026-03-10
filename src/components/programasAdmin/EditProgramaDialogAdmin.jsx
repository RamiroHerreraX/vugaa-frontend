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
  MenuItem,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { editarPrograma, editarProgramaGlobal } from "../../services/programas";

const tipos = ["VIDEO", "DOCUMENTO"];

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
};

const EditProgramaDialogAdmin = ({
  open,
  onClose,
  programa,
  onSuccess,
  esGlobal = false,
}) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (programa && open) {
      // ✅ Normalizar el ID al cargar el formulario para no depender
      // de qué campo devuelva el backend en cada contexto.
      const id =
        programa.id ||
        programa.idPrograma ||
        programa.programaId ||
        null;

      setForm({
        ...programa,
        id,
        idPrograma: id,
        horasRequeridas: programa.horasRequeridas?.toString() || "",
        configuracionJson: programa.configuracionJson || "",
      });
      setError(null);
    }
  }, [programa, open]);

  const handleSave = async () => {
    if (!form?.nombre?.trim()) {
      setError("El nombre del programa es obligatorio");
      return;
    }

    if (form.configuracionJson?.trim()) {
      try {
        JSON.parse(form.configuracionJson);
      } catch (e) {
        setError("La configuración JSON no es válida.");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        horasRequeridas: form.horasRequeridas
          ? parseInt(form.horasRequeridas)
          : null,
        tipo: form.tipo,
        activo: form.activo !== undefined ? form.activo : true,
        configuracionJson: form.configuracionJson?.trim() || null,
        idInstancia: form.idInstancia || null,
        idApartado: form.idApartado || null,
      };

      const response = esGlobal
        ? await editarProgramaGlobal(form.id, payload)
        : await editarPrograma(form.id, payload);

      // ✅ Normalizar el ID de la respuesta también
      const id =
        response?.id ||
        response?.idPrograma ||
        response?.programaId ||
        form.id;

      const programaNormalizado = {
        ...form,       // conservar los campos locales como fallback
        ...response,   // sobrescribir con lo que devuelve el servidor
        id,
        idPrograma: id,
      };

      // ✅ Llamar onSuccess ANTES de cerrar para que el padre tenga
      // acceso al apartadoId (en currentApartado) sin que se limpie.
      onSuccess(programaNormalizado);
      onClose();
    } catch (err) {
      console.error("Error al editar programa:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al actualizar el programa."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!form) return null;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SchoolIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">
            Editar Programa {esGlobal ? "Global" : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {!esGlobal && form.instancia && (
            <Alert severity="info">
              Editando programa de la instancia:{" "}
              {form.instancia.nombre || form.instancia}
            </Alert>
          )}

          <TextField
            label="Nombre *"
            fullWidth
            value={form.nombre || ""}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            disabled={loading}
          />

          <TextField
            label="Descripción"
            multiline
            rows={2}
            fullWidth
            value={form.descripcion || ""}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
            disabled={loading}
          />

          <TextField
            label="Horas Requeridas"
            type="number"
            fullWidth
            value={form.horasRequeridas || ""}
            onChange={(e) =>
              setForm({ ...form, horasRequeridas: e.target.value })
            }
            disabled={loading}
            inputProps={{ min: 0, step: 1 }}
          />

          <TextField
            select
            label="Tipo"
            fullWidth
            value={form.tipo || "VIDEO"}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            disabled={loading}
          >
            {tipos.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Configuración JSON (opcional)"
            multiline
            rows={3}
            fullWidth
            value={form.configuracionJson || ""}
            onChange={(e) =>
              setForm({ ...form, configuracionJson: e.target.value })
            }
            placeholder='Ejemplo: {"duracionMaxima": 30}'
            disabled={loading}
            helperText="Campo opcional para configuración adicional en formato JSON"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!form?.nombre?.trim() || loading}
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

export default EditProgramaDialogAdmin;