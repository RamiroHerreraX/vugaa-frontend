import React from 'react';
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
    CheckCircle as CheckCircleIcon
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
        purple: '#6C5CE7'
    },
    status: {
        success: '#00A8A8',
        error: '#0099FF'
    },
    text: {
        primary: '#0D2A4D',
        secondary: '#3A6EA5'
    }
};

/**
 * AddCertificationModal
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSave: () => void
 * - nuevaCertificacion: { subseccion, tipoDocumento, institucion, fecha, horas, archivo, nombreArchivo }
 * - onFieldChange: (campo) => (event) => void
 * - onFileChange: (event) => void
 * - onRemoveFile: () => void
 * - uploading: boolean
 * - uploadProgress: number
 * - saving: boolean
 * - subseccionFija: string | null  — si viene, oculta el selector y muestra chip con el nombre del programa
 */
const AddCertificationModal = ({
    open,
    onClose,
    onSave,
    nuevaCertificacion,
    onFieldChange,
    onFileChange,
    onRemoveFile,
    uploading,
    uploadProgress,
    saving,
    subseccionFija = null,
}) => {

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const canSave =
        !saving &&
        nuevaCertificacion.tipoDocumento &&
        nuevaCertificacion.archivo &&
        nuevaCertificacion.horas &&
        nuevaCertificacion.institucion &&
        (subseccionFija || nuevaCertificacion.subseccion);

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
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Agregar Nueva Certificación
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }} disabled={saving}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3, px: 3 }}>
                <Grid container spacing={2.5}>

                    {/* Subsección — selector normal o chip fijo si viene de un programa */}
                    {subseccionFija ? (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                                Programa
                            </Typography>
                            <Chip
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
                                Subsección <span style={{ color: colors.status.error }}>*</span>
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={nuevaCertificacion.subseccion}
                                onChange={onFieldChange('subseccion')}
                                required
                                disabled={saving}
                            >
                                <MenuItem value="formacionEtica">Formación Ética y Cumplimiento</MenuItem>
                                <MenuItem value="actualizacionTecnica">Actualización Técnica y Aduanera</MenuItem>
                                <MenuItem value="otros">Otros</MenuItem>
                            </TextField>
                        </Grid>
                    )}

                    {/* Nombre */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Nombre de la Certificación <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={nuevaCertificacion.tipoDocumento}
                            onChange={onFieldChange('tipoDocumento')}
                            placeholder="Ej: Curso de Ética Profesional"
                            required
                            disabled={saving}
                        />
                    </Grid>

                    {/* Institución */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Institución <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={nuevaCertificacion.institucion}
                            onChange={onFieldChange('institucion')}
                            placeholder="Ej: Instituto de Ética Empresarial"
                            required
                            disabled={saving}
                        />
                    </Grid>

                    {/* Horas + Fecha */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Horas <span style={{ color: colors.status.error }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            size="small"
                            value={nuevaCertificacion.horas}
                            onChange={onFieldChange('horas')}
                            placeholder="Ej: 20"
                            required
                            inputProps={{ min: 1 }}
                            disabled={saving}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                            Fecha de Expedición
                        </Typography>
                        <TextField
                            fullWidth
                            type="date"
                            size="small"
                            value={nuevaCertificacion.fecha}
                            onChange={onFieldChange('fecha')}
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
                                p: 3,
                                borderRadius: 2,
                                textAlign: 'center',
                                cursor: saving ? 'default' : 'pointer',
                                border: `2px dashed ${nuevaCertificacion.archivo ? colors.status.success : colors.primary.main}40`,
                                opacity: saving ? 0.7 : 1,
                                transition: 'all 0.2s',
                                '&:hover': saving ? {} : {
                                    borderColor: colors.primary.main,
                                    backgroundColor: '#f8f9fa'
                                }
                            }}
                            onClick={() => !saving && document.getElementById('add-cert-file-upload').click()}
                        >
                            <input
                                id="add-cert-file-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={onFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                disabled={saving}
                            />

                            {nuevaCertificacion.archivo ? (
                                <>
                                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: '500', color: colors.text.primary }}>
                                        {nuevaCertificacion.nombreArchivo}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                                        Archivo seleccionado correctamente
                                    </Typography>
                                    {uploading && (
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress}
                                                sx={{ height: 6, borderRadius: 3 }}
                                            />
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                                {uploadProgress}% completado
                                            </Typography>
                                        </Box>
                                    )}
                                    {!saving && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={(e) => { e.stopPropagation(); onRemoveFile(); }}
                                            sx={{ mt: 1, color: colors.status.error, borderColor: colors.status.error }}
                                        >
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
                    onClick={onSave}
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