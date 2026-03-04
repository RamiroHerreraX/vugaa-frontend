import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { editarPrograma, editarProgramaGlobal } from "../../services/programas";

const tipos = ["ETICA", "TECNICA", "GESTION"];

const EditProgramaDialog = ({
  open,
  onClose,
  programa,
  onSuccess,
  esGlobal = false,
}) => {
  const [form, setForm] = useState(programa);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm(programa);
  }, [programa]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        horasRequeridas: form.horasRequeridas
          ? parseInt(form.horasRequeridas)
          : null,
      };

      const response = esGlobal
        ? await editarProgramaGlobal(form.id, payload)
        : await editarPrograma(form.id, payload);

      onSuccess(response);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al actualizar el programa."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <SchoolIcon sx={{ mr: 1 }} />
        Editar Programa
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
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
          />

          <TextField
            label="Horas Requeridas"
            type="number"
            fullWidth
            value={form.horasRequeridas || ""}
            onChange={(e) =>
              setForm({ ...form, horasRequeridas: e.target.value })
            }
          />

          <TextField
            select
            label="Tipo"
            fullWidth
            value={form.tipo}
            onChange={(e) =>
              setForm({ ...form, tipo: e.target.value })
            }
          >
            {tipos.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={form.activo}
                onChange={(e) =>
                  setForm({ ...form, activo: e.target.checked })
                }
              />
            }
            label="Activo"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProgramaDialog;