import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import UploadProgress from "./UploadProgress";

const colors = {
  primary: { main: "#133B6B", dark: "#0D2A4D" },
  status: { success: "#00A8A8", error: "#0099FF" },
  text: { primary: "#0D2A4D", secondary: "#3A6EA5" },
};

const UploadDocumentModal = ({
  open,
  onClose,
  titulo,
  archivo,
  nombreArchivo,
  uploading,
  progress,
  onFileSelect,
  onRemoveFile,
  onUpload,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${colors.primary.main}20`,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: colors.primary.dark,
          fontWeight: "bold",
        }}
      >
        <CloudUploadIcon sx={{ color: colors.primary.main }} />
        Subir Documento: {titulo}
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: colors.text.primary, mb: 1, fontWeight: "600" }}
        >
          Archivo <span style={{ color: colors.status.error }}>*</span>
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            border: `2px dashed ${archivo ? colors.status.success : colors.primary.main}40`,
            borderRadius: 2,
            cursor: uploading ? "default" : "pointer",
            textAlign: "center",
            transition: "all 0.2s",
            opacity: uploading ? 0.7 : 1,
            "&:hover": {
              borderColor: uploading ? undefined : colors.primary.main,
              backgroundColor: uploading ? undefined : "#f8f9fa",
            },
          }}
          onClick={() => !uploading && document.getElementById("file-upload").click()}
        >
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={onFileSelect}
            disabled={uploading}
          />
          {archivo ? (
            <>
              <CheckCircleIcon
                sx={{ color: colors.status.success, fontSize: 40, mb: 1 }}
              />
              <Typography
                variant="body1"
                sx={{ color: colors.text.primary, fontWeight: "500" }}
              >
                {nombreArchivo}
              </Typography>
              {!uploading && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile();
                  }}
                  sx={{
                    mt: 1,
                    color: colors.status.error,
                    borderColor: colors.status.error,
                    "&:hover": { backgroundColor: "#ffebee" },
                  }}
                >
                  Quitar archivo
                </Button>
              )}
            </>
          ) : (
            <>
              <CloudUploadIcon
                sx={{ color: colors.primary.main, fontSize: 40, mb: 1 }}
              />
              <Typography
                variant="body1"
                sx={{ color: colors.text.primary, fontWeight: "500" }}
              >
                Haz clic para seleccionar un archivo
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, display: "block", mt: 1 }}
              >
                Formatos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)
              </Typography>
            </>
          )}
        </Paper>
        {uploading && (
          <UploadProgress
            progress={progress}
            fileName={nombreArchivo}
            onComplete={() => {}}
          />
        )}
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={uploading}
          sx={{
            textTransform: "none",
            color: colors.primary.main,
            borderColor: colors.primary.main,
            "&:hover": { backgroundColor: `${colors.primary.main}10` },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onUpload}
          variant="contained"
          disabled={!archivo || uploading}
          sx={{
            textTransform: "none",
            bgcolor: colors.primary.main,
            "&:hover": { bgcolor: colors.primary.dark },
            "&.Mui-disabled": { bgcolor: "#e0e0e0" },
          }}
        >
          {uploading ? "Subiendo..." : "Subir Documento"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentModal;