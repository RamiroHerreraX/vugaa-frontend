import React, { useState, useEffect } from 'react';
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
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  warning: '#f39c12',
  info: '#3498db',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f5f7fa',
};

const formatOptions = ['PDF', 'JPG', 'PNG', 'DOC', 'DOCX', 'XLS', 'XLSX', 'TXT'];
const sizeOptions = ['1MB', '5MB', '10MB', '25MB', '50MB', '100MB'];

const EditDocumentDialog = ({ open, onClose, onSave, categoryId, document }) => {
  const [editedDocument, setEditedDocument] = useState(null);

  useEffect(() => {
    if (document) {
      setEditedDocument({ ...document });
    }
  }, [document]);

  if (!editedDocument) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
            Editar Documento
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre del Documento *"
            value={editedDocument.name}
            onChange={(e) => setEditedDocument({...editedDocument, name: e.target.value})}
          />
          
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={2}
            value={editedDocument.description}
            onChange={(e) => setEditedDocument({...editedDocument, description: e.target.value})}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Formato"
              value={editedDocument.format}
              onChange={(e) => setEditedDocument({...editedDocument, format: e.target.value})}
            >
              {formatOptions.map(format => (
                <MenuItem key={format} value={format}>{format}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              select
              label="Tamaño Máximo"
              value={editedDocument.maxSize}
              onChange={(e) => setEditedDocument({...editedDocument, maxSize: e.target.value})}
            >
              {sizeOptions.map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </TextField>
          </Box>
          
          <TextField
            fullWidth
            label="Revisión Periódica"
            value={editedDocument.periodicReview}
            onChange={(e) => setEditedDocument({...editedDocument, periodicReview: e.target.value})}
            InputProps={{
              endAdornment: <InputAdornment position="end">días</InputAdornment>,
            }}
          />
          
          <TextField
            fullWidth
            label="Validación Requerida"
            value={editedDocument.validation}
            onChange={(e) => setEditedDocument({...editedDocument, validation: e.target.value})}
          />
          
          <TextField
            fullWidth
            label="Etiquetas"
            value={editedDocument.tags?.join(', ') || ''}
            onChange={(e) => setEditedDocument({...editedDocument, tags: e.target.value.split(',').map(t => t.trim())})}
            helperText="Separar por comas"
          />
          
          <TextField
            fullWidth
            label="Orden"
            type="number"
            value={editedDocument.order}
            onChange={(e) => setEditedDocument({...editedDocument, order: parseInt(e.target.value)})}
          />
          
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={editedDocument.required}
                  onChange={(e) => setEditedDocument({...editedDocument, required: e.target.checked})}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: institutionalColors.primary,
                    }
                  }}
                />
              }
              label="Documento Obligatorio"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={editedDocument.committeeReview}
                  onChange={(e) => setEditedDocument({...editedDocument, committeeReview: e.target.checked})}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: institutionalColors.warning,
                    }
                  }}
                />
              }
              label="Requiere revisión por comité"
            />
          </Stack>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} sx={{ color: institutionalColors.textSecondary }}>
          Cancelar
        </Button>
        <Button 
          onClick={() => onSave(categoryId, editedDocument)} 
          variant="contained"
          disabled={!editedDocument.name}
          sx={{
            bgcolor: institutionalColors.primary,
            '&:hover': { bgcolor: institutionalColors.secondary }
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDocumentDialog;