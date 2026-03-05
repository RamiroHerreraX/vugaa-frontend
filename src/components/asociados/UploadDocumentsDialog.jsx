import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
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
  error: "#dc2626",
};

const UploadDocumentsDialog = ({
  open,
  onClose,
  selectedUser,
  selectedCertification,
  uploadFiles,
  onFileSelect,
  onRemoveFile,
  onUpload,
  uploading,
  uploadProgress,
  getFileIcon,
  formatFileSize,
}) => {
  const fileInputRef = useRef(null);

  if (!selectedCertification) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !uploading && onClose()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <UploadIcon sx={{ color: institutionalColors.primary }} />
          <Box>
            <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
              Subir Documentos Adicionales
            </Typography>
            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
              {selectedCertification.name} - {selectedUser?.name}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: institutionalColors.primary,
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: institutionalColors.lightBlue,
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1,
              "&:hover": {
                bgcolor: uploading
                  ? "rgba(19, 59, 107, 0.08)"
                  : "rgba(19, 59, 107, 0.12)",
              },
            }}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              disabled={uploading}
              style={{ display: "none" }}
            />
            <UploadIcon sx={{ fontSize: 48, color: institutionalColors.primary, mb: 1 }} />
            <Typography variant="body1" sx={{ color: institutionalColors.textPrimary }} gutterBottom>
              Haz clic para seleccionar archivos
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              o arrastra y suelta los archivos aquí
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: institutionalColors.textSecondary,
                display: "block",
                mt: 1,
              }}
            >
              Formatos permitidos: PDF, JPG, PNG, DOC, DOCX (Máx. 10MB)
            </Typography>
          </Box>

          {uploadFiles.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                Archivos seleccionados ({uploadFiles.length})
              </Typography>
              <List dense>
                {uploadFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onRemoveFile(index)}
                        disabled={uploading}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: institutionalColors.error }} />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                    <ListItemText primary={file.name} secondary={formatFileSize(file.size)} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {uploading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
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
                Subiendo... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onUpload}
          disabled={uploadFiles.length === 0 || uploading}
          startIcon={
            uploading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              <UploadIcon />
            )
          }
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {uploading ? "Subiendo..." : "Subir Archivos"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentsDialog;