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
import { Description as DescriptionIcon } from '@mui/icons-material';

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

const CreateDocumentDialog = ({ open, onClose, onSave, categoryId }) => {
  const [document, setDocument] = useState({
    id: Date.now(),
    name: '',
    description: '',
    required: false,
    format: 'PDF',
    maxSize: '5MB',
    validation: '',
    tags: [],
    order: 1,
    periodicReview: '0',
    committeeReview: false,
    reviewDescription: ''
  });

  useEffect(() => {
    if (open) {
      setDocument({
        id: Date.now(),
        name: '',
        description: '',
        required: false,
        format: 'PDF',
        maxSize: '5MB',
        validation: '',
        tags: [],
        order: 1,
        periodicReview: '0',
        committeeReview: false,
        reviewDescription: ''
      });
    }
  }, [open]);

  const handleSave = () => {
    if (!document.name) return;
    onSave(categoryId, document);
  };

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
          <DescriptionIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
            Nuevo Documento
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre del Documento *"
            value={document.name}
            onChange={(e) => setDocument({...document, name: e.target.value})}
          />
          
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={2}
            value={document.description}
            onChange={(e) => setDocument({...document, description: e.target.value})}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Formato"
              value={document.format}
              onChange={(e) => setDocument({...document, format: e.target.value})}
            >
              {formatOptions.map(format => (
                <MenuItem key={format} value={format}>{format}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              select
              label="Tamaño Máximo"
              value={document.maxSize}
              onChange={(e) => setDocument({...document, maxSize: e.target.value})}
            >
              {sizeOptions.map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </TextField>
          </Box>
          
          <TextField
            fullWidth
            label="Revisión Periódica"
            value={document.periodicReview}
            onChange={(e) => setDocument({...document, periodicReview: e.target.value})}
            helperText="Ej: 30, 90, 180, 365, 730 días (0 = sin revisión)"
            InputProps={{
              endAdornment: <InputAdornment position="end">días</InputAdornment>,
            }}
          />
          
          <TextField
            fullWidth
            label="Validación Requerida"
            value={document.validation}
            onChange={(e) => setDocument({...document, validation: e.target.value})}
            helperText="Ej: OCR, Vigencia, Firma, etc."
          />
          
          <TextField
            fullWidth
            label="Etiquetas"
            value={document.tags?.join(', ') || ''}
            onChange={(e) => setDocument({...document, tags: e.target.value.split(',').map(t => t.trim())})}
            helperText="Separar por comas"
          />
          
          <TextField
            fullWidth
            label="Orden"
            type="number"
            value={document.order}
            onChange={(e) => setDocument({...document, order: parseInt(e.target.value)})}
          />
          
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={document.required}
                  onChange={(e) => setDocument({...document, required: e.target.checked})}
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
                  checked={document.committeeReview}
                  onChange={(e) => setDocument({...document, committeeReview: e.target.checked})}
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
          onClick={handleSave} 
          variant="contained"
          disabled={!document.name}
          sx={{
            bgcolor: institutionalColors.primary,
            '&:hover': { bgcolor: institutionalColors.secondary }
          }}
        >
          Crear Documento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDocumentDialog;