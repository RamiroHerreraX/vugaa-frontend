import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

const colors = {
  primary: { main: "#133B6B", dark: "#0D2A4D" },
  text: { secondary: "#3A6EA5" },
};

const ValidationSendModal = ({ open, onClose, onConfirm, programa, documento, fecha }) => {
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
        sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SendIcon sx={{ color: colors.primary.main }} />
          <Typography
            variant="h6"
            sx={{ color: colors.primary.dark, fontWeight: "600" }}
          >
            Enviar Certificación a Validación
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Alert
          severity="info"
          sx={{ mb: 3, backgroundColor: "#e3f2fd", borderRadius: 2 }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "600", color: colors.primary.main }}
          >
            Confirmación de Envío
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            ¿Está seguro de enviar esta certificación para su validación?
          </Typography>
        </Alert>
        <Paper
          variant="outlined"
          sx={{ p: 2.5, mb: 3, backgroundColor: "#f8f9fa", borderRadius: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  fontWeight: "500",
                  mb: 0.5,
                }}
              >
                Programa:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: colors.primary.dark, fontWeight: "600" }}
              >
                {programa?.nombre}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  fontWeight: "500",
                  mb: 0.5,
                }}
              >
                Documento:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: colors.primary.dark, fontWeight: "600" }}
              >
                {documento?.nombreArchivo}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  fontWeight: "500",
                  mb: 0.5,
                }}
              >
                Fecha de envío:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: colors.primary.dark, fontWeight: "600" }}
              >
                {fecha}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
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
          onClick={onConfirm}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{
            textTransform: "none",
            bgcolor: colors.primary.main,
            "&:hover": { bgcolor: colors.primary.dark },
          }}
        >
          Confirmar Envío
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationSendModal;