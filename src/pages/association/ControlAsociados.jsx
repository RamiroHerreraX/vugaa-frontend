import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  InputAdornment,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  VerifiedUser as VerifiedIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon  from "@mui/icons-material/InsertDriveFile";
import { useNavigate } from "react-router-dom";

import {
  parseISO,
  differenceInYears,
} from "date-fns";

// Importar componentes separados
import AssociateUserDialog from "../../components/asociados/AssociateUserDialog";
import AddCertificationDialog from "../../components/asociados/AddCertificationDialog";
import UserDetailsDialog from "../../components/asociados/UserDetailsDialog";
import DocumentsDialog from "../../components/asociados/DocumentsDialog";
import UploadDocumentsDialog from "../../components/asociados/UploadDocumentsDialog";

// Colores institucionales
const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  accent: "#e9e9e9",
  background: "#f4f6f8",
  lightBlue: "rgba(19, 59, 107, 0.08)",
  darkBlue: "#0D2A4D",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  success: "#059669",
  warning: "#d97706",
  error: "#dc2626",
  info: "#1976d2",
  level1: "#6b7280",
  level2: "#4b5563",
  level3: "#1f2937",
};

// Niveles de reconocimiento
const recognitionLevels = [
  {
    value: 1,
    label: "Nivel I",
    color: institutionalColors.level1,
    icon: "I",
    minCertifications: 1,
    maxCertifications: 3,
  },
  {
    value: 2,
    label: "Nivel II",
    color: institutionalColors.level2,
    icon: "II",
    minCertifications: 4,
    maxCertifications: 7,
  },
  {
    value: 3,
    label: "Nivel III",
    color: institutionalColors.level3,
    icon: "III",
    minCertifications: 8,
    maxCertifications: Infinity,
  },
];

// Datos iniciales
const initialUsers = [
  {
    id: 1,
    name: "Luis Rodríguez Lopez",
    email: "luis.rodriguez@empresa.com",
    role: "agente",
    roleName: "Agente Aduanal",
    region: "Norte",
    phone: "+52 55 1234 5678",
    color: "#526F78",
    avatar: "LR",
    department: "Operaciones",
    joinDate: "2023-01-15",
    uploadPermission: "permitido",
    associationCertifications: [
      {
        id: 1,
        name: "Curso de ética profesional y código de conducta",
        type: "etica_cumplimiento",
        hoursValue: 20,
        status: "active",
        documents: [
          {
            id: 101,
            name: "certificado_aduanal_basico.pdf",
            url: "/assets/Curso de ética profesional y código de conducta.pdf",
            type: "application/pdf",
            size: 245760,
            uploadDate: "2024-01-20T10:30:00",
            uploadedBy: "admin@asociacion.com",
          },
        ],
      },
      {
        id: 2,
        name: "Diplomado en Comercio Exterior y Legislación Aduanera",
        type: "actualizacion_aduanera",
        hoursValue: 40,
        status: "active",
        documents: [
          {
            id: 102,
            name: "Diplomado en Comercio Exterior y Legislación Aduanera.pdf",
            url: "/assets/Diplomado en Comercio Exterior y Legislación Aduanera.pdf",
            type: "application/pdf",
            size: 245760,
            uploadDate: "2024-01-20T10:30:00",
            uploadedBy: "admin@asociacion.com",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "María González López",
    email: "maria.gonzalez@comite.com",
    role: "comite",
    roleName: "Miembro del Comité",
    region: "Centro",
    phone: "+52 55 8765 4321",
    color: "#1a237e",
    avatar: "MG",
    department: "Dirección",
    joinDate: "2022-06-10",
    uploadPermission: "no-permitido",
    associationCertifications: [
      {
        id: 1,
        name: "Certificación de Comité",
        type: "administrativa",
        hoursValue: 15,
        status: "active",
        documents: [],
      },
    ],
  },
  {
    id: 3,
    name: "Carlos López Pérez",
    email: "carlos.lopez@consultor.com",
    role: "profesionista",
    roleName: "Consultor Externo",
    region: "Sur",
    phone: "+52 55 9999 8888",
    color: "#2e7d32",
    avatar: "CL",
    department: "Consultoría",
    joinDate: "2024-01-20",
    uploadPermission: "permitido",
    associationCertifications: [],
  },
  {
    id: 4,
    name: "Ana Torres García",
    email: "ana.torres@auditor.com",
    role: "profesionista",
    roleName: "Auditor",
    region: "Metropolitana",
    phone: "+52 55 7777 6666",
    color: "#2e7d32",
    avatar: "AT",
    department: "Auditoría",
    joinDate: "2021-11-05",
    uploadPermission: "no-permitido",
    associationCertifications: [
      {
        id: 1,
        name: "Certificación de Auditor",
        type: "legal",
        hoursValue: 30,
        status: "active",
        documents: [
          {
            id: 102,
            name: "certificado_auditor.pdf",
            url: "/documentos/auditor.pdf",
            type: "application/pdf",
            size: 182400,
            uploadDate: "2024-05-15T14:20:00",
            uploadedBy: "admin@asociacion.com",
          },
          {
            id: 103,
            name: "constancia_vigencia.jpg",
            url: "/documentos/constancia.jpg",
            type: "image/jpeg",
            size: 512000,
            uploadDate: "2024-05-20T09:15:00",
            uploadedBy: "admin@asociacion.com",
          },
        ],
      },
    ],
  },
];

// Usuarios disponibles para agregar a la asociación
const availableUsers = [
  {
    id: 101,
    name: "Juan Pérez Gómez",
    email: "juan.perez@externo.com",
    role: "profesionista",
    roleName: "Consultor Externo",
  },
  {
    id: 102,
    name: "Ana Ruiz Sánchez",
    email: "ana.ruiz@consultora.com",
    role: "profesionista",
    roleName: "Auditor Aduanal",
  },
  {
    id: 103,
    name: "Carlos Méndez Torres",
    email: "carlos.mendez@empresa.com",
    role: "empresario",
    roleName: "Representante Comercial",
  },
  {
    id: 104,
    name: "Laura Castro Díaz",
    email: "laura.castro@legal.com",
    role: "profesionista",
    roleName: "Asesor Legal",
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const rowsPerPage = 10;
  const [users, setUsers] = useState(initialUsers);

  // Estados para el formulario de nueva certificación
  const [newCertification, setNewCertification] = useState({
    name: "",
    type: "operativa",
    hoursValue: "",
  });

  // Estados para subida de documentos en certificación
  const [certificationFiles, setCertificationFiles] = useState([]);
  const [certificationUploading, setCertificationUploading] = useState(false);
  const [certificationUploadProgress, setCertificationUploadProgress] = useState(0);

  // Estados para subida de documentos adicionales
  const [uploadFiles, setUploadFiles] = useState([]);

  // Tipos de certificaciones
  const certificationTypes = [
    {
      value: "etica_cumplimiento",
      label: "Formación ética y cumplimiento",
      color: "#455a64",
    },
    {
      value: "actualizacion_aduanera",
      label: "Actualización técnica aduanera",
      color: "#1565c0",
    },
    {
      value: "operativa",
      label: "Operativa",
      color: institutionalColors.primary,
    },
    {
      value: "fiscal",
      label: "Fiscal",
      color: institutionalColors.success,
    },
    {
      value: "legal",
      label: "Legal",
      color: "#9c27b0",
    },
    {
      value: "administrativa",
      label: "Administrativa",
      color: institutionalColors.warning,
    },
    {
      value: "seguridad",
      label: "Seguridad",
      color: institutionalColors.error,
    },
  ];

  // Calcular estadísticas para las tabs
  const stats = useMemo(() => {
    const total = users.length;
    const withPermission = users.filter(
      (u) => u.uploadPermission === "permitido",
    ).length;
    const withoutPermission = users.filter(
      (u) => u.uploadPermission === "no-permitido",
    ).length;

    return {
      total,
      withPermission,
      withoutPermission,
    };
  }, [users]);

  // Función para obtener el nivel de reconocimiento del usuario
  const getRecognitionLevel = (user) => {
    if (!user || !user.associationCertifications) return 1;
    const certificationsCount = user.associationCertifications.length;
    if (certificationsCount >= 8) return 3;
    if (certificationsCount >= 4) return 2;
    return 1;
  };

  // Función para obtener información del nivel de reconocimiento
  const getRecognitionLevelInfo = (level) => {
    return recognitionLevels.find((l) => l.value === level) || recognitionLevels[0];
  };

  // Función para calcular la antigüedad en la asociación
  const getMembershipDuration = (joinDate) => {
    if (!joinDate) return "N/A";
    const join = parseISO(joinDate);
    const now = new Date();
    const years = differenceInYears(now, join);
    const months = Math.floor((now - join) / (1000 * 60 * 60 * 24 * 30)) % 12;

    if (years === 0) {
      return `${months} ${months === 1 ? "mes" : "meses"}`;
    }
    return `${years} ${years === 1 ? "año" : "años"} ${months > 0 ? `y ${months} ${months === 1 ? "mes" : "meses"}` : ""}`;
  };

  // Función para obtener el ícono según el tipo de archivo
  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return <PictureAsPdfIcon sx={{ color: "#f44336" }} />;
    if (fileType.includes("image")) return <ImageIcon sx={{ color: "#4caf50" }} />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <DescriptionIcon sx={{ color: "#2196f3" }} />;
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return <DescriptionIcon sx={{ color: "#4caf50" }} />;
    return <InsertDriveFileIcon sx={{ color: "#757575" }} />;
  };

  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Función de filtrado
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.roleName.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term) ||
          user.region.toLowerCase().includes(term),
      );
    }

    if (selectedTab === "con-permisos") {
      filtered = filtered.filter((user) => user.uploadPermission === "permitido");
    } else if (selectedTab === "sin-permisos") {
      filtered = filtered.filter((user) => user.uploadPermission === "no-permitido");
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [users, searchTerm, selectedTab]);

  // Paginación
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  // Handlers
  const handleAddExistingUser = () => {
    setOpenAddUserDialog(true);
  };

  const handleAddUserToAssociation = (user) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const newAssociationUser = {
          ...user,
          region: "Norte",
          joinDate: new Date().toISOString().split("T")[0],
          uploadPermission: "no-permitido",
          associationCertifications: [],
          avatar: user.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
          color: getRoleColor(user.role),
          phone: "N/A",
          department: "Nuevo",
        };

        setUsers((prev) => [...prev, newAssociationUser]);
        setOpenAddUserDialog(false);

        setSnackbar({
          open: true,
          message: `Usuario ${user.name} agregado a la asociación correctamente.`,
          severity: "success",
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al agregar el usuario",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleAddCertification = (userId) => {
    const user = users.find((u) => u.id === userId);

    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message: "No puedes subir certificaciones. Este usuario no ha dado permiso de subida desde su dispositivo.",
        severity: "warning",
      });
      return;
    }

    setSelectedUser(user);
    setNewCertification({
      name: "",
      type: "operativa",
      hoursValue: "",
    });
    setCertificationFiles([]);
    setOpenCertificationDialog(true);
  };

  const handleCertificationFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setCertificationFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveCertificationFile = (index) => {
    setCertificationFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCertification = async () => {
    if (!newCertification.name) {
      setSnackbar({
        open: true,
        message: "El nombre de la certificación es obligatorio",
        severity: "warning",
      });
      return;
    }

    if (!selectedUser || selectedUser.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message: "No tienes permiso para subir certificaciones para este usuario",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      let documents = [];

      if (certificationFiles.length > 0) {
        setCertificationUploading(true);
        setCertificationUploadProgress(0);

        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setCertificationUploadProgress(i);
        }

        documents = certificationFiles.map((file, index) => ({
          id: Date.now() + index,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          uploadedBy: "admin@asociacion.com",
        }));

        setCertificationUploading(false);
      }

      const certification = {
        id: Date.now(),
        ...newCertification,
        hoursValue: newCertification.hoursValue ? parseInt(newCertification.hoursValue) : 0,
        status: "active",
        documents: documents,
      };

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                associationCertifications: [
                  ...(user.associationCertifications || []),
                  certification,
                ],
              }
            : user,
        ),
      );

      setOpenCertificationDialog(false);
      setCertificationFiles([]);

      setSnackbar({
        open: true,
        message: documents.length > 0
          ? `Certificación agregada correctamente con ${documents.length} documento(s)`
          : "Certificación agregada correctamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar la certificación",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setCertificationUploading(false);
    }
  };

  const handleEditCertification = (user, certification) => {
    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message: "No puedes editar certificaciones. Este usuario no ha dado permiso de subida desde su dispositivo.",
        severity: "warning",
      });
      return;
    }

    setSelectedUser(user);
    setSelectedCertification(certification);
    setNewCertification({
      name: certification.name,
      type: certification.type,
      hoursValue: certification.hoursValue || "",
    });
    setCertificationFiles([]);
    setOpenCertificationDialog(true);
  };

  const handleDeleteCertification = async (userId, certificationId) => {
    const user = users.find((u) => u.id === userId);

    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message: "No puedes eliminar certificaciones. Este usuario no ha dado permiso de subida desde su dispositivo.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                associationCertifications: user.associationCertifications.filter(
                  (c) => c.id !== certificationId,
                ),
              }
            : user,
        ),
      );

      setSnackbar({
        open: true,
        message: "Certificación eliminada correctamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar la certificación",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocuments = (user, certification) => {
    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message: "No puedes subir documentos. El usuario no ha dado permiso.",
        severity: "warning",
      });
      return;
    }

    setSelectedUser(user);
    setSelectedCertification(certification);
    setUploadFiles([]);
    setUploadProgress(0);
    setOpenUploadDialog(true);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (uploadFiles.length === 0) {
      setSnackbar({
        open: true,
        message: "Selecciona al menos un archivo para subir",
        severity: "warning",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      const newDocuments = uploadFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        uploadedBy: "admin@asociacion.com",
      }));

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === selectedUser.id) {
            return {
              ...user,
              associationCertifications: user.associationCertifications.map(
                (cert) => {
                  if (cert.id === selectedCertification.id) {
                    return {
                      ...cert,
                      documents: [...(cert.documents || []), ...newDocuments],
                    };
                  }
                  return cert;
                },
              ),
            };
          }
          return user;
        }),
      );

      setSnackbar({
        open: true,
        message: `${uploadFiles.length} archivo(s) subido(s) correctamente`,
        severity: "success",
      });

      setOpenUploadDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al subir los archivos",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocuments = (user, certification) => {
    setSelectedUser(user);
    setSelectedCertification(certification);
    setOpenDocumentDialog(true);
  };

  const handleDeleteDocument = async (documentId) => {
    if (!selectedUser || !selectedCertification) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === selectedUser.id) {
            return {
              ...user,
              associationCertifications: user.associationCertifications.map(
                (cert) => {
                  if (cert.id === selectedCertification.id) {
                    return {
                      ...cert,
                      documents: cert.documents.filter((doc) => doc.id !== documentId),
                    };
                  }
                  return cert;
                },
              ),
            };
          }
          return user;
        }),
      );

      setSelectedCertification((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => doc.id !== documentId),
      }));

      setSnackbar({
        open: true,
        message: "Documento eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar el documento",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: institutionalColors.success,
      comite: institutionalColors.primary,
      agente: "#526F78",
      profesionista: "#2e7d32",
      empresario: "#ed6c02",
    };
    return colors[role] || institutionalColors.textSecondary;
  };

  const getCertificationColor = (type) => {
    const certType = certificationTypes.find((t) => t.value === type);
    return certType ? certType.color : institutionalColors.textSecondary;
  };

  const tabs = [
    { value: "todos", label: `TODOS (${stats.total})`, icon: <GroupIcon /> },
    {
      value: "con-permisos",
      label: `CON PERMISOS (${stats.withPermission})`,
      icon: <CheckCircleIcon />,
    },
    {
      value: "sin-permisos",
      label: `SIN PERMISOS (${stats.withoutPermission})`,
      icon: <CancelIcon />,
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: institutionalColors.background,
        p: 2,
      }}
    >
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, bgcolor: "background.paper", border: `1px solid #e5e7eb` }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                color: institutionalColors.primary,
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              Control de Asociados
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Gestión de permisos y certificaciones de usuarios asociados
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const data = filteredUsers.map((user) => ({
                    Nombre: user.name,
                    Email: user.email,
                    Rol: user.roleName,
                    Región: user.region,
                    Departamento: user.department,
                    "Permiso Subida": user.uploadPermission === "permitido" ? "Permitido" : "No Permitido",
                    Certificaciones: user.associationCertifications?.length || 0,
                  }));

                  const csv = [
                    Object.keys(data[0]).join(","),
                    ...data.map((row) => Object.values(row).join(",")),
                  ].join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `asociados_${new Date().toISOString().split("T")[0]}.csv`;
                  a.click();

                  setSnackbar({
                    open: true,
                    message: "Datos exportados correctamente",
                    severity: "success",
                  });
                }}
                disabled={loading}
                sx={{
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  "&:hover": {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue,
                  },
                }}
              >
                Exportar CSV
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleAddExistingUser}
                disabled={loading}
                sx={{
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Agregar Asociado
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Filtro de búsqueda */}
      <Paper elevation={1} sx={{ p: 2, border: `1px solid #e5e7eb` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar asociados por nombre, email, rol, departamento o región..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon sx={{ color: institutionalColors.textSecondary }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs y tabla (se mantiene igual) */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: `1px solid #e5e7eb`,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => {
            setSelectedTab(newValue);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            "& .MuiTab-root.Mui-selected": {
              color: selectedTab === "con-permisos"
                ? institutionalColors.success
                : selectedTab === "sin-permisos"
                  ? institutionalColors.error
                  : institutionalColors.primary,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: selectedTab === "con-permisos"
                ? institutionalColors.success
                : selectedTab === "sin-permisos"
                  ? institutionalColors.error
                  : institutionalColors.primary,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 48 }}
            />
          ))}
        </Tabs>

        {/* Contenido principal - Tabla (se mantiene igual) */}
        <TableContainer sx={{ flex: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress sx={{ color: institutionalColors.primary }} />
            </Box>
          ) : (
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>Rol / Departamento</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>Región</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>Certificaciones</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>Permiso de Subida</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => {
                  const level = getRecognitionLevel(user);
                  const levelInfo = getRecognitionLevelInfo(level);

                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={
                              <Tooltip title={levelInfo.label}>
                                <Avatar
                                  sx={{
                                    width: 22,
                                    height: 22,
                                    bgcolor: levelInfo.color,
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {levelInfo.icon}
                                </Avatar>
                              </Tooltip>
                            }
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: getRoleColor(user.role),
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              {user.avatar}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Chip
                            label={user.roleName}
                            size="small"
                            sx={{
                              bgcolor: `${getRoleColor(user.role)}15`,
                              color: getRoleColor(user.role),
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          />
                          <Typography variant="caption" display="block" sx={{ color: institutionalColors.textSecondary }}>
                            {user.department}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                          <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                            {user.region}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body1" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                            {user.associationCertifications?.length || 0}
                          </Typography>
                          {user.associationCertifications?.slice(0, 2).map((cert, index) => (
                            <Chip
                              key={index}
                              label={cert.name}
                              size="small"
                              sx={{
                                bgcolor: `${getCertificationColor(cert.type)}15`,
                                color: getCertificationColor(cert.type),
                                maxWidth: 120,
                              }}
                            />
                          ))}
                          {user.associationCertifications?.length > 2 && (
                            <Chip
                              label={`+${user.associationCertifications.length - 2} más`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: institutionalColors.textSecondary,
                                color: institutionalColors.textSecondary,
                              }}
                            />
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {user.uploadPermission === "permitido" ? (
                            <>
                              <CheckCircleIcon sx={{ color: institutionalColors.success }} fontSize="small" />
                              <Typography variant="body2" sx={{ color: institutionalColors.success }}>
                                Permitido
                              </Typography>
                              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }} display="block">
                                (Usuario dio permiso)
                              </Typography>
                            </>
                          ) : (
                            <>
                              <CancelIcon sx={{ color: institutionalColors.error }} fontSize="small" />
                              <Typography variant="body2" sx={{ color: institutionalColors.error }}>
                                No Permitido
                              </Typography>
                              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }} display="block">
                                (Usuario debe dar permiso)
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenDetailsDialog(true);
                              }}
                              sx={{ color: institutionalColors.primary }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              user.uploadPermission === "permitido"
                                ? "Gestionar certificaciones"
                                : "Sin permiso del usuario para subir documentos"
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (user.uploadPermission === "permitido") {
                                    handleAddCertification(user.id);
                                  } else {
                                    setSnackbar({
                                      open: true,
                                      message: "No puedes subir certificaciones. El usuario no ha dado permiso desde su dispositivo.",
                                      severity: "warning",
                                    });
                                  }
                                }}
                                sx={{
                                  color: user.uploadPermission === "permitido"
                                    ? institutionalColors.success
                                    : institutionalColors.textSecondary,
                                }}
                              >
                                <VerifiedIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Paginación */}
        {filteredUsers.length > 0 && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              Mostrando {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
            </Typography>
            <Pagination
              count={Math.ceil(filteredUsers.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="small"
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  bgcolor: institutionalColors.primary,
                  color: "white",
                  "&:hover": { bgcolor: institutionalColors.secondary },
                },
              }}
            />
          </Stack>
        )}

        {filteredUsers.length === 0 && !loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 8, flex: 1 }}>
            <GroupIcon sx={{ fontSize: 64, color: institutionalColors.textSecondary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: institutionalColors.textSecondary }} gutterBottom>
              No se encontraron usuarios en esta categoría
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mb: 3 }}>
              {selectedTab === "todos"
                ? "No hay usuarios en la asociación"
                : selectedTab === "con-permisos"
                  ? "No hay usuarios con permisos de subida"
                  : "Todos los usuarios tienen permisos de subida"}
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddExistingUser}
              sx={{ bgcolor: institutionalColors.primary, "&:hover": { bgcolor: institutionalColors.secondary } }}
            >
              Agregar Usuarios
            </Button>
          </Box>
        )}
      </Paper>

      {/* Diálogos importados */}
      <AssociateUserDialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        availableUsers={availableUsers}
        onAddUser={handleAddUserToAssociation}
        loading={loading}
        getRoleColor={getRoleColor}
      />

      <AddCertificationDialog
        open={openCertificationDialog}
        onClose={() => {
          setOpenCertificationDialog(false);
          setSelectedCertification(null);
          setCertificationFiles([]);
        }}
        selectedUser={selectedUser}
        selectedCertification={selectedCertification}
        newCertification={newCertification}
        onCertificationChange={setNewCertification}
        certificationFiles={certificationFiles}
        onFileSelect={handleCertificationFileSelect}
        onRemoveFile={handleRemoveCertificationFile}
        onSave={handleSaveCertification}
        loading={loading}
        certificationUploading={certificationUploading}
        certificationUploadProgress={certificationUploadProgress}
        certificationTypes={certificationTypes}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />

      <UserDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        selectedUser={selectedUser}
        getRecognitionLevel={getRecognitionLevel}
        getRecognitionLevelInfo={getRecognitionLevelInfo}
        getRoleColor={getRoleColor}
        getCertificationColor={getCertificationColor}
        getMembershipDuration={getMembershipDuration}
        certificationTypes={certificationTypes}
        onEditCertification={handleEditCertification}
        onDeleteCertification={handleDeleteCertification}
        onViewDocuments={handleViewDocuments}
        onUploadDocuments={handleUploadDocuments}
      />

      <DocumentsDialog
        open={openDocumentDialog}
        onClose={() => setOpenDocumentDialog(false)}
        selectedUser={selectedUser}
        selectedCertification={selectedCertification}
        onDeleteDocument={handleDeleteDocument}
        onUploadDocuments={() => {
          setOpenDocumentDialog(false);
          handleUploadDocuments(selectedUser, selectedCertification);
        }}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />

      <UploadDocumentsDialog
        open={openUploadDialog}
        onClose={() => !uploading && setOpenUploadDialog(false)}
        selectedUser={selectedUser}
        selectedCertification={selectedCertification}
        uploadFiles={uploadFiles}
        onFileSelect={handleFileSelect}
        onRemoveFile={handleRemoveFile}
        onUpload={handleUploadFiles}
        uploading={uploading}
        uploadProgress={uploadProgress}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />
    </Box>
  );
};

export default UserManagement;