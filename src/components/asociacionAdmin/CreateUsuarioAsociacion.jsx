// src/components/asociacionAdmin/CreateUsuarioAsociacion.jsx
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
    Alert,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    Paper,
    Chip,
    IconButton,
    FormHelperText,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    PersonAdd as PersonAddIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Info as InfoIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon
} from '@mui/icons-material';

import asociacionService from '../../services/asociacion';
import usuarioService from '../../services/usuarioService';

// ── Paleta corporativa ──────────────────────────────────────────────────────
const colors = {
    primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
    secondary: { main: '#00A8A8', light: '#00C2D1' },
    accents: { blue: '#0099FF', purple: '#6C5CE7' },
    text: { primary: '#0D2A4D', secondary: '#3A6EA5' },
    semaforo: { verde: '#388E3C' }
};

// ── Stepper personalizado ───────────────────────────────────────────────────
const ColorConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 18 },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: { borderColor: colors.primary.main }
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: { borderColor: colors.secondary.main }
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#e0e0e0',
        borderTopWidth: 3,
        borderRadius: 1
    }
}));

const steps = [
    { label: 'Datos del Usuario', icon: <PersonIcon /> },
    { label: 'Datos de la Asociación', icon: <BusinessIcon /> },
    { label: 'Confirmación', icon: <CheckCircleIcon /> }
];

// ── Componente principal ────────────────────────────────────────────────────
const CreateUsuarioAsociacion = ({
    open,
    onClose,
    onComplete,
    availableRoles = [],
    availableRegions = [],
    loadingRoles = false,
    loadingRegions = false
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [usuarioCreado, setUsuarioCreado] = useState(null);
    const [asociacionCreada, setAsociacionCreada] = useState(null);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState(null);

    // ── Formulario Usuario ──────────────────────────────────────────────────
    const [userForm, setUserForm] = useState({
        nombre: '',
        email: '',
        password: '',
        regionNombre: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [userErrors, setUserErrors] = useState({});

    // ── Formulario Asociación ───────────────────────────────────────────────
    const [assocForm, setAssocForm] = useState({
        nombre: '',
        codigo: '',
        idRegion: ''
    });
    const [assocErrors, setAssocErrors] = useState({});

    // Cuando se abre el modal, resetear todo
    useEffect(() => {
        if (open) {
            resetAll();
        }
    }, [open]);

    // Pre-llenar representante de la asociación con el nombre del usuario
    useEffect(() => {
        if (usuarioCreado) {
            setAssocForm(prev => ({ ...prev }));
        }
    }, [usuarioCreado]);

    // 🔹 EFECTO PARA SINCRONIZAR REGIÓN DE ASOCIACIÓN CON LA REGIÓN DEL USUARIO
    useEffect(() => {
        if (usuarioCreado && userForm.regionNombre) {
            // Buscar el id de la región correspondiente al nombre seleccionado
            const regionSeleccionada = availableRegions.find(r => r.nombre === userForm.regionNombre || r === userForm.regionNombre);
            if (regionSeleccionada) {
                const regionId = regionSeleccionada.id || regionSeleccionada;
                setAssocForm(prev => ({
                    ...prev,
                    idRegion: regionId
                }));
            }
        }
    }, [usuarioCreado, userForm.regionNombre, availableRegions]);

    const resetAll = () => {
        setActiveStep(0);
        setUsuarioCreado(null);
        setAsociacionCreada(null);
        setProcesando(false);
        setError(null);
        setUserForm({ nombre: '', email: '', password: '', regionNombre: '' });
        setUserErrors({});
        setShowPassword(false);
        setAssocForm({ nombre: '', codigo: '', idRegion: '' });
        setAssocErrors({});
    };

    // ── Validaciones ────────────────────────────────────────────────────────
    const validateUserForm = () => {
        const errs = {};
        if (!userForm.nombre || userForm.nombre.trim().length < 3)
            errs.nombre = 'El nombre debe tener al menos 3 caracteres';
        if (!userForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email))
            errs.email = 'Ingrese un email válido';
        if (!userForm.password || userForm.password.length < 6)
            errs.password = 'La contraseña debe tener al menos 6 caracteres';
        if (!userForm.regionNombre)
            errs.regionNombre = 'Debe seleccionar una región';
        setUserErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateAssocForm = () => {
        const errs = {};
        if (!assocForm.nombre || assocForm.nombre.trim().length < 3)
            errs.nombre = 'El nombre debe tener al menos 3 caracteres';
        if (!assocForm.idRegion)
            errs.idRegion = 'Debe seleccionar una región';
        setAssocErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Paso 1 → Crear Usuario ──────────────────────────────────────────────
    const handleCrearUsuario = async () => {
        if (!validateUserForm()) return;
        setProcesando(true);
        setError(null);
        try {
            // Adaptar el payload según tu backend
            const payload = {
                nombre: userForm.nombre.trim(),
                email: userForm.email.trim(),
                password: userForm.password,
                rolNombre: 'ASOCIACION',
                regionNombre: userForm.regionNombre,
                activo: true
            };
            const nuevo = await usuarioService.create(payload);
            setUsuarioCreado(nuevo);
            setActiveStep(1);
        } catch (err) {
            console.error('Error al crear usuario:', err);
            setError(err?.message || 'Error al crear el usuario. Verifique los datos e intente de nuevo.');
        } finally {
            setProcesando(false);
        }
    };

    // ── Paso 2 → Crear Asociación + Relacionar ──────────────────────────────
    const handleCrearAsociacionYRelacionar = async () => {
        if (!validateAssocForm()) return;
        if (!usuarioCreado) return;
        setProcesando(true);
        setError(null);
        try {
            // 1. Crear asociación
            const assocPayload = {
                nombre: assocForm.nombre.trim(),
                idInstancia: 1,
                idRegion: assocForm.idRegion || null,
                codigo: assocForm.codigo?.trim() || null,
                representanteLegal: usuarioCreado.nombre
            };
            const nuevaAsociacion = await asociacionService.create(assocPayload);

            // 2. Relacionar usuario ↔ asociación
            await asociacionService.relacionarUsuario(nuevaAsociacion.idAsociacion, usuarioCreado.id);

            setAsociacionCreada(nuevaAsociacion);
            setActiveStep(2);

            // Notificar al padre
            onComplete({ usuario: usuarioCreado, asociacion: nuevaAsociacion, relacionExitosa: true });
        } catch (err) {
            console.error('Error al crear asociación o relacionar:', err);
            setError(err?.message || 'Error al crear la asociación. Intente de nuevo.');
        } finally {
            setProcesando(false);
        }
    };

    // ── Cerrar ──────────────────────────────────────────────────────────────
    const handleClose = () => {
        if (procesando) return;
        resetAll();
        onClose();
    };

    // ── Helpers de formulario ───────────────────────────────────────────────
    const handleUserChange = (field) => (e) => {
        setUserForm(prev => ({ ...prev, [field]: e.target.value }));
        if (userErrors[field]) setUserErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleAssocChange = (field) => (e) => {
        setAssocForm(prev => ({ ...prev, [field]: e.target.value }));
        if (assocErrors[field]) setAssocErrors(prev => ({ ...prev, [field]: null }));
    };

    const isUserFormReady =
        userForm.nombre?.trim().length >= 3 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email) &&
        userForm.password?.length >= 6 &&
        !!userForm.regionNombre;

    const isAssocFormReady =
        assocForm.nombre?.trim().length >= 3 &&
        !!assocForm.idRegion;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, minHeight: 560 }
            }}
        >
            {/* ── Cabecera ── */}
            <DialogTitle
                sx={{
                    bgcolor: colors.primary.main,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    px: 3
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonAddIcon />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                            Nuevo Usuario Asociación
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            Registro de usuario y su asociación en un solo flujo
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleClose} disabled={procesando} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* ── Stepper ── */}
            <Box sx={{ px: 3, pt: 2.5, pb: 1, bgcolor: '#f8f9fa', borderBottom: `1px solid #e0e0e0` }}>
                <Stepper activeStep={activeStep} connector={<ColorConnector />} alternativeLabel>
                    {steps.map((s, i) => (
                        <Step key={s.label} completed={activeStep > i}>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        color: activeStep > i ? `${colors.secondary.main} !important` : undefined,
                                        '&.Mui-active': { color: colors.primary.main },
                                        '&.Mui-completed': { color: colors.secondary.main }
                                    }
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: activeStep === i ? 700 : 400,
                                        color: activeStep === i
                                            ? colors.primary.main
                                            : activeStep > i
                                                ? colors.secondary.main
                                                : colors.text.secondary
                                    }}
                                >
                                    {s.label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {/* ── Contenido ── */}
            <DialogContent sx={{ px: 3, py: 2.5, flex: 1 }}>

                {/* Error global */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* ════════════════════════════════════════
                    PASO 0 – Formulario de Usuario
                ════════════════════════════════════════ */}
                {activeStep === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Paper sx={{ p: 1.5, bgcolor: '#e8f0fe', border: `1px solid #c5d7f5`, borderRadius: 1.5 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                <InfoIcon sx={{ fontSize: 18, color: colors.accents.blue }} />
                                El usuario se creará con rol&nbsp;
                                <Chip
                                    label="ASOCIACION"
                                    size="small"
                                    sx={{ bgcolor: colors.primary.main, color: 'white', fontWeight: 700, height: 20 }}
                                />
                            </Typography>
                        </Paper>

                        {/* Nombre */}
                        <TextField
                            fullWidth
                            label="Nombre completo"
                            size="small"
                            required
                            value={userForm.nombre}
                            onChange={handleUserChange('nombre')}
                            error={!!userErrors.nombre}
                            helperText={userErrors.nombre || 'Nombre del representante de la asociación'}
                            disabled={procesando}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: colors.primary.main } }}
                        />

                        {/* Email */}
                        <TextField
                            fullWidth
                            label="Correo electrónico"
                            type="email"
                            size="small"
                            required
                            value={userForm.email}
                            onChange={handleUserChange('email')}
                            error={!!userErrors.email}
                            helperText={userErrors.email}
                            disabled={procesando}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: colors.primary.main } }}
                        />

                        {/* Contraseña */}
                        <TextField
                            fullWidth
                            label="Contraseña"
                            size="small"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={userForm.password}
                            onChange={handleUserChange('password')}
                            error={!!userErrors.password}
                            helperText={userErrors.password || 'Mínimo 6 caracteres'}
                            disabled={procesando}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(p => !p)}
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: colors.primary.main } }}
                        />

                        {/* Región */}
                        <FormControl fullWidth size="small" required error={!!userErrors.regionNombre} disabled={procesando}>
                            <InputLabel>Región *</InputLabel>
                            <Select
                                value={userForm.regionNombre}
                                label="Región *"
                                onChange={handleUserChange('regionNombre')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LocationIcon sx={{ color: colors.primary.main, fontSize: 20, ml: 1 }} />
                                    </InputAdornment>
                                }
                                sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary.main } }}
                            >
                                {loadingRegions ? (
                                    <MenuItem disabled>Cargando regiones...</MenuItem>
                                ) : availableRegions.length > 0 ? (
                                    availableRegions.map(r => (
                                        <MenuItem key={r.id || r} value={r.nombre || r}>
                                            {r.nombre || r}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value=""><em>No hay regiones disponibles</em></MenuItem>
                                )}
                            </Select>
                            {userErrors.regionNombre && <FormHelperText>{userErrors.regionNombre}</FormHelperText>}
                        </FormControl>
                    </Box>
                )}

                {/* ════════════════════════════════════════
                    PASO 1 – Formulario de Asociación
                ════════════════════════════════════════ */}
                {activeStep === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Resumen del usuario (solo lectura) */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                bgcolor: '#f0faf0',
                                borderColor: colors.secondary.main,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5
                            }}
                        >
                            <CheckCircleIcon sx={{ color: colors.secondary.main, fontSize: 28, flexShrink: 0 }} />
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: colors.primary.dark }}>
                                    Usuario registrado correctamente
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    {usuarioCreado?.nombre} &nbsp;·&nbsp; {usuarioCreado?.email}
                                </Typography>
                            </Box>
                        </Paper>

                        <Divider sx={{ my: 0.5 }}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                Datos de la asociación
                            </Typography>
                        </Divider>

                        {/* Nombre de la asociación */}
                        <TextField
                            fullWidth
                            label="Nombre de la Asociación"
                            size="small"
                            required
                            value={assocForm.nombre}
                            onChange={handleAssocChange('nombre')}
                            error={!!assocErrors.nombre}
                            helperText={assocErrors.nombre || 'Nombre completo de la asociación'}
                            disabled={procesando}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: colors.primary.main } }}
                        />

                        {/* Código */}
                        <TextField
                            fullWidth
                            label="Código"
                            size="small"
                            value={assocForm.codigo}
                            onChange={handleAssocChange('codigo')}
                            disabled={procesando}
                            placeholder="ASOC-001"
                            helperText="Código único de identificación (opcional)"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: colors.primary.main } }}
                        />

                        {/* Representante Legal — auto-llenado, solo lectura */}
                        <TextField
                            fullWidth
                            label="Representante Legal"
                            size="small"
                            value={usuarioCreado?.nombre || ''}
                            disabled
                            helperText="Tomado automáticamente del usuario registrado"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Chip
                                            label="Del usuario"
                                            size="small"
                                            sx={{ bgcolor: colors.secondary.main, color: 'white', height: 20, '& .MuiChip-label': { fontSize: '0.7rem' } }}
                                        />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Región de la asociación - 🔹 AHORA ES DE SOLO LECTURA Y SE SINCRONIZA AUTOMÁTICAMENTE */}
                        <TextField
                            fullWidth
                            label="Región de la Asociación"
                            size="small"
                            value={(() => {
                                // Mostrar el nombre de la región basado en el ID seleccionado
                                if (!assocForm.idRegion) return '';
                                const region = availableRegions.find(r => (r.id || r) === assocForm.idRegion);
                                return region ? (region.nombre || region) : '';
                            })()}
                            disabled
                            helperText="Se asigna automáticamente la misma región del usuario"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Chip
                                            label="Sincronizada con usuario"
                                            size="small"
                                            sx={{ bgcolor: colors.accents.blue, color: 'white', height: 20, '& .MuiChip-label': { fontSize: '0.7rem' } }}
                                        />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiInputBase-input.Mui-disabled': {
                                    backgroundColor: '#f5f5f5',
                                    WebkitTextFillColor: colors.primary.dark
                                }
                            }}
                        />

                        <Paper sx={{ p: 1.5, bgcolor: '#f0f7ff', border: `1px solid ${colors.primary.light}`, borderLeft: `4px solid ${colors.accents.blue}`, borderRadius: 1.5 }}>
                            <Typography variant="caption" sx={{ color: colors.primary.dark, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <InfoIcon sx={{ fontSize: 16, color: colors.accents.blue, mt: 0.2, flexShrink: 0 }} />
                                Al guardar, la asociación se creará en la Instancia 1 (SICAG) y se relacionará automáticamente con el usuario registrado.
                                <br />
                                <strong>La región se hereda automáticamente de la seleccionada para el usuario.</strong>
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {/* ════════════════════════════════════════
                    PASO 2 – Confirmación / Procesando
                ════════════════════════════════════════ */}
                {activeStep === 2 && (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                        {procesando ? (
                            <>
                                <CircularProgress size={52} sx={{ color: colors.primary.main, mb: 2 }} />
                                <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                                    Relacionando usuario con la asociación…
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    {usuarioCreado?.nombre} &nbsp;↔&nbsp; {asociacionCreada?.nombre}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon sx={{ fontSize: 72, color: colors.secondary.main, mb: 2 }} />
                                <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 700, mb: 1 }}>
                                    ¡Proceso completado!
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2.5 }}>
                                    Usuario y asociación creados y relacionados exitosamente.
                                </Typography>
                                <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, textAlign: 'left', bgcolor: '#f8f9fa', p: 2, borderRadius: 1.5, border: `1px solid #e0e0e0` }}>
                                    <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                        <strong>Usuario:</strong> {usuarioCreado?.nombre}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                        <strong>Correo:</strong> {usuarioCreado?.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                        <strong>Asociación:</strong> {asociacionCreada?.nombre}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                        <strong>Región:</strong> {(() => {
                                            if (!asociacionCreada?.idRegion) return 'No especificada';
                                            const region = availableRegions.find(r => (r.id || r) === asociacionCreada.idRegion);
                                            return region ? (region.nombre || region) : asociacionCreada.idRegion;
                                        })()}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>

            {/* ── Acciones ── */}
            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    bgcolor: '#f8f9fa',
                    borderTop: `1px solid #e0e0e0`,
                    justifyContent: 'space-between'
                }}
            >
                {/* Botón Cancelar — visible en pasos 0 y 1 */}
                <Box>
                    {activeStep < 2 && (
                        <Button
                            onClick={handleClose}
                            disabled={procesando}
                            variant="outlined"
                            size="small"
                            sx={{ borderColor: colors.primary.light, color: colors.text.secondary }}
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>

                {/* Botón principal */}
                <Box>
                    {activeStep === 0 && (
                        <Button
                            onClick={handleCrearUsuario}
                            variant="contained"
                            size="small"
                            disabled={!isUserFormReady || procesando}
                            startIcon={procesando ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
                            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                        >
                            {procesando ? 'Creando usuario…' : 'Crear Usuario y Continuar'}
                        </Button>
                    )}

                    {activeStep === 1 && (
                        <Button
                            onClick={handleCrearAsociacionYRelacionar}
                            variant="contained"
                            size="small"
                            disabled={!isAssocFormReady || procesando || availableRegions.length === 0}
                            startIcon={procesando ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
                            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                        >
                            {procesando ? 'Guardando…' : 'Crear Asociación y Relacionar'}
                        </Button>
                    )}

                    {activeStep === 2 && !procesando && (
                        <Button
                            onClick={handleClose}
                            variant="contained"
                            size="small"
                            sx={{ bgcolor: colors.secondary.main, '&:hover': { bgcolor: '#008f8f' } }}
                        >
                            Aceptar y Cerrar
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CreateUsuarioAsociacion;