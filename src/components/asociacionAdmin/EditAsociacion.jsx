// src/components/asociacionAdmin/EditAsociacion.jsx
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
    Chip
} from '@mui/material';
import {
    Business as BusinessIcon,
    Info as InfoIcon,
    Person as PersonIcon,
    LocationOn as LocationOnIcon,
    Edit as EditIcon
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
        blue: '#0099FF',
        purple: '#6C5CE7'
    },
    text: {
        secondary: '#3A6EA5'
    },
    semaforo: {
        verde: '#388E3C'
    }
};

const EditAsociacion = ({
    open,
    onClose,
    onSave,
    asociacion = null,
    saving = false,
    regiones = []
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        representanteLegal: '',
        idRegion: ''
    });

    const [originalData, setOriginalData] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Cargar datos cuando se edita
    useEffect(() => {
        if (asociacion) {
            const data = {
                nombre: asociacion.nombre || '',
                codigo: asociacion.codigo || '',
                representanteLegal: asociacion.representanteLegal || '',
                idRegion: asociacion.idRegion || ''
            };
            setFormData(data);
            setOriginalData(data);
        }
    }, [asociacion, open]);

    // Detectar cambios
    useEffect(() => {
        if (originalData) {
            const changed = 
                formData.nombre !== originalData.nombre ||
                formData.codigo !== originalData.codigo ||
                formData.representanteLegal !== originalData.representanteLegal ||
                formData.idRegion !== originalData.idRegion;
            setHasChanges(changed);
        }
    }, [formData, originalData]);

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

    if (!asociacion) return null;

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
                    <EditIcon sx={{ color: colors.primary.main }} />
                    <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 600 }}>
                        Editar Asociación
                    </Typography>
                    {asociacion.activa ? (
                        <Chip 
                            label="ACTIVA" 
                            size="small" 
                            sx={{ 
                                bgcolor: colors.semaforo.verde, 
                                color: 'white',
                                ml: 'auto',
                                fontWeight: 600
                            }} 
                        />
                    ) : (
                        <Chip 
                            label="INACTIVA" 
                            size="small" 
                            sx={{ 
                                bgcolor: colors.primary.dark, 
                                color: 'white',
                                ml: 'auto',
                                fontWeight: 600
                            }} 
                        />
                    )}
                </Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                    ID: {asociacion.idAsociacion}
                </Typography>
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
                                    Cargando regiones...
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
                                <strong>Nota:</strong> La asociación pertenece a la Instancia 1 (SICAG). 
                                El estado activa/inactiva se cambia desde la tabla principal.
                            </span>
                        </Typography>
                    </Box>

                    {/* Campos de solo lectura (información adicional) */}
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: 2,
                        p: 2,
                        bgcolor: '#f8f9fa',
                        borderRadius: 1,
                        border: `1px solid ${colors.primary.light}`
                    }}>
                        <Box>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                Fecha de Creación
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.primary.dark, fontWeight: 500 }}>
                                {asociacion.fechaCreacion ? new Date(asociacion.fechaCreacion).toLocaleDateString() : 'No disponible'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                Última Modificación
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.primary.dark, fontWeight: 500 }}>
                                {asociacion.fechaModificacion ? new Date(asociacion.fechaModificacion).toLocaleDateString() : 'No disponible'}
                            </Typography>
                        </Box>
                    </Box>
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
                    disabled={!isFormValid() || !hasChanges || saving}
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
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAsociacion;