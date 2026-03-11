import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, Chip, Paper, Grid
} from '@mui/material';
import { 
    EmojiEvents as EmojiEventsIcon,
    Edit as EditIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const colors = {
    primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
    secondary: { main: '#00A8A8' },
    text: { secondary: '#3A6EA5' }
};

const ViewNivelDialog = ({ open, onClose, nivel, onEdit }) => {
    if (!nivel) return null;

    // Parsear las reglasJson para obtener los programas
    let programas = [];
    let version = 1;
    if (nivel.reglasJson) {
        try {
            const reglas = JSON.parse(nivel.reglasJson);
            programas = reglas.programas || [];
            version = reglas.version || 1;
        } catch (e) {
            console.error('Error al parsear reglasJson:', e);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.light}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: colors.primary.main }} />
                    <Typography variant="h6" sx={{ color: colors.primary.dark }}>
                        Detalle del Nivel de Reconocimiento
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Información básica */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                Información General
                            </Typography>
                            <Chip 
                                label={nivel.activo ? 'ACTIVO' : 'INACTIVO'} 
                                size="small"
                                sx={{ 
                                    bgcolor: nivel.activo ? colors.secondary.main : colors.primary.dark, 
                                    color: 'white', 
                                    fontWeight: 600 
                                }} 
                            />
                        </Box>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    ID del Nivel
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                    {nivel.idNivel}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    Número de Nivel
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                    {nivel.nivel}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    Nombre del Nivel
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                    {nivel.nombre}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    Descripción
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                                    {nivel.descripcion || 'Sin descripción'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Programas Requeridos */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark, mb: 2 }}>
                            Programas Requeridos ({programas.length})
                        </Typography>
                        
                        {programas.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {programas.map((programa, index) => (
                                    <Box key={programa.id || index} 
                                         sx={{ 
                                             p: 1.5, 
                                             border: `1px solid ${colors.primary.light}`, 
                                             borderRadius: 1,
                                             bgcolor: 'white'
                                         }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                                {programa.nombre}
                                            </Typography>
                                            {programa.horasRequeridas > 0 && (
                                                <Chip 
                                                    label={`${programa.horasRequeridas} horas`} 
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: colors.secondary.main,
                                                        color: 'white',
                                                        fontSize: '0.7rem',
                                                        height: '20px'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                            ID: {programa.id}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: colors.text.secondary, fontStyle: 'italic' }}>
                                No hay programas asociados a este nivel
                            </Typography>
                        )}
                    </Paper>

                    {/* Metadatos */}
                    {(nivel.fechaCreacion || nivel.fechaActualizacion || version) && (
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark, mb: 1 }}>
                                Metadatos
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 'bold' }}>
                                        Versión:
                                    </Typography>
                                    <Chip 
                                        label={`v${version}`} 
                                        size="small"
                                        sx={{ 
                                            bgcolor: colors.primary.light,
                                            color: 'white',
                                            height: '20px',
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </Box>
                                {nivel.fechaCreacion && (
                                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                        📅 Creado: {new Date(nivel.fechaCreacion).toLocaleString()}
                                    </Typography>
                                )}
                                {nivel.fechaActualizacion && (
                                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                        ✏️ Actualizado: {new Date(nivel.fechaActualizacion).toLocaleString()}
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
                <Button 
                    onClick={onClose}
                    startIcon={<CloseIcon />}
                    sx={{ color: colors.text.secondary }}
                    size="small"
                >
                    Cerrar
                </Button>
                <Button 
                    onClick={() => {
                        onClose();
                        onEdit(nivel);
                    }}
                    variant="contained"
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
                >
                    Editar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewNivelDialog;