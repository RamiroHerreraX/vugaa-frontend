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
    FormControlLabel,
    Switch,
    CircularProgress
} from '@mui/material';
import {
    Public as PublicIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import regionesService from '../../services/regiones';

// Paleta corporativa (del prototipo)
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
        primary: '#0D2A4D',
        secondary: '#3A6EA5'
    }
};

const CreateRegion = ({ 
    open, 
    onClose, 
    onSave, 
    editingRegion = null,
    saving = false
}) => {
    const [regionForm, setRegionForm] = useState({
        nombre: '',
        pais: 'México',
        estado: '',
        activa: true,
        idInstancia: 1
    });
    const [checkingNombre, setCheckingNombre] = useState(false);
    const [nombreExists, setNombreExists] = useState(false);

    // Inicializar formulario cuando se abre el diálogo
    useEffect(() => {
        if (open) {
            setRegionForm({
                nombre: editingRegion?.nombre || '',
                pais: editingRegion?.pais || 'México',
                estado: editingRegion?.estado || '',
                activa: editingRegion?.activa !== undefined ? editingRegion.activa : true,
                idInstancia: editingRegion?.idInstancia || 1
            });
            setNombreExists(false);
        }
    }, [open, editingRegion]);

    // Debounce: verificar nombre duplicado
    useEffect(() => {
        const check = async () => {
            if (!regionForm.nombre || regionForm.nombre.length < 3) {
                setNombreExists(false);
                return;
            }
            setCheckingNombre(true);
            try {
                if (editingRegion) {
                    // Para edición, verificamos si existe otro con el mismo nombre
                    try {
                        const existingRegion = await regionesService.findByNombreIgnoreCase(regionForm.nombre);
                        setNombreExists(existingRegion !== null && existingRegion.id !== editingRegion.id);
                    } catch {
                        setNombreExists(false);
                    }
                } else {
                    // Para creación nueva
                    try {
                        const existingRegion = await regionesService.findByNombreIgnoreCase(regionForm.nombre);
                        setNombreExists(existingRegion !== null);
                    } catch {
                        setNombreExists(false);
                    }
                }
            } catch (error) {
                console.error('Error verificando nombre:', error);
                setNombreExists(false);
            } finally {
                setCheckingNombre(false);
            }
        };
        const t = setTimeout(check, 500);
        return () => clearTimeout(t);
    }, [regionForm.nombre, editingRegion]);

    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setRegionForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!regionForm.nombre.trim()) return;
        if (!regionForm.pais.trim()) return;
        if (nombreExists) return;

        await onSave(regionForm);
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
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PublicIcon sx={{ color: colors.primary.main }} />
                    <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                        {editingRegion ? 'Editar Región' : 'Nueva Región'}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Nombre de la Región"
                        value={regionForm.nombre}
                        onChange={handleChange('nombre')}
                        required
                        error={nombreExists}
                        helperText={nombreExists ? 'Este nombre ya existe' : checkingNombre ? 'Verificando...' : ''}
                        disabled={saving}
                        size="small"
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.text.secondary },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="País"
                        value={regionForm.pais}
                        onChange={handleChange('pais')}
                        required
                        placeholder="Ej: México"
                        disabled={saving}
                        size="small"
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.text.secondary },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Estado / Provincia"
                        value={regionForm.estado}
                        onChange={handleChange('estado')}
                        placeholder="Ej: Región Metropolitana, Provincia de Buenos Aires..."
                        disabled={saving}
                        size="small"
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.text.secondary },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={regionForm.activa}
                                onChange={handleChange('activa')}
                                disabled={saving}
                                size="small"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: colors.secondary.main,
                                        '&:hover': { backgroundColor: '#e8f5e9' },
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: colors.secondary.main,
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                Región Activa
                            </Typography>
                        }
                    />
                    <Box sx={{ mt: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: `1px solid ${colors.primary.light}` }}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <InfoIcon sx={{ fontSize: 16, color: colors.accents.blue }} />
                            Las regiones no se eliminan, solo se activan o desactivan
                        </Typography>
                        {editingRegion && (
                            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                                El estado activo/inactivo también puede cambiarse desde la tabla
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                <Button
                    onClick={handleClose}
                    disabled={saving}
                    sx={{ color: colors.text.secondary }}
                    size="small"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!regionForm.nombre.trim() || !regionForm.pais.trim() || nombreExists || checkingNombre || saving}
                    startIcon={saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
                    size="small"
                    sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                >
                    {saving ? 'Guardando...' : (editingRegion ? 'Actualizar' : 'Crear')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRegion;