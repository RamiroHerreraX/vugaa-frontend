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
  Switch,
  FormControlLabel,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { crearPrograma, crearProgramaGlobal } from "../../services/programas";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
};

// 🔥 SOLO DOS TIPOS
const tipos = ["VIDEO", "DOCUMENTO"];

const CreateProgramaDialog = ({
  open,
  onClose,
  onSuccess,
  isSuperAdmin,
  idInstancia,
  apartadoId,  // ← Cambiado de idApartado a apartadoId
  esGlobal = false,
}) => {
  const [programa, setPrograma] = useState({
    nombre: "",
    descripcion: "",
    horasRequeridas: "",
    tipo: "VIDEO",
    activo: true,
    configuracionJson: "", // 🔥 nuevo campo JSON
    requiereValidacion: false, // ✅ NUEVO CAMPO
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingSuccess = useRef(null);

  useEffect(() => {
    if (open) {
      setPrograma({
        nombre: "",
        descripcion: "",
        horasRequeridas: "",
        tipo: "VIDEO",
        activo: true,
        configuracionJson: "",
        requiereValidacion: false, // ✅ Reiniciar campo
      });
      setError(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!programa.nombre.trim()) {
      setError("El nombre del programa es obligatorio");
      return;
    }

    // 🔥 Validar JSON si viene algo
    if (programa.configuracionJson) {
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
      const payload = {
        ...programa,
        horasRequeridas: programa.horasRequeridas
          ? parseInt(programa.horasRequeridas)
          : null,
        configuracionJson: programa.configuracionJson || null,
        requiereValidacion: programa.requiereValidacion, // ✅ Incluir el nuevo campo
        idInstancia: esGlobal ? null : idInstancia,
        idApartado: apartadoId || null,  // ← Usamos apartadoId aquí
      };

      const response = esGlobal
        ? await crearProgramaGlobal(payload)
        : await crearPrograma(payload);

      pendingSuccess.current = response;
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al crear el programa."
      );
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
      disableEscapeKeyDown={loading}
      TransitionProps={{
        onExited: () => {
          if (pendingSuccess.current) {
            onSuccess(pendingSuccess.current);
            pendingSuccess.current = null;
          }
        },
      }}
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

          {/* Nombre */}
          <TextField
            label="Nombre *"
            fullWidth
            value={programa.nombre}
            onChange={(e) =>
              setPrograma({ ...programa, nombre: e.target.value })
            }
            disabled={loading}
          />

          {/* Descripción */}
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

          {/* Horas */}
          <TextField
            label="Horas Requeridas"
            type="number"
            fullWidth
            value={programa.horasRequeridas}
            onChange={(e) =>
              setPrograma({ ...programa, horasRequeridas: e.target.value })
            }
            disabled={loading}
          />

          {/* 🔥 Tipo SOLO VIDEO O DOCUMENTO */}
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

          {/* 🔥 Configuración JSON (opcional) */}
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
          />

          {/* ✅ NUEVO: Requiere Validación */}
          <FormControlLabel
            control={
              <Switch
                checked={programa.requiereValidacion}
                onChange={(e) =>
                  setPrograma({ ...programa, requiereValidacion: e.target.checked })
                }
                disabled={loading}
              />
            }
            label="Requiere Validación por Comité"
          />

          {/* Activo */}
          <FormControlLabel
            control={
              <Switch
                checked={programa.activo}
                onChange={(e) =>
                  setPrograma({ ...programa, activo: e.target.checked })
                }
                disabled={loading}
              />
            }
            label="Programa Activo"
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

export default CreateProgramaDialog;