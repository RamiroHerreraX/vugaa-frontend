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
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const colors = {
  primary: { main: "#133B6B", dark: "#0D2A4D" },
  status: { error: "#0099FF" },
  text: { secondary: "#3A6EA5" },
};

const DeleteConfirmModal = ({ open, onClose, onConfirm, nombre, tipo = "documento" }) => {
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
          <DeleteIcon sx={{ color: colors.status.error }} />
          <Typography
            variant="h6"
            sx={{ color: colors.primary.dark, fontWeight: "600" }}
          >
            Confirmar Eliminación
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2">
            ¿Está seguro que desea eliminar{" "}
            <strong>"{nombre}"</strong>?
          </Typography>
        </Alert>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Esta acción no se puede deshacer.
        </Typography>
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
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            textTransform: "none",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;