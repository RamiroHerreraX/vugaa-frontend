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
  FormControlLabel,
  Switch,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Folder as FolderIcon } from "@mui/icons-material";
import { IconSelector, IconPreview } from "./IconComponents";
import { crearApartado, crearApartadoGlobal } from "../../services/apartado";
import { useAuth } from "../../context/AuthContext";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
};

// Opciones de tipos de usuarios destinados
const USER_TYPES = [
  { value: 'AGENTE', label: 'Agentes Aduanales' },
  { value: 'ASOCIACION', label: 'Asociaciones' }
];

const CreateCategoryDialogAdmin = ({
  open,
  onClose,
  onSuccess,
  isSuperAdmin = false,
}) => {
  const { user } = useAuth();
  
  const [category, setCategory] = useState({
    nombre: "",
    descripcion: "",
    icono: "📁",
    obligatorio: false,
    usuariosDestinados: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingSuccess = useRef(null);

  // Resetear formulario cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setCategory({
        nombre: "",
        descripcion: "",
        icono: "📁",
        obligatorio: false,
        usuariosDestinados: [],
      });
      setError(null);
    }
  }, [open]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleSave = async () => {
    // Validaciones
    if (!category.nombre.trim()) {
      setError("El nombre de la categoría es requerido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar el payload base
      const payload = {
        nombre: category.nombre.trim(),
        descripcion: category.descripcion.trim() || null,
        icono: category.icono || "📁",
        obligatorio: category.obligatorio,
        activo: true,
      };

      // Procesar usuarios destinados (convertir array a string separado por comas)
      if (category.usuariosDestinados && category.usuariosDestinados.length > 0) {
        payload.usuariosDestinados = category.usuariosDestinados.join(',');
      } else {
        payload.usuariosDestinados = null;
      }

      let newCategory;
      
      if (isSuperAdmin) {
        newCategory = await crearApartadoGlobal(payload);
      } else {
        // ADMIN NORMAL: Agregar el idInstancia del usuario logueado
        if (!user?.instanciaId) {
          throw new Error("No se encontró la instancia del usuario. No puedes crear categorías.");
        }
        
        // Agregar el idInstancia al payload
        payload.idInstancia = user.instanciaId;
        
        newCategory = await crearApartado(payload);
      }

      pendingSuccess.current = newCategory;
      handleClose();
      
    } catch (error) {
      console.error("❌ Error al crear categoría:", error);
      
      let errorMessage = "Ocurrió un error al crear la categoría.";
      
      if (error.response) {
        console.error("Detalles del error del servidor:", error.response.data);
        errorMessage = error.response.data?.message || 
                      error.response.data?.mensaje || 
                      `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      } else if (error.message) {
        errorMessage = error.message;
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
          <FolderIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">
            Nueva Categoría {isSuperAdmin ? "Global" : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* ========== SECCIÓN 1: INFORMACIÓN BÁSICA ========== */}
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: institutionalColors.primary, 
                mb: 1,
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Información Básica
            </Typography>
            
            {/* Nombre - AHORA PRIMERO */}
            <TextField
              fullWidth
              label="Nombre de la Categoría *"
              value={category.nombre}
              onChange={(e) =>
                setCategory({ ...category, nombre: e.target.value })
              }
              disabled={loading}
              error={!category.nombre.trim() && !!error}
              helperText={!category.nombre.trim() && "El nombre es requerido"}
              sx={{ mb: 2 }}
            />

            {/* Descripción */}
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Descripción"
              value={category.descripcion}
              onChange={(e) =>
                setCategory({ ...category, descripcion: e.target.value })
              }
              disabled={loading}
              sx={{ mb: 2 }}
            />

            {/* Icono */}
            <Box sx={{ mb: 1 }}>
              <IconSelector
                value={category.icono}
                onChange={(newIcon) =>
                  setCategory({ ...category, icono: newIcon })
                }
                disabled={loading}
              />
              <Box sx={{ mt: 1 }}>
                <IconPreview icon={category.icono} />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* ========== SECCIÓN 2: CONFIGURACIÓN ========== */}
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: institutionalColors.primary, 
                mb: 1,
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Configuración
            </Typography>

            {/* Usuarios Destinados - AHORA DESPUÉS DE LA INFO BÁSICA */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="usuarios-destinados-label">
                Asignar a
              </InputLabel>
              <Select
                labelId="usuarios-destinados-label"
                multiple
                value={category.usuariosDestinados}
                onChange={(e) =>
                  setCategory({
                    ...category,
                    usuariosDestinados: e.target.value,
                  })
                }
                input={<OutlinedInput label="Asignar a" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={USER_TYPES.find(t => t.value === value)?.label || value}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
                disabled={loading}
              >
                {USER_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Checkbox checked={category.usuariosDestinados.indexOf(type.value) > -1} />
                    <ListItemText primary={type.label} />
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                Selecciona a qué tipo de usuarios estará disponible esta categoría
              </Typography>
            </FormControl>

            {/* Obligatorio - AL FINAL */}
            <FormControlLabel
              control={
                <Switch
                  checked={category.obligatorio}
                  onChange={(e) =>
                    setCategory({
                      ...category,
                      obligatorio: e.target.checked,
                    })
                  }
                  disabled={loading}
                />
              }
              label="Categoría Obligatoria"
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!category.nombre.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { 
              bgcolor: institutionalColors.secondary 
            },
            "&.Mui-disabled": {
              bgcolor: alpha(institutionalColors.primary, 0.5),
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Crear Categoría"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialogAdmin;