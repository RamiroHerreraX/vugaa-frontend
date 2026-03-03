// src/components/admin/SystemConfig.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Chip,
    Slider,
    InputAdornment,
    Alert,
    Tabs,
    Tab,
    Stack,
    IconButton,
    Tooltip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    CircularProgress,
    Snackbar
} from '@mui/material';
import {
    Security as SecurityIcon,
    Timer as TimerIcon,
    Assessment as AssessmentIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Lock as LockIcon,
    Edit as EditIcon,
    Block as BlockIcon,
    Add as AddIcon,
    Business as BusinessIcon,
    HowToReg as HowToRegIcon,
    School as SchoolIcon,
    Gavel as GavelIcon,
    Public as PublicIcon,
    EmojiEvents as EmojiEventsIcon,
    Search as SearchIcon,
    ChevronRight as ChevronRightIcon,
    Info as InfoIcon,
    PendingActions as PendingActionsIcon,
    AssignmentInd as AssignmentIndIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Close as CloseIcon
} from '@mui/icons-material';

import rolService from '../../services/rol';
import asociacionService from '../../services/asociacion';
import regionesService from '../../services/regiones';

// Paleta corporativa (del prototipo)
const colors = {
    primary: {
        dark: '#0D2A4D',
        main: '#133B6B',
        light: '#3A6EA5'
    },
    secondary: {
        main: '#00A8A8',
        light: '#00C2D1',
        lighter: '#35D0FF'
    },
    accents: {
        blue: '#0099FF',
        purple: '#6C5CE7'
    },
    status: {
        success: '#00A8A8',
        warning: '#00C2D1',
        error: '#0099FF',
        info: '#3A6EA5'
    },
    text: {
        primary: '#0D2A4D',
        secondary: '#3A6EA5',
        light: '#6C5CE7'
    },
    semaforo: {
        rojo: '#D32F2F',
        amarillo: '#FFC107',
        verde: '#388E3C'
    }
};

// ─── Snackbar helper ────────────────────────────────────────────────────────
const useNotification = () => {
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
    const notify = (message, severity = 'success') => setSnack({ open: true, message, severity });
    const close = () => setSnack(prev => ({ ...prev, open: false }));
    return { snack, notify, close };
};

const SystemConfig = () => {
    const { snack, notify, close: closeSnack } = useNotification();

    const [activeTab, setActiveTab] = useState(0);
    const [showChangesPanel, setShowChangesPanel] = useState(false);
    const [showCards, setShowCards] = useState(true);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedEvaluator, setSelectedEvaluator] = useState('');

    // ── Estado Roles ────────────────────────────────────────────────────────
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [errorRoles, setErrorRoles] = useState(null);
    const [rolFilter, setRolFilter] = useState('todos');
    const [searchRoles, setSearchRoles] = useState('');

    const [rolDialogOpen, setRolDialogOpen] = useState(false);
    const [editingRol, setEditingRol] = useState(null);
    const [rolForm, setRolForm] = useState({ nombre: '', descripcion: '' });
    const [nombreExists, setNombreExists] = useState(false);
    const [checkingNombre, setCheckingNombre] = useState(false);

    // ── Estado Asociaciones ─────────────────────────────────────────────────
    const [asociaciones, setAsociaciones] = useState([]);
    const [loadingAsociaciones, setLoadingAsociaciones] = useState(false);
    const [errorAsociaciones, setErrorAsociaciones] = useState(null);
    const [asociacionFilter, setAsociacionFilter] = useState('todos');
    const [searchAsociaciones, setSearchAsociaciones] = useState('');

    const [asociacionDialogOpen, setAsociacionDialogOpen] = useState(false);
    const [editingAsociacion, setEditingAsociacion] = useState(null);
    const [asociacionForm, setAsociacionForm] = useState({ nombre: '', region: '' });
    const [savingAsociacion, setSavingAsociacion] = useState(false);
    const [togglingAsociacion, setTogglingAsociacion] = useState(null);

    // ── Estado Regiones ─────────────────────────────────────────────────────
    const [regiones, setRegiones] = useState([]);
    const [loadingRegiones, setLoadingRegiones] = useState(false);
    const [errorRegiones, setErrorRegiones] = useState(null);
    const [regionFilter, setRegionFilter] = useState('todos');
    const [searchRegiones, setSearchRegiones] = useState('');
    
    const [regionDialogOpen, setRegionDialogOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [regionForm, setRegionForm] = useState({ 
        nombre: '', 
        pais: 'Chile', 
        estado: '', 
        activa: true,
        idInstancia: 1 
    });
    const [savingRegion, setSavingRegion] = useState(false);
    const [togglingRegion, setTogglingRegion] = useState(null);
    const [checkingRegionNombre, setCheckingRegionNombre] = useState(false);
    const [regionNombreExists, setRegionNombreExists] = useState(false);

    // ── Config General ──────────────────────────────────────────────────────
    const [config, setConfig] = useState({
        systemName: 'SICAG',
        maintenanceMode: false,
        allowRegistrations: true,
        maxLoginAttempts: 3,
        sessionTimeout: 30,
        certificationValidity: 365,
        renewalWarningDays: 30,
        maxCertificationsPerUser: 10,
        autoRenewal: true,
        declarationValidity: 365,
        declarationWarningDays: 30,
        maxDeclarationsPerUser: 10,
        declarationAutoRenewal: true,
        greenThreshold: 90,
        yellowThreshold: 70,
        redThreshold: 50,
        autoRecalculation: true
    });
    const [changes, setChanges] = useState([]);

    // ── Carga inicial ───────────────────────────────────────────────────────
    useEffect(() => {
        fetchRoles();
        fetchAsociaciones();
        fetchRegiones(); // Cargar regiones
    }, []);

    // ══════════════════════════════════════════════════════════════════════
    // ROLES - CORREGIDO según la entidad proporcionada
    // ══════════════════════════════════════════════════════════════════════
    const fetchRoles = async () => {
        setLoadingRoles(true);
        setErrorRoles(null);
        try {
            const data = await rolService.findAll();
            const rolesArray = Array.isArray(data) ? data : [];
            // Eliminado el filtro por idInstancia ya que la entidad no tiene ese campo
            const sorted = rolesArray.sort((a, b) => a.id - b.id);
            setRoles(sorted);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            setErrorRoles(error?.message || 'No se pudieron cargar los roles');
            notify(error?.message || 'Error al cargar roles', 'error');
        } finally {
            setLoadingRoles(false);
        }
    };

    // Debounce: verificar nombre duplicado de rol
    useEffect(() => {
        const check = async () => {
            if (!rolForm.nombre || rolForm.nombre.length < 3) {
                setNombreExists(false);
                return;
            }
            setCheckingNombre(true);
            try {
                const exists = editingRol
                    ? await rolService.existsByNombreAndIdNot(rolForm.nombre, editingRol.id)
                    : await rolService.existsByNombre(rolForm.nombre);
                setNombreExists(exists);
            } catch (error) {
                console.error('Error verificando nombre:', error);
                setNombreExists(false);
            } finally {
                setCheckingNombre(false);
            }
        };
        const t = setTimeout(check, 500);
        return () => clearTimeout(t);
    }, [rolForm.nombre, editingRol]);

    const filteredRoles = roles
        .filter(rol => {
            const matchSearch = rol.nombre?.toLowerCase().includes(searchRoles.toLowerCase());
            const matchFilter =
                rolFilter === 'todos' ? true :
                    rolFilter === 'activos' ? rol.activo === true :
                        rol.activo === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => a.id - b.id);

    const handleOpenRolDialog = (rol = null) => {
        setEditingRol(rol);
        setRolForm({ 
            nombre: rol?.nombre || '', 
            descripcion: rol?.descripcion || '' 
        });
        setNombreExists(false);
        setRolDialogOpen(true);
    };

    const handleCloseRolDialog = () => {
        setRolDialogOpen(false);
        setEditingRol(null);
        setRolForm({ nombre: '', descripcion: '' });
        setNombreExists(false);
    };

    const handleRolFormChange = (field) => (event) => {
        setRolForm(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSaveRol = async () => {
        if (!rolForm.nombre.trim()) {
            notify('El nombre del rol es obligatorio', 'error');
            return;
        }
        if (nombreExists) {
            notify('Ya existe un rol con este nombre', 'error');
            return;
        }
        try {
            if (editingRol) {
                // Para actualización, mantenemos los valores existentes de activo y esGlobal
                const payload = {
                    nombre: rolForm.nombre,
                    descripcion: rolForm.descripcion,
                    // Mantenemos los valores originales
                    activo: editingRol.activo,
                    esGlobal: editingRol.esGlobal
                };
                await rolService.update(editingRol.id, payload);
                setRoles(prev =>
                    prev.map(r => r.id === editingRol.id
                        ? { ...r, nombre: payload.nombre, descripcion: payload.descripcion }
                        : r
                    )
                );
                notify('Rol actualizado exitosamente');
            } else {
                // Para creación, usamos los valores por defecto según la entidad
                const payload = {
                    nombre: rolForm.nombre,
                    descripcion: rolForm.descripcion,
                    activo: true,        // @Builder.Default activo = true
                    esGlobal: false       // @Builder.Default esGlobal = false
                };
                const newRol = await rolService.create(payload);
                setRoles(prev =>
                    [...prev, newRol].sort((a, b) => a.id - b.id)
                );
                notify('Rol creado exitosamente');
            }
            handleCloseRolDialog();
        } catch (error) {
            console.error('Error al guardar rol:', error);
            notify(error?.message || 'Error al guardar el rol', 'error');
        }
    };

    const handleToggleRoleStatus = async (id) => {
        const rol = roles.find(r => r.id === id);
        if (!rol) return;
        const nuevoEstado = !rol.activo;
        if (!window.confirm(`¿Está seguro de ${nuevoEstado ? 'activar' : 'desactivar'} el rol "${rol.nombre}"?`)) return;
        try {
            await rolService.changeEstado(id, nuevoEstado);
            setRoles(prev => prev.map(r => r.id === id ? { ...r, activo: nuevoEstado } : r));
            notify(`Rol ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado del rol:', error);
            notify(error?.message || 'Error al cambiar el estado del rol', 'error');
        }
    };

    // ══════════════════════════════════════════════════════════════════════
    // ASOCIACIONES
    // ══════════════════════════════════════════════════════════════════════
    const fetchAsociaciones = async () => {
        setLoadingAsociaciones(true);
        setErrorAsociaciones(null);
        try {
            const data = await asociacionService.findAll();
            const asociacionesArray = Array.isArray(data) ? data : [];
            const filtered = asociacionesArray
                .filter(a => a.idInstancia === 1)
                .sort((a, b) => (a.idAsociacion || 0) - (b.idAsociacion || 0));
            setAsociaciones(filtered);
        } catch (error) {
            console.error('Error al cargar asociaciones:', error);
            const errorMessage = error?.message || 'No se pudieron cargar las asociaciones';
            setErrorAsociaciones(errorMessage);
            notify(errorMessage, 'error');
        } finally {
            setLoadingAsociaciones(false);
        }
    };

    const handleOpenAsociacionDialog = (asociacion = null) => {
        setEditingAsociacion(asociacion);
        setAsociacionForm({
            nombre: asociacion?.nombre || '',
            region: asociacion?.region || ''
        });
        setAsociacionDialogOpen(true);
    };

    const handleCloseAsociacionDialog = () => {
        if (savingAsociacion) return;
        setAsociacionDialogOpen(false);
        setEditingAsociacion(null);
        setAsociacionForm({ nombre: '', region: '' });
        setSavingAsociacion(false);
    };

    const handleAsociacionFormChange = (field) => (event) => {
        setAsociacionForm(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSaveAsociacion = async () => {
        if (!asociacionForm.nombre.trim()) {
            notify('El nombre de la asociación es obligatorio', 'error');
            return;
        }

        setSavingAsociacion(true);
        try {
            if (editingAsociacion) {
                const payload = {
                    nombre: asociacionForm.nombre.trim(),
                    region: asociacionForm.region.trim(),
                    id_instancia: 1,
                    activa: editingAsociacion.activa
                };
                const updatedAsociacion = await asociacionService.update(
                    editingAsociacion.idAsociacion,
                    payload
                );
                setAsociaciones(prev =>
                    prev.map(a =>
                        a.idAsociacion === editingAsociacion.idAsociacion
                            ? { ...a, ...updatedAsociacion }
                            : a
                    )
                );
                notify('Asociación actualizada exitosamente');
            } else {
                const payload = {
                    nombre: asociacionForm.nombre.trim(),
                    region: asociacionForm.region.trim(),
                    id_instancia: 1,
                    activa: true
                };
                const newAsociacion = await asociacionService.create(payload);
                setAsociaciones(prev =>
                    [...prev, newAsociacion].sort((a, b) => a.idAsociacion - b.idAsociacion)
                );
                notify('Asociación creada exitosamente');
            }
            handleCloseAsociacionDialog();
        } catch (error) {
            console.error('Error al guardar asociación:', error);
            let errorMessage = 'Error al guardar la asociación';
            if (error) {
                if (typeof error === 'string') errorMessage = error;
                else if (error.message) errorMessage = error.message;
                else if (error.mensaje) errorMessage = error.mensaje;
                else if (error.error) errorMessage = error.error;
            }
            const errorLower = errorMessage.toLowerCase();
            if (
                errorMessage.includes('400') ||
                errorLower.includes('ya existe') ||
                errorLower.includes('duplicate') ||
                errorLower.includes('unique') ||
                errorLower.includes('nombre ya registrado') ||
                errorLower.includes('already exists') ||
                errorLower.includes('conflicto')
            ) {
                notify('Ya existe una asociación con este nombre', 'error');
            } else {
                notify(errorMessage, 'error');
            }
        } finally {
            setSavingAsociacion(false);
        }
    };

    const handleToggleAsociacionStatus = async (id) => {
        const asociacion = asociaciones.find(a => a.idAsociacion === id);
        if (!asociacion) return;
        const nuevoEstado = !asociacion.activa;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        if (!window.confirm(`¿Está seguro de ${accion} la asociación "${asociacion.nombre}"?`)) return;
        setTogglingAsociacion(id);
        try {
            // Usar el método unificado cambiarEstadoActivo
            const result = await asociacionService.cambiarEstadoActivo(id, nuevoEstado);
            const updatedData = result?.asociacion || result;
            setAsociaciones(prev =>
                prev.map(a =>
                    a.idAsociacion === id
                        ? { ...a, activa: nuevoEstado, ...updatedData }
                        : a
                )
            );
            notify(`Asociación ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado de asociación:', error);
            let errorMessage = 'Error al cambiar el estado de la asociación';
            if (error) {
                if (typeof error === 'string') errorMessage = error;
                else if (error.message) errorMessage = error.message;
                else if (error.mensaje) errorMessage = error.mensaje;
                else if (error.error) errorMessage = error.error;
            }
            notify(errorMessage, 'error');
        } finally {
            setTogglingAsociacion(null);
        }
    };

    const filteredAsociaciones = asociaciones
        .filter(asoc => {
            const matchSearch =
                asoc.nombre?.toLowerCase().includes(searchAsociaciones.toLowerCase()) ||
                (asoc.region && asoc.region.toLowerCase().includes(searchAsociaciones.toLowerCase()));
            const matchFilter =
                asociacionFilter === 'todos' ? true :
                    asociacionFilter === 'activos' ? asoc.activa === true :
                        asoc.activa === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => a.idAsociacion - b.idAsociacion);

    // ══════════════════════════════════════════════════════════════════════
    // REGIONES - VERSIÓN CORREGIDA (SIN ELIMINAR)
    // ══════════════════════════════════════════════════════════════════════
    const fetchRegiones = async () => {
        setLoadingRegiones(true);
        setErrorRegiones(null);
        try {
            // Usar el método findAll del servicio de regiones
            const data = await regionesService.findAll();
            const regionesArray = Array.isArray(data) ? data : [];
            const sorted = regionesArray.sort((a, b) => a.id - b.id);
            setRegiones(sorted);
        } catch (error) {
            console.error('Error al cargar regiones:', error);
            const errorMessage = error?.error || error?.message || 'No se pudieron cargar las regiones';
            setErrorRegiones(errorMessage);
            notify(errorMessage, 'error');
        } finally {
            setLoadingRegiones(false);
        }
    };

    // Debounce: verificar nombre duplicado de región
    useEffect(() => {
        const check = async () => {
            if (!regionForm.nombre || regionForm.nombre.length < 3) {
                setRegionNombreExists(false);
                return;
            }
            setCheckingRegionNombre(true);
            try {
                // Para edición, necesitamos verificar si el nombre ya existe excluyendo el ID actual
                // Como no tenemos un método específico, podemos buscar por nombre y comparar IDs
                if (editingRegion) {
                    try {
                        const existingRegion = await regionesService.findByNombreIgnoreCase(regionForm.nombre);
                        setRegionNombreExists(existingRegion !== null && existingRegion.id !== editingRegion.id);
                    } catch {
                        setRegionNombreExists(false);
                    }
                } else {
                    // Para creación nueva, verificamos si existe
                    try {
                        const existingRegion = await regionesService.findByNombreIgnoreCase(regionForm.nombre);
                        setRegionNombreExists(existingRegion !== null);
                    } catch {
                        setRegionNombreExists(false);
                    }
                }
            } catch (error) {
                console.error('Error verificando nombre de región:', error);
                setRegionNombreExists(false);
            } finally {
                setCheckingRegionNombre(false);
            }
        };
        const t = setTimeout(check, 500);
        return () => clearTimeout(t);
    }, [regionForm.nombre, editingRegion]);

    const filteredRegiones = regiones
        .filter(region => {
            const matchSearch = 
                region.nombre?.toLowerCase().includes(searchRegiones.toLowerCase()) ||
                (region.pais?.toLowerCase() || '').includes(searchRegiones.toLowerCase()) ||
                (region.estado?.toLowerCase() || '').includes(searchRegiones.toLowerCase());
            const matchFilter =
                regionFilter === 'todos' ? true :
                    regionFilter === 'activos' ? region.activa === true :
                        region.activa === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => a.id - b.id);

    const handleOpenRegionDialog = (region = null) => {
        setEditingRegion(region);
        setRegionForm({
            nombre: region?.nombre || '',
            pais: region?.pais || 'Chile',
            estado: region?.estado || '',
            activa: region?.activa !== undefined ? region.activa : true,
            idInstancia: region?.idInstancia || 1
        });
        setRegionNombreExists(false);
        setRegionDialogOpen(true);
    };

    const handleCloseRegionDialog = () => {
        if (savingRegion) return;
        setRegionDialogOpen(false);
        setEditingRegion(null);
        setRegionForm({ 
            nombre: '', 
            pais: 'Chile', 
            estado: '', 
            activa: true,
            idInstancia: 1 
        });
        setRegionNombreExists(false);
        setSavingRegion(false);
    };

    const handleRegionFormChange = (field) => (event) => {
        setRegionForm(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSaveRegion = async () => {
        if (!regionForm.nombre.trim()) {
            notify('El nombre de la región es obligatorio', 'error');
            return;
        }
        if (!regionForm.pais.trim()) {
            notify('El país es obligatorio', 'error');
            return;
        }
        if (regionNombreExists) {
            notify('Ya existe una región con este nombre', 'error');
            return;
        }

        setSavingRegion(true);
        try {
            if (editingRegion) {
                // Actualizar región existente
                const payload = {
                    nombre: regionForm.nombre.trim(),
                    pais: regionForm.pais.trim(),
                    estado: regionForm.estado.trim() || null,
                    activa: regionForm.activa,
                    idInstancia: regionForm.idInstancia
                };
                const updatedRegion = await regionesService.update(editingRegion.id, payload);
                setRegiones(prev =>
                    prev.map(r => r.id === editingRegion.id
                        ? { ...r, ...updatedRegion }
                        : r
                    ).sort((a, b) => a.id - b.id)
                );
                notify('Región actualizada exitosamente');
            } else {
                // Crear nueva región
                const payload = {
                    nombre: regionForm.nombre.trim(),
                    pais: regionForm.pais.trim(),
                    estado: regionForm.estado.trim() || null,
                    activa: regionForm.activa,
                    idInstancia: regionForm.idInstancia
                };
                const newRegion = await regionesService.create(payload);
                setRegiones(prev =>
                    [...prev, newRegion].sort((a, b) => a.id - b.id)
                );
                notify('Región creada exitosamente');
            }
            handleCloseRegionDialog();
        } catch (error) {
            console.error('Error al guardar región:', error);
            let errorMessage = 'Error al guardar la región';
            if (error) {
                if (typeof error === 'string') errorMessage = error;
                else if (error.message) errorMessage = error.message;
                else if (error.mensaje) errorMessage = error.mensaje;
                else if (error.error) errorMessage = error.error;
            }
            const errorLower = errorMessage.toLowerCase();
            if (
                errorMessage.includes('400') ||
                errorLower.includes('ya existe') ||
                errorLower.includes('duplicate') ||
                errorLower.includes('unique') ||
                errorLower.includes('nombre ya registrado') ||
                errorLower.includes('already exists') ||
                errorLower.includes('conflicto')
            ) {
                notify('Ya existe una región con este nombre', 'error');
            } else {
                notify(errorMessage, 'error');
            }
        } finally {
            setSavingRegion(false);
        }
    };

    const handleToggleRegionStatus = async (id) => {
        const region = regiones.find(r => r.id === id);
        if (!region) return;
        const nuevoEstado = !region.activa;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        if (!window.confirm(`¿Está seguro de ${accion} la región "${region.nombre}"?`)) return;
        
        setTogglingRegion(id);
        try {
            // Usar el método unificado cambiarEstadoActivo
            const result = await regionesService.cambiarEstadoActivo(id, nuevoEstado);
            // La respuesta contiene { mensaje, region }
            const regionActualizada = result.region;
            
            setRegiones(prev =>
                prev.map(r => r.id === id ? { ...r, ...regionActualizada, activa: nuevoEstado } : r)
            );
            notify(result.mensaje || `Región ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado de región:', error);
            let errorMessage = 'Error al cambiar el estado de la región';
            if (error) {
                if (typeof error === 'string') errorMessage = error;
                else if (error.message) errorMessage = error.message;
                else if (error.mensaje) errorMessage = error.mensaje;
                else if (error.error) errorMessage = error.error;
            }
            notify(errorMessage, 'error');
        } finally {
            setTogglingRegion(null);
        }
    };

    // ══════════════════════════════════════════════════════════════════════
    // CONFIG GENERAL
    // ══════════════════════════════════════════════════════════════════════
    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const oldValue = config[field];
        setConfig(prev => ({ ...prev, [field]: value }));
        setChanges(prev => [...prev, { field, oldValue, newValue: value, timestamp: new Date().toLocaleTimeString() }]);
    };

    const handleSliderChange = (field) => (event, newValue) => {
        const oldValue = config[field];
        setConfig(prev => ({ ...prev, [field]: newValue }));
        setChanges(prev => [...prev, { field, oldValue, newValue, timestamp: new Date().toLocaleTimeString() }]);
    };

    const handleSave = () => {
        setTimeout(() => {
            notify('Configuración guardada exitosamente');
            setChanges([]);
        }, 1000);
    };

    const handleConfirmAssignment = () => {
        setAssignDialogOpen(false);
        setSelectedAgent(null);
        setSelectedEvaluator('');
        notify('Evaluador asignado exitosamente');
    };

    const toggleChangesPanel = () => setShowChangesPanel(prev => !prev);
    const systemHealth = config.maintenanceMode ? 90 : 100;

    const tabs = [
        { label: 'Catálogo Certificaciones', icon: <SchoolIcon /> },
        { label: 'Catálogo Declaraciones', icon: <GavelIcon /> },
        { label: 'Roles', icon: <HowToRegIcon /> },
        { label: 'Regiones', icon: <PublicIcon /> },
        { label: 'Comité', icon: <SecurityIcon /> },
        { label: 'Asociaciones', icon: <BusinessIcon /> },
        { label: 'Agentes Pendientes', icon: <PendingActionsIcon /> },
        { label: 'Niveles Reconocimiento', icon: <EmojiEventsIcon /> }
    ];

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* ── Header fijo ── */}
            <Box sx={{
                flexShrink: 0,
                bgcolor: 'white',
                borderBottom: '1px solid #e0e0e0',
                px: 3,
                pt: 2,
                pb: 1.5,
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                        <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
                            Configuración del Sistema
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            Configure los parámetros globales del sistema SICAG
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={showCards ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            onClick={() => setShowCards(!showCards)}
                            sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
                        >
                            {showCards ? 'Ocultar Resumen' : 'Mostrar Resumen'}
                        </Button>
                    </Stack>
                </Box>

                <Alert
                    severity="info"
                    icon={<WarningIcon />}
                    sx={{
                        mb: 1.5,
                        py: 0.5,
                        bgcolor: '#e6f0ff',
                        color: colors.primary.dark,
                        '& .MuiAlert-icon': {
                            color: colors.accents.blue
                        }
                    }}
                >
                    Los cambios en la configuración afectarán a todos los usuarios del sistema. Cambios no guardados: {changes.length}
                </Alert>

                {/* Tarjetas de estado - Ocultables */}
                {showCards && (
                    <Box sx={{
                        display: 'grid',
                        gap: 1.5,
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        '@media (max-width: 1200px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
                        '@media (max-width: 600px)': { gridTemplateColumns: '1fr' }
                    }}>
                        <Card sx={{ borderLeft: `4px solid ${colors.primary.main}` }}>
                            <CardContent sx={{ p: '12px 16px !important' }}>
                                <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 'bold', mb: 0.5 }}>
                                    {systemHealth}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                    Salud del Sistema
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={systemHealth}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        mt: 1,
                                        bgcolor: '#f0f0f0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: systemHealth >= 80 ? colors.secondary.main :
                                                systemHealth >= 60 ? colors.accents.blue : colors.primary.dark
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <Card sx={{ borderLeft: `4px solid ${config.maintenanceMode ? colors.semaforo.amarillo : colors.secondary.main}` }}>
                            <CardContent sx={{ p: '12px 16px !important' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: config.maintenanceMode ? colors.semaforo.amarillo : colors.secondary.main }}>
                                            {config.maintenanceMode ? 'ACTIVO' : 'INACTIVO'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Mantenimiento
                                        </Typography>
                                    </Box>
                                    {config.maintenanceMode ?
                                        <WarningIcon sx={{ color: colors.semaforo.amarillo }} /> :
                                        <CheckCircleIcon sx={{ color: colors.secondary.main }} />}
                                </Box>
                            </CardContent>
                        </Card>
                        <Card sx={{ borderLeft: `4px solid ${colors.accents.purple}` }}>
                            <CardContent sx={{ p: '12px 16px !important' }}>
                                <Typography variant="h6" sx={{ color: colors.accents.purple, fontWeight: 'bold', mb: 0.5 }}>
                                    {config.certificationValidity}d
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                    Vigencia Certificaciones
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ borderLeft: `4px solid ${colors.secondary.main}` }}>
                            <CardContent sx={{ p: '12px 16px !important' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: config.allowRegistrations ? colors.secondary.main : colors.primary.dark }}>
                                            {config.allowRegistrations ? 'ACTIVO' : 'INACTIVO'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Registros
                                        </Typography>
                                    </Box>
                                    {config.allowRegistrations ?
                                        <CheckCircleIcon sx={{ color: colors.secondary.main }} /> :
                                        <LockIcon sx={{ color: colors.primary.dark }} />}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Box>

            {/* ── Área de contenido ── */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                gap: showChangesPanel ? 2 : 0,
                p: 2,
                minHeight: 0,
            }}>
                {/* Panel principal */}
                <Paper elevation={1} sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderRadius: 2,
                    minWidth: 0,
                    transition: 'all 0.2s ease'
                }}>
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', flexShrink: 0 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    color: colors.text.secondary,
                                    minHeight: 48,
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    '&.Mui-selected': {
                                        color: colors.primary.main
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: colors.primary.main
                                }
                            }}
                        >
                            {tabs.map((tab, i) => (
                                <Tab
                                    key={i}
                                    icon={tab.icon}
                                    iconPosition="start"
                                    label={tab.label}
                                    sx={{ minHeight: 48 }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Contenido de tabs */}
                    <Box sx={{ flex: 1, overflow: 'auto', p: 2.5, bgcolor: '#fafafa', minHeight: 0 }}>

                        {/* TAB 0: Catálogo Certificaciones */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                                    Módulo de Catálogo Certificaciones
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                    Contenido en desarrollo
                                </Typography>
                            </Box>
                        )}

                        {/* TAB 1: Catálogo Declaraciones */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                                    Módulo de Catálogo Declaraciones
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                    Contenido en desarrollo
                                </Typography>
                            </Box>
                        )}

                        {/* TAB 2: Roles - CORREGIDO */}
                        {activeTab === 2 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip
                                                key={f}
                                                label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={rolFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setRolFilter(f)}
                                                clickable
                                                size="small"
                                                sx={rolFilter === f ? {
                                                    bgcolor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                } : {
                                                    borderColor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenRolDialog()}
                                        size="small"
                                        sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                                    >
                                        Nuevo Rol
                                    </Button>
                                </Box>

                                <TextField
                                    placeholder="Buscar rol por nombre..."
                                    value={searchRoles}
                                    onChange={e => setSearchRoles(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: colors.primary.main }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchRoles && (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setSearchRoles('')}>
                                                    <CloseIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    size="small"
                                    sx={{
                                        maxWidth: 400,
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                                        }
                                    }}
                                />

                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }}>
                                                    ID
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '30%' }}>
                                                    Nombre del Rol
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '40%' }}>
                                                    Descripción
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '10%' }} align="center">
                                                    Global
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '10%' }} align="center">
                                                    Estatus
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }} align="center">
                                                    Acciones
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingRoles ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <CircularProgress size={30} sx={{ color: colors.primary.main }} />
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                                            Cargando roles...
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : errorRoles ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>
                                                            {errorRoles}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredRoles.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                            No se encontraron roles
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredRoles.map(rol => (
                                                    <TableRow
                                                        key={rol.id}
                                                        hover
                                                        sx={{
                                                            '&:hover': { bgcolor: '#f8f9fa' },
                                                            opacity: !rol.activo ? 0.7 : 1,
                                                            backgroundColor: !rol.activo ? '#fff5f5' : 'inherit'
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {rol.id}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                                                {rol.nombre}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {rol.descripcion || 'Sin descripción'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={rol.esGlobal ? 'SÍ' : 'NO'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: rol.esGlobal ? colors.accents.purple : colors.primary.light,
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    minWidth: 40
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={rol.activo ? 'ACTIVO' : 'INACTIVO'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: rol.activo ? colors.secondary.main : colors.primary.dark,
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    minWidth: 80
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                                                <Tooltip title="Editar rol">
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: colors.accents.blue }}
                                                                        onClick={() => handleOpenRolDialog(rol)}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={rol.activo ? 'Desactivar' : 'Activar'}>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: rol.activo ? colors.semaforo.rojo : colors.secondary.main }}
                                                                        onClick={() => handleToggleRoleStatus(rol.id)}
                                                                    >
                                                                        {rol.activo ?
                                                                            <BlockIcon fontSize="small" /> :
                                                                            <CheckCircleIcon fontSize="small" />}
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 3: Regiones - COMPLETADO Y CORREGIDO (SIN ELIMINAR) */}
                        {activeTab === 3 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip
                                                key={f}
                                                label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={regionFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setRegionFilter(f)}
                                                clickable
                                                size="small"
                                                sx={regionFilter === f ? {
                                                    bgcolor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                } : {
                                                    borderColor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Total: {filteredRegiones.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Activas: {regiones.filter(r => r.activa).length}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenRegionDialog()}
                                            size="small"
                                            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                                        >
                                            Nueva Región
                                        </Button>
                                    </Box>
                                </Box>

                                <TextField
                                    placeholder="Buscar región por nombre, país o estado..."
                                    value={searchRegiones}
                                    onChange={e => setSearchRegiones(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: colors.primary.main }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchRegiones && (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setSearchRegiones('')}>
                                                    <CloseIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    size="small"
                                    sx={{
                                        maxWidth: 500,
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                                        }
                                    }}
                                />

                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '25%' }}>Nombre</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '20%' }}>País</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '20%' }}>Estado/Provincia</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '12%' }} align="center">Estatus</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '18%' }} align="center">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingRegiones ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <CircularProgress size={30} sx={{ color: colors.primary.main }} />
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                                            Cargando regiones...
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : errorRegiones ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>
                                                            {errorRegiones}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredRegiones.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                            No se encontraron regiones
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredRegiones.map(region => (
                                                    <TableRow
                                                        key={region.id}
                                                        hover
                                                        sx={{
                                                            '&:hover': { bgcolor: '#f8f9fa' },
                                                            opacity: !region.activa ? 0.7 : 1,
                                                            backgroundColor: !region.activa ? '#fff5f5' : 'inherit'
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {region.id}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                                                {region.nombre}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {region.pais || 'No especificado'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {region.estado || 'No especificado'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={region.activa ? 'ACTIVA' : 'INACTIVA'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: region.activa ? colors.secondary.main : colors.primary.dark,
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    minWidth: 80
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                                                <Tooltip title="Editar región">
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: colors.accents.blue }}
                                                                        onClick={() => handleOpenRegionDialog(region)}
                                                                        disabled={togglingRegion === region.id}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={region.activa ? 'Desactivar' : 'Activar'}>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: region.activa ? colors.semaforo.rojo : colors.secondary.main }}
                                                                        onClick={() => handleToggleRegionStatus(region.id)}
                                                                        disabled={togglingRegion === region.id}
                                                                    >
                                                                        {togglingRegion === region.id
                                                                            ? <CircularProgress size={16} sx={{ color: colors.primary.main }} />
                                                                            : region.activa
                                                                                ? <BlockIcon fontSize="small" />
                                                                                : <CheckCircleIcon fontSize="small" />
                                                                        }
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 4: Comité */}
                        {activeTab === 4 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                                    Módulo de Comité
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                    Contenido en desarrollo
                                </Typography>
                            </Box>
                        )}

                        {/* TAB 5: Asociaciones */}
                        {activeTab === 5 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip
                                                key={f}
                                                label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={asociacionFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setAsociacionFilter(f)}
                                                clickable
                                                size="small"
                                                sx={asociacionFilter === f ? {
                                                    bgcolor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                } : {
                                                    borderColor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Total: {filteredAsociaciones.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Activas: {asociaciones.filter(a => a.activa).length}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenAsociacionDialog()}
                                            size="small"
                                            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                                        >
                                            Nueva Asociación
                                        </Button>
                                    </Box>
                                </Box>

                                <TextField
                                    placeholder="Buscar asociación por nombre o región..."
                                    value={searchAsociaciones}
                                    onChange={e => setSearchAsociaciones(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: colors.primary.main }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchAsociaciones && (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setSearchAsociaciones('')}>
                                                    <CloseIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    size="small"
                                    sx={{
                                        maxWidth: 500,
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                                        }
                                    }}
                                />

                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '25%' }}>Nombre</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '25%' }}>Región</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '20%' }}>Instancia</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '12%' }} align="center">Estatus</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '13%' }} align="center">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingAsociaciones ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <CircularProgress size={30} sx={{ color: colors.primary.main }} />
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                                            Cargando asociaciones...
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : errorAsociaciones ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>
                                                            {errorAsociaciones}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredAsociaciones.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                            No se encontraron asociaciones
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredAsociaciones.map(asoc => (
                                                    <TableRow
                                                        key={asoc.idAsociacion}
                                                        hover
                                                        sx={{
                                                            '&:hover': { bgcolor: '#f8f9fa' },
                                                            opacity: !asoc.activa ? 0.7 : 1,
                                                            backgroundColor: !asoc.activa ? '#fff5f5' : 'inherit'
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {asoc.idAsociacion}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                                                {asoc.nombre}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                {asoc.region || 'No especificada'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                                Instancia 1 (SICAG)
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={asoc.activa ? 'ACTIVA' : 'INACTIVA'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: asoc.activa ? colors.secondary.main : colors.primary.dark,
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    minWidth: 80
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                                                <Tooltip title="Editar asociación">
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: colors.accents.blue }}
                                                                        onClick={() => handleOpenAsociacionDialog(asoc)}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={asoc.activa ? 'Desactivar' : 'Activar'}>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: asoc.activa ? colors.semaforo.rojo : colors.secondary.main }}
                                                                        onClick={() => handleToggleAsociacionStatus(asoc.idAsociacion)}
                                                                        disabled={togglingAsociacion === asoc.idAsociacion}
                                                                    >
                                                                        {togglingAsociacion === asoc.idAsociacion
                                                                            ? <CircularProgress size={16} sx={{ color: colors.primary.main }} />
                                                                            : asoc.activa
                                                                                ? <BlockIcon fontSize="small" />
                                                                                : <CheckCircleIcon fontSize="small" />
                                                                        }
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 6: Agentes Pendientes */}
                        {activeTab === 6 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                                    Módulo de Agentes Pendientes
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                                    Contenido en desarrollo
                                </Typography>
                            </Box>
                        )}

                        {/* TAB 7: Niveles Reconocimiento */}
                        {activeTab === 7 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', border: `1px solid ${colors.primary.light}` }}>
                                    <Typography variant="subtitle1" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 2 }}>
                                        Configuración de Umbrales del Semáforo
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                                        Configure los porcentajes mínimos para cada nivel del semáforo de cumplimiento
                                    </Typography>
                                    <Box sx={{ px: 2, mb: 2 }}>
                                        <Slider
                                            value={[config.redThreshold, config.yellowThreshold, config.greenThreshold]}
                                            onChange={(e, v) => {
                                                handleSliderChange('redThreshold')(e, v[0]);
                                                handleSliderChange('yellowThreshold')(e, v[1]);
                                                handleSliderChange('greenThreshold')(e, v[2]);
                                            }}
                                            min={0}
                                            max={100}
                                            step={5}
                                            valueLabelDisplay="auto"
                                            disableSwap
                                            size="small"
                                            sx={{
                                                '& .MuiSlider-thumb': {
                                                    height: 20,
                                                    width: 20,
                                                    backgroundColor: '#fff',
                                                    border: '2px solid currentColor',
                                                },
                                                '& .MuiSlider-track': {
                                                    height: 8,
                                                    borderRadius: 4,
                                                },
                                                '& .MuiSlider-rail': {
                                                    height: 8,
                                                    borderRadius: 4,
                                                    opacity: 0.3,
                                                    backgroundColor: '#bfbfbf',
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
                                                <ErrorIcon sx={{ color: colors.semaforo.rojo, fontSize: 32, mb: 1 }} />
                                                <Typography variant="subtitle2" sx={{ color: colors.semaforo.rojo, fontWeight: 'bold' }}>
                                                    ROJO
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.semaforo.rojo }}>
                                                    {'<'} {config.redThreshold}%
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff8e1' }}>
                                                <WarningIcon sx={{ color: colors.semaforo.amarillo, fontSize: 32, mb: 1 }} />
                                                <Typography variant="subtitle2" sx={{ color: colors.semaforo.amarillo, fontWeight: 'bold' }}>
                                                    AMARILLO
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.semaforo.amarillo }}>
                                                    {config.redThreshold}% - {config.yellowThreshold}%
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                                <CheckCircleIcon sx={{ color: colors.semaforo.verde, fontSize: 32, mb: 1 }} />
                                                <Typography variant="subtitle2" sx={{ color: colors.semaforo.verde, fontWeight: 'bold' }}>
                                                    VERDE
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.semaforo.verde }}>
                                                    {'>'} {config.yellowThreshold}%
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 3 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={config.autoRecalculation}
                                                    onChange={handleChange('autoRecalculation')}
                                                    size="small"
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: colors.primary.main,
                                                            '&:hover': { backgroundColor: '#e8f0fe' },
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: colors.primary.main,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                                    Cálculo Automático del Semáforo
                                                </Typography>
                                            }
                                        />
                                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', ml: 4 }}>
                                            Recalcula automáticamente el semáforo cuando cambian las certificaciones o declaraciones
                                        </Typography>
                                    </Box>
                                </Paper>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip
                                                key={f}
                                                label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant="outlined"
                                                clickable
                                                size="small"
                                                sx={{
                                                    borderColor: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    color: f === 'activos' ? colors.secondary.main :
                                                        f === 'inactivos' ? colors.primary.dark : colors.primary.main,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Total: 0 niveles
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            Activos: 0
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            size="small"
                                            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                                        >
                                            Nuevo Nivel
                                        </Button>
                                    </Box>
                                </Box>

                                <TextField
                                    placeholder="Buscar nivel de reconocimiento por nombre..."
                                    size="small"
                                    sx={{
                                        maxWidth: 400,
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                                        }
                                    }}
                                />

                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Nombre del Nivel</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Descripción</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }} align="center">Estatus</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }} align="center">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                        No hay niveles de reconocimiento disponibles
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* Panel de cambios (lateral) */}
                {showChangesPanel && (
                    <Paper elevation={3} sx={{
                        width: 320,
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: 2,
                        border: `1px solid ${colors.primary.light}`
                    }}>
                        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: `1px solid ${colors.primary.light}` }}>
                                <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                                    Cambios Recientes
                                </Typography>
                                <IconButton size="small" onClick={toggleChangesPanel} sx={{ color: colors.primary.main }}>
                                    <ChevronRightIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TimerIcon sx={{ color: colors.accents.purple }} />
                                        <Typography variant="subtitle1" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                                            Historial
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${changes.length} cambios`}
                                        size="small"
                                        sx={{ bgcolor: colors.primary.main, color: 'white' }}
                                    />
                                </Box>
                                {changes.length > 0 ? (
                                    changes.slice(-10).reverse().map((c, i) => (
                                        <Paper
                                            key={i}
                                            sx={{
                                                p: 1.5,
                                                mb: 1.5,
                                                bgcolor: 'white',
                                                borderLeft: `3px solid ${colors.accents.blue}`,
                                                border: `1px solid ${colors.primary.light}`
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: colors.primary.dark, textTransform: 'capitalize' }}>
                                                    {c.field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>{c.timestamp}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>De:</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: colors.semaforo.rojo, maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {c.oldValue.toString()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.text.secondary, mx: 0.5 }}>→</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: colors.secondary.main, maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {c.newValue.toString()}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                                        <CheckCircleIcon sx={{ color: colors.secondary.main, fontSize: 48, mb: 2, opacity: 0.7 }} />
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                            No hay cambios pendientes
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.primary.light, mt: 1 }}>
                                            Realice cambios en la configuración
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ pt: 2, mt: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ChevronRightIcon />}
                                    onClick={toggleChangesPanel}
                                    fullWidth
                                    sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
                                >
                                    Cerrar Panel
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Box>

            {/* ── Diálogo de Roles (CORREGIDO) ── */}
            <Dialog
                open={rolDialogOpen}
                onClose={handleCloseRolDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HowToRegIcon sx={{ color: colors.primary.main }} />
                        <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                            {editingRol ? 'Editar Rol' : 'Nuevo Rol'}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nombre del Rol"
                            value={rolForm.nombre}
                            onChange={handleRolFormChange('nombre')}
                            required
                            error={nombreExists}
                            helperText={nombreExists ? 'Este nombre ya existe' : checkingNombre ? 'Verificando...' : ''}
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
                            label="Descripción"
                            value={rolForm.descripcion}
                            onChange={handleRolFormChange('descripcion')}
                            multiline
                            rows={3}
                            size="small"
                            sx={{
                                '& .MuiInputLabel-root': { color: colors.text.secondary },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                                }
                            }}
                        />
                        <Box sx={{ mt: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: `1px solid ${colors.primary.light}` }}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <InfoIcon sx={{ fontSize: 16, color: colors.accents.blue }} />
                                Los roles nuevos se crean con estado ACTIVO y NO GLOBAL por defecto
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                    <Button
                        onClick={handleCloseRolDialog}
                        sx={{ color: colors.text.secondary }}
                        size="small"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveRol}
                        variant="contained"
                        disabled={!rolForm.nombre.trim() || nombreExists || checkingNombre}
                        size="small"
                        sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                    >
                        {editingRol ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Diálogo de Regiones (CORREGIDO, SIN OPCIÓN DE ELIMINAR) ── */}
            <Dialog
                open={regionDialogOpen}
                onClose={handleCloseRegionDialog}
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
                            onChange={handleRegionFormChange('nombre')}
                            required
                            error={regionNombreExists}
                            helperText={regionNombreExists ? 'Este nombre ya existe' : checkingRegionNombre ? 'Verificando...' : ''}
                            disabled={savingRegion}
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
                            onChange={handleRegionFormChange('pais')}
                            required
                            placeholder="Ej: Chile, Argentina, Perú..."
                            disabled={savingRegion}
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
                            onChange={handleRegionFormChange('estado')}
                            placeholder="Ej: Región Metropolitana, Provincia de Buenos Aires..."
                            disabled={savingRegion}
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
                                    onChange={handleRegionFormChange('activa')}
                                    disabled={savingRegion}
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
                        onClick={handleCloseRegionDialog}
                        disabled={savingRegion}
                        sx={{ color: colors.text.secondary }}
                        size="small"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveRegion}
                        variant="contained"
                        disabled={!regionForm.nombre.trim() || !regionForm.pais.trim() || regionNombreExists || checkingRegionNombre || savingRegion}
                        startIcon={savingRegion ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
                        size="small"
                        sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                    >
                        {savingRegion ? 'Guardando...' : (editingRegion ? 'Actualizar' : 'Crear')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Diálogo de Asociaciones ── */}
            <Dialog
                open={asociacionDialogOpen}
                onClose={handleCloseAsociacionDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: colors.primary.main }} />
                        <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                            {editingAsociacion ? 'Editar Asociación' : 'Nueva Asociación'}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nombre de la Asociación"
                            value={asociacionForm.nombre}
                            onChange={handleAsociacionFormChange('nombre')}
                            required
                            disabled={savingAsociacion}
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
                            label="Región"
                            value={asociacionForm.region}
                            onChange={handleAsociacionFormChange('region')}
                            placeholder="Ej: Región Metropolitana, Región de Valparaíso..."
                            disabled={savingAsociacion}
                            size="small"
                            sx={{
                                '& .MuiInputLabel-root': { color: colors.text.secondary },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                                }
                            }}
                        />
                        <Box sx={{ mt: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: `1px solid ${colors.primary.light}` }}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <InfoIcon sx={{ fontSize: 16, color: colors.accents.blue }} />
                                La asociación se creará en la Instancia 1 (SICAG)
                            </Typography>
                            {editingAsociacion && (
                                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                                    El estado activa/inactiva se cambia desde la tabla con el botón de bloqueo
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                    <Button
                        onClick={handleCloseAsociacionDialog}
                        disabled={savingAsociacion}
                        sx={{ color: colors.text.secondary }}
                        size="small"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveAsociacion}
                        variant="contained"
                        disabled={!asociacionForm.nombre.trim() || savingAsociacion}
                        startIcon={savingAsociacion ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
                        size="small"
                        sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                    >
                        {savingAsociacion ? 'Guardando...' : (editingAsociacion ? 'Actualizar' : 'Crear')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={assignDialogOpen}
                onClose={() => setAssignDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIndIcon sx={{ color: colors.primary.main }} />
                        <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                            Asignar Evaluador
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedAgent && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: `1px solid ${colors.primary.light}` }}>
                                <Typography variant="subtitle2" sx={{ color: colors.primary.dark, mb: 1 }}>
                                    Agente Seleccionado:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: colors.primary.main, fontSize: '0.9rem' }}>
                                        AG
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                            {selectedAgent.nombre}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                            {selectedAgent.documentos_pendientes} documentos pendientes • {selectedAgent.region}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ color: colors.text.secondary }}>Seleccionar Evaluador</InputLabel>
                                <Select
                                    value={selectedEvaluator}
                                    label="Seleccionar Evaluador"
                                    onChange={e => setSelectedEvaluator(e.target.value)}
                                    sx={{
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.primary.main
                                        }
                                    }}
                                >
                                    <MenuItem value=""><em>Seleccionar evaluador...</em></MenuItem>
                                    <MenuItem value="Juan Pérez López">Juan Pérez López</MenuItem>
                                    <MenuItem value="María González Sánchez">María González Sánchez</MenuItem>
                                    <MenuItem value="Carlos Rodríguez Martínez">Carlos Rodríguez Martínez</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                    <Button
                        onClick={() => setAssignDialogOpen(false)}
                        sx={{ color: colors.text.secondary }}
                        size="small"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAssignment}
                        variant="contained"
                        disabled={!selectedEvaluator}
                        size="small"
                        sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                    >
                        Asignar Evaluador
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={closeSnack}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={closeSnack}
                    severity={snack.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        bgcolor: snack.severity === 'success' ? colors.secondary.main :
                            snack.severity === 'error' ? colors.semaforo.rojo :
                                snack.severity === 'warning' ? colors.semaforo.amarillo : colors.accents.blue
                    }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SystemConfig;