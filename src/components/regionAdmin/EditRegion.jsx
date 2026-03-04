// src/components/regionAdmin/EditRegion.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import {
    Public as PublicIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const colors = {
    primary: {
        dark: '#0D2A4D',
        main: '#133B6B',
        light: '#3A6EA5'
    },
    accents: {
        blue: '#0099FF'
    },
    text: {
        secondary: '#3A6EA5'
    }
};

const EditRegion = ({
    open,
    onClose,
    onSave,
    editingRegion,
    saving
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        pais: '',
        estado: ''
    });
    const [errors, setErrors] = useState({});

    // Cargar datos de la región cuando se abre el diálogo
    useEffect(() => {
        if (editingRegion && open) {
            setFormData({
                nombre: editingRegion.nombre || '',
                pais: editingRegion.pais || '',
                estado: editingRegion.estado || ''
            });
            setErrors({});
        }
    }, [editingRegion, open]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre de la región es obligatorio';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (formData.nombre.length > 100) {
            newErrors.nombre = 'El nombre no puede exceder los 100 caracteres';
        }

        if (formData.pais && formData.pais.length > 100) {
            newErrors.pais = 'El país no puede exceder los 100 caracteres';
        }

        if (formData.estado && formData.estado.length > 100) {
            newErrors.estado = 'El estado/provincia no puede exceder los 100 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const regionData = {
            nombre: formData.nombre.trim(),
            pais: formData.pais.trim() || null,
            estado: formData.estado.trim() || null,
            // Mantener el estado activo original (no se modifica aquí)
            activa: editingRegion.activa
        };

        await onSave(regionData);
    };

    const handleClose = () => {
        if (saving) return;
        onClose();
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
                    backgroundColor: 'white'
                }
            }}
        >
            <DialogTitle sx={{
                borderBottom: `1px solid ${colors.primary.light}`,
                backgroundColor: '#f8f9fa'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PublicIcon sx={{ color: colors.primary.main }} />
                    <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                        Editar Región: {editingRegion?.nombre}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        fullWidth
                        label="Nombre de la Región *"
                        value={formData.nombre}
                        onChange={handleChange('nombre')}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        disabled={saving}
                        size="small"
                        required
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: colors.text.secondary,
                                '&.Mui-focused': {
                                    color: colors.primary.main
                                }
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.primary.main
                                }
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="País"
                        value={formData.pais}
                        onChange={handleChange('pais')}
                        error={!!errors.pais}
                        helperText={errors.pais}
                        disabled={saving}
                        size="small"
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: colors.text.secondary,
                                '&.Mui-focused': {
                                    color: colors.primary.main
                                }
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.primary.main
                                }
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Estado / Provincia"
                        value={formData.estado}
                        onChange={handleChange('estado')}
                        error={!!errors.estado}
                        helperText={errors.estado}
                        disabled={saving}
                        size="small"
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: colors.text.secondary,
                                '&.Mui-focused': {
                                    color: colors.primary.main
                                }
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.primary.main
                                }
                            }
                        }}
                    />

                    <Box sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: '#f8f9fa',
                        borderRadius: 1,
                        border: `1px solid ${colors.primary.light}`
                    }}>
                        <Typography variant="caption" sx={{
                            color: colors.text.secondary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}>
                            <InfoIcon sx={{ fontSize: 16, color: colors.accents.blue }} />
                            Para activar o desactivar la región, use los botones en la tabla principal.
                            Estado actual: {editingRegion?.activa ? 'ACTIVA' : 'INACTIVA'}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{
                p: 2,
                borderTop: `1px solid ${colors.primary.light}`,
                backgroundColor: '#f8f9fa'
            }}>
                <Button
                    onClick={handleClose}
                    disabled={saving}
                    sx={{
                        color: colors.text.secondary,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                    size="small"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={saving || !formData.nombre.trim()}
                    size="small"
                    sx={{
                        bgcolor: colors.primary.main,
                        '&:hover': {
                            bgcolor: colors.primary.dark
                        },
                        '&.Mui-disabled': {
                            bgcolor: colors.primary.light,
                            opacity: 0.6
                        }
                    }}
                >
                    {saving ? (
                        <>
                            <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                            Actualizando...
                        </>
                    ) : (
                        'Actualizar Región'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRegion;