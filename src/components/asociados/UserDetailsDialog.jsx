import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Avatar,
  Badge,
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
} from "@mui/material";
import {
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textSecondary: "#6b7280",
  textPrimary: "#111827",
  success: "#059669",
  error: "#dc2626",
};

const UserDetailsDialog = ({
  open,
  onClose,
  selectedUser,
  getRecognitionLevel,
  getRecognitionLevelInfo,
  getRoleColor,
  getCertificationColor,
  getMembershipDuration,
  certificationTypes,
  onEditCertification,
  onDeleteCertification,
  onViewDocuments,
  onUploadDocuments,
}) => {
  if (!selectedUser) return null;

  const level = getRecognitionLevel(selectedUser);
  const levelInfo = getRecognitionLevelInfo(level);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1200px",
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Tooltip title={levelInfo.label}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: levelInfo.color,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    border: "2px solid white",
                  }}
                >
                  {levelInfo.icon}
                </Avatar>
              </Tooltip>
            }
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: getRoleColor(selectedUser.role),
                fontWeight: "bold",
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              {selectedUser.avatar}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: institutionalColors.textPrimary,
                fontWeight: 600,
              }}
            >
              {selectedUser.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              {selectedUser.roleName} • {selectedUser.department}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Información Personal */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                color: institutionalColors.textSecondary,
                mb: 1,
                fontWeight: 600,
              }}
            >
              Información Personal
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "#f9fafb",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <List dense disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <MailIcon
                      sx={{
                        color: institutionalColors.textSecondary,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={selectedUser.email}
                    primaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textSecondary,
                        fontSize: "0.75rem",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textPrimary,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhoneIcon
                      sx={{
                        color: institutionalColors.textSecondary,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Teléfono"
                    secondary={selectedUser.phone}
                    primaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textSecondary,
                        fontSize: "0.75rem",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textPrimary,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationIcon
                      sx={{
                        color: institutionalColors.textSecondary,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Región"
                    secondary={selectedUser.region}
                    primaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textSecondary,
                        fontSize: "0.75rem",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textPrimary,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <TrophyIcon
                      sx={{
                        color: institutionalColors.textSecondary,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Antigüedad en la asociación"
                    secondary={getMembershipDuration(selectedUser.joinDate)}
                    primaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textSecondary,
                        fontSize: "0.75rem",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: institutionalColors.textPrimary,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ px: 0, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <VerifiedIcon
                      sx={{
                        color: institutionalColors.textSecondary,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>

                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        color: institutionalColors.textSecondary,
                        fontSize: "0.75rem",
                        mb: 0.5,
                      }}
                    >
                      Nivel de asociado
                    </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: levelInfo.color,
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {levelInfo.icon}
                      </Avatar>

                      <Box>
                        <Typography
                          sx={{
                            color: levelInfo.color,
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {levelInfo.label}
                        </Typography>

                        <Typography
                          sx={{
                            color: institutionalColors.textSecondary,
                            fontSize: "0.75rem",
                          }}
                        >
                          {selectedUser.associationCertifications?.length || 0}{" "}
                          certificaciones
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Certificaciones */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
                mt: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: institutionalColors.textSecondary,
                  fontWeight: 600,
                }}
              >
                Certificaciones de la Asociación
              </Typography>

              <Chip
                size="small"
                icon={
                  selectedUser.uploadPermission === "permitido" ? (
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <CancelIcon sx={{ fontSize: 16 }} />
                  )
                }
                label={
                  selectedUser.uploadPermission === "permitido"
                    ? "Permiso de carga concedido"
                    : "Permiso de carga no concedido"
                }
                sx={{
                  bgcolor:
                    selectedUser.uploadPermission === "permitido"
                      ? `${institutionalColors.success}10`
                      : `${institutionalColors.error}10`,
                  color:
                    selectedUser.uploadPermission === "permitido"
                      ? institutionalColors.success
                      : institutionalColors.error,
                  borderColor:
                    selectedUser.uploadPermission === "permitido"
                      ? institutionalColors.success
                      : institutionalColors.error,
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: "inherit",
                  },
                }}
                variant="outlined"
              />
            </Box>

            {selectedUser.associationCertifications?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ color: institutionalColors.primary, fontWeight: 600 }}>
                        Certificación
                      </TableCell>
                      <TableCell sx={{ color: institutionalColors.primary, fontWeight: 600 }}>
                        Tipo
                      </TableCell>
                      <TableCell sx={{ color: institutionalColors.primary, fontWeight: 600 }}>
                        Horas
                      </TableCell>
                      <TableCell align="center" sx={{ color: institutionalColors.primary, fontWeight: 600 }}>
                        Documentos
                      </TableCell>
                      <TableCell align="right" sx={{ color: institutionalColors.primary, fontWeight: 600 }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedUser.associationCertifications.map((cert) => (
                      <TableRow key={cert.id} hover>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {cert.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={
                              certificationTypes.find((t) => t.value === cert.type)
                                ?.label || cert.type
                            }
                            size="small"
                            sx={{
                              bgcolor: `${getCertificationColor(cert.type)}10`,
                              color: getCertificationColor(cert.type),
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: institutionalColors.textPrimary,
                              fontWeight: 500,
                            }}
                          >
                            {cert.hoursValue || 0} horas
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Badge
                            badgeContent={cert.documents?.length || 0}
                            color="primary"
                            sx={{
                              "& .MuiBadge-badge": {
                                bgcolor: institutionalColors.primary,
                                fontSize: "0.65rem",
                                height: 18,
                                minWidth: 18,
                              },
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => onViewDocuments(selectedUser, cert)}
                              disabled={selectedUser.uploadPermission !== "permitido"}
                              sx={{
                                color: institutionalColors.primary,
                                "&.Mui-disabled": {
                                  color: institutionalColors.textSecondary,
                                  opacity: 0.5,
                                },
                              }}
                            >
                              <AttachFileIcon fontSize="small" />
                            </IconButton>
                          </Badge>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Editar certificación">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => onEditCertification(selectedUser, cert)}
                                  disabled={selectedUser.uploadPermission !== "permitido"}
                                  sx={{
                                    color:
                                      selectedUser.uploadPermission === "permitido"
                                        ? institutionalColors.primary
                                        : institutionalColors.textSecondary,
                                    opacity:
                                      selectedUser.uploadPermission === "permitido"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title="Eliminar certificación">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => onDeleteCertification(selectedUser.id, cert.id)}
                                  disabled={selectedUser.uploadPermission !== "permitido"}
                                  sx={{
                                    color: institutionalColors.error,
                                    opacity:
                                      selectedUser.uploadPermission === "permitido"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  textAlign: "center",
                  py: 4,
                  px: 2,
                  bgcolor: "#f9fafb",
                  borderRadius: 2,
                }}
              >
                <VerifiedIcon
                  sx={{
                    fontSize: 48,
                    color: institutionalColors.textSecondary,
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{ color: institutionalColors.textSecondary, fontWeight: 500 }}
                  gutterBottom
                >
                  No hay certificaciones registradas
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  {selectedUser.uploadPermission === "permitido"
                    ? "Agrega certificaciones para este usuario usando el botón + en la lista principal"
                    : "Este usuario no tiene permiso para agregar certificaciones"}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
            px: 3,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;