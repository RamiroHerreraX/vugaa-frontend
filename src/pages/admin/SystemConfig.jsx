// src/pages/admin/SystemConfig.jsx
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
    Chip,
    Slider,
    InputAdornment,
    Alert,
    Tabs, Tab,
    Stack,
    IconButton,
    Tooltip,
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
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Lock as LockIcon,
    Edit as EditIcon,
    Block as BlockIcon,
    Add as AddIcon,
    Business as BusinessIcon,
    HowToReg as HowToRegIcon,
    Public as PublicIcon,
    EmojiEvents as EmojiEventsIcon,
    Search as SearchIcon,
    PendingActions as PendingActionsIcon,
    AssignmentInd as AssignmentIndIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    LocationOn as LocationOnIcon,
    PersonAdd as PersonAddIcon,
    Group as GroupIcon,
    Assignment as AssignmentIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

import { useAuth } from './../../context/AuthContext';

import CreateRegion from './../../components/regionAdmin/CreateRegion';
import EditRegion from './../../components/regionAdmin/EditRegion';
import AsigAsociacion from './../../components/asociacionAdmin/AsigAsociacion';
import CreateUsuarioAsociacion from '../../components/asociacionAdmin/CreateUsuarioAsociacion';

// ── Componentes de Niveles de Reconocimiento ──────────────────────────────
import CreateNivelDialog from '../../components/nivelesReconocimiento/Createniveldialog';
import EditNivelDialog from '../../components/nivelesReconocimiento/Editniveldialog';
import ViewNivelDialog from '../../components/nivelesReconocimiento/Viewniveldialog';

import rolService from '../../services/rol';
import asociacionService from '../../services/asociacion';
import regionesService from '../../services/regiones';
import nivelReconocimientoService from '../../services/nivelreconocimiento';

// Paleta corporativa
const colors = {
    primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
    secondary: { main: '#00A8A8', light: '#00C2D1', lighter: '#35D0FF' },
    accents: { blue: '#0099FF', purple: '#6C5CE7' },
    status: { success: '#00A8A8', warning: '#00C2D1', error: '#0099FF', info: '#3A6EA5' },
    text: { primary: '#0D2A4D', secondary: '#3A6EA5', light: '#6C5CE7' },
    semaforo: { rojo: '#D32F2F', amarillo: '#FFC107', verde: '#388E3C' }
};

// ─── Snackbar helper ────────────────────────────────────────────────────────
const useNotification = () => {
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
    const notify = (message, severity = 'success') => setSnack({ open: true, message, severity });
    const close = () => setSnack(prev => ({ ...prev, open: false }));
    return { snack, notify, close };
};

const SystemConfig = () => {
    const { user } = useAuth();
    const { snack, notify, close: closeSnack } = useNotification();

    const [activeTab, setActiveTab] = useState(0);
    const [showCards, setShowCards] = useState(true);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedEvaluator, setSelectedEvaluator] = useState('');

    // ── Estado Roles ──────────────────────────────────────────────────────
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

    // ── Estado Asociaciones ───────────────────────────────────────────────
    const [asociaciones, setAsociaciones] = useState([]);
    const [loadingAsociaciones, setLoadingAsociaciones] = useState(false);
    const [errorAsociaciones, setErrorAsociaciones] = useState(null);
    const [asociacionFilter, setAsociacionFilter] = useState('todos');
    const [searchAsociaciones, setSearchAsociaciones] = useState('');
    const [regiones, setRegiones] = useState([]);
    const [togglingAsociacion, setTogglingAsociacion] = useState(null);
    const [loadingRegionesForSelect, setLoadingRegionesForSelect] = useState(false);
    const [usuariosAsociacionDialogOpen, setUsuariosAsociacionDialogOpen] = useState(false);
    const [selectedAsociacionForUsuarios, setSelectedAsociacionForUsuarios] = useState(null);
    const [usuariosAsociacion, setUsuariosAsociacion] = useState([]);
    const [loadingUsuariosAsociacion, setLoadingUsuariosAsociacion] = useState(false);
    const [errorUsuariosAsociacion, setErrorUsuariosAsociacion] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [desvinculandoUsuario, setDesvinculandoUsuario] = useState(null);
    const [usuarioAsociacionDialogOpen, setUsuarioAsociacionDialogOpen] = useState(false);

    // ── Estado Regiones ───────────────────────────────────────────────────
    const [regionesList, setRegionesList] = useState([]);
    const [loadingRegiones, setLoadingRegiones] = useState(false);
    const [errorRegiones, setErrorRegiones] = useState(null);
    const [regionFilter, setRegionFilter] = useState('todos');
    const [searchRegiones, setSearchRegiones] = useState('');
    const [regionDialogOpen, setRegionDialogOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [savingRegion, setSavingRegion] = useState(false);
    const [togglingRegion, setTogglingRegion] = useState(null);

    // ── Estado Niveles de Reconocimiento ──────────────────────────────────
    const [niveles, setNiveles] = useState([]);
    const [loadingNiveles, setLoadingNiveles] = useState(false);
    const [errorNiveles, setErrorNiveles] = useState(null);
    const [nivelFilter, setNivelFilter] = useState('todos');
    const [searchNiveles, setSearchNiveles] = useState('');
    const [togglingNivel, setTogglingNivel] = useState(null);
    const [savingNivel, setSavingNivel] = useState(false);

    // Diálogos de Niveles
    const [createNivelOpen, setCreateNivelOpen] = useState(false);
    const [editNivelOpen, setEditNivelOpen] = useState(false);
    const [viewNivelOpen, setViewNivelOpen] = useState(false);
    const [selectedNivel, setSelectedNivel] = useState(null);

    // ── Config General ────────────────────────────────────────────────────
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

    // ── Carga inicial ─────────────────────────────────────────────────────
    useEffect(() => {
        fetchRoles();
        fetchAsociaciones();
        fetchRegionesList();
        fetchRegiones();
        fetchNiveles();
    }, [user?.instanciaId]);

    // ══════════════════════════════════════════════════════════════════════
    // ROLES
    // ══════════════════════════════════════════════════════════════════════
    const fetchRoles = async () => {
        setLoadingRoles(true);
        setErrorRoles(null);
        try {
            const data = await rolService.findAll();
            const rolesArray = Array.isArray(data) ? data : [];
            const filteredRoles = rolesArray.filter(rol =>
                rol.nombre !== 'ADMIN' && rol.nombre !== 'SUPERADMIN'
            );
            setRoles(filteredRoles.sort((a, b) => a.id - b.id));
        } catch (error) {
            setErrorRoles(error?.message || 'No se pudieron cargar los roles');
            notify(error?.message || 'Error al cargar roles', 'error');
        } finally {
            setLoadingRoles(false);
        }
    };

    useEffect(() => {
        const check = async () => {
            if (!rolForm.nombre || rolForm.nombre.length < 3) { setNombreExists(false); return; }
            setCheckingNombre(true);
            try {
                const exists = editingRol
                    ? await rolService.existsByNombreAndIdNot(rolForm.nombre, editingRol.id)
                    : await rolService.existsByNombre(rolForm.nombre);
                setNombreExists(exists);
            } catch { setNombreExists(false); }
            finally { setCheckingNombre(false); }
        };
        const t = setTimeout(check, 500);
        return () => clearTimeout(t);
    }, [rolForm.nombre, editingRol]);

    const filteredRoles = roles
        .filter(rol => {
            const matchSearch = rol.nombre?.toLowerCase().includes(searchRoles.toLowerCase());
            const matchFilter = rolFilter === 'todos' ? true : rolFilter === 'activos' ? rol.activo === true : rol.activo === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => a.id - b.id);

    const handleOpenRolDialog = (rol = null) => {
        setEditingRol(rol);
        setRolForm({ nombre: rol?.nombre || '', descripcion: rol?.descripcion || '' });
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
        if (!rolForm.nombre.trim()) { notify('El nombre del rol es obligatorio', 'error'); return; }
        if (nombreExists) { notify('Ya existe un rol con este nombre', 'error'); return; }
        try {
            if (editingRol) {
                const payload = { nombre: rolForm.nombre, descripcion: rolForm.descripcion, activo: editingRol.activo };
                await rolService.update(editingRol.id, payload);
                setRoles(prev => prev.map(r => r.id === editingRol.id ? { ...r, ...payload } : r));
                notify('Rol actualizado exitosamente');
            } else {
                const payload = { nombre: rolForm.nombre, descripcion: rolForm.descripcion, activo: true };
                const newRol = await rolService.create(payload);
                setRoles(prev => [...prev, newRol].sort((a, b) => a.id - b.id));
                notify('Rol creado exitosamente');
            }
            handleCloseRolDialog();
        } catch (error) {
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
                .filter(a => a.idInstancia === user?.instanciaId)
                .sort((a, b) => (a.idAsociacion || 0) - (b.idAsociacion || 0));
            const regionesData = await regionesService.findAll();
            const regionesMap = new Map(regionesData.map(r => [r.idRegion, r.nombre]));
            setAsociaciones(filtered.map(asoc => ({
                ...asoc,
                nombreRegion: regionesMap.get(asoc.idRegion) || 'No especificada'
            })));
        } catch (error) {
            const errorMessage = error?.message || 'No se pudieron cargar las asociaciones';
            setErrorAsociaciones(errorMessage);
            notify(errorMessage, 'error');
        } finally {
            setLoadingAsociaciones(false);
        }
    };

    const fetchRegiones = async () => {
        setLoadingRegionesForSelect(true);
        try {
            const data = await regionesService.findAll();
            const regionesArray = Array.isArray(data) ? data : [];
            const regionesDeInstancia = regionesArray.filter(r => r.idInstancia === user?.instanciaId);
            setRegiones(regionesDeInstancia.filter(r => r.activa).sort((a, b) => a.nombre.localeCompare(b.nombre)));
        } catch (error) {
            console.error('Error al cargar regiones para selector:', error);
        } finally {
            setLoadingRegionesForSelect(false);
        }
    };

    const handleToggleAsociacionStatus = async (id) => {
        const asociacion = asociaciones.find(a => a.idAsociacion === id);
        if (!asociacion) return;
        if (!window.confirm(`¿Está seguro de ${asociacion.activa ? 'desactivar' : 'activar'} la asociación "${asociacion.nombre}"?`)) return;
        setTogglingAsociacion(id);
        try {
            if (asociacion.activa) await asociacionService.desactivar(id);
            else await asociacionService.activar(id);
            setAsociaciones(prev => prev.map(a => a.idAsociacion === id ? { ...a, activa: !asociacion.activa } : a));
            notify(`Asociación ${asociacion.activa ? 'desactivada' : 'activada'} correctamente`);
        } catch (error) {
            notify(error?.message || 'Error al cambiar el estado de la asociación', 'error');
        } finally {
            setTogglingAsociacion(null);
        }
    };

    const handleOpenUsuariosAsociacionDialog = async (asociacion) => {
        setSelectedAsociacionForUsuarios(asociacion);
        setUsuariosAsociacionDialogOpen(true);
        setLoadingUsuariosAsociacion(true);
        setErrorUsuariosAsociacion(null);
        try {
            const usuarios = await asociacionService.listarUsuariosAsociacionPorInstancia(user?.instanciaId);
            try {
                const asociacionCompleta = await asociacionService.findById(asociacion.idAsociacion);
                const usuariosRelacionadosIds = asociacionCompleta.usuarios?.map(u => u.id) || [];
                setUsuariosAsociacion(usuarios.map(u => ({ ...u, relacionado: usuariosRelacionadosIds.includes(u.id) })));
            } catch {
                setUsuariosAsociacion(usuarios.map(u => ({ ...u, relacionado: false })));
            }
        } catch (error) {
            setErrorUsuariosAsociacion(error?.message || 'Error al cargar los usuarios');
            notify('Error al cargar los usuarios de la asociación', 'error');
        } finally {
            setLoadingUsuariosAsociacion(false);
        }
    };

    const handleCloseUsuariosAsociacionDialog = () => {
        setUsuariosAsociacionDialogOpen(false);
        setSelectedAsociacionForUsuarios(null);
        setUsuariosAsociacion([]);
        setErrorUsuariosAsociacion(null);
        setDesvinculandoUsuario(null);
    };

    const handleRelacionarUsuario = async (usuario) => {
        if (!selectedAsociacionForUsuarios) return;
        setActionLoading(true);
        try {
            await asociacionService.relacionarUsuario(selectedAsociacionForUsuarios.idAsociacion, usuario.id);
            setUsuariosAsociacion(prev => prev.map(u => u.id === usuario.id ? { ...u, relacionado: true } : u));
            notify(`Usuario "${usuario.nombre}" relacionado exitosamente`, 'success');
        } catch (error) {
            notify(error?.message || 'Error al relacionar el usuario', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDesvincularUsuario = async (usuario) => {
        if (!selectedAsociacionForUsuarios) return;
        if (!window.confirm(`¿Está seguro de desvincular al usuario "${usuario.nombre}" de la asociación?`)) return;
        setDesvinculandoUsuario(usuario.id);
        try {
            await asociacionService.desvincularUsuario(selectedAsociacionForUsuarios.idAsociacion, usuario.id);
            setUsuariosAsociacion(prev => prev.map(u => u.id === usuario.id ? { ...u, relacionado: false } : u));
            notify(`Usuario "${usuario.nombre}" desvinculado exitosamente`, 'success');
        } catch (error) {
            notify(error?.message || 'Error al desvincular el usuario', 'error');
        } finally {
            setDesvinculandoUsuario(null);
        }
    };

    const handleUsuarioAsociacionComplete = (resultado) => {
        notify(`Usuario "${resultado.usuario.nombre}" y asociación "${resultado.asociacion.nombre}" creados y relacionados exitosamente`, 'success');
        fetchAsociaciones();
    };

    // ══════════════════════════════════════════════════════════════════════
    // REGIONES
    // ══════════════════════════════════════════════════════════════════════
    const fetchRegionesList = async () => {
        setLoadingRegiones(true);
        setErrorRegiones(null);
        try {
            const data = await regionesService.findAll();
            const regionesArray = Array.isArray(data) ? data : [];
            const regionesDeInstancia = regionesArray.filter(r => r.idInstancia === user?.instanciaId);
            setRegionesList(regionesDeInstancia.sort((a, b) => a.idRegion - b.idRegion));
        } catch (error) {
            const errorMessage = error?.error || error?.message || 'No se pudieron cargar las regiones';
            setErrorRegiones(errorMessage);
            notify(errorMessage, 'error');
        } finally {
            setLoadingRegiones(false);
        }
    };

    const filteredRegiones = regionesList
        .filter(region => {
            const matchSearch =
                region.nombre?.toLowerCase().includes(searchRegiones.toLowerCase()) ||
                (region.pais?.toLowerCase() || '').includes(searchRegiones.toLowerCase()) ||
                (region.estado?.toLowerCase() || '').includes(searchRegiones.toLowerCase());
            const matchFilter = regionFilter === 'todos' ? true : regionFilter === 'activos' ? region.activa === true : region.activa === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => a.idRegion - b.idRegion);

    const handleOpenRegionDialog = (region = null) => {
        setEditingRegion(region);
        setRegionDialogOpen(true);
    };

    const handleCloseRegionDialog = () => {
        if (savingRegion) return;
        setRegionDialogOpen(false);
        setEditingRegion(null);
        setSavingRegion(false);
    };

    const handleSaveRegion = async (regionData) => {
        setSavingRegion(true);
        try {
            if (editingRegion) {
                const updatedRegion = await regionesService.update(editingRegion.idRegion, { ...regionData, idInstancia: user?.instanciaId });
                setRegionesList(prev => prev.map(r => r.idRegion === editingRegion.idRegion ? { ...r, ...updatedRegion } : r).sort((a, b) => a.idRegion - b.idRegion));
                notify('Región actualizada exitosamente');
            } else {
                const newRegion = await regionesService.create({ ...regionData, idInstancia: user?.instanciaId });
                setRegionesList(prev => [...prev, newRegion].sort((a, b) => a.idRegion - b.idRegion));
                notify('Región creada exitosamente');
            }
            handleCloseRegionDialog();
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.message || error?.mensaje || error?.error || 'Error al guardar la región';
            notify(errorMessage, 'error');
        } finally {
            setSavingRegion(false);
        }
    };

    const handleToggleRegionStatus = async (id) => {
        const region = regionesList.find(r => r.idRegion === id);
        if (!region) return;
        if (!window.confirm(`¿Está seguro de ${region.activa ? 'desactivar' : 'activar'} la región "${region.nombre}"?`)) return;
        setTogglingRegion(id);
        try {
            if (region.activa) await regionesService.desactivarRegion(id);
            else await regionesService.activarRegion(id);
            setRegionesList(prev => prev.map(r => r.idRegion === id ? { ...r, activa: !region.activa } : r));
            notify(`Región ${region.activa ? 'desactivada' : 'activada'} correctamente`);
        } catch (error) {
            notify(error?.message || 'Error al cambiar el estado de la región', 'error');
        } finally {
            setTogglingRegion(null);
        }
    };

    // ══════════════════════════════════════════════════════════════════════
    // NIVELES DE RECONOCIMIENTO
    // ══════════════════════════════════════════════════════════════════════
    const fetchNiveles = async () => {
        setLoadingNiveles(true);
        setErrorNiveles(null);
        try {
            // Traer por instancia del usuario logueado
            const data = await nivelReconocimientoService.findByInstancia(user?.instanciaId);
            const nivelesArray = Array.isArray(data) ? data : [];
            setNiveles(nivelesArray.sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0)));
        } catch (error) {
            const errorMessage = error?.message || 'No se pudieron cargar los niveles de reconocimiento';
            setErrorNiveles(errorMessage);
            notify(errorMessage, 'error');
        } finally {
            setLoadingNiveles(false);
        }
    };

    const filteredNiveles = niveles
        .filter(n => {
            const matchSearch = n.nombre?.toLowerCase().includes(searchNiveles.toLowerCase());
            const matchFilter = nivelFilter === 'todos' ? true : nivelFilter === 'activos' ? n.activo === true : n.activo === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0));

    // ── Crear ────────────────────────────────────────────────────────────
    const handleCreateNivel = async (nivelData) => {
        setSavingNivel(true);
        try {
            const payload = {
                ...nivelData,
                idInstancia: user?.instanciaId  // siempre viene del usuario logueado
            };
            const newNivel = await nivelReconocimientoService.create(payload);
            setNiveles(prev => [...prev, newNivel].sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0)));
            notify('Nivel de reconocimiento creado exitosamente');
            setCreateNivelOpen(false);
        } catch (error) {
            notify(error?.message || 'Error al crear el nivel', 'error');
        } finally {
            setSavingNivel(false);
        }
    };

    // ── Editar ───────────────────────────────────────────────────────────
    const handleOpenEditNivel = (nivel) => {
        setSelectedNivel(nivel);
        setEditNivelOpen(true);
    };

    const handleUpdateNivel = async (id, nivelData) => {
        setSavingNivel(true);
        try {
            const payload = {
                ...nivelData,
                idInstancia: user?.instanciaId  // siempre viene del usuario logueado
            };
            const updated = await nivelReconocimientoService.update(id, payload);
            setNiveles(prev => prev.map(n => n.idNivel === id ? updated : n).sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0)));
            notify('Nivel de reconocimiento actualizado exitosamente');
            setEditNivelOpen(false);
            setSelectedNivel(null);
        } catch (error) {
            notify(error?.message || 'Error al actualizar el nivel', 'error');
        } finally {
            setSavingNivel(false);
        }
    };

    // ── Ver detalle ──────────────────────────────────────────────────────
    const handleOpenViewNivel = (nivel) => {
        setSelectedNivel(nivel);
        setViewNivelOpen(true);
    };

    // ── Eliminar lógico ──────────────────────────────────────────────────
    const handleToggleNivelStatus = async (id) => {
        const nivel = niveles.find(n => n.idNivel === id);
        if (!nivel) return;
        if (!window.confirm(`¿Está seguro de ${nivel.activo ? 'desactivar' : 'activar'} el nivel "${nivel.nombre}"?`)) return;
        setTogglingNivel(id);
        try {
            await nivelReconocimientoService.delete(id);
            setNiveles(prev => prev.map(n => n.idNivel === id ? { ...n, activo: !nivel.activo } : n));
            notify(`Nivel ${nivel.activo ? 'desactivado' : 'activado'} correctamente`);
        } catch (error) {
            notify(error?.message || 'Error al cambiar el estado del nivel', 'error');
        } finally {
            setTogglingNivel(null);
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

    const handleConfirmAssignment = () => {
        setAssignDialogOpen(false);
        setSelectedAgent(null);
        setSelectedEvaluator('');
        notify('Evaluador asignado exitosamente');
    };

    const filteredAsociaciones = asociaciones
        .filter(asoc => {
            const matchSearch =
                asoc.nombre?.toLowerCase().includes(searchAsociaciones.toLowerCase()) ||
                (asoc.codigo && asoc.codigo.toLowerCase().includes(searchAsociaciones.toLowerCase())) ||
                (asoc.representanteLegal && asoc.representanteLegal.toLowerCase().includes(searchAsociaciones.toLowerCase())) ||
                (asoc.nombreRegion && asoc.nombreRegion.toLowerCase().includes(searchAsociaciones.toLowerCase()));
            const matchFilter = asociacionFilter === 'todos' ? true : asociacionFilter === 'activos' ? asoc.activa === true : asoc.activa === false;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => a.idAsociacion - b.idAsociacion);

    // ══════════════════════════════════════════════════════════════════════
    // TARJETAS DE RESUMEN
    // ══════════════════════════════════════════════════════════════════════
    const getResumenCards = () => {
        switch (activeTab) {
            case 0:
                return [
                    { titulo: 'Total Roles', valor: roles.length, color: colors.primary.main, icono: <HowToRegIcon />, subtitulo: 'Roles registrados' },
                    { titulo: 'Roles Activos', valor: roles.filter(r => r.activo).length, color: colors.secondary.main, icono: <CheckCircleIcon />, subtitulo: 'En funcionamiento' },
                    { titulo: 'Roles Inactivos', valor: roles.filter(r => !r.activo).length, color: colors.semaforo.rojo, icono: <BlockIcon />, subtitulo: 'Deshabilitados' },
                    { titulo: 'Última Actualización', valor: new Date().toLocaleDateString(), color: colors.accents.blue, icono: <EditIcon />, subtitulo: 'Fecha de carga' }
                ];
            case 1:
                return [
                    { titulo: 'Total Regiones', valor: regionesList.length, color: colors.primary.main, icono: <PublicIcon />, subtitulo: 'Regiones configuradas' },
                    { titulo: 'Regiones Activas', valor: regionesList.filter(r => r.activa).length, color: colors.secondary.main, icono: <CheckCircleIcon />, subtitulo: 'Habilitadas' },
                    { titulo: 'Regiones Inactivas', valor: regionesList.filter(r => !r.activa).length, color: colors.semaforo.rojo, icono: <BlockIcon />, subtitulo: 'Deshabilitadas' },
                    { titulo: 'Países', valor: [...new Set(regionesList.map(r => r.pais).filter(Boolean))].length, color: colors.accents.blue, icono: <LocationOnIcon />, subtitulo: 'Países cubiertos' }
                ];
            case 2:
                return [
                    { titulo: 'Miembros Comité', valor: 0, color: colors.primary.main, icono: <GroupIcon />, subtitulo: 'Total miembros' },
                    { titulo: 'Activos', valor: 0, color: colors.secondary.main, icono: <CheckCircleIcon />, subtitulo: 'En función' },
                    { titulo: 'Pendientes', valor: 0, color: colors.semaforo.amarillo, icono: <PendingActionsIcon />, subtitulo: 'Por confirmar' },
                    { titulo: 'Evaluaciones', valor: 0, color: colors.accents.purple, icono: <AssignmentIndIcon />, subtitulo: 'Asignadas' }
                ];
            case 3: {
                const asociacionesActivas = asociaciones.filter(a => a.activa).length;
                const regionesConAsoc = [...new Set(asociaciones.map(a => a.nombreRegion).filter(Boolean))].length;
                return [
                    { titulo: 'Total Asociaciones', valor: asociaciones.length, color: colors.primary.main, icono: <BusinessIcon />, subtitulo: 'Asociaciones registradas' },
                    { titulo: 'Asociaciones Activas', valor: asociacionesActivas, color: colors.secondary.main, icono: <CheckCircleIcon />, subtitulo: 'En operación' },
                    { titulo: 'Asociaciones Inactivas', valor: asociaciones.length - asociacionesActivas, color: colors.semaforo.rojo, icono: <BlockIcon />, subtitulo: 'Deshabilitadas' },
                    { titulo: 'Regiones con Asoc.', valor: regionesConAsoc, color: colors.accents.blue, icono: <LocationOnIcon />, subtitulo: 'Regiones representadas' }
                ];
            }
            case 4:
                return [
                    { titulo: 'Agentes Pendientes', valor: 0, color: colors.primary.main, icono: <PendingActionsIcon />, subtitulo: 'Esperando validación' },
                    { titulo: 'Por Revisar', valor: 0, color: colors.semaforo.amarillo, icono: <AssignmentIcon />, subtitulo: 'Documentos pendientes' },
                    { titulo: 'Urgentes', valor: 0, color: colors.semaforo.rojo, icono: <WarningIcon />, subtitulo: 'Alta prioridad' },
                    { titulo: 'Asignados', valor: 0, color: colors.secondary.main, icono: <AssignmentIndIcon />, subtitulo: 'Evaluadores asignados' }
                ];
            case 5: {
                const nivelesActivos = niveles.filter(n => n.activo).length;
                return [
                    { titulo: 'Total Niveles', valor: niveles.length, color: colors.primary.main, icono: <EmojiEventsIcon />, subtitulo: 'Niveles registrados' },
                    { titulo: 'Niveles Activos', valor: nivelesActivos, color: colors.secondary.main, icono: <CheckCircleIcon />, subtitulo: 'En uso' },
                    { titulo: 'Niveles Inactivos', valor: niveles.length - nivelesActivos, color: colors.semaforo.rojo, icono: <BlockIcon />, subtitulo: 'Deshabilitados' },
                    { titulo: 'Instancia', valor: user?.instanciaNombre || `ID: ${user?.instanciaId}`, color: colors.accents.blue, icono: <AssignmentIndIcon />, subtitulo: 'Instancia actual' }
                ];
            }
            default: return [];
        }
    };

    const tabs = [
        { label: 'Roles', icon: <HowToRegIcon /> },
        { label: 'Regiones', icon: <PublicIcon /> },
        { label: 'Comité', icon: <SecurityIcon /> },
        { label: 'Asociaciones', icon: <BusinessIcon /> },
        { label: 'Agentes Pendientes', icon: <PendingActionsIcon /> },
        { label: 'Niveles Reconocimiento', icon: <EmojiEventsIcon /> }
    ];

    const resumenCards = getResumenCards();

    // ══════════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════════
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* ── Header fijo ── */}
            <Box sx={{ flexShrink: 0, bgcolor: 'white', borderBottom: '1px solid #e0e0e0', px: 3, pt: 2, pb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                        <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
                            Configuración del Sistema
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {tabs[activeTab]?.label} — Configure los parámetros globales del sistema SICAG
                        </Typography>
                        {user && (
                            <Typography variant="caption" sx={{ color: colors.accents.blue, display: 'block', mt: 0.5 }}>
                                Instancia: {user.instanciaNombre || `ID: ${user.instanciaId}`}
                            </Typography>
                        )}
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="outlined" size="small"
                            startIcon={showCards ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            onClick={() => setShowCards(!showCards)}
                            sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
                        >
                            {showCards ? 'Ocultar Resumen' : 'Mostrar Resumen'}
                        </Button>
                    </Stack>
                </Box>

                {showCards && (
                    <Box sx={{
                        display: 'grid', gap: 1.5,
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        '@media (max-width: 1200px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
                        '@media (max-width: 600px)': { gridTemplateColumns: '1fr' }
                    }}>
                        {resumenCards.map((card, index) => (
                            <Card key={index} sx={{ borderLeft: `4px solid ${card.color}` }}>
                                <CardContent sx={{ p: '12px 16px !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: card.color, fontWeight: 'bold', mb: 0.5 }}>{card.valor}</Typography>
                                            <Typography variant="body2" sx={{ color: colors.text.secondary }}>{card.titulo}</Typography>
                                            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 0.5 }}>{card.subtitulo}</Typography>
                                        </Box>
                                        <Box sx={{ bgcolor: `${card.color}20`, borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {React.cloneElement(card.icono, { sx: { color: card.color, fontSize: 24 } })}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>

            {/* ── Área de contenido ── */}
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', p: 2, minHeight: 0 }}>
                <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2, minWidth: 0 }}>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', flexShrink: 0 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    color: colors.text.secondary, minHeight: 48, textTransform: 'none', fontSize: '0.85rem', flex: 1, maxWidth: 'none',
                                    '&.Mui-selected': { color: colors.primary.main, fontWeight: 'bold' }
                                },
                                '& .MuiTabs-indicator': { backgroundColor: colors.primary.main, height: 3 }
                            }}
                        >
                            {tabs.map((tab, i) => (
                                <Tab key={i} icon={tab.icon} iconPosition="start" label={tab.label} />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Contenido de tabs */}
                    <Box sx={{ flex: 1, overflow: 'auto', p: 2.5, bgcolor: '#fafafa', minHeight: 0 }}>

                        {/* TAB 0: Roles */}
                        {activeTab === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={rolFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setRolFilter(f)} clickable size="small"
                                                sx={rolFilter === f
                                                    ? { bgcolor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: 'white', cursor: 'pointer' }
                                                    : { borderColor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total: {filteredRoles.length}</Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Activos: {roles.filter(r => r.activo).length}</Typography>
                                    </Box>
                                </Box>
                                <TextField
                                    placeholder="Buscar rol por nombre..."
                                    value={searchRoles} onChange={e => setSearchRoles(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.primary.main }} /></InputAdornment>,
                                        endAdornment: searchRoles && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchRoles('')}><CloseIcon fontSize="small" sx={{ color: colors.primary.main }} /></IconButton></InputAdornment>
                                    }}
                                    size="small" sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
                                />
                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '30%' }}>Nombre del Rol</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '50%' }}>Descripción</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '15%' }} align="center">Estatus</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingRoles ? (
                                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress size={30} sx={{ color: colors.primary.main }} /></TableCell></TableRow>
                                            ) : errorRoles ? (
                                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>{errorRoles}</Typography></TableCell></TableRow>
                                            ) : filteredRoles.length === 0 ? (
                                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.text.secondary }}>No se encontraron roles</Typography></TableCell></TableRow>
                                            ) : filteredRoles.map(rol => (
                                                <TableRow key={rol.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' }, opacity: !rol.activo ? 0.7 : 1, backgroundColor: !rol.activo ? '#fff5f5' : 'inherit' }}>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{rol.id}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>{rol.nombre}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{rol.descripcion || 'Sin descripción'}</Typography></TableCell>
                                                    <TableCell align="center"><Chip label={rol.activo ? 'ACTIVO' : 'INACTIVO'} size="small" sx={{ bgcolor: rol.activo ? colors.secondary.main : colors.primary.dark, color: 'white', fontWeight: 600, minWidth: 80 }} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 1: Regiones */}
                        {activeTab === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={regionFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setRegionFilter(f)} clickable size="small"
                                                sx={regionFilter === f
                                                    ? { bgcolor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: 'white', cursor: 'pointer' }
                                                    : { borderColor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total: {filteredRegiones.length}</Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Activas: {regionesList.filter(r => r.activa).length}</Typography>
                                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenRegionDialog()} size="small" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
                                            Nueva Región
                                        </Button>
                                    </Box>
                                </Box>
                                <TextField
                                    placeholder="Buscar región por nombre, país o estado..."
                                    value={searchRegiones} onChange={e => setSearchRegiones(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.primary.main }} /></InputAdornment>,
                                        endAdornment: searchRegiones && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchRegiones('')}><CloseIcon fontSize="small" sx={{ color: colors.primary.main }} /></IconButton></InputAdornment>
                                    }}
                                    size="small" sx={{ maxWidth: 500, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
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
                                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><CircularProgress size={30} sx={{ color: colors.primary.main }} /></TableCell></TableRow>
                                            ) : errorRegiones ? (
                                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>{errorRegiones}</Typography></TableCell></TableRow>
                                            ) : filteredRegiones.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.text.secondary }}>No se encontraron regiones</Typography></TableCell></TableRow>
                                            ) : filteredRegiones.map(region => (
                                                <TableRow key={region.idRegion} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' }, opacity: !region.activa ? 0.7 : 1, backgroundColor: !region.activa ? '#fff5f5' : 'inherit' }}>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{region.idRegion}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>{region.nombre}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{region.pais || 'No especificado'}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{region.estado || 'No especificado'}</Typography></TableCell>
                                                    <TableCell align="center"><Chip label={region.activa ? 'ACTIVA' : 'INACTIVA'} size="small" sx={{ bgcolor: region.activa ? colors.secondary.main : colors.primary.dark, color: 'white', fontWeight: 600, minWidth: 80 }} /></TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                                            <Tooltip title="Editar región">
                                                                <IconButton size="small" sx={{ color: colors.accents.blue }} onClick={() => handleOpenRegionDialog(region)} disabled={togglingRegion === region.idRegion}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={region.activa ? 'Desactivar' : 'Activar'}>
                                                                <IconButton size="small" sx={{ color: region.activa ? colors.semaforo.rojo : colors.secondary.main }} onClick={() => handleToggleRegionStatus(region.idRegion)} disabled={togglingRegion === region.idRegion}>
                                                                    {togglingRegion === region.idRegion ? <CircularProgress size={16} /> : region.activa ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 2: Comité */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: colors.text.secondary }}>Módulo de Comité</Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>Contenido en desarrollo</Typography>
                            </Box>
                        )}

                        {/* TAB 3: Asociaciones */}
                        {activeTab === 3 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={asociacionFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setAsociacionFilter(f)} clickable size="small"
                                                sx={asociacionFilter === f
                                                    ? { bgcolor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: 'white', cursor: 'pointer' }
                                                    : { borderColor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total: {filteredAsociaciones.length}</Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Activas: {asociaciones.filter(a => a.activa).length}</Typography>
                                        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setUsuarioAsociacionDialogOpen(true)} size="small" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, fontWeight: 600 }}>
                                            Nueva Asociación
                                        </Button>
                                    </Box>
                                </Box>
                                <TextField
                                    placeholder="Buscar por nombre, código, representante o región..."
                                    value={searchAsociaciones} onChange={e => setSearchAsociaciones(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.primary.main }} /></InputAdornment>,
                                        endAdornment: searchAsociaciones && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchAsociaciones('')}><CloseIcon fontSize="small" sx={{ color: colors.primary.main }} /></IconButton></InputAdornment>
                                    }}
                                    size="small" sx={{ maxWidth: 500, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
                                />
                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '22%' }}>Asociación</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '10%' }}>Código</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '14%' }}>Región</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '17%' }}>Representante Legal</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '10%' }} align="center">Estatus</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '22%' }} align="center">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingAsociaciones ? (
                                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><CircularProgress size={30} sx={{ color: colors.primary.main }} /></TableCell></TableRow>
                                            ) : errorAsociaciones ? (
                                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>{errorAsociaciones}</Typography></TableCell></TableRow>
                                            ) : filteredAsociaciones.length === 0 ? (
                                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.text.secondary }}>No se encontraron asociaciones</Typography></TableCell></TableRow>
                                            ) : filteredAsociaciones.map(asoc => (
                                                <TableRow key={asoc.idAsociacion} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' }, opacity: !asoc.activa ? 0.7 : 1, backgroundColor: !asoc.activa ? '#fff5f5' : 'inherit' }}>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{asoc.idAsociacion}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>{asoc.nombre}</Typography></TableCell>
                                                    <TableCell>{asoc.codigo ? <Typography variant="body2" sx={{ color: colors.primary.dark }}>{asoc.codigo}</Typography> : <Typography variant="caption" sx={{ color: colors.text.secondary }}>-</Typography>}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <LocationOnIcon sx={{ fontSize: 14, color: colors.accents.blue }} />
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>{asoc.nombreRegion || 'No especificada'}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <PersonIcon sx={{ fontSize: 14, color: colors.accents.blue }} />
                                                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>{asoc.representanteLegal || 'No especificado'}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center"><Chip label={asoc.activa ? 'ACTIVA' : 'INACTIVA'} size="small" sx={{ bgcolor: asoc.activa ? colors.secondary.main : colors.primary.dark, color: 'white', fontWeight: 600, minWidth: 80 }} /></TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                                            <Tooltip title={asoc.activa ? 'Desactivar' : 'Activar'}>
                                                                <IconButton size="small" sx={{ color: asoc.activa ? colors.semaforo.rojo : colors.secondary.main }} onClick={() => handleToggleAsociacionStatus(asoc.idAsociacion)} disabled={togglingAsociacion === asoc.idAsociacion}>
                                                                    {togglingAsociacion === asoc.idAsociacion ? <CircularProgress size={16} /> : asoc.activa ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 4: Agentes Pendientes */}
                        {activeTab === 4 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: colors.text.secondary }}>Módulo de Agentes Pendientes</Typography>
                                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>Contenido en desarrollo</Typography>
                            </Box>
                        )}

                        {/* TAB 5: Niveles de Reconocimiento */}
                        {activeTab === 5 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Barra de controles */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['todos', 'activos', 'inactivos'].map(f => (
                                            <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                                                variant={nivelFilter === f ? 'filled' : 'outlined'}
                                                onClick={() => setNivelFilter(f)} clickable size="small"
                                                sx={nivelFilter === f
                                                    ? { bgcolor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: 'white', cursor: 'pointer' }
                                                    : { borderColor: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, color: f === 'activos' ? colors.secondary.main : f === 'inactivos' ? colors.primary.dark : colors.primary.main, cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total: {filteredNiveles.length}</Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Activos: {niveles.filter(n => n.activo).length}</Typography>
                                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateNivelOpen(true)} size="small"
                                            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
                                            Nuevo Nivel
                                        </Button>
                                    </Box>
                                </Box>

                                {/* Buscador */}
                                <TextField
                                    placeholder="Buscar nivel por nombre..."
                                    value={searchNiveles} onChange={e => setSearchNiveles(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.primary.main }} /></InputAdornment>,
                                        endAdornment: searchNiveles && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchNiveles('')}><CloseIcon fontSize="small" sx={{ color: colors.primary.main }} /></IconButton></InputAdornment>
                                    }}
                                    size="small" sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }}
                                />

                                {/* Tabla */}
                                <TableContainer sx={{ border: `1px solid ${colors.primary.light}`, borderRadius: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '5%' }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '8%' }} align="center">Nivel</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '27%' }}>Nombre</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '37%' }}>Descripción</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '10%' }} align="center">Estatus</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '13%' }} align="center">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loadingNiveles ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <CircularProgress size={30} sx={{ color: colors.primary.main }} />
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>Cargando niveles...</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : errorNiveles ? (
                                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.semaforo.rojo }}>{errorNiveles}</Typography></TableCell></TableRow>
                                            ) : filteredNiveles.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><Typography variant="body2" sx={{ color: colors.text.secondary }}>No se encontraron niveles de reconocimiento</Typography></TableCell></TableRow>
                                            ) : filteredNiveles.map(nivel => (
                                                <TableRow key={nivel.idNivel} hover
                                                    sx={{ '&:hover': { bgcolor: '#f8f9fa' }, opacity: !nivel.activo ? 0.7 : 1, backgroundColor: !nivel.activo ? '#fff5f5' : 'inherit' }}>
                                                    <TableCell><Typography variant="body2" sx={{ color: colors.primary.dark }}>{nivel.idNivel}</Typography></TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{
                                                            width: 32, height: 32, borderRadius: '50%',
                                                            bgcolor: colors.primary.main,
                                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>{nivel.nivel}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>{nivel.nombre}</Typography></TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: colors.primary.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                                                            {nivel.descripcion || <span style={{ color: '#9e9e9e', fontStyle: 'italic' }}>Sin descripción</span>}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={nivel.activo ? 'ACTIVO' : 'INACTIVO'} size="small"
                                                            sx={{ bgcolor: nivel.activo ? colors.secondary.main : colors.primary.dark, color: 'white', fontWeight: 600, minWidth: 80 }} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                                            <Tooltip title="Ver detalle">
                                                                <IconButton size="small" sx={{ color: colors.accents.blue }} onClick={() => handleOpenViewNivel(nivel)}>
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Editar">
                                                                <IconButton size="small" sx={{ color: colors.primary.light }} onClick={() => handleOpenEditNivel(nivel)} disabled={togglingNivel === nivel.idNivel}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={nivel.activo ? 'Desactivar' : 'Activar'}>
                                                                <IconButton size="small" sx={{ color: nivel.activo ? colors.semaforo.rojo : colors.secondary.main }} onClick={() => handleToggleNivelStatus(nivel.idNivel)} disabled={togglingNivel === nivel.idNivel}>
                                                                    {togglingNivel === nivel.idNivel ? <CircularProgress size={16} /> : nivel.activo ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* ════════════════════════════════════════
                DIÁLOGOS
            ════════════════════════════════════════ */}

            {/* ── Diálogo Roles ── */}
            <Dialog open={rolDialogOpen} onClose={handleCloseRolDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
                <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HowToRegIcon sx={{ color: colors.primary.main }} />
                        <Typography variant="h6" sx={{ color: colors.primary.dark }}>Editar Rol</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField fullWidth label="Nombre del Rol" value={rolForm.nombre} onChange={handleRolFormChange('nombre')} required error={nombreExists} helperText={nombreExists ? 'Este nombre ya existe' : checkingNombre ? 'Verificando...' : ''} size="small" sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }} />
                        <TextField fullWidth label="Descripción" value={rolForm.descripcion} onChange={handleRolFormChange('descripcion')} multiline rows={3} size="small" sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: colors.primary.main } } }} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                    <Button onClick={handleCloseRolDialog} sx={{ color: colors.text.secondary }} size="small">Cancelar</Button>
                    <Button onClick={handleSaveRol} variant="contained" disabled={!rolForm.nombre.trim() || nombreExists || checkingNombre} size="small" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>Actualizar</Button>
                </DialogActions>
            </Dialog>

            {/* ── Diálogos Niveles de Reconocimiento ── */}
            <CreateNivelDialog
                open={createNivelOpen}
                onClose={() => setCreateNivelOpen(false)}
                onSave={handleCreateNivel}
                saving={savingNivel}
            />
            <EditNivelDialog
                open={editNivelOpen}
                onClose={() => { setEditNivelOpen(false); setSelectedNivel(null); }}
                onSave={handleUpdateNivel}
                nivel={selectedNivel}
                saving={savingNivel}
            />
            <ViewNivelDialog
                open={viewNivelOpen}
                onClose={() => { setViewNivelOpen(false); setSelectedNivel(null); }}
                nivel={selectedNivel}
                onEdit={handleOpenEditNivel}
            />

            {/* ── Modal unificado: Nuevo Usuario Asociación ── */}
            <CreateUsuarioAsociacion
                open={usuarioAsociacionDialogOpen}
                onClose={() => setUsuarioAsociacionDialogOpen(false)}
                onComplete={handleUsuarioAsociacionComplete}
                availableRoles={roles.map(r => r.nombre)}
                availableRegions={regionesList.map(r => ({ id: r.idRegion, nombre: r.nombre }))}
                loadingRoles={loadingRoles}
                loadingRegions={loadingRegiones}
                instanciaId={user?.instanciaId}
            />

            {/* ── Diálogo para gestionar usuarios de asociación ── */}
            <AsigAsociacion
                open={usuariosAsociacionDialogOpen}
                onClose={handleCloseUsuariosAsociacionDialog}
                asociacion={selectedAsociacionForUsuarios}
                usuarios={usuariosAsociacion}
                loading={loadingUsuariosAsociacion}
                error={errorUsuariosAsociacion}
                onRelacionar={handleRelacionarUsuario}
                onDesvincular={handleDesvincularUsuario}
                actionLoading={actionLoading}
                desvinculandoUsuario={desvinculandoUsuario}
            />

            {/* ── Diálogos Región ── */}
            <CreateRegion open={regionDialogOpen && !editingRegion} onClose={handleCloseRegionDialog} onSave={handleSaveRegion} saving={savingRegion} />
            <EditRegion open={regionDialogOpen && !!editingRegion} onClose={handleCloseRegionDialog} onSave={handleSaveRegion} editingRegion={editingRegion} saving={savingRegion} />

            {/* ── Diálogo de Asignación ── */}
            <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
                <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIndIcon sx={{ color: colors.primary.main }} />
                        <Typography variant="h6" sx={{ color: colors.primary.dark }}>Asignar Evaluador</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedAgent && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: `1px solid ${colors.primary.light}` }}>
                                <Typography variant="subtitle2" sx={{ color: colors.primary.dark, mb: 1 }}>Agente Seleccionado:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: colors.primary.main, fontSize: '0.9rem' }}>AG</Avatar>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>{selectedAgent.nombre}</Typography>
                                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>{selectedAgent.documentos_pendientes} documentos pendientes · {selectedAgent.region}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ color: colors.text.secondary }}>Seleccionar Evaluador</InputLabel>
                                <Select value={selectedEvaluator} label="Seleccionar Evaluador" onChange={e => setSelectedEvaluator(e.target.value)} sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary.main } }}>
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
                    <Button onClick={() => setAssignDialogOpen(false)} sx={{ color: colors.text.secondary }} size="small">Cancelar</Button>
                    <Button onClick={handleConfirmAssignment} variant="contained" disabled={!selectedEvaluator} size="small" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>Asignar Evaluador</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{
                    width: '100%',
                    bgcolor: snack.severity === 'success' ? colors.secondary.main : snack.severity === 'error' ? colors.semaforo.rojo : snack.severity === 'warning' ? colors.semaforo.amarillo : colors.accents.blue
                }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SystemConfig;