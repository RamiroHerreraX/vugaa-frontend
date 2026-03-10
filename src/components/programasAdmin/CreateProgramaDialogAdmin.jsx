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
import { crearPrograma, crearProgramaGlobal } from "../../services/programas";
import { useAuth } from "../../context/AuthContext";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
};

const tipos = ["VIDEO", "DOCUMENTO"];

const CreateProgramaDialogAdmin = ({
  open,
  onClose,
  onSuccess,
  isSuperAdmin,
  idInstancia: propIdInstancia,
  apartadoId,
  esGlobal = false,
}) => {
  const { user } = useAuth();

  const [programa, setPrograma] = useState({
    nombre: "",
    descripcion: "",
    horasRequeridas: "",
    tipo: "VIDEO",
    configuracionJson: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setPrograma({
        nombre: "",
        descripcion: "",
        horasRequeridas: "",
        tipo: "VIDEO",
        configuracionJson: "",
      });
      setError(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!programa.nombre.trim()) {
      setError("El nombre del programa es obligatorio");
      return;
    }

    if (programa.configuracionJson.trim()) {
      try {
        JSON.parse(programa.configuracionJson);
      } catch (e) {
        setError("La configuración JSON no es válida.");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let idInstanciaToUse = null;

      if (!esGlobal) {
        idInstanciaToUse = user?.instanciaId || propIdInstancia || null;

        if (!idInstanciaToUse) {
          setError("No se pudo determinar la instancia para crear el programa");
          setLoading(false);
          return;
        }
      }

      const payload = {
        nombre: programa.nombre,
        descripcion: programa.descripcion || null,
        horasRequeridas: programa.horasRequeridas
          ? parseInt(programa.horasRequeridas)
          : null,
        tipo: programa.tipo,
        activo: true,
        configuracionJson: programa.configuracionJson.trim() || null,
        idInstancia: idInstanciaToUse,
        idApartado: apartadoId || null,
      };

      const response = esGlobal
        ? await crearProgramaGlobal(payload)
        : await crearPrograma(payload);

      // ✅ CORRECCIÓN CLAVE: normalizar el ID aquí mismo y pasar apartadoId
      // directamente al callback, sin depender de onExited ni de estado externo.
      const id =
        response?.id ||
        response?.idPrograma ||
        response?.programaId ||
        null;

      const programaNormalizado = {
        ...response,
        id,
        idPrograma: id,
      };

      // Llamamos onSuccess ANTES de cerrar el modal para que el padre
      // tenga el apartadoId correcto (que viene como prop, no como estado).
      onSuccess(apartadoId, programaNormalizado);
      onClose();
    } catch (err) {
      console.error("Error al crear programa:", err);
      setError(
        err.response?.data?.message || "Error al crear el programa."
      );
    } finally {
      setLoading(false);
    }
  };

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
            Nuevo Programa {esGlobal && isSuperAdmin ? "Global" : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {!esGlobal && user?.instanciaNombre && (
            <Alert severity="info">
              Creando programa para la instancia: {user.instanciaNombre}
            </Alert>
          )}

          <TextField
            label="Nombre *"
            fullWidth
            value={programa.nombre}
            onChange={(e) =>
              setPrograma({ ...programa, nombre: e.target.value })
            }
            disabled={loading}
          />

          <TextField
            label="Descripción"
            multiline
            rows={2}
            fullWidth
            value={programa.descripcion}
            onChange={(e) =>
              setPrograma({ ...programa, descripcion: e.target.value })
            }
            disabled={loading}
          />

          <TextField
            label="Horas Requeridas"
            type="number"
            fullWidth
            value={programa.horasRequeridas}
            onChange={(e) =>
              setPrograma({ ...programa, horasRequeridas: e.target.value })
            }
            disabled={loading}
            inputProps={{ min: 0, step: 1 }}
          />

          <TextField
            select
            label="Tipo"
            fullWidth
            value={programa.tipo}
            onChange={(e) =>
              setPrograma({ ...programa, tipo: e.target.value })
            }
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
            value={programa.configuracionJson}
            onChange={(e) =>
              setPrograma({ ...programa, configuracionJson: e.target.value })
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
          disabled={!programa.nombre.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Crear Programa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProgramaDialogAdmin;