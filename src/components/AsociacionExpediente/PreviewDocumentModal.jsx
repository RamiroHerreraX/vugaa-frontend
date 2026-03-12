import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  FilePresent as FilePresentIcon,
} from "@mui/icons-material";

const colors = {
  primary: { main: "#133B6B", dark: "#0D2A4D" },
  text: { primary: "#0D2A4D", secondary: "#3A6EA5" },
};

const TextPreview = ({ objectUrl }) => {
  const [text, setText] = React.useState("");
  React.useEffect(() => {
    fetch(objectUrl)
      .then((r) => r.text())
      .then(setText)
      .catch(() => setText("No se pudo leer el archivo."));
  }, [objectUrl]);
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        margin: 0,
        color: "#333",
      }}
    >
      {text}
    </pre>
  );
};

const PreviewDocumentModal = ({
  open,
  onClose,
  nombre,
  tipo,
  loading,
  objectUrl,
  onDownload,
}) => {
  const handleClose = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "90vh",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${colors.primary.main}20`,
          py: 1.5,
          flexShrink: 0,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <DescriptionIcon sx={{ color: colors.primary.main }} />
            <Typography
              variant="h6"
              sx={{
                color: colors.primary.dark,
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {nombre}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
          backgroundColor: "#f5f5f5",
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 2,
            }}
          >
            <LinearProgress sx={{ width: "200px" }} />
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Cargando vista previa...
            </Typography>
          </Box>
        )}
        {!loading && !objectUrl && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 2,
              p: 3,
            }}
          >
            <FilePresentIcon sx={{ fontSize: 80, color: colors.primary.main }} />
            <Typography variant="h6" sx={{ color: colors.text.primary }}>
              {nombre}
            </Typography>
            <Alert severity="info" sx={{ maxWidth: "400px", borderRadius: 2 }}>
              <Typography variant="body2">
                Vista previa no disponible para este documento.
              </Typography>
            </Alert>
          </Box>
        )}
        {!loading && objectUrl && tipo === "pdf" && (
          <iframe
            src={objectUrl}
            style={{ width: "100%", flex: 1, border: "none", minHeight: 0 }}
            title={nombre}
          />
        )}
        {!loading && objectUrl && tipo === "image" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              p: 2,
              backgroundColor: "#f0f0f0",
              overflow: "auto",
            }}
          >
            <img
              src={objectUrl}
              alt={nombre}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </Box>
        )}
        {!loading && objectUrl && tipo === "office" && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              gap: 2,
            }}
          >
            <FilePresentIcon sx={{ fontSize: 60, color: colors.primary.main }} />
            <Typography variant="body1" sx={{ color: colors.text.primary }}>
              {nombre}
            </Typography>
            <Alert severity="info" sx={{ maxWidth: "400px", borderRadius: 2 }}>
              <Typography variant="body2">
                Los archivos Office no se pueden previsualizar. Usa el botón{" "}
                <strong>Descargar</strong>.
              </Typography>
            </Alert>
          </Box>
        )}
        {!loading && objectUrl && tipo === "text" && (
          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            <TextPreview objectUrl={objectUrl} />
          </Box>
        )}
        {!loading && objectUrl && tipo === "video" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              backgroundColor: "#000",
            }}
          >
            <video
              src={objectUrl}
              controls
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Box>
        )}
        {!loading && objectUrl && tipo === "audio" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              p: 4,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <FilePresentIcon
                sx={{ fontSize: 80, color: colors.primary.main, mb: 2 }}
              />
              <Typography variant="body1" sx={{ mb: 3, color: colors.text.primary }}>
                {nombre}
              </Typography>
              <audio src={objectUrl} controls style={{ width: "100%", minWidth: "300px" }} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 1.5,
          borderTop: `1px solid ${colors.primary.main}20`,
          flexShrink: 0,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            color: colors.primary.main,
            borderColor: colors.primary.main,
            "&:hover": { backgroundColor: `${colors.primary.main}10` },
          }}
        >
          Cerrar
        </Button>
        {objectUrl && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{
              textTransform: "none",
              bgcolor: colors.primary.main,
              "&:hover": { bgcolor: colors.primary.dark },
            }}
          >
            Descargar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDocumentModal;