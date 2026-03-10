// src/pages/admin/ConfigDeclaraciones.jsx  —  VERSIÓN FINAL
import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Paper, Typography, Card, CardContent, Button, Chip,
    IconButton, List, ListItem, ListItemIcon, Tooltip, Fade,
    CircularProgress, Alert, Snackbar, Avatar, Badge, Zoom,
    Grid, TextField, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Switch, Tabs, Tab, InputAdornment,
} from "@mui/material";
import {
    Add as AddIcon, Edit as EditIcon,
    Assignment as AssignmentIcon, Refresh as RefreshIcon,
    CheckCircle as CheckCircleIcon, Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon, Business as BusinessIcon,
    Event as EventIcon, Search as SearchIcon, Cancel as CancelIcon,
    Label as LabelIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

import { useAuth } from "../../context/AuthContext";
import declaracionesService from "../../services/declaracion";
import { institutionalColors } from "../../utils/iconosUtils";

import CreateDeclaracionDialog from "../../components/declaracionesAdmin/CreateDeclaracionDialog";
import EditDeclaracionDialog   from "../../components/declaracionesAdmin/EditDeclaracionDialog";
import ViewDeclaracionDialog   from "../../components/declaracionesAdmin/ViewDeclaracionDialog";

// ─── Helpers de color ────────────────────────────────────────────────────────
const COLOR_PALETTE = [
    "#133B6B", "#00A8A8", "#E67E22", "#2980B9",
    "#8E44AD", "#27AE60", "#C0392B", "#16A085",
];
const hashColor = (str) => {
    if (!str) return COLOR_PALETTE[0];
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return COLOR_PALETTE[Math.abs(h) % COLOR_PALETTE.length];
};

const enrichDeclaracion = (decl) => ({
    ...decl,
    activa: Boolean(decl.activa !== undefined && decl.activa !== null ? decl.activa : true),
    color:  hashColor(decl.tipo),
});

// ─── Componente ───────────────────────────────────────────────────────────────
const ConfigDeclaraciones = () => {
    const { user } = useAuth();

    const [declaraciones,     setDeclaraciones]     = useState([]);
    const [loading,           setLoading]           = useState(true);
    const [error,             setError]             = useState(null);
    const [snackbar,          setSnackbar]          = useState({ open: false, message: "", severity: "success" });
    const [searchTerm,        setSearchTerm]        = useState("");
    const [selectedTab,       setSelectedTab]       = useState("all");
    const [openCreateDialog,  setOpenCreateDialog]  = useState(false);
    const [openEditDialog,    setOpenEditDialog]    = useState(false);
    const [openViewDialog,    setOpenViewDialog]    = useState(false);
    const [currentDeclaracion, setCurrentDeclaracion] = useState(null);
    const [toggleDialog, setToggleDialog] = useState({
        open: false, declaracion: null, nuevoEstado: false, loading: false,
    });

    // ─── DEBUG: loguear user para verificar instanciaId ──────────────────────
    useEffect(() => {
        console.log('[ConfigDeclaraciones] user:', user);
        console.log('[ConfigDeclaraciones] user.instanciaId:', user?.instanciaId, typeof user?.instanciaId);
    }, [user]);

    // ─── Permisos ─────────────────────────────────────────────────────────────
    /**
     * FIX BOTONES:
     * El backend ahora siempre devuelve idInstancia correcto (desde instancia.getId()).
     * El service normaliza a Number.
     * Aquí comparamos ambos como Number para cubrir cualquier tipo residual.
     *
     * Si los botones siguen sin aparecer, revisar en consola:
     *   declaracion.idInstancia vs user.instanciaId
     */
    const canModifyDeclaracion = (declaracion) => {
        if (!user || !declaracion) return false;
        const declId = Number(declaracion.idInstancia);
        const userId = Number(user.instanciaId);
        if (isNaN(declId) || isNaN(userId)) {
            console.warn('[canModifyDeclaracion] NaN detectado:', { declId, userId, declaracion });
            return false;
        }
        const result = declId === userId;
        console.debug(`[canModifyDeclaracion] decl=${declaracion.idDeclaracion} declInstancia=${declId} userInstancia=${userId} => ${result}`);
        return result;
    };

    // ─── Carga de datos ───────────────────────────────────────────────────────
    useEffect(() => { cargarDeclaraciones(); }, []);

    const cargarDeclaraciones = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!user?.instanciaId) {
                setError("No se pudo determinar la instancia del usuario");
                return;
            }
            const todas = await declaracionesService.findAll();
            console.log('[cargarDeclaraciones] Total recibidas:', todas.length);
            console.log('[cargarDeclaraciones] Primeras 3:', todas.slice(0, 3));

            const mias = todas
                .filter(d => {
                    const match = Number(d.idInstancia) === Number(user.instanciaId);
                    if (!match) console.debug(`[filtro] descartando decl ${d.idDeclaracion}: idInstancia=${d.idInstancia} !== ${user.instanciaId}`);
                    return match;
                })
                .map(enrichDeclaracion)
                .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));

            console.log('[cargarDeclaraciones] Declaraciones de mi instancia:', mias.length);
            setDeclaraciones(mias);
        } catch (err) {
            console.error("Error cargando declaraciones:", err);
            setError("Error al cargar las declaraciones.");
            showSnackbar("Error al cargar datos", "error");
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = "success") =>
        setSnackbar({ open: true, message, severity });

    // ─── Stats & Tabs ─────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const activas = declaraciones.filter(d => d.activa === true).length;
        const porTipo = {};
        declaraciones.forEach(d => {
            const k = d.tipo || "Sin tipo";
            porTipo[k] = (porTipo[k] || 0) + 1;
        });
        return { total: declaraciones.length, activas, inactivas: declaraciones.length - activas, porTipo };
    }, [declaraciones]);

    const tabs = useMemo(() => {
        const tiposUnicos = [...new Set(declaraciones.map(d => d.tipo || "Sin tipo"))].sort();
        return [
            { value: "all",       label: `Todas (${stats.total})`,         icon: <AssignmentIcon   fontSize="small" /> },
            { value: "activas",   label: `Activas (${stats.activas})`,     icon: <CheckCircleIcon  fontSize="small" /> },
            { value: "inactivas", label: `Inactivas (${stats.inactivas})`, icon: <VisibilityOffIcon fontSize="small" /> },
            ...tiposUnicos.map(tipo => ({
                value: tipo,
                label: `${tipo} (${stats.porTipo[tipo] || 0})`,
                icon:  <LabelIcon fontSize="small" />,
            })),
        ];
    }, [declaraciones, stats]);

    // ─── Filtrado ─────────────────────────────────────────────────────────────
    const declaracionesFiltradas = useMemo(() => {
        return declaraciones.filter(d => {
            const matchTab =
                selectedTab === "all"       ? true :
                selectedTab === "activas"   ? d.activa === true :
                selectedTab === "inactivas" ? d.activa === false :
                (d.tipo || "Sin tipo")     === selectedTab;
            const term = searchTerm.toLowerCase();
            const matchSearch = !searchTerm ||
                (d.nombre             || "").toLowerCase().includes(term) ||
                (d.tipo               || "").toLowerCase().includes(term) ||
                (d.descripcion        || "").toLowerCase().includes(term) ||
                (d.articuloReferencia || "").toLowerCase().includes(term);
            return matchTab && matchSearch;
        });
    }, [declaraciones, selectedTab, searchTerm]);

    // ─── CRUD callbacks ───────────────────────────────────────────────────────
    const handleCreateSuccess = (nueva) => {
        console.log('[handleCreateSuccess] Nueva declaración recibida:', nueva);
        const completa = enrichDeclaracion(nueva);
        console.log('[handleCreateSuccess] Enriquecida:', completa);
        console.log('[handleCreateSuccess] canModify:', canModifyDeclaracion(completa));
        setDeclaraciones(prev =>
            [...prev, completa].sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
        );
        setOpenCreateDialog(false);
        showSnackbar("Declaración creada exitosamente");
    };

    const handleUpdateSuccess = (actualizada) => {
        const completa = enrichDeclaracion(actualizada);
        setDeclaraciones(prev =>
            prev.map(d => d.idDeclaracion === completa.idDeclaracion ? completa : d)
                .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
        );
        setCurrentDeclaracion(completa);
        setOpenEditDialog(false);
        showSnackbar("Declaración actualizada exitosamente");
    };

    // ─── Toggle activa/inactiva ───────────────────────────────────────────────
    const handleToggleClick = (declaracion) => {
        setToggleDialog({
            open: true,
            declaracion,
            nuevoEstado: !declaracion.activa,
            loading: false,
        });
    };

    const handleToggleClose = () => {
        if (toggleDialog.loading) return;
        setToggleDialog({ open: false, declaracion: null, nuevoEstado: false, loading: false });
    };

    /**
     * FIX TOGGLE:
     * 1. Actualización OPTIMISTA — el estado local cambia antes de esperar al backend.
     * 2. Llamada al backend (que con el fix de DeclaracionServiceImpl ya funciona).
     * 3. Si el backend devuelve datos, actualizamos con la respuesta real.
     * 4. Si hay error, revertimos el estado optimista.
     */
    const handleToggleConfirm = async () => {
        const { declaracion, nuevoEstado } = toggleDialog;
        if (!declaracion) return;

        setToggleDialog(prev => ({ ...prev, loading: true }));

        // 1. Actualización optimista
        const optimista = enrichDeclaracion({ ...declaracion, activa: nuevoEstado });
        setDeclaraciones(prev =>
            prev.map(d => d.idDeclaracion === declaracion.idDeclaracion ? optimista : d)
        );
        setCurrentDeclaracion(prev =>
            prev?.idDeclaracion === declaracion.idDeclaracion ? optimista : prev
        );

        try {
            // 2. Llamada al backend
            const respuesta = await declaracionesService.setActiva(declaracion.idDeclaracion, nuevoEstado);
            console.log('[handleToggleConfirm] Respuesta del backend:', respuesta);

            if (respuesta) {
                // 3. Actualizar con datos reales del backend, forzando nuevoEstado
                // por si el backend devuelve el valor con algún delay
                const final = enrichDeclaracion({ ...optimista, ...respuesta, activa: nuevoEstado });
                setDeclaraciones(prev =>
                    prev.map(d => d.idDeclaracion === final.idDeclaracion ? final : d)
                );
                setCurrentDeclaracion(prev =>
                    prev?.idDeclaracion === final.idDeclaracion ? final : prev
                );
            }

            showSnackbar(nuevoEstado ? "Declaración activada exitosamente" : "Declaración desactivada exitosamente");
        } catch (err) {
            console.error('[handleToggleConfirm] Error:', err);
            // 4. Revertir estado optimista
            setDeclaraciones(prev =>
                prev.map(d => d.idDeclaracion === declaracion.idDeclaracion
                    ? enrichDeclaracion(declaracion) : d)
            );
            setCurrentDeclaracion(prev =>
                prev?.idDeclaracion === declaracion.idDeclaracion
                    ? enrichDeclaracion(declaracion) : prev
            );
            showSnackbar("Error al cambiar el estado de la declaración", "error");
        } finally {
            setToggleDialog({ open: false, declaracion: null, nuevoEstado: false, loading: false });
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" color="textSecondary">Cargando declaraciones...</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: institutionalColors.background }}>

            {/* ── Header ── */}
            <Box sx={{ mb: 2, p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ color: institutionalColors.primary, fontWeight: "bold", mb: 0.5 }}>
                            Configuración de Declaraciones
                        </Typography>
                        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                            Panel de Administración — Gestión de declaraciones de tu instancia
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            <Chip
                                icon={<BusinessIcon />}
                                label={`${user?.instanciaNombre || "Mi Instancia"} (ID: ${user?.instanciaId})`}
                                size="small"
                                sx={{ bgcolor: institutionalColors.primary, color: "white", fontWeight: "bold" }}
                            />
                            <Tooltip title="Recargar datos">
                                <IconButton size="small" onClick={cargarDeclaraciones} sx={{ color: institutionalColors.primary }}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Button
                        variant="contained" startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                        sx={{ bgcolor: institutionalColors.primary, "&:hover": { bgcolor: institutionalColors.secondary } }}
                    >
                        Nueva Declaración
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Stats cards */}
                <Box sx={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3,
                    "@media (max-width: 1100px)": { gridTemplateColumns: "repeat(2, 1fr)" },
                    "@media (max-width: 600px)":  { gridTemplateColumns: "1fr" },
                }}>
                    {[
                        { color: institutionalColors.primary,  icon: <AssignmentIcon />,   label: "Total Declaraciones",    value: stats.total,    sub: `${stats.activas} activas, ${stats.inactivas} inactivas` },
                        { color: institutionalColors.success,  icon: <CheckCircleIcon />,  label: "Declaraciones Activas",  value: stats.activas,  sub: `${((stats.activas   / (stats.total || 1)) * 100).toFixed(1)}% del total` },
                        { color: institutionalColors.error,    icon: <VisibilityOffIcon />,label: "Declaraciones Inactivas",value: stats.inactivas,sub: `${((stats.inactivas / (stats.total || 1)) * 100).toFixed(1)}% del total` },
                        { color: institutionalColors.info,     icon: <EventIcon />,        label: "Tipos distintos",        value: Object.keys(stats.porTipo).length, sub: Object.entries(stats.porTipo).map(([t, c]) => `${t}: ${c}`).join(", ") },
                    ].map(({ color, icon, label, value, sub }) => (
                        <Card key={label} sx={{ borderLeft: `4px solid ${color}`, height: 120, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                            <CardContent sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{ color }}>{icon}</Box>
                                        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, fontWeight: 500, fontSize: "0.75rem", lineHeight: 1.2 }}>
                                            {label}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" sx={{ color: institutionalColors.textPrimary, fontWeight: "bold", fontSize: "1.5rem", lineHeight: 1 }}>
                                        {value}
                                    </Typography>
                                </Box>
                                {sub && (
                                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, fontSize: "0.7rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {sub}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Búsqueda */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                    <TextField
                        fullWidth size="small"
                        placeholder="Buscar por nombre, tipo, descripción o artículo..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: institutionalColors.primary }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                                        <CancelIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>
            </Box>

            {/* ── Panel principal ── */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, px: 3, pb: 3 }}>
                <Paper elevation={3} sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 3 }}>

                    {/* Header + Tabs */}
                    <Box sx={{ px: 2.5, pt: 1, borderBottom: `1px solid ${alpha(institutionalColors.primary, 0.1)}`, bgcolor: "#fff" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="h6" sx={{ color: institutionalColors.primary, fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                <AssignmentIcon /> Declaraciones de mi Instancia
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {declaracionesFiltradas.length} declaraciones encontradas
                            </Typography>
                        </Box>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, v) => setSelectedTab(v)}
                            variant="scrollable" scrollButtons="auto"
                            sx={{
                                "& .MuiTab-root": { color: institutionalColors.textSecondary, "&.Mui-selected": { color: institutionalColors.primary }, minHeight: 44, textTransform: "none", fontSize: "0.82rem" },
                                "& .MuiTabs-indicator": { backgroundColor: institutionalColors.primary },
                            }}
                        >
                            {tabs.map(tab => (
                                <Tab key={tab.value} value={tab.value} icon={tab.icon} iconPosition="start" label={tab.label} sx={{ minHeight: 44 }} />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Lista */}
                    <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, bgcolor: institutionalColors.background }}>
                        {declaraciones.length === 0 ? (
                            <Fade in>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", p: 4 }}>
                                    <Avatar sx={{ width: 120, height: 120, bgcolor: alpha(institutionalColors.primary, 0.1), color: institutionalColors.primary, mb: 3 }}>
                                        <BusinessIcon sx={{ fontSize: 60 }} />
                                    </Avatar>
                                    <Typography variant="h5" sx={{ color: institutionalColors.textPrimary, mb: 1, fontWeight: "bold" }}>No hay declaraciones configuradas</Typography>
                                    <Typography variant="body1" sx={{ color: institutionalColors.textSecondary, mb: 3, textAlign: "center" }}>Comience creando una nueva declaración para su instancia</Typography>
                                    <Button variant="contained" size="large" startIcon={<AddIcon />}
                                        onClick={() => setOpenCreateDialog(true)}
                                        sx={{ bgcolor: institutionalColors.primary, "&:hover": { bgcolor: institutionalColors.secondary } }}>
                                        Crear primera declaración
                                    </Button>
                                </Box>
                            </Fade>
                        ) : declaracionesFiltradas.length === 0 ? (
                            <Fade in>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", p: 4 }}>
                                    <Avatar sx={{ width: 100, height: 100, bgcolor: alpha(institutionalColors.warning, 0.1), color: institutionalColors.warning, mb: 3 }}>
                                        <SearchIcon sx={{ fontSize: 50 }} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ color: institutionalColors.textPrimary, mb: 1, fontWeight: "bold" }}>No hay resultados para este filtro</Typography>
                                    <Button variant="outlined" size="small"
                                        onClick={() => { setSelectedTab("all"); setSearchTerm(""); }}
                                        sx={{ color: institutionalColors.primary, borderColor: institutionalColors.primary }}>
                                        Limpiar filtros
                                    </Button>
                                </Box>
                            </Fade>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {declaracionesFiltradas.map((declaracion, index) => {
                                    const puedeModificar = canModifyDeclaracion(declaracion);
                                    const tipoColor      = declaracion.color;

                                    return (
                                        <Fade key={declaracion.idDeclaracion} in style={{ transitionDelay: `${index * 40}ms` }}>
                                            <ListItem sx={{
                                                p: 2.5, mb: 2, borderRadius: 2, bgcolor: "#fff",
                                                border: `1px solid ${alpha(institutionalColors.primary, 0.1)}`,
                                                borderLeft: `4px solid ${tipoColor}`,
                                                alignItems: "flex-start", transition: "all 0.2s",
                                                "&:hover": { transform: "translateX(4px)", boxShadow: 3 },
                                            }}>
                                                <ListItemIcon sx={{ minWidth: 56, mt: 0.5 }}>
                                                    <Badge
                                                        color={declaracion.activa === true ? "success" : "error"}
                                                        variant="dot" overlap="circular"
                                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    >
                                                        <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(tipoColor, 0.1), color: tipoColor }}>
                                                            <AssignmentIcon />
                                                        </Avatar>
                                                    </Badge>
                                                </ListItemIcon>

                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: "bold", color: institutionalColors.textPrimary, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                                            onClick={() => { setCurrentDeclaracion(declaracion); setOpenViewDialog(true); }}
                                                        >
                                                            {declaracion.nombre}
                                                        </Typography>
                                                        {declaracion.tipo && (
                                                            <Chip size="small" label={declaracion.tipo}
                                                                sx={{ height: 24, bgcolor: alpha(tipoColor, 0.12), color: tipoColor, fontWeight: "medium" }} />
                                                        )}
                                                        <Chip size="small"
                                                            label={declaracion.activa === true ? "Activa" : "Inactiva"}
                                                            color={declaracion.activa === true ? "success" : "error"}
                                                            variant="outlined"
                                                            sx={{ height: 22, fontSize: "0.7rem" }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mb: 2 }}>
                                                        {declaracion.descripcion || "Sin descripción"}
                                                    </Typography>
                                                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                                        <Grid item xs={12} md={6}>
                                                            <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(institutionalColors.primary, 0.03) }}>
                                                                <Typography variant="caption" color="textSecondary" display="block">Artículo de referencia</Typography>
                                                                <Typography variant="body2" fontWeight="medium">{declaracion.articuloReferencia || "No especificado"}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(institutionalColors.info, 0.03) }}>
                                                                <Typography variant="caption" color="textSecondary" display="block">Vigencia</Typography>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    {declaracion.vigenciaDias ? `${declaracion.vigenciaDias} días` : "No definida"}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                                {/* Botones de acción */}
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2, flexShrink: 0 }}>
                                                    <Tooltip title="Ver detalles">
                                                        <IconButton size="small"
                                                            onClick={e => { e.stopPropagation(); setCurrentDeclaracion(declaracion); setOpenViewDialog(true); }}
                                                            sx={{ color: institutionalColors.info, "&:hover": { bgcolor: alpha(institutionalColors.info, 0.1) } }}>
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {puedeModificar && (
                                                        <>
                                                            <Tooltip title="Editar">
                                                                <IconButton size="small"
                                                                    onClick={e => { e.stopPropagation(); setCurrentDeclaracion(declaracion); setOpenEditDialog(true); }}
                                                                    sx={{ color: institutionalColors.primary, "&:hover": { bgcolor: alpha(institutionalColors.primary, 0.1) } }}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={declaracion.activa === true ? "Desactivar" : "Activar"}>
                                                                <Switch
                                                                    checked={declaracion.activa === true}
                                                                    onChange={e => { e.stopPropagation(); handleToggleClick(declaracion); }}
                                                                    size="small"
                                                                    sx={{
                                                                        "& .MuiSwitch-switchBase.Mui-checked": { color: institutionalColors.success },
                                                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: institutionalColors.success },
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Box>
                                            </ListItem>
                                        </Fade>
                                    );
                                })}
                            </List>
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* ── Diálogos CRUD ── */}
            <CreateDeclaracionDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onSuccess={handleCreateSuccess}
                instanciaId={user?.instanciaId}
            />
            <EditDeclaracionDialog
                open={openEditDialog}
                onClose={() => { setOpenEditDialog(false); setCurrentDeclaracion(null); }}
                onSuccess={handleUpdateSuccess}
                declaracion={currentDeclaracion}
            />
            <ViewDeclaracionDialog
                open={openViewDialog}
                onClose={() => { setOpenViewDialog(false); setCurrentDeclaracion(null); }}
                declaracion={currentDeclaracion}
                onEdit={() => { setOpenViewDialog(false); setOpenEditDialog(true); }}
            />

            {/* ── Diálogo confirmación toggle ── */}
            <Dialog open={toggleDialog.open} onClose={handleToggleClose}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {toggleDialog.nuevoEstado
                            ? <CheckCircleIcon sx={{ color: institutionalColors.success }} />
                            : <VisibilityOffIcon sx={{ color: institutionalColors.error }} />
                        }
                        <Typography variant="h6">
                            {toggleDialog.nuevoEstado ? "Activar Declaración" : "Desactivar Declaración"}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea {toggleDialog.nuevoEstado ? "activar" : "desactivar"} la declaración{" "}
                        <strong>"{toggleDialog.declaracion?.nombre}"</strong>?
                        {!toggleDialog.nuevoEstado && (
                            <Box component="span" display="block" sx={{ mt: 1, color: institutionalColors.warning }}>
                                Nota: Las declaraciones inactivas no estarán disponibles para nuevos registros.
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button onClick={handleToggleClose} variant="outlined"
                        disabled={toggleDialog.loading}
                        sx={{ color: institutionalColors.textSecondary }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleToggleConfirm} variant="contained" autoFocus
                        disabled={toggleDialog.loading}
                        startIcon={toggleDialog.loading ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{
                            bgcolor: toggleDialog.nuevoEstado ? institutionalColors.success : institutionalColors.error,
                            "&:hover": { bgcolor: toggleDialog.nuevoEstado ? institutionalColors.success : institutionalColors.error },
                        }}>
                        {toggleDialog.loading ? "Procesando..." : "Confirmar"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000}
                onClose={() => setSnackbar(p => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                TransitionComponent={Zoom}>
                <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))}
                    severity={snackbar.severity} elevation={6} variant="filled"
                    sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ConfigDeclaraciones;