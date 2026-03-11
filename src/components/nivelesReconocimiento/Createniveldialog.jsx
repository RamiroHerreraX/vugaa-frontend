import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, TextField, Button, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, Chip,
    OutlinedInput, Checkbox, ListItemText, FormHelperText,
    Alert, Grid
} from '@mui/material';
import { EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import * as programaService from '../../services/programas';
import { useAuth } from '../../context/AuthContext';

const colors = {
    primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
    secondary: { main: '#00A8A8' },
    text: { secondary: '#3A6EA5' }
};

const INITIAL_FORM = {
    nombre: '',
    nivel: '',
    descripcion: '',
    programasSeleccionados: []
};

const CreateNivelDialog = ({ open, onClose, onSave, saving }) => {
    const { user } = useAuth();
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [programas, setProgramas] = useState([]);
    const [loadingProgramas, setLoadingProgramas] = useState(false);
    const [programasError, setProgramasError] = useState(null);

    useEffect(() => {
        if (open && user?.instanciaId) {
            fetchProgramas();
        }
    }, [open, user]);

    const fetchProgramas = async () => {
        setLoadingProgramas(true);
        setProgramasError(null);
        
        try {
            const data = await programaService.getProgramasGlobalesYPorInstancia(user.instanciaId);
            
            let programasArray = [];
            
            if (Array.isArray(data)) {
                programasArray = data;
            } else if (data && typeof data === 'object') {
                if (data.data && Array.isArray(data.data)) {
                    programasArray = data.data;
                } else if (data.programas && Array.isArray(data.programas)) {
                    programasArray = data.programas;
                } else {
                    const possibleArray = Object.values(data).find(val => Array.isArray(val));
                    if (possibleArray) {
                        programasArray = possibleArray;
                    }
                }
            }
            
            const programasActivos = programasArray.filter(p => p.activo !== false);
            setProgramas(programasActivos);
            
        } catch (error) {
            setProgramasError(
                error?.response?.data?.message || 
                error?.message || 
                'Error al cargar los programas'
            );
        } finally {
            setLoadingProgramas(false);
        }
    };

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleProgramasChange = (event) => {
        const selectedIds = event.target.value;
        
        const programasSeleccionados = selectedIds.map(id => {
            const programa = programas.find(p => 
                p.id === id || 
                p.idPrograma === id || 
                p.programaId === id
            );
            
            return {
                id: programa?.id || programa?.idPrograma || programa?.programaId,
                nombre: programa?.nombre || '',
                horasRequeridas: programa?.horasRequeridas || 0
            };
        }).filter(p => p.id);

        setForm(prev => ({ ...prev, programasSeleccionados }));
        
        if (errors.programasSeleccionados) {
            setErrors(prev => ({ ...prev, programasSeleccionados: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!form.nivel || isNaN(Number(form.nivel)) || Number(form.nivel) <= 0)
            newErrors.nivel = 'Ingrese un nivel numérico válido (mayor a 0)';
        if (form.programasSeleccionados.length === 0)
            newErrors.programasSeleccionados = 'Debe seleccionar al menos un programa';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const reglasJson = JSON.stringify({
            programas: form.programasSeleccionados,
            version: 1,
            fechaCreacion: new Date().toISOString()
        });

        onSave({
            nombre: form.nombre.trim(),
            nivel: Number(form.nivel),
            descripcion: form.descripcion.trim() || null,
            reglasJson: reglasJson,
            activo: true
        });
    };

    const handleClose = () => {
        if (saving) return;
        setForm(INITIAL_FORM);
        setErrors({});
        setProgramasError(null);
        onClose();
    };

    const getProgramaId = (programa) => programa.id || programa.idPrograma || programa.programaId;

    const esProgramaGlobal = (programa) => {
        return !programa.instancia && !programa.idInstancia;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: colors.primary.main }} />
                    <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                        Nuevo Nivel de Reconocimiento
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    
                    {programasError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {programasError}
                        </Alert>
                    )}

                    {!loadingProgramas && programas.length === 0 && !programasError && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            No hay programas disponibles. Contacta al administrador.
                        </Alert>
                    )}

                    {/* Grid para nombre y nivel en la misma fila */}
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth 
                                label="Nombre del Nivel" 
                                required
                                value={form.nombre} 
                                onChange={handleChange('nombre')}
                                error={!!errors.nombre} 
                                helperText={errors.nombre}
                                size="small" 
                                disabled={saving}
                                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth 
                                label="Número" 
                                required 
                                type="number"
                                value={form.nivel} 
                                onChange={handleChange('nivel')}
                                error={!!errors.nivel} 
                                helperText={errors.nivel}
                                size="small" 
                                disabled={saving}
                                inputProps={{ min: 1 }}
                                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
                            />
                        </Grid>
                    </Grid>
                    
                    <TextField
                        fullWidth 
                        label="Descripción" 
                        multiline 
                        rows={2}
                        value={form.descripcion} 
                        onChange={handleChange('descripcion')}
                        size="small" 
                        disabled={saving}
                        sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
                    />

                    <FormControl fullWidth error={!!errors.programasSeleccionados}>
                        <InputLabel id="programas-select-label">Programas Requeridos *</InputLabel>
                        <Select
                            labelId="programas-select-label"
                            multiple
                            value={form.programasSeleccionados.map(p => p.id)}
                            onChange={handleProgramasChange}
                            input={<OutlinedInput label="Programas Requeridos *" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((id) => {
                                        const programa = programas.find(p => getProgramaId(p) === id);
                                        return programa ? (
                                            <Chip 
                                                key={id} 
                                                label={programa.nombre}
                                                size="small"
                                                sx={{ 
                                                    bgcolor: esProgramaGlobal(programa) ? colors.primary.light : colors.secondary.main,
                                                    color: 'white'
                                                }}
                                            />
                                        ) : null;
                                    })}
                                </Box>
                            )}
                            disabled={saving || loadingProgramas}
                            MenuProps={{
                                PaperProps: {
                                    sx: { maxHeight: 300 }
                                }
                            }}
                        >
                            {loadingProgramas ? (
                                <MenuItem disabled>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                                        <CircularProgress size={24} />
                                        <Typography sx={{ ml: 1 }}>Cargando programas...</Typography>
                                    </Box>
                                </MenuItem>
                            ) : programasError ? (
                                <MenuItem disabled>
                                    <Typography color="error">{programasError}</Typography>
                                </MenuItem>
                            ) : programas.length === 0 ? (
                                <MenuItem disabled>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay programas disponibles
                                    </Typography>
                                </MenuItem>
                            ) : (
                                programas.map((programa) => {
                                    const programaId = getProgramaId(programa);
                                    const esGlobal = esProgramaGlobal(programa);
                                    
                                    return (
                                        <MenuItem key={`programa-${programaId}`} value={programaId}>
                                            <Checkbox checked={form.programasSeleccionados.some(p => p.id === programaId)} />
                                            <ListItemText 
                                                primary={programa.nombre}
                                                secondary={`Horas: ${programa.horasRequeridas || 0}`}
                                            />
                                            <Chip 
                                                label={esGlobal ? "Global" : "Instancia"} 
                                                size="small" 
                                                sx={{ 
                                                    ml: 1, 
                                                    bgcolor: esGlobal ? colors.primary.light : colors.secondary.main, 
                                                    color: 'white', 
                                                    fontSize: '0.7rem' 
                                                }}
                                            />
                                        </MenuItem>
                                    );
                                })
                            )}
                        </Select>
                        {errors.programasSeleccionados && (
                            <FormHelperText>{errors.programasSeleccionados}</FormHelperText>
                        )}
                        <FormHelperText>
                            Seleccione uno o más programas requeridos para este nivel
                        </FormHelperText>
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                <Button onClick={handleClose} disabled={saving}
                    sx={{ color: colors.text.secondary }} size="small">
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    disabled={saving || loadingProgramas || programas.length === 0} 
                    size="small"
                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
                    sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, ml: 1 }}>
                    {saving ? 'Guardando...' : 'Crear Nivel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateNivelDialog;