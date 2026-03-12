import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Avatar,
  Tooltip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Mail as MailIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  AccessTime as HoursIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

import { getExpedienteByUsuarioId } from "../../services/expediente";
import {
  getCertificacionesPorExpediente,
  obtenerArchivoBlobCertificacion,
} from "../../services/certificaciones";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textSecondary: "#6b7280",
  textPrimary: "#111827",
  success: "#059669",
  warning: "#d97706",
  error: "#dc2626",
};

// ── Modal de previsualización de documento ───────────────────────
const DocumentPreviewModal = ({ open, onClose, blobUrl, nombreArchivo, mimeType }) => {
  const isPdf = mimeType?.includes("pdf");
  const isImage = mimeType?.includes("image");

  const handleDescargar = () => {
    if (!blobUrl) return;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nombreArchivo || "documento";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { height: "90vh", display: "flex", flexDirection: "column", borderRadius: 2 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: institutionalColors.primary,
          color: "white",
          py: 1.5,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            {isPdf
              ? <PdfIcon sx={{ fontSize: 22 }} />
              : isImage
                ? <ImageIcon sx={{ fontSize: 22 }} />
                : <FileIcon sx={{ fontSize: 22 }} />
            }
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: "0.95rem" }}>
                {nombreArchivo || "Documento"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                {isPdf ? "Documento PDF" : isImage ? "Imagen" : "Archivo"}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Descargar">
              <IconButton size="small" onClick={handleDescargar}
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar">
              <IconButton size="small" onClick={onClose}
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogTitle>

      {/* Contenido */}
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#1a1a2e",
        }}
      >
        {!blobUrl ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : isPdf ? (
          <iframe
            src={blobUrl}
            title={nombreArchivo}
            style={{ width: "100%", height: "100%", border: "none", flex: 1 }}
          />
        ) : isImage ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              overflow: "auto",
            }}
          >
            <img
              src={blobUrl}
              alt={nombreArchivo}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            />
          </Box>
        ) : (
          // Tipo no soportado para previsualizar
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              color: "white",
            }}
          >
            <FileIcon sx={{ fontSize: 72, opacity: 0.4 }} />
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              No se puede previsualizar este tipo de archivo
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDescargar}
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)", "&:hover": { borderColor: "white" } }}
            >
              Descargar archivo
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ── Componente principal ─────────────────────────────────────────
const UserDetailsDialog = ({ open, onClose, user }) => {
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");
  const [expediente, setExpediente] = useState(null);
  const [certificaciones, setCertificaciones] = useState([]);
  const [loadingDocumento, setLoadingDocumento] = useState(null);

  // Estado del modal de previsualización
  const [previewModal, setPreviewModal] = useState({
    open: false,
    blobUrl: null,
    nombreArchivo: "",
    mimeType: "",
  });

  // Limpiar blobUrl al cerrar el modal de preview
  const handleClosePreview = () => {
    if (previewModal.blobUrl) {
      URL.revokeObjectURL(previewModal.blobUrl);
    }
    setPreviewModal({ open: false, blobUrl: null, nombreArchivo: "", mimeType: "" });
  };

  // ── Cargar datos completos al abrir ────────────────────────────
  useEffect(() => {
    if (!open || !user?.id) return;

    const cargarDatos = async () => {
      setLoadingDetalle(true);
      setErrorDetalle("");
      setExpediente(null);
      setCertificaciones([]);

      try {
        console.log("========== [UserDetailsDialog] ABRIENDO DETALLES ==========");
        console.log("👤 Usuario completo:", user);
        console.log("   - ID:", user.id);
        console.log("   - Nombre:", user.nombre);
        console.log("   - Email:", user.email);
        console.log("   - Estado:", user.estado);
        console.log("   - Región:", user.regionNombre);
        console.log("   - Instancia ID:", user.instanciaId);
        console.log("   - Permiso asociación:", user.permisoAsociacion);
        console.log("   - Certificaciones count (local):", user.certificacionesCount);
        console.log("   - Fecha ingreso:", user.fechaIngreso);

        console.log(`\n🔍 Obteniendo expediente para usuario ID: ${user.id}...`);
        const exp = await getExpedienteByUsuarioId(user.id);
        console.log("📄 Expediente completo:", exp);
        console.log("   - ID:", exp?.id);
        console.log("   - Estado:", exp?.estado);
        console.log("   - Fecha inicio:", exp?.fechaInicio);
        console.log("   - instanciaId:", exp?.instanciaId);
        setExpediente(exp);

        if (exp?.id) {
          console.log(`\n🔍 Obteniendo certificaciones para expediente ID: ${exp.id}...`);
          const certs = await getCertificacionesPorExpediente(exp.id);
          console.log(`📋 Total certificaciones encontradas: ${certs?.length || 0}`);
          if (Array.isArray(certs)) {
            certs.forEach((cert, i) => {
              console.log(`\n   [${i + 1}] ────────────────────────────`);
              console.log("        Objeto completo:", cert);
              console.log("        - idCertExp:", cert.idCertExp);
              console.log("        - idCertificacion:", cert.idCertificacion);
              console.log("        - nombreCertificacion:", cert.nombreCertificacion);
              console.log("        - institucion:", cert.institucion);
              console.log("        - horasAcreditadas:", cert.horasAcreditadas);
              console.log("        - horasCatalogo:", cert.horasCatalogo);
              console.log("        - fechaEmision:", cert.fechaEmision);
              console.log("        - fechaExpiracion:", cert.fechaExpiracion);
              console.log("        - fechaCreacion:", cert.fechaCreacion);
              console.log("        - estado:", cert.estado);
              console.log("        - mongoDocumentoId:", cert.mongoDocumentoId);
              console.log("        - nombreArchivo:", cert.nombreArchivo);
              console.log("        - descripcion:", cert.descripcion);
              console.log("        - idExpediente:", cert.idExpediente);
            });
          }
          setCertificaciones(Array.isArray(certs) ? certs : []);
        } else {
          console.warn("⚠️ Sin expediente — se omite carga de certificaciones.");
        }

        console.log("\n✅ [UserDetailsDialog] Carga completa.");
        console.log("============================================================");
      } catch (err) {
        console.error("❌ [UserDetailsDialog] Error al cargar datos:", err);
        console.error("   - Mensaje:", err?.message);
        console.error("   - Response data:", err?.response?.data);
        setErrorDetalle("No se pudieron cargar todos los datos del usuario.");
      } finally {
        setLoadingDetalle(false);
      }
    };

    cargarDatos();
  }, [open, user?.id]);

  if (!user) return null;

  // ── Ver documento → abre modal de preview ──────────────────────
  const handleVerDocumento = async (cert) => {
    const idCertExp = cert.idCertExp;
    if (!idCertExp) {
      console.warn("⚠️ Sin idCertExp para esta certificación:", cert);
      return;
    }

    console.log(`\n📂 [Ver Documento] Abriendo para idCertExp: ${idCertExp}`);
    console.log("   - nombreArchivo:", cert.nombreArchivo);
    console.log("   - mongoDocumentoId:", cert.mongoDocumentoId);

    setLoadingDocumento(idCertExp);

    // Abrir modal inmediatamente en estado de carga
    setPreviewModal({
      open: true,
      blobUrl: null,
      nombreArchivo: cert.nombreArchivo || `certificacion_${idCertExp}`,
      mimeType: "",
    });

    try {
      const blob = await obtenerArchivoBlobCertificacion(idCertExp);
      console.log("✅ Blob recibido:");
      console.log("   - type:", blob.type);
      console.log("   - size:", blob.size, "bytes");

      const url = URL.createObjectURL(blob);

      setPreviewModal({
        open: true,
        blobUrl: url,
        nombreArchivo: cert.nombreArchivo || `certificacion_${idCertExp}`,
        mimeType: blob.type,
      });
    } catch (err) {
      console.error(`❌ Error al obtener documento idCertExp ${idCertExp}:`, err);
      console.error("   - Mensaje:", err?.message);
      console.error("   - Response:", err?.response?.data);
      setPreviewModal({ open: false, blobUrl: null, nombreArchivo: "", mimeType: "" });
      setErrorDetalle(
        `No se pudo abrir el documento: ${err?.response?.data?.message || err.message}`
      );
    } finally {
      setLoadingDocumento(null);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────
  const getInitials = (nombre) => {
    if (!nombre) return "?";
    return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  };

  const formatDate = (fecha) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-MX", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch { return "—"; }
  };

  const formatDuracion = (fechaIngreso) => {
    if (!fechaIngreso) return "No disponible";
    try {
      const diff = Math.abs(new Date() - new Date(fechaIngreso));
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      if (years < 1) {
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        return `${months} mes(es)`;
      }
      return `${years} año(s)`;
    } catch { return "No disponible"; }
  };

  const totalHoras = certificaciones.reduce(
    (acc, c) => acc + (c.horasAcreditadas || c.horas || 0), 0
  );

  const recargar = () => {
    setLoadingDetalle(true);
    setErrorDetalle("");
    getExpedienteByUsuarioId(user.id)
      .then(async (exp) => {
        setExpediente(exp);
        if (exp?.id) {
          const certs = await getCertificacionesPorExpediente(exp.id);
          setCertificaciones(Array.isArray(certs) ? certs : []);
        }
      })
      .catch(() => setErrorDetalle("Error al recargar los datos."))
      .finally(() => setLoadingDetalle(false));
  };

  return (
    <>
      {/* ── Modal principal de detalles ──────────────────────── */}
      <Dialog open={open} onClose={onClose} fullWidth
        PaperProps={{ sx: { width: "100%", maxWidth: "900px", maxHeight: "92vh" } }}
      >
        {/* Header */}
        <DialogTitle sx={{ bgcolor: institutionalColors.primary, color: "white", py: 2.5, px: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{
              width: 56, height: 56, bgcolor: "rgba(255,255,255,0.2)",
              fontWeight: "bold", color: "white", fontSize: "1.4rem",
              border: "2px solid rgba(255,255,255,0.4)",
            }}>
              {user.avatar || getInitials(user.nombre)}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {user.nombre}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.3 }}>{user.email}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
                <Chip
                  size="small"
                  icon={user.estado === "CON_PERMISO"
                    ? <CheckCircleIcon sx={{ fontSize: "14px !important" }} />
                    : <CancelIcon sx={{ fontSize: "14px !important" }} />
                  }
                  label={user.estado === "CON_PERMISO" ? "Con permiso" : "Sin permiso"}
                  sx={{
                    bgcolor: user.estado === "CON_PERMISO" ? "rgba(5,150,105,0.25)" : "rgba(220,38,38,0.25)",
                    color: "white", fontWeight: 600, fontSize: "0.7rem", height: 22,
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
                {!loadingDetalle && (
                  <Chip
                    size="small"
                    icon={<VerifiedIcon sx={{ fontSize: "14px !important" }} />}
                    label={`${certificaciones.length} certificacion${certificaciones.length !== 1 ? "es" : ""}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)", color: "white",
                      fontSize: "0.7rem", height: 22,
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                )}
              </Stack>
            </Box>

            <Tooltip title="Recargar datos">
              <span>
                <IconButton size="small" onClick={recargar} disabled={loadingDetalle}
                  sx={{ color: "white", opacity: 0.75, "&:hover": { opacity: 1 } }}
                >
                  {loadingDetalle
                    ? <CircularProgress size={16} sx={{ color: "white" }} />
                    : <RefreshIcon fontSize="small" />
                  }
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, bgcolor: "#f9fafb" }}>
          {errorDetalle && (
            <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setErrorDetalle("")}>
              {errorDetalle}
            </Alert>
          )}

          <Grid container spacing={2.5}>

            {/* ── Panel izquierdo ──────────────────────────── */}
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: "white", height: "100%" }}>

                <SectionTitle>Información Personal</SectionTitle>
                <List dense disablePadding>
                  <InfoRow icon={<MailIcon sx={{ fontSize: 18 }} />} label="Email" value={user.email} />
                  <InfoRow icon={<LocationIcon sx={{ fontSize: 18 }} />} label="Región" value={user.regionNombre || "Sin región"} />
                  <InfoRow icon={<TrophyIcon sx={{ fontSize: 18 }} />} label="Antigüedad" value={formatDuracion(user.fechaIngreso)} />
                  <InfoRow
                    icon={<VerifiedIcon sx={{ fontSize: 18 }} />}
                    label="Permiso dispositivo"
                    value={
                      <Chip size="small"
                        label={user.permisoAsociacion ? "Autorizado" : "No autorizado"}
                        sx={{
                          bgcolor: user.permisoAsociacion ? `${institutionalColors.success}15` : "#f3f4f6",
                          color: user.permisoAsociacion ? institutionalColors.success : institutionalColors.textSecondary,
                          fontWeight: 600, fontSize: "0.72rem", height: 20,
                        }}
                      />
                    }
                  />
                </List>

                <Divider sx={{ my: 2 }} />
                <SectionTitle>Expediente</SectionTitle>

                {loadingDetalle ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={14} sx={{ color: institutionalColors.primary }} />
                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>Cargando...</Typography>
                  </Stack>
                ) : expediente ? (
                  <List dense disablePadding>
                    <InfoRow icon={<CalendarIcon sx={{ fontSize: 16 }} />} label="ID Expediente" value={`#${expediente.id}`} />
                    <InfoRow icon={<CalendarIcon sx={{ fontSize: 16 }} />} label="Fecha inicio" value={formatDate(expediente.fechaInicio)} />
                    <InfoRow
                      icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                      label="Estado"
                      value={
                        <Chip size="small" label={expediente.estado || "ACTIVO"}
                          sx={{
                            bgcolor: `${institutionalColors.success}15`,
                            color: institutionalColors.success,
                            fontWeight: 600, fontSize: "0.72rem", height: 20,
                          }}
                        />
                      }
                    />
                  </List>
                ) : (
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                    Sin expediente registrado
                  </Typography>
                )}

                {!loadingDetalle && certificaciones.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <SectionTitle>Resumen</SectionTitle>
                    <Stack spacing={1}>
                      <ResumenCard label="Total certificaciones" value={certificaciones.length} color={institutionalColors.primary} />
                      <ResumenCard label="Horas acumuladas" value={`${totalHoras} hrs`} color={institutionalColors.success} />
                    </Stack>
                  </>
                )}
              </Paper>
            </Grid>

            {/* ── Panel derecho: tabla certificaciones ──────── */}
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: "white" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <SectionTitle noMargin>Certificaciones</SectionTitle>
                  <Chip
                    size="small"
                    icon={user.estado === "CON_PERMISO"
                      ? <CheckCircleIcon sx={{ fontSize: "13px !important" }} />
                      : <CancelIcon sx={{ fontSize: "13px !important" }} />
                    }
                    label={user.estado === "CON_PERMISO" ? "Carga permitida" : "Sin permiso de carga"}
                    variant="outlined"
                    sx={{
                      borderColor: user.estado === "CON_PERMISO" ? institutionalColors.success : institutionalColors.error,
                      color: user.estado === "CON_PERMISO" ? institutionalColors.success : institutionalColors.error,
                      fontSize: "0.7rem", height: 22,
                      "& .MuiChip-icon": { color: "inherit" },
                    }}
                  />
                </Stack>

                {loadingDetalle ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <Stack alignItems="center" spacing={1.5}>
                      <CircularProgress sx={{ color: institutionalColors.primary }} size={32} />
                      <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                        Cargando certificaciones...
                      </Typography>
                    </Stack>
                  </Box>
                ) : certificaciones.length > 0 ? (
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {["Certificación", "Institución", "Horas", "Fecha", "Doc."].map((h) => (
                            <TableCell key={h} sx={{
                              fontWeight: 700, color: institutionalColors.primary,
                              bgcolor: "#f8fafc", fontSize: "0.75rem", py: 1,
                            }}>
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {certificaciones.map((cert, idx) => {
                          const idCertExp = cert.idCertExp;
                          const isLoadingThis = loadingDocumento === idCertExp;
                          return (
                            <TableRow key={idCertExp || idx} hover>

                              {/* Nombre + estado badge */}
                              <TableCell sx={{ maxWidth: 165 }}>
                                <Stack direction="row" spacing={0.8} alignItems="flex-start">
                                  <SchoolIcon sx={{ fontSize: 15, color: institutionalColors.primary, mt: 0.3, flexShrink: 0 }} />
                                  <Box>
                                    <Typography variant="body2" fontWeight={600}
                                      sx={{ color: institutionalColors.textPrimary, fontSize: "0.8rem", lineHeight: 1.3 }}
                                    >
                                      {cert.nombreCertificacion || cert.nombre || "Sin nombre"}
                                    </Typography>
                                    {cert.estado && (
                                      <Chip size="small" label={cert.estado.replace("_", " ")}
                                        sx={{
                                          mt: 0.3, height: 16, fontSize: "0.6rem",
                                          bgcolor: cert.estado === "APROBADO"
                                            ? `${institutionalColors.success}15`
                                            : `${institutionalColors.warning}15`,
                                          color: cert.estado === "APROBADO"
                                            ? institutionalColors.success
                                            : institutionalColors.warning,
                                          fontWeight: 600,
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Stack>
                              </TableCell>

                              {/* Institución */}
                              <TableCell>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <BusinessIcon sx={{ fontSize: 13, color: institutionalColors.textSecondary, flexShrink: 0 }} />
                                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                    {cert.institucion || "—"}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              {/* Horas */}
                              <TableCell>
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                  <HoursIcon sx={{ fontSize: 13, color: institutionalColors.primary }} />
                                  <Typography variant="body2" fontWeight={600}
                                    sx={{ color: institutionalColors.primary, fontSize: "0.8rem" }}
                                  >
                                    {cert.horasAcreditadas || cert.horas || 0}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              {/* Fecha */}
                              <TableCell>
                                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                  {formatDate(cert.fechaEmision || cert.fecha)}
                                </Typography>
                              </TableCell>

                              {/* Botón ver documento */}
                              <TableCell align="center">
                                {cert.mongoDocumentoId ? (
                                  <Tooltip title={isLoadingThis ? "Cargando documento..." : `Ver: ${cert.nombreArchivo || "documento"}`}>
                                    <span>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleVerDocumento(cert)}
                                        disabled={isLoadingThis}
                                        sx={{
                                          color: institutionalColors.primary, p: 0.5,
                                          "&:hover": { bgcolor: `${institutionalColors.primary}10` },
                                        }}
                                      >
                                        {isLoadingThis
                                          ? <CircularProgress size={14} sx={{ color: institutionalColors.primary }} />
                                          : <OpenInNewIcon sx={{ fontSize: 16 }} />
                                        }
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                ) : (
                                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>—</Typography>
                                )}
                              </TableCell>

                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <VerifiedIcon sx={{ fontSize: 48, color: institutionalColors.textSecondary, mb: 1.5, opacity: 0.4 }} />
                    <Typography variant="body2" fontWeight={500}
                      sx={{ color: institutionalColors.textSecondary }} gutterBottom
                    >
                      Sin certificaciones registradas
                    </Typography>
                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                      {user.estado === "CON_PERMISO"
                        ? "Agrega certificaciones desde la tabla principal"
                        : "Este usuario no tiene permiso para agregar certificaciones"}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", bgcolor: "white" }}>
          <Button onClick={onClose} variant="contained"
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": { bgcolor: institutionalColors.secondary },
              px: 4, textTransform: "none", fontWeight: 600,
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal de previsualización de documento ────────── */}
      <DocumentPreviewModal
        open={previewModal.open}
        onClose={handleClosePreview}
        blobUrl={previewModal.blobUrl}
        nombreArchivo={previewModal.nombreArchivo}
        mimeType={previewModal.mimeType}
      />
    </>
  );
};

// ── Sub-componentes ───────────────────────────────────────────────

const SectionTitle = ({ children, noMargin }) => (
  <Typography variant="subtitle2" sx={{
    color: "#133B6B", fontWeight: 700, mb: noMargin ? 0 : 2,
    fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 0.5,
  }}>
    {children}
  </Typography>
);

const InfoRow = ({ icon, label, value }) => (
  <ListItem sx={{ px: 0, py: 0.6, alignItems: "flex-start" }}>
    <ListItemIcon sx={{ minWidth: 32, mt: 0.2, color: "#9ca3af" }}>{icon}</ListItemIcon>
    <ListItemText
      primary={label}
      secondary={typeof value === "string" || typeof value === "number" ? value || "No disponible" : value}
      primaryTypographyProps={{ sx: { color: "#9ca3af", fontSize: "0.7rem", lineHeight: 1.2 } }}
      secondaryTypographyProps={{ component: "div", sx: { color: "#111827", fontSize: "0.82rem", fontWeight: 500, mt: 0.2 } }}
    />
  </ListItem>
);

const ResumenCard = ({ label, value, color }) => (
  <Box sx={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    px: 1.5, py: 1, borderRadius: 1.5,
    bgcolor: `${color}08`, border: `1px solid ${color}20`,
  }}>
    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>{label}</Typography>
    <Typography variant="body2" sx={{ color, fontWeight: 700, fontSize: "0.9rem" }}>{value}</Typography>
  </Box>
);

export default UserDetailsDialog;