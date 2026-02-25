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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  InputAdornment,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Pagination,
  Select,
  Tabs,
  Tab,
  LinearProgress,
  Badge,
  Rating,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Download as DownloadIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  VerifiedUser as VerifiedIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Upload as UploadIcon,
  AttachFile as AttachFileIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  format,
  parseISO,
  isAfter,
  addMonths,
  differenceInYears,
} from "date-fns";
import { es } from "date-fns/locale";

// Colores institucionales
const institutionalColors = {
  primary: "#133B6B", // Azul oscuro principal
  secondary: "#1a4c7a", // Azul medio
  accent: "#e9e9e9", // Color para acentos (gris claro)
  background: "#f4f6f8", // Fondo claro
  lightBlue: "rgba(19, 59, 107, 0.08)", // Azul transparente para hover
  darkBlue: "#0D2A4D", // Azul más oscuro
  textPrimary: "#111827", // Texto principal
  textSecondary: "#6b7280", // Texto secundario
  success: "#059669", // Verde para éxito
  warning: "#d97706", // Naranja para advertencias
  error: "#dc2626", // Rojo para errores
  info: "#1976d2", // Azul para información
  // Niveles - ahora con colores más neutros
  level1: "#6b7280", // Gris para Nivel I
  level2: "#4b5563", // Gris más oscuro para Nivel II
  level3: "#1f2937", // Gris muy oscuro para Nivel III
};

// Niveles de reconocimiento - SIN nombres de metales
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

// Datos iniciales actualizados con fecha de ingreso y nivel de reconocimiento
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
    joinDate: "2023-01-15", // Fecha de ingreso a la asociación
    // El permiso lo da el usuario desde su dispositivo
    uploadPermission: "permitido", // Estado inicial: no se puede subir documentos
    associationCertifications: [
      {
        id: 1,
        name: "Curso de ética profesional y código de conducta",
        type: "Formación ética y cumplimiento ",
        hoursValue: 20, // Horas que vale la certificación
        status: "active",
        documents: [
          {
            id: 101,
            name: "certificado_aduanal_basico.pdf",
            url: "/assets/Curso de ética profesional y código de conducta.pdf",
            type: "application/pdf",
            size: 245760, // 240KB
            uploadDate: "2024-01-20T10:30:00",
            uploadedBy: "admin@asociacion.com",
          },
        ],
      },
      {
        id: 2,
        name: "Diplomado en Comercio Exterior y Legislación Aduanera",
        type: "Actualización técnica aduaner",
        hoursValue: 40, // Horas que vale la certificación
        status: "active",
        documents: [
          {
            id: 102,
            name: "Diplomado en Comercio Exterior y Legislación Aduanera.pdf",
            url: "/assets/Diplomado en Comercio Exterior y Legislación Aduanera.pdf",
            type: "application/pdf",
            size: 245760, // 240KB
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
    uploadPermission: "no-permitido", // Sin permiso de subida inicialmente
    associationCertifications: [
      {
        id: 1,
        name: "Certificación de Comité",
        type: "administrativa",
        hoursValue: 15, // Horas que vale la certificación
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
    uploadPermission: "permitido", // Usuario dio permiso desde su dispositivo
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
        hoursValue: 30, // Horas que vale la certificación
        status: "active",
        documents: [
          {
            id: 102,
            name: "certificado_auditor.pdf",
            url: "/documentos/auditor.pdf",
            type: "application/pdf",
            size: 182400, // 178KB
            uploadDate: "2024-05-15T14:20:00",
            uploadedBy: "admin@asociacion.com",
          },
          {
            id: 103,
            name: "constancia_vigencia.jpg",
            url: "/documentos/constancia.jpg",
            type: "image/jpeg",
            size: 512000, // 500KB
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
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

  // Estados para el formulario de nueva certificación - MODIFICADO: quitamos fechas y descripción, agregamos hoursValue
  const [newCertification, setNewCertification] = useState({
    name: "",
    type: "operativa",
    hoursValue: "", // Horas que vale la certificación
  });

  // Estados para subida de documentos en certificación
  const [certificationFiles, setCertificationFiles] = useState([]);
  const [certificationUploading, setCertificationUploading] = useState(false);
  const [certificationUploadProgress, setCertificationUploadProgress] =
    useState(0);
  const certificationFileInputRef = React.useRef(null);

  // Estados para subida de documentos adicionales
  const [uploadFiles, setUploadFiles] = useState([]);
  const fileInputRef = React.useRef(null);

  // Tipos de certificaciones
  const certificationTypes = [
    // NUEVAS certificaciones de formación
    {
      value: "etica_cumplimiento",
      label: "Formación ética y cumplimiento",
      color: "#455a64", // azul gris institucional
    },
    {
      value: "actualizacion_aduanera",
      label: "Actualización técnica aduanera",
      color: "#1565c0", // azul técnico
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
    if (!user || !user.associationCertifications) return 1; // Nivel I por defecto

    const certificationsCount = user.associationCertifications.length;

    if (certificationsCount >= 8) return 3; // Nivel III
    if (certificationsCount >= 4) return 2; // Nivel II
    return 1; // Nivel I
  };

  // Función para obtener información del nivel de reconocimiento
  const getRecognitionLevelInfo = (level) => {
    return (
      recognitionLevels.find((l) => l.value === level) || recognitionLevels[0]
    );
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
    if (fileType.includes("pdf")) return <PdfIcon sx={{ color: "#f44336" }} />;
    if (fileType.includes("image"))
      return <ImageIcon sx={{ color: "#4caf50" }} />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <DescriptionIcon sx={{ color: "#2196f3" }} />;
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return <DescriptionIcon sx={{ color: "#4caf50" }} />;
    return <FileIcon sx={{ color: "#757575" }} />;
  };

  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Función de filtrado mejorada con tabs
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filtro por búsqueda
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

    // Filtro por pestaña seleccionada
    if (selectedTab === "con-permisos") {
      filtered = filtered.filter(
        (user) => user.uploadPermission === "permitido",
      );
    } else if (selectedTab === "sin-permisos") {
      filtered = filtered.filter(
        (user) => user.uploadPermission === "no-permitido",
      );
    }
    // Para 'todos' no aplicamos filtro adicional

    // Ordenamiento por nombre
    filtered.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [users, searchTerm, selectedTab]);

  // Paginación
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  // Funciones de manejo
  const handleAddExistingUser = () => {
    setOpenAddUserDialog(true);
  };

  const handleAddUserToAssociation = (user) => {
    setLoading(true);
    try {
      // Simular llamada API
      setTimeout(() => {
        const newAssociationUser = {
          ...user,
          region: "Norte", // Región por defecto
          joinDate: new Date().toISOString().split("T")[0], // Fecha actual como fecha de ingreso
          uploadPermission: "no-permitido", // SIN permiso por defecto (el usuario debe dar permiso desde su dispositivo)
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
          message: `Usuario ${user.name} agregado a la asociación correctamente. El usuario debe dar permiso de subida desde su dispositivo.`,
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

  const handleCheckPermissionStatus = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        // Simular verificación del permiso desde el dispositivo del usuario
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = users.find((u) => u.id === userId);

        setSnackbar({
          open: true,
          message: `El permiso de subida lo debe dar el usuario ${user.name} desde su dispositivo. No puedes modificar este permiso.`,
          severity: "info",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al verificar el permiso",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [users],
  );

  const handleAddCertification = (userId) => {
    const user = users.find((u) => u.id === userId);

    // SOLO puedo ver certificaciones si el usuario me dio permiso
    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message:
          "No puedes subir certificaciones. Este usuario no ha dado permiso de subida desde su dispositivo.",
        severity: "warning",
      });
      return;
    }

    setSelectedUser(user);
    setNewCertification({
      name: "",
      type: "operativa",
      hoursValue: "", // Horas que vale la certificación
    });
    setCertificationFiles([]);
    setOpenCertificationDialog(true);
  };

  // Manejar selección de archivos para certificación
  const handleCertificationFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setCertificationFiles((prev) => [...prev, ...files]);
  };

  // Eliminar archivo de la lista de certificación
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

    // Verificar que el usuario tenga permiso
    if (!selectedUser || selectedUser.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message:
          "No tienes permiso para subir certificaciones para este usuario",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Si hay archivos para subir, procesarlos
      let documents = [];

      if (certificationFiles.length > 0) {
        setCertificationUploading(true);
        setCertificationUploadProgress(0);

        // Simular subida de archivos con progreso
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setCertificationUploadProgress(i);
        }

        // Crear objetos de documentos
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
        // Convertir hoursValue a número, si está vacío poner 0
        hoursValue: newCertification.hoursValue
          ? parseInt(newCertification.hoursValue)
          : 0,
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

      const message =
        documents.length > 0
          ? `Certificación agregada correctamente con ${documents.length} documento(s)`
          : "Certificación agregada correctamente";

      setSnackbar({
        open: true,
        message: message,
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
    // SOLO puedo editar si el usuario me dio permiso
    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message:
          "No puedes editar certificaciones. Este usuario no ha dado permiso de subida desde su dispositivo.",
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
    setCertificationFiles([]); // No cargamos los documentos existentes para edición
    setOpenCertificationDialog(true);
  };

  const handleDeleteCertification = async (userId, certificationId) => {
    const user = users.find((u) => u.id === userId);

    // SOLO puedo eliminar si el usuario me dio permiso
    if (user.uploadPermission !== "permitido") {
      setSnackbar({
        open: true,
        message:
          "No puedes eliminar certificaciones. Este usuario no ha dado permiso de subida desde su dispositivo.",
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
                associationCertifications:
                  user.associationCertifications.filter(
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

  // Función para subir documentos a una certificación existente
  const handleUploadDocuments = (user, certification) => {
    // Verificar permiso
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

  // Manejar selección de archivos para subida adicional
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadFiles((prev) => [...prev, ...files]);
  };

  // Eliminar archivo de la lista de subida adicional
  const handleRemoveFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Subir archivos adicionales
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
      // Simular subida con progreso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Crear objetos de documentos
      const newDocuments = uploadFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file), // En producción, esto sería la URL del servidor
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        uploadedBy: "admin@asociacion.com", // Usuario actual
      }));

      // Actualizar el estado
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

  // Ver documentos de una certificación
  const handleViewDocuments = (user, certification) => {
    setSelectedUser(user);
    setSelectedCertification(certification);
    setOpenDocumentDialog(true);
  };

  // Eliminar documento - CORREGIDO: eliminada la coma después de return user
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
                      documents: cert.documents.filter(
                        (doc) => doc.id !== documentId,
                      ),
                    };
                  }
                  return cert;
                },
              ),
            };
          }
          return user; // ← AQUÍ ESTABA EL ERROR (había una coma después de return user)
        }),
      );

      // Actualizar el estado local del diálogo
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

  // Definir las tabs (sin la de desactivados)
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
      {/* Snackbar para notificaciones */}
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
                    "Permiso Subida":
                      user.uploadPermission === "permitido"
                        ? "Permitido"
                        : "No Permitido",
                    Certificaciones:
                      user.associationCertifications?.length || 0,
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
                    <SearchIcon
                      sx={{ color: institutionalColors.textSecondary }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon
                        sx={{ color: institutionalColors.textSecondary }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs de navegación */}
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
              color:
                selectedTab === "con-permisos"
                  ? institutionalColors.success
                  : selectedTab === "sin-permisos"
                    ? institutionalColors.error
                    : institutionalColors.primary,
            },
            "& .MuiTabs-indicator": {
              backgroundColor:
                selectedTab === "con-permisos"
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
              sx={{
                minHeight: 48,
              }}
            />
          ))}
        </Tabs>

        {/* Contenido principal */}
        <TableContainer sx={{ flex: 1 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <CircularProgress sx={{ color: institutionalColors.primary }} />
            </Box>
          ) : (
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                  >
                    Usuario
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                  >
                    Rol / Departamento
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                  >
                    Región
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                  >
                    Certificaciones
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                  >
                    Permiso de Subida
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                    align="center"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => {
                  const level = getRecognitionLevel(user);
                  const levelInfo = getRecognitionLevelInfo(level);

                  return (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
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
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              sx={{ color: institutionalColors.textPrimary }}
                            >
                              {user.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: institutionalColors.textSecondary }}
                            >
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
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ color: institutionalColors.textSecondary }}
                          >
                            {user.department}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationIcon
                            fontSize="small"
                            sx={{ color: institutionalColors.textSecondary }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {user.region}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {user.associationCertifications?.length || 0}
                          </Typography>
                          {user.associationCertifications
                            ?.slice(0, 2)
                            .map((cert, index) => (
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {user.uploadPermission === "permitido" ? (
                            <>
                              <CheckCircleIcon
                                sx={{ color: institutionalColors.success }}
                                fontSize="small"
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: institutionalColors.success }}
                              >
                                Permitido
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: institutionalColors.textSecondary,
                                }}
                                display="block"
                              >
                                (Usuario dio permiso)
                              </Typography>
                            </>
                          ) : (
                            <>
                              <CancelIcon
                                sx={{ color: institutionalColors.error }}
                                fontSize="small"
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: institutionalColors.error }}
                              >
                                No Permitido
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: institutionalColors.textSecondary,
                                }}
                                display="block"
                              >
                                (Usuario debe dar permiso)
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
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
                                      message:
                                        "No puedes subir certificaciones. El usuario no ha dado permiso desde su dispositivo.",
                                      severity: "warning",
                                    });
                                  }
                                }}
                                sx={{
                                  color:
                                    user.uploadPermission === "permitido"
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
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Mostrando {(page - 1) * rowsPerPage + 1} -{" "}
              {Math.min(page * rowsPerPage, filteredUsers.length)} de{" "}
              {filteredUsers.length} usuarios
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
                  "&:hover": {
                    bgcolor: institutionalColors.secondary,
                  },
                },
              }}
            />
          </Stack>
        )}

        {filteredUsers.length === 0 && !loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 8,
              flex: 1,
            }}
          >
            <GroupIcon
              sx={{
                fontSize: 64,
                color: institutionalColors.textSecondary,
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: institutionalColors.textSecondary }}
              gutterBottom
            >
              No se encontraron usuarios en esta categoría
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary, mb: 3 }}
            >
              {selectedTab === "todos"
                ? "No hay usuarios en la asociación"
                : selectedTab === "con-permisos"
                  ? "No hay usuarios con permisos de subida"
                  : "Todos los usuarios tienen permisos de subida"}
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddExistingUser}
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": {
                  bgcolor: institutionalColors.secondary,
                },
              }}
            >
              Agregar Usuarios
            </Button>
          </Box>
        )}
      </Paper>

      {/* Diálogo para agregar usuarios existentes */}
      <Dialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <PersonAddIcon sx={{ color: institutionalColors.primary }} />
            <Typography
              variant="h6"
              sx={{ color: institutionalColors.textPrimary }}
            >
              Agregar Usuario Existente a la Asociación
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{ color: institutionalColors.textSecondary }}
            paragraph
          >
            Selecciona un usuario existente en el sistema para agregarlo a tu
            asociación.
            <strong> IMPORTANTE:</strong> El permiso para subir documentos lo
            debe dar el usuario desde su dispositivo.
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: institutionalColors.primary }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ color: institutionalColors.primary }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: institutionalColors.primary }}>
                    Rol
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: institutionalColors.primary }}
                  >
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: getRoleColor(user.role),
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{ color: institutionalColors.textPrimary }}
                        >
                          {user.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: institutionalColors.textSecondary }}
                      >
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.roleName}
                        size="small"
                        sx={{
                          bgcolor: `${getRoleColor(user.role)}15`,
                          color: getRoleColor(user.role),
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAddUserToAssociation(user)}
                        disabled={loading}
                        sx={{
                          bgcolor: institutionalColors.primary,
                          "&:hover": {
                            bgcolor: institutionalColors.secondary,
                          },
                        }}
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddUserDialog(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para agregar/editar certificación CON CARGA DE ARCHIVOS - MODIFICADO */}
      <Dialog
        open={openCertificationDialog}
        onClose={() =>
          !certificationUploading && setOpenCertificationDialog(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            sx={{ color: institutionalColors.textPrimary }}
          >
            {selectedCertification
              ? "Editar Certificación"
              : "Nueva Certificación"}
          </Typography>
          <Typography
            variant="caption"
            display="block"
            sx={{ color: institutionalColors.textSecondary }}
          >
            {selectedUser?.uploadPermission === "permitido"
              ? "Permiso de subida concedido por el usuario"
              : "No tienes permiso para subir documentos para este usuario"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Usuario: <strong>{selectedUser?.name}</strong>
            </Typography>

            {selectedUser?.uploadPermission !== "permitido" ? (
              <Alert severity="warning" sx={{ mt: 1 }}>
                No puedes subir certificaciones. Este usuario no ha dado permiso
                de subida desde su dispositivo.
              </Alert>
            ) : (
              <>
                {/* Datos de la certificación - MODIFICADO: quitamos fechas y descripción, agregamos hoursValue */}
                <TextField
                  label="Nombre de la certificación"
                  value={newCertification.name}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      name: e.target.value,
                    })
                  }
                  fullWidth
                  required
                  disabled={certificationUploading}
                />

                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": { color: institutionalColors.primary },
                    }}
                  >
                    Tipo de certificación
                  </InputLabel>
                  <Select
                    value={newCertification.type}
                    onChange={(e) =>
                      setNewCertification({
                        ...newCertification,
                        type: e.target.value,
                      })
                    }
                    label="Tipo de certificación"
                    disabled={certificationUploading}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: institutionalColors.primary,
                      },
                    }}
                  >
                    {certificationTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: type.color,
                            }}
                          />
                          <span>{type.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Horas que vale"
                  type="number"
                  value={newCertification.hoursValue}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      hoursValue: e.target.value,
                    })
                  }
                  fullWidth
                  disabled={certificationUploading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">horas</InputAdornment>
                    ),
                  }}
                />

                <Divider sx={{ my: 1 }}>
                  <Chip label="DOCUMENTOS" size="small" />
                </Divider>

                {/* Área de carga de documentos */}
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: institutionalColors.primary,
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    bgcolor: institutionalColors.lightBlue,
                    cursor: certificationUploading ? "not-allowed" : "pointer",
                    opacity: certificationUploading ? 0.7 : 1,
                    "&:hover": {
                      bgcolor: certificationUploading
                        ? "rgba(19, 59, 107, 0.08)"
                        : "rgba(19, 59, 107, 0.12)",
                    },
                  }}
                  onClick={() =>
                    !certificationUploading &&
                    certificationFileInputRef.current?.click()
                  }
                >
                  <input
                    type="file"
                    ref={certificationFileInputRef}
                    onChange={handleCertificationFileSelect}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    disabled={certificationUploading}
                    style={{ display: "none" }}
                  />
                  <UploadIcon
                    sx={{
                      fontSize: 48,
                      color: institutionalColors.primary,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: institutionalColors.textPrimary }}
                    gutterBottom
                  >
                    Haz clic para adjuntar documentos
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: institutionalColors.textSecondary }}
                  >
                    Sube los archivos relacionados con esta certificación
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: institutionalColors.textSecondary,
                      display: "block",
                      mt: 1,
                    }}
                  >
                    Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB por
                    archivo)
                  </Typography>
                </Box>

                {/* Lista de archivos seleccionados */}
                {certificationFiles.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: institutionalColors.textPrimary, mb: 1 }}
                    >
                      Documentos a adjuntar ({certificationFiles.length})
                    </Typography>
                    <List dense>
                      {certificationFiles.map((file, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() =>
                                handleRemoveCertificationFile(index)
                              }
                              disabled={certificationUploading}
                            >
                              <DeleteIcon
                                fontSize="small"
                                sx={{ color: institutionalColors.error }}
                              />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                          <ListItemText
                            primary={file.name}
                            secondary={formatFileSize(file.size)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Barra de progreso de subida */}
                {certificationUploading && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress
                      variant="determinate"
                      value={certificationUploadProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: institutionalColors.accent,
                        "& .MuiLinearProgress-bar": {
                          bgcolor: institutionalColors.primary,
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: institutionalColors.textSecondary,
                        mt: 1,
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      Subiendo documentos... {certificationUploadProgress}%
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCertificationDialog(false);
              setSelectedCertification(null);
              setCertificationFiles([]);
            }}
            disabled={loading || certificationUploading}
          >
            Cancelar
          </Button>
          {selectedUser?.uploadPermission === "permitido" && (
            <Button
              onClick={handleSaveCertification}
              variant="contained"
              disabled={loading || certificationUploading}
              startIcon={
                loading || certificationUploading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": {
                  bgcolor: institutionalColors.secondary,
                },
              }}
            >
              {loading || certificationUploading
                ? "Guardando..."
                : selectedCertification
                  ? "Actualizar"
                  : certificationFiles.length > 0
                    ? `Agregar con ${certificationFiles.length} documento(s)`
                    : "Agregar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Diálogo de detalles del usuario con nivel de reconocimiento */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}

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
        {selectedUser && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Tooltip
                      title={
                        getRecognitionLevelInfo(
                          getRecognitionLevel(selectedUser),
                        ).label
                      }
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: getRecognitionLevelInfo(
                            getRecognitionLevel(selectedUser),
                          ).color,
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          border: "2px solid white",
                        }}
                      >
                        {
                          getRecognitionLevelInfo(
                            getRecognitionLevel(selectedUser),
                          ).icon
                        }
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
                {/* ================= INFO PERSONAL ================= */}
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
                          secondary={getMembershipDuration(
                            selectedUser.joinDate,
                          )}
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
                        {/* Icono izquierdo */}
                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                          <VerifiedIcon
                            sx={{
                              color: institutionalColors.textSecondary,
                              fontSize: 20,
                            }}
                          />
                        </ListItemIcon>

                        {/* Contenido */}
                        <Box sx={{ width: "100%" }}>
                          {/* Título */}
                          <Typography
                            sx={{
                              color: institutionalColors.textSecondary,
                              fontSize: "0.75rem",
                              mb: 0.5,
                            }}
                          >
                            Nivel de asociado
                          </Typography>

                          {/* Nivel */}
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: getRecognitionLevelInfo(
                                  getRecognitionLevel(selectedUser),
                                ).color,
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                getRecognitionLevelInfo(
                                  getRecognitionLevel(selectedUser),
                                ).icon
                              }
                            </Avatar>

                            <Box>
                              <Typography
                                sx={{
                                  color: getRecognitionLevelInfo(
                                    getRecognitionLevel(selectedUser),
                                  ).color,
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                  lineHeight: 1.2,
                                }}
                              >
                                {
                                  getRecognitionLevelInfo(
                                    getRecognitionLevel(selectedUser),
                                  ).label
                                }
                              </Typography>

                              <Typography
                                sx={{
                                  color: institutionalColors.textSecondary,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {selectedUser.associationCertifications
                                  ?.length || 0}{" "}
                                certificaciones
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>

                {/* ================= CERTIFICACIONES ================= */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />

                  {/* HEADER + PERMISO */}
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
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <Table size="small">
                        <TableHead sx={{ bgcolor: "#f8fafc" }}>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: institutionalColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              Certificación
                            </TableCell>
                            <TableCell
                              sx={{
                                color: institutionalColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              Tipo
                            </TableCell>
                            <TableCell
                              sx={{
                                color: institutionalColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              Horas
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                color: institutionalColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              Documentos
                            </TableCell>

                            
                            <TableCell
                              align="right"
                              sx={{
                                color: institutionalColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              Acciones
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUser.associationCertifications.map(
                            (cert) => (
                              <TableRow
                                key={cert.id}
                                hover
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    fontWeight="500"
                                    sx={{
                                      color: institutionalColors.textPrimary,
                                    }}
                                  >
                                    {cert.name}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Chip
                                    label={
                                      certificationTypes.find(
                                        (t) => t.value === cert.type,
                                      )?.label || cert.type
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
                                      onClick={() =>
                                        handleViewDocuments(selectedUser, cert)
                                      }
                                      disabled={
                                        selectedUser.uploadPermission !==
                                        "permitido"
                                      }
                                      sx={{
                                        color: institutionalColors.primary,
                                        "&.Mui-disabled": {
                                          color:
                                            institutionalColors.textSecondary,
                                          opacity: 0.5,
                                        },
                                      }}
                                    >
                                      <AttachFileIcon fontSize="small" />
                                    </IconButton>
                                  </Badge>
                                </TableCell>

                                <TableCell align="right">
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    justifyContent="flex-end"
                                  >
                                    <Tooltip title="Editar certificación">
                                      <span>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleEditCertification(
                                              selectedUser,
                                              cert,
                                            )
                                          }
                                          disabled={
                                            selectedUser.uploadPermission !==
                                            "permitido"
                                          }
                                          sx={{
                                            color:
                                              selectedUser.uploadPermission ===
                                              "permitido"
                                                ? institutionalColors.primary
                                                : institutionalColors.textSecondary,
                                            opacity:
                                              selectedUser.uploadPermission ===
                                              "permitido"
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
                                          onClick={() =>
                                            handleDeleteCertification(
                                              selectedUser.id,
                                              cert.id,
                                            )
                                          }
                                          disabled={
                                            selectedUser.uploadPermission !==
                                            "permitido"
                                          }
                                          sx={{
                                            color: institutionalColors.error,
                                            opacity:
                                              selectedUser.uploadPermission ===
                                              "permitido"
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
                            ),
                          )}
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
                        sx={{
                          color: institutionalColors.textSecondary,
                          fontWeight: 500,
                        }}
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

            <DialogActions
              sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
            >
              <Button
                onClick={() => setOpenDetailsDialog(false)}
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
          </>
        )}
      </Dialog>

      {/* Diálogo para ver documentos */}
      <Dialog
        open={openDocumentDialog}
        onClose={() => setOpenDocumentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedCertification && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachFileIcon sx={{ color: institutionalColors.primary }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    Documentos de {selectedCertification.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: institutionalColors.textSecondary }}
                  >
                    Usuario: {selectedUser?.name}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>

            <DialogContent dividers>
              {selectedCertification.documents?.length > 0 ? (
                <List>
                  {selectedCertification.documents.map((doc) => (
                    <ListItem
                      key={doc.id}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          {selectedUser?.uploadPermission === "permitido" && (
                            <Tooltip title="Eliminar">
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteDocument(doc.id)}
                                sx={{ color: institutionalColors.error }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      }
                    >
                      <ListItemIcon>{getFileIcon(doc.type)}</ListItemIcon>
                      <ListItemText
                        primary={doc.name}
                        secondary={
                          <Stack direction="row" spacing={2} component="span">
                            <Typography variant="caption" component="span">
                              {formatFileSize(doc.size)}
                            </Typography>
                            <Typography variant="caption" component="span">
                              {format(
                                parseISO(doc.uploadDate),
                                "dd/MM/yyyy HH:mm",
                                { locale: es },
                              )}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <AttachFileIcon
                    sx={{
                      fontSize: 48,
                      color: institutionalColors.textSecondary,
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: institutionalColors.textSecondary }}
                    gutterBottom
                  >
                    No hay documentos para esta certificación
                  </Typography>
                  {selectedUser?.uploadPermission === "permitido" && (
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      onClick={() => {
                        setOpenDocumentDialog(false);
                        handleUploadDocuments(
                          selectedUser,
                          selectedCertification,
                        );
                      }}
                      sx={{
                        mt: 2,
                        bgcolor: institutionalColors.primary,
                        "&:hover": { bgcolor: institutionalColors.secondary },
                      }}
                    >
                      Subir Documentos
                    </Button>
                  )}
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenDocumentDialog(false)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo para subir documentos adicionales */}
      <Dialog
        open={openUploadDialog}
        onClose={() => !uploading && setOpenUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <UploadIcon sx={{ color: institutionalColors.primary }} />
            <Box>
              <Typography
                variant="h6"
                sx={{ color: institutionalColors.textPrimary }}
              >
                Subir Documentos Adicionales
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: institutionalColors.textSecondary }}
              >
                {selectedCertification?.name} - {selectedUser?.name}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: institutionalColors.primary,
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                bgcolor: institutionalColors.lightBlue,
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.7 : 1,
                "&:hover": {
                  bgcolor: uploading
                    ? "rgba(19, 59, 107, 0.08)"
                    : "rgba(19, 59, 107, 0.12)",
                },
              }}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                disabled={uploading}
                style={{ display: "none" }}
              />
              <UploadIcon
                sx={{ fontSize: 48, color: institutionalColors.primary, mb: 1 }}
              />
              <Typography
                variant="body1"
                sx={{ color: institutionalColors.textPrimary }}
                gutterBottom
              >
                Haz clic para seleccionar archivos
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: institutionalColors.textSecondary }}
              >
                o arrastra y suelta los archivos aquí
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: institutionalColors.textSecondary,
                  display: "block",
                  mt: 1,
                }}
              >
                Formatos permitidos: PDF, JPG, PNG, DOC, DOCX (Máx. 10MB)
              </Typography>
            </Box>

            {uploadFiles.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: institutionalColors.textPrimary, mb: 1 }}
                >
                  Archivos seleccionados ({uploadFiles.length})
                </Typography>
                <List dense>
                  {uploadFiles.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                          disabled={uploading}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: institutionalColors.error }}
                          />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={formatFileSize(file.size)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {uploading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: institutionalColors.accent,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: institutionalColors.primary,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: institutionalColors.textSecondary,
                    mt: 1,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Subiendo... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenUploadDialog(false)}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadFiles}
            disabled={uploadFiles.length === 0 || uploading}
            startIcon={
              uploading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <UploadIcon />
              )
            }
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": { bgcolor: institutionalColors.secondary },
            }}
          >
            {uploading ? "Subiendo..." : "Subir Archivos"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
