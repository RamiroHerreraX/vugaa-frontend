import React from "react";
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
  Tooltip,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textSecondary: "#6b7280",
  textPrimary: "#111827",
  error: "#dc2626",
};

const DocumentsDialog = ({
  open,
  onClose,
  selectedUser,
  selectedCertification,
  onDeleteDocument,
  onUploadDocuments,
  getFileIcon,
  formatFileSize,
}) => {
  if (!selectedCertification) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <AttachFileIcon sx={{ color: institutionalColors.primary }} />
          <Box>
            <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
              Documentos de {selectedCertification.name}
            </Typography>
            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
              Usuario: {selectedUser?.name}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {selectedCertification.documents?.length > 0 ? (
          <List>
            {selectedCertification.documents.map((doc) => (
              <ListItem
                key={doc.id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    {selectedUser?.uploadPermission === "permitido" && (
                      <Tooltip title="Eliminar">
                        <IconButton
                          edge="end"
                          onClick={() => onDeleteDocument(doc.id)}
                          sx={{ color: institutionalColors.error }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                }
              >
                <ListItemIcon>{getFileIcon(doc.type)}</ListItemIcon>
                <ListItemText
                  primary={doc.name}
                  secondary={
                    <Stack direction="row" spacing={2} component="span">
                      <Typography variant="caption" component="span">
                        {formatFileSize(doc.size)}
                      </Typography>
                      <Typography variant="caption" component="span">
                        {format(parseISO(doc.uploadDate), "dd/MM/yyyy HH:mm", { locale: es })}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <AttachFileIcon
              sx={{
                fontSize: 48,
                color: institutionalColors.textSecondary,
                mb: 2,
              }}
            />
            <Typography variant="body1" sx={{ color: institutionalColors.textSecondary }} gutterBottom>
              No hay documentos para esta certificación
            </Typography>
            {selectedUser?.uploadPermission === "permitido" && (
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={onUploadDocuments}
                sx={{
                  mt: 2,
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Subir Documentos
              </Button>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentsDialog;