import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  LinearProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  lightBlue: "rgba(19, 59, 107, 0.08)",
  textSecondary: "#6b7280",
  textPrimary: "#111827",
  accent: "#e9e9e9",
};

const AddCertificationDialog = ({
  open,
  onClose,
  selectedUser,
  selectedCertification,
  newCertification,
  onCertificationChange,
  certificationFiles,
  onFileSelect,
  onRemoveFile,
  onSave,
  loading,
  certificationUploading,
  certificationUploadProgress,
  certificationTypes,
  getFileIcon,
  formatFileSize,
}) => {
  const certificationFileInputRef = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={() => !certificationUploading && onClose()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
          {selectedCertification ? "Editar Certificación" : "Nueva Certificación"}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          sx={{ color: institutionalColors.textSecondary }}
        >
          {selectedUser?.uploadPermission === "permitido"
            ? "Permiso de subida concedido por el usuario"
            : "No tienes permiso para subir documentos para este usuario"}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: institutionalColors.textSecondary }}
          >
            Usuario: <strong>{selectedUser?.name}</strong>
          </Typography>

          {selectedUser?.uploadPermission !== "permitido" ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              No puedes subir certificaciones. Este usuario no ha dado permiso
              de subida desde su dispositivo.
            </Alert>
          ) : (
            <>
              <TextField
                label="Nombre de la certificación"
                value={newCertification.name}
                onChange={(e) =>
                  onCertificationChange({
                    ...newCertification,
                    name: e.target.value,
                  })
                }
                fullWidth
                required
                disabled={certificationUploading}
              />

              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    "&.Mui-focused": { color: institutionalColors.primary },
                  }}
                >
                  Tipo de certificación
                </InputLabel>
                <Select
                  value={newCertification.type}
                  onChange={(e) =>
                    onCertificationChange({
                      ...newCertification,
                      type: e.target.value,
                    })
                  }
                  label="Tipo de certificación"
                  disabled={certificationUploading}
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: institutionalColors.primary,
                    },
                  }}
                >
                  {certificationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: type.color,
                          }}
                        />
                        <span>{type.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Horas que vale"
                type="number"
                value={newCertification.hoursValue}
                onChange={(e) =>
                  onCertificationChange({
                    ...newCertification,
                    hoursValue: e.target.value,
                  })
                }
                fullWidth
                disabled={certificationUploading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">horas</InputAdornment>
                  ),
                }}
              />

              <Divider sx={{ my: 1 }}>
                <Chip label="DOCUMENTOS" size="small" />
              </Divider>

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: institutionalColors.primary,
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: institutionalColors.lightBlue,
                  cursor: certificationUploading ? "not-allowed" : "pointer",
                  opacity: certificationUploading ? 0.7 : 1,
                  "&:hover": {
                    bgcolor: certificationUploading
                      ? "rgba(19, 59, 107, 0.08)"
                      : "rgba(19, 59, 107, 0.12)",
                  },
                }}
                onClick={() =>
                  !certificationUploading &&
                  certificationFileInputRef.current?.click()
                }
              >
                <input
                  type="file"
                  ref={certificationFileInputRef}
                  onChange={onFileSelect}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  disabled={certificationUploading}
                  style={{ display: "none" }}
                />
                <UploadIcon
                  sx={{
                    fontSize: 48,
                    color: institutionalColors.primary,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{ color: institutionalColors.textPrimary }}
                  gutterBottom
                >
                  Haz clic para adjuntar documentos
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Sube los archivos relacionados con esta certificación
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: institutionalColors.textSecondary,
                    display: "block",
                    mt: 1,
                  }}
                >
                  Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB por
                  archivo)
                </Typography>
              </Box>

              {certificationFiles.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: institutionalColors.textPrimary, mb: 1 }}
                  >
                    Documentos a adjuntar ({certificationFiles.length})
                  </Typography>
                  <List dense>
                    {certificationFiles.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => onRemoveFile(index)}
                            disabled={certificationUploading}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: institutionalColors.error }}
                            />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={formatFileSize(file.size)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {certificationUploading && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={certificationUploadProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: institutionalColors.accent,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: institutionalColors.primary,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: institutionalColors.textSecondary,
                      mt: 1,
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Subiendo documentos... {certificationUploadProgress}%
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
          disabled={loading || certificationUploading}
        >
          Cancelar
        </Button>
        {selectedUser?.uploadPermission === "permitido" && (
          <Button
            onClick={onSave}
            variant="contained"
            disabled={loading || certificationUploading}
            startIcon={
              loading || certificationUploading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": {
                bgcolor: institutionalColors.secondary,
              },
            }}
          >
            {loading || certificationUploading
              ? "Guardando..."
              : selectedCertification
                ? "Actualizar"
                : certificationFiles.length > 0
                  ? `Agregar con ${certificationFiles.length} documento(s)`
                  : "Agregar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddCertificationDialog;