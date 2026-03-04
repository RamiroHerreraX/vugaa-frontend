// src/components/admin/CreateAsociacion.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    InputAdornment,
    Alert
} from '@mui/material';
import {
    Business as BusinessIcon,
    Info as InfoIcon,
    Person as PersonIcon,
    LocationOn as LocationOnIcon
} from '@mui/icons-material';

// Paleta corporativa
const colors = {
    primary: {
        dark: '#0D2A4D',
        main: '#133B6B',
        light: '#3A6EA5'
    },
    secondary: {
        main: '#00A8A8'
    },
    accents: {
        blue: '#0099FF'
    },
    text: {
        secondary: '#3A6EA5'
    }
};

const CreateAsociacion = ({
    open,
    onClose,
    onSave,
    editingAsociacion = null,
    saving = false,
    regiones = []
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        representanteLegal: '',
        idRegion: ''
    });

    // Cargar datos cuando se edita
    useEffect(() => {
        if (editingAsociacion) {
            setFormData({
                nombre: editingAsociacion.nombre || '',
                codigo: editingAsociacion.codigo || '',
                representanteLegal: editingAsociacion.representanteLegal || '',
                idRegion: editingAsociacion.idRegion || ''
            });
        } else {
            setFormData({
                nombre: '',
                codigo: '',
                representanteLegal: '',
                idRegion: ''
            });
        }
    }, [editingAsociacion, open]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    const isFormValid = () => {
        return formData.nombre.trim() !== '' && formData.idRegion !== '';
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ 
                sx: { 
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                } 
            }}
        >
            <DialogTitle sx={{ 
                borderBottom: `1px solid ${colors.primary.light}`,
                bgcolor: '#f8f9fa',
                px: 3,
                py: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ color: colors.primary.main }} />
                    <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 600 }}>
                        {editingAsociacion ? 'Editar Asociación' : 'Nueva Asociación'}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* Campo: Nombre */}
                    <TextField
                        fullWidth
                        label="Nombre de la Asociación"
                        value={formData.nombre}
                        onChange={handleChange('nombre')}
                        required
                        disabled={saving}
                        size="small"
                        placeholder="Ej: Asociación de Ganaderos del Norte"
                        helperText="Nombre completo de la asociación"
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: colors.text.secondary,
                                '&.Mui-focused': { color: colors.primary.main }
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />
                    
                    {/* Campo: Código */}
                    <TextField
                        fullWidth
                        label="Código"
                        value={formData.codigo}
                        onChange={handleChange('codigo')}
                        disabled={saving}
                        size="small"
                        placeholder="ASOC-001"
                        helperText="Código único de identificación (opcional)"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                        ID:
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: colors.text.secondary,
                                '&.Mui-focused': { color: colors.primary.main }
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />

                    {/* Campo: Representante Legal */}
                    <TextField
                        fullWidth
                        label="Representante Legal"
                        value={formData.representanteLegal}
                        onChange={handleChange('representanteLegal')}
                        disabled={saving}
                        size="small"
                        placeholder="Juan Carlos Méndez"
                        helperText="Nombre del representante legal (opcional)"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: colors.text.secondary,
                                '&.Mui-focused': { color: colors.primary.main }
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />

                    {/* Selector: Región */}
                    <FormControl 
                        fullWidth 
                        size="small" 
                        disabled={saving}
                        required
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: colors.text.secondary,
                                '&.Mui-focused': { color: colors.primary.main }
                            }
                        }}
                    >
                        <InputLabel>Región *</InputLabel>
                        <Select
                            value={formData.idRegion}
                            label="Región *"
                            onChange={handleChange('idRegion')}
                            startAdornment={
                                <InputAdornment position="start">
                                    <LocationOnIcon sx={{ color: colors.primary.main, fontSize: 20, ml: 1 }} />
                                </InputAdornment>
                            }
                            sx={{
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary.main
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>Seleccionar región</em>
                            </MenuItem>
                            {regiones.length === 0 ? (
                                <MenuItem disabled>
                                    <CircularProgress size={20} sx={{ mr: 1 }} /> 
                                    No hay regiones disponibles
                                </MenuItem>
                            ) : (
                                regiones.map(region => (
                                    <MenuItem key={region.idRegion} value={region.idRegion}>
                                        {region.nombre}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    {/* Información adicional */}
                    <Box sx={{ 
                        mt: 1, 
                        p: 2, 
                        bgcolor: '#f0f7ff', 
                        borderRadius: 1.5, 
                        border: `1px solid ${colors.primary.light}`,
                        borderLeft: `4px solid ${colors.accents.blue}`
                    }}>
                        <Typography variant="caption" sx={{ 
                            color: colors.primary.dark, 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1,
                            lineHeight: 1.5
                        }}>
                            <InfoIcon sx={{ fontSize: 18, color: colors.accents.blue, mt: 0.2, flexShrink: 0 }} />
                            <span>
                                <strong>Nota:</strong> La asociación se creará en la Instancia 1 (SICAG). 
                                {editingAsociacion ? ' El estado activa/inactiva se cambia desde la tabla principal.' : ''}
                            </span>
                        </Typography>
                    </Box>

                    {/* Advertencia si no hay regiones */}
                    {regiones.length === 0 && !saving && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                            No hay regiones activas disponibles. Debe crear al menos una región antes de crear una asociación.
                        </Alert>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ 
                p: 2.5, 
                borderTop: `1px solid ${colors.primary.light}`,
                bgcolor: '#f8f9fa',
                gap: 1
            }}>
                <Button
                    onClick={handleClose}
                    disabled={saving}
                    variant="outlined"
                    size="small"
                    sx={{ 
                        color: colors.text.secondary,
                        borderColor: colors.primary.light,
                        '&:hover': {
                            borderColor: colors.primary.main,
                            bgcolor: 'transparent'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!isFormValid() || saving || regiones.length === 0}
                    startIcon={saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
                    size="small"
                    sx={{ 
                        bgcolor: colors.primary.main, 
                        '&:hover': { bgcolor: colors.primary.dark },
                        '&.Mui-disabled': {
                            bgcolor: colors.primary.light,
                            opacity: 0.5
                        }
                    }}
                >
                    {saving ? 'Guardando...' : (editingAsociacion ? 'Actualizar' : 'Crear')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAsociacion;