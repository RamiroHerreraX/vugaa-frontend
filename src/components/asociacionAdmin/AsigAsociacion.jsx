import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    Button,
    Chip,
    Tooltip
} from '@mui/material';
import {
    Close as CloseIcon,
    Search as SearchIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    CheckCircle as CheckCircleIcon,
    PersonAdd as PersonAddIcon,
    Error as ErrorIcon
} from '@mui/icons-material';

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
    },
    semaforo: {
        rojo: '#D32F2F'
    }
};

const AsigAsociacion = ({
    open,
    onClose,
    asociacion,
    usuarios = [],
    loading = false,
    error = null,
    onRelacionar,
    actionLoading = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (usuario.nombre?.toLowerCase() || '').includes(searchLower) ||
            (usuario.email?.toLowerCase() || '').includes(searchLower) ||
            (usuario.rol?.toLowerCase() || '').includes(searchLower)
        );
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2, minHeight: '60vh', maxHeight: '80vh' } }}
        >
            <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}`, bgcolor: colors.primary.dark, color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon />
                        <Typography variant="h6">
                            {asociacion ? `Gestionar Usuarios - ${asociacion.nombre}` : 'Gestionar Usuarios de Asociación'}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {asociacion && (
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: `1px solid ${colors.primary.light}` }}>
                        <Typography variant="subtitle2" sx={{ color: colors.primary.dark, mb: 0.5 }}>
                            Asociación: <strong>{asociacion.nombre}</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            ID: {asociacion.idAsociacion} • Código: {asociacion.codigo || 'N/A'} • 
                            Región: {asociacion.nombreRegion}
                        </Typography>
                    </Box>
                )}
                
                <Box sx={{ p: 2, borderBottom: `1px solid ${colors.primary.light}` }}>
                    <TextField
                        fullWidth
                        placeholder="Buscar usuario por nombre, email o rol..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: colors.primary.main }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                                        <CloseIcon fontSize="small" sx={{ color: colors.primary.main }} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={40} sx={{ color: colors.primary.main, mb: 2 }} />
                            <Typography variant="body2" sx={{ color: colors.text.secondary }}>Cargando usuarios...</Typography>
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <ErrorIcon sx={{ fontSize: 48, color: colors.semaforo.rojo, mb: 2 }} />
                            <Typography variant="body1" sx={{ color: colors.semaforo.rojo, mb: 1 }}>Error al cargar usuarios</Typography>
                            <Typography variant="body2" sx={{ color: colors.text.secondary }}>{error}</Typography>
                        </Box>
                    ) : filteredUsuarios.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <PersonIcon sx={{ fontSize: 48, color: colors.primary.light, mb: 2 }} />
                            <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 1 }}>
                                {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios disponibles'}
                            </Typography>
                            {searchTerm && (
                                <Button variant="text" onClick={() => setSearchTerm('')} sx={{ color: colors.primary.main }}>
                                    Limpiar búsqueda
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {filteredUsuarios.map((usuario, index) => (
                                <React.Fragment key={usuario.id || index}>
                                    {index > 0 && <Divider variant="inset" component="li" />}
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{ 
                                            px: 2,
                                            bgcolor: usuario.relacionado ? '#e8f5e9' : 'transparent',
                                            '&:hover': { bgcolor: '#f5f5f5' }
                                        }}
                                        secondaryAction={
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {!usuario.relacionado && (
                                                    <Tooltip title="Relacionar usuario con la asociación">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => onRelacionar(usuario)}
                                                            disabled={actionLoading}
                                                            sx={{ color: colors.secondary.main }}
                                                        >
                                                            {actionLoading ? <CircularProgress size={24} /> : <PersonAddIcon />}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: usuario.activo ? colors.accents.blue : colors.primary.light }}>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                    <Typography variant="subtitle2" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                                                        {usuario.nombre || 'Nombre no disponible'}
                                                    </Typography>
                                                    <Chip
                                                        label={usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: usuario.activo ? colors.secondary.main : colors.primary.dark,
                                                            color: 'white',
                                                            height: 20,
                                                            '& .MuiChip-label': { fontSize: '0.7rem', px: 1 }
                                                        }}
                                                    />
                                                    {usuario.relacionado && (
                                                        <Chip
                                                            icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                                            label="RELACIONADO"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: colors.secondary.main,
                                                                color: 'white',
                                                                height: 20,
                                                                '& .MuiChip-label': { fontSize: '0.7rem', px: 1 }
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <EmailIcon sx={{ fontSize: 14, color: colors.accents.blue }} />
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                            {usuario.email || 'Email no disponible'}
                                                        </Typography>
                                                    </Box>
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <BadgeIcon sx={{ fontSize: 14, color: colors.accents.blue }} />
                                                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                            Rol: {usuario.rol || 'No especificado'}
                                                        </Typography>
                                                    </Box>
                                                    {usuario.telefono && (
                                                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PhoneIcon sx={{ fontSize: 14, color: colors.accents.blue }} />
                                                            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                                                {usuario.telefono}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}`, justifyContent: 'flex-end' }}>
                <Button onClick={handleClose} variant="contained" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AsigAsociacion;