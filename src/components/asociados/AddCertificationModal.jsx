import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    TextField,
    IconButton,
    LinearProgress,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    CloudUpload as CloudUploadIcon,
    CheckCircle as CheckCircleIcon,
    School as SchoolIcon
} from '@mui/icons-material';

import { useAuth } from "../../context/AuthContext";
import { getTodosApartados } from '../../services/apartado';
import { getProgramasPorApartadoActivos } from '../../services/programas';
import { crearCertificacionCompleta } from '../../services/certificaciones';
import { getMiExpediente } from '../../services/expediente';

const colors = {
    primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
    secondary: { main: '#00A8A8' },
    accents: { purple: '#6C5CE7' },
    status: { success: '#00A8A8', error: '#0099FF' },
    text: { primary: '#0D2A4D', secondary: '#3A6EA5' }
};

const emptyForm = {
    subseccion: '',
    tipoDocumento: '',
    institucion: '',
    fecha: new Date().toISOString().split('T')[0],
    horas: '',
    archivo: null,
    nombreArchivo: '',
};

/**
 * AddCertificationModal
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSaved: (nuevaCertLocal) => void   ← callback cuando se guarda exitosamente
 * - selectedUser: objeto usuario de controlAsociados ({ id, nombre, instanciaId, ... })
 * - subseccionFija: string | null
 */
const AddCertificationModal = ({
    open,
    onClose,
    onSaved,
    selectedUser,
    subseccionFija = null,
}) => {
    const { user: authUser } = useAuth();

    const [form, setForm] = useState(emptyForm);
    const [programasDisponibles, setProgramasDisponibles] = useState([]);
    const [loadingProgramas, setLoadingProgramas] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // ── Resetear formulario al abrir/cerrar ──────────────────────────
    useEffect(() => {
        if (open) {
            setForm(emptyForm);
            setUploadProgress(0);
            setUploading(false);
            setError('');
        } else {
            setProgramasDisponibles([]);
        }
    }, [open]);

    // ── Cargar programas desde la BD ─────────────────────────────────
    useEffect(() => {
        if (!open || subseccionFija) return;

        const cargarProgramas = async () => {
            // Usa instanciaId del usuario asociado si está disponible, sino del usuario logueado
            const instanciaId = selectedUser?.instanciaId || authUser?.instanciaId;
            if (!instanciaId) return;

            setLoadingProgramas(true);
            try {
                const todos = await getTodosApartados();
                const filtrados = todos.filter(
                    (a) => !a.idInstancia || a.idInstancia === instanciaId
                );

                const programas = [];
                for (const apartado of filtrados) {
                    try {
                        const progs = await getProgramasPorApartadoActivos(apartado.idApartado);
                        programas.push(...progs);
                    } catch (e) {
                        console.error(`Error cargando programas del apartado ${apartado.idApartado}:`, e);
                    }
                }
                programas.push({ id: null, nombre: 'Otros' });
                setProgramasDisponibles(programas);
            } catch (err) {
                console.error('Error cargando programas:', err);
            } finally {
                setLoadingProgramas(false);
            }
        };

        cargarProgramas();
    }, [open, subseccionFija, selectedUser?.instanciaId, authUser?.instanciaId]);

    // ── Handlers del formulario ──────────────────────────────────────
    const handleFieldChange = (campo) => (event) => {
        setForm(prev => ({ ...prev, [campo]: event.target.value }));
        if (error) setError('');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setError('El archivo no puede ser mayor a 10MB');
            return;
        }

        const tiposPermitidos = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];
        if (!tiposPermitidos.includes(file.type)) {
            setError('Formato no permitido. Use PDF, DOC, DOCX, JPG o PNG');
            return;
        }

        // Simular progreso de subida
        setUploading(true);
        setUploadProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setUploading(false);
                setForm(prev => ({ ...prev, archivo: file, nombreArchivo: file.name }));
            }
        }, 150);
    };

    const handleRemoveFile = () => {
        setForm(prev => ({ ...prev, archivo: null, nombreArchivo: '' }));
        setUploadProgress(0);
    };

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    // ── Guardar ──────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedUser?.id) {
            setError('No se encontró el usuario seleccionado');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // 1. Obtener el expediente del usuario asociado
            const expediente = await getMiExpediente(selectedUser.id);
            const idExpediente = expediente?.id;

            if (!idExpediente) {
                setError('No se encontró el expediente del usuario');
                return;
            }

            // 2. Determinar idPrograma
            const idPrograma = form.subseccion && form.subseccion !== 'otros'
                ? form.subseccion   // ya es el id numérico del programa
                : null;

            // 3. Instancia del usuario asociado
            const idInstancia = selectedUser?.instanciaId || authUser?.instanciaId;

            // 4. Llamar al servicio real
            const certCreada = await crearCertificacionCompleta(
                {
                    nombre: form.tipoDocumento,
                    institucion: form.institucion,
                    horas: parseInt(form.horas),
                    fecha: form.fecha,
                    nombreArchivo: form.nombreArchivo,
                    descripcion: '',
                },
                idInstancia,
                idExpediente,
                idPrograma,
                form.archivo
            );

            // 5. Construir objeto local para actualizar la tabla sin recargar
            const nuevaCertLocal = {
                id: certCreada?.idCertExp || Date.now(),
                idCertificacion: certCreada?.idCertificacion,
                type: form.tipoDocumento.toUpperCase(),
                number: `CERT-${certCreada?.idCertExp || Date.now()}`,
                issueDate: new Date(form.fecha).toLocaleDateString('es-MX'),
                issueDateRaw: form.fecha,
                expirationDate: certCreada?.fechaExpiracion || '—',
                status: 'En revisión',
                progress: 30,
                documents: 1,
                lastUpdate: new Date().toLocaleDateString('es-MX'),
                subseccion: certCreada?.nombrePrograma ||
                    programasDisponibles.find(p => p.id === form.subseccion)?.nombre ||
                    'Otros',
                horas: parseInt(form.horas),
                tipo: form.tipoDocumento,
                autoridad: form.institucion,
                vigencia: '3 años',
                ambito: 'Nacional',
                comentarios: 'Certificación en proceso de validación',
                documentosAsociados: [{
                    id: certCreada?.mongoDocumentoId || `d${Date.now()}`,
                    nombre: form.nombreArchivo,
                    tipo: form.archivo?.type?.includes('pdf') ? 'PDF' : 'Documento',
                    tamaño: `${Math.round((form.archivo?.size || 0) / 1024 / 1024 * 10) / 10} MB`,
                    fecha: new Date().toLocaleDateString('es-MX'),
                }]
            };

            if (onSaved) onSaved(nuevaCertLocal);
            onClose();

        } catch (err) {
            console.error('Error al guardar certificación:', err);
            setError(err?.response?.data?.message || 'Error al guardar la certificación');
        } finally {
            setSaving(false);
        }
    };

    const canSave =
        !saving &&
        !uploading &&
        form.tipoDocumento &&
        form.archivo &&
        form.horas &&
        form.institucion &&
        (subseccionFija || form.subseccion !== '');

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{
                bgcolor: colors.primary.main,
                color: 'white',
                py: 2,
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AddIcon />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                            Agregar Certificación
                        </Typography>
                        {selectedUser?.nombre && (
                            <Typography variant="caption" sx={{ opacity: 0.85 }}>
                                Para: {selectedUser.nombre}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }} disabled={saving}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3, px: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2.5}>

                    {/* Programa / Subsección */}
                    {subseccionFija ? (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                                Programa
                            </Typography>
                            <Chip
                                icon={<SchoolIcon sx={{ fontSize: '1rem !important' }} />}
                                label={subseccionFija}
                                size="small"
                                sx={{
                                    bgcolor: `${colors.accents.purple}15`,
                                    color: colors.accents.purple,
                                    fontWeight: '600',
                                    fontSize: '0.8rem'
                                }}
                            />
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                                Programa / Subsección <span style={{ color: colors.status.error }}>*</span>
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={form.subseccion}
                                onChange={handleFieldChange('subseccion')}
                                required
                                disabled={saving || loadingProgramas}
                                helperText={
                                    loadingProgramas
                                        ? 'Cargando programas disponibles...'
                                        : programasDisponibles.length === 0
                                            ? 'No hay programas disponibles'
                                            : 'Selecciona el programa al que pertenece esta certificación'
                                }
                                InputProps={loadingProgramas ? {
                                    endAdornment: <CircularProgress size={18} sx={{ mr: 1 }} />
                                } : undefined}
                            >
                                {programasDisponibles.map((prog) => (
                                    <MenuItem key={prog.id ?? 'otros'} value={prog.id ?? 'otros'}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SchoolIcon sx={{
                                                fontSize: '1rem',
                                                color: prog.id === null ? colors.text.secondary : colors.accents.purple
                                            }} />
                                            <span>{prog.nombre}</span>
                                            {prog.id === null && (
                                                <Chip label="Sin programa" size="small" sx={{
                                                    height: '18px', fontSize: '0.6rem', ml: 0.5,
                                                    bgcolor: '#f5f5f5', color: colors.text.secondary
                                                }} />
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )}

                    {/* Nombre */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Nombre de la Certificación <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth size="small"
                            value={form.tipoDocumento}
                            onChange={handleFieldChange('tipoDocumento')}
                            placeholder="Ej: Curso de Ética Profesional"
                            required disabled={saving}
                        />
                    </Grid>

                    {/* Institución */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Institución <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth size="small"
                            value={form.institucion}
                            onChange={handleFieldChange('institucion')}
                            placeholder="Ej: Instituto de Ética Empresarial"
                            required disabled={saving}
                        />
                    </Grid>

                    {/* Horas + Fecha */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Horas <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth type="number" size="small"
                            value={form.horas}
                            onChange={handleFieldChange('horas')}
                            placeholder="Ej: 20"
                            required inputProps={{ min: 1 }} disabled={saving}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Fecha de Expedición
                        </Typography>
                        <TextField
                            fullWidth type="date" size="small"
                            value={form.fecha}
                            onChange={handleFieldChange('fecha')}
                            InputLabelProps={{ shrink: true }}
                            disabled={saving}
                        />
                    </Grid>

                    {/* Archivo */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Archivo <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3, borderRadius: 2, textAlign: 'center',
                                cursor: saving ? 'default' : 'pointer',
                                border: `2px dashed ${form.archivo ? colors.status.success : colors.primary.main}40`,
                                opacity: saving ? 0.7 : 1,
                                transition: 'all 0.2s',
                                '&:hover': saving ? {} : { borderColor: colors.primary.main, backgroundColor: '#f8f9fa' }
                            }}
                            onClick={() => !saving && document.getElementById('assoc-cert-file-upload').click()}
                        >
                            <input
                                id="assoc-cert-file-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                disabled={saving}
                            />

                            {form.archivo ? (
                                <>
                                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: '500', color: colors.text.primary }}>
                                        {form.nombreArchivo}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                                        Archivo seleccionado correctamente
                                    </Typography>
                                    {uploading && (
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress variant="determinate" value={uploadProgress}
                                                sx={{ height: 6, borderRadius: 3 }} />
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                                {uploadProgress}% completado
                                            </Typography>
                                        </Box>
                                    )}
                                    {!saving && (
                                        <Button size="small" variant="outlined"
                                            onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                                            sx={{ mt: 1, color: colors.status.error, borderColor: colors.status.error }}>
                                            Quitar archivo
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ color: colors.primary.main, fontSize: 40, mb: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: '500', color: colors.text.primary }}>
                                        Haz clic para seleccionar un archivo
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                                        Formatos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>

                    {/* Nota */}
                    <Grid item xs={12}>
                        <Alert severity="info" sx={{ backgroundColor: `${colors.primary.main}10`, fontSize: '0.85rem' }}>
                            <Typography variant="body2">
                                <strong>Nota:</strong> La certificación se agregará en estado "En revisión" hasta que sea validada por el comité.
                            </Typography>
                        </Alert>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={saving}
                    sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!canSave}
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        textTransform: 'none',
                        bgcolor: colors.primary.main,
                        '&:hover': { bgcolor: colors.primary.dark },
                        '&.Mui-disabled': { bgcolor: '#e0e0e0' }
                    }}
                >
                    {saving ? 'Guardando...' : 'Agregar Certificación'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCertificationModal;