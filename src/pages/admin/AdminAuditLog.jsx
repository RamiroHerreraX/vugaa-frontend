// src/pages/audit/AuditLog.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Gavel as GavelIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Downloading as DownloadingIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon
} from '@mui/icons-material';

// Librerías para exportación
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Paleta corporativa
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
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db'
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    light: '#6C5CE7'
  },
  semaforo: {
    rojo: '#D32F2F',
    amarillo: '#FFC107',
    verde: '#388E3C'
  }
};

// Configuración de estados
const statusConfig = {
  'Aceptados': {
    label: 'Aceptados',
    color: colors.status.success,
    bgColor: '#e8f5e9',
    icon: <CheckCircleIcon />,
    description: 'Certificación validada y activa'
  },
  'En revisión': {
    label: 'En revisión',
    color: colors.status.warning,
    bgColor: '#fff3e0',
    icon: <PendingIcon />,
    description: 'En proceso de validación por el comité'
  },
  'Registro': {
    label: 'Registro',
    color: colors.primary.light,
    bgColor: '#e1f5fe',
    icon: <InfoIcon />,
    description: 'Registro inicial'
  }
};

const AdminAuditLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 10;

  // Estados para exportación
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');
  const [exportScope, setExportScope] = useState('filtered');
  const [exportLoading, setExportLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ===================================================
  // DATOS DE AUDITORÍA EN EL ORDEN EXACTO SOLICITADO
  // ===================================================
  const auditLogs = [
    // ===================================================
    // BLOQUE 1: AGENTE ADUANAL - PRIMERA SESIÓN (26/02/2026)
    // ===================================================
    {
      id: 1,
      timestamp: "26/02/2026 12:26:00",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión exitoso",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicio de sesión desde dispositivo principal",
      ip: "192.168.1.105",
      severity: "info",
      status: "Aceptados",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 2,
      timestamp: "26/02/2026 12:27:00",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "DOCUMENT_UPLOAD",
      actionName: "Documento subido",
      entity: "Expediente",
      entityId: "DOC-2026-001",
      details: "Se subió el acta de nacimiento al expediente digital",
      ip: "192.168.1.105",
      severity: "success",
      status: "Aceptados",
      icon: <CloudUploadIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 3,
      timestamp: "26/02/2026 12:29:22",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "CERTIFICATION_CREATE",
      actionName: "Certificación creada",
      entity: "Certificación",
      entityId: "CET-2025-001",
      details: "Curso de Ética Profesional y Código de Conducta",
      ip: "192.168.1.105",
      severity: "success",
      status: "En revisión",
      icon: <VerifiedIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 4,
      timestamp: "26/02/2026 12:30:22",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "CERTIFICATION_CREATE",
      actionName: "Certificación creada",
      entity: "Certificación",
      entityId: "DCE-2025-002",
      details: "Diplomado en Comercio Exterior y Legislación Aduanera",
      ip: "192.168.1.105",
      severity: "success",
      status: "En revisión",
      icon: <VerifiedIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 5,
      timestamp: "26/02/2026 12:32:00",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "DECLARACION_ACCEPTED",
      actionName: "Declaración aceptada",
      entity: "Cumplimiento",
      entityId: "DEC-2026-001",
      details: "Se aceptó la declaración de buena fe y veracidad",
      ip: "192.168.1.105",
      severity: "success",
      status: "Aceptados",
      icon: <AssignmentTurnedInIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 6,
      timestamp: "26/02/2026 12:34:50",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "CONFLICTO_INTERESES_COMPLETED",
      actionName: "Declaración completada",
      entity: "Cumplimiento",
      entityId: "ART-92-2026",
      details: "Se completó la declaración de conflicto de intereses (Artículo 92)",
      ip: "192.168.1.105",
      severity: "success",
      status: "Aceptados",
      icon: <GavelIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 7,
      timestamp: "26/02/2026 12:36:00",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "AUTORIZACION_ASOCIACION",
      actionName: "Autorización otorgada",
      entity: "Documentos",
      entityId: "AUT-2026-001",
      details: "Se aceptó que la asociación suba los documentos al sistema",
      ip: "192.168.1.105",
      severity: "info",
      status: "Aceptados",
      icon: <AssignmentTurnedInIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 8,
      timestamp: "26/02/2026 12:36:15",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "LOGOUT",
      actionName: "Cierre de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Cierre de sesión exitoso",
      ip: "192.168.1.105",
      severity: "info",
      status: "Aceptados",
      icon: <LogoutIcon />,
      instanceName: "Instancia Principal",
    },

    // ===================================================
    // BLOQUE 2: ASOCIACIÓN ADUANAL DEL NORTE (15/01/2026)
    // ===================================================
    {
      id: 9,
      timestamp: "15/01/2026 10:30:15",
      user: {
        name: "Carlos Mendoza",
        role: "asociacion_admin",
        avatar: "CM",
        email: "carlos.mendoza@aduanaldelnorte.mx",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicio de sesión - Asociación Aduanal del Norte, S.A. de C.V.",
      ip: "192.168.1.110",
      severity: "info",
      status: "Aceptados",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 10,
      timestamp: "15/01/2026 10:45:10",
      user: {
        name: "Carlos Mendoza",
        role: "asociacion_admin",
        avatar: "CM",
        email: "carlos.mendoza@aduanaldelnorte.mx",
      },
      action: "CERTIFICATION_UPLOAD",
      actionName: "Certificación subida",
      entity: "Certificación",
      entityId: "CERT-2026-00145",
      details: "Subió una certificación al usuario Luis Rodríguez",
      ip: "192.168.1.150",
      severity: "success",
      status: "Registro",
      icon: <VerifiedIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 11,
      timestamp: "15/01/2026 10:50:00",
      user: {
        name: "Carlos Mendoza",
        role: "asociacion_admin",
        avatar: "CM",
        email: "carlos.mendoza@aduanaldelnorte.mx",
      },
      action: "LOGOUT",
      actionName: "Cierre de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Cierre de sesión - Asociación Aduanal del Norte, S.A. de C.V.",
      ip: "192.168.1.110",
      severity: "info",
      status: "Aceptados",
      icon: <LogoutIcon />,
      instanceName: "Instancia Principal",
    },

    // ===================================================
    // BLOQUE 3: INICIO DE SESIÓN DEL COMITÉ - María González
    // ===================================================
    {
      id: 12,
      timestamp: "26/02/2026 12:40:00",
      user: {
        name: "María González",
        role: "comite",
        avatar: "MG",
        email: "maria.gonzalez@comite.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión exitoso",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicio de sesión desde equipo de comité evaluador",
      ip: "192.168.1.150",
      severity: "info",
      status: "Aceptados",
      icon: <LoginIcon />,
      instanceName: "Instancia de Comité",
    },

    // ===================================================
    // BLOQUE 4: REVISIÓN Y ACEPTACIÓN DE CERTIFICACIONES
    // ===================================================
    {
      id: 13,
      timestamp: "26/02/2026 12:45:00",
      user: {
        name: "María González",
        role: "comite",
        avatar: "MG",
        email: "maria.gonzalez@comite.edu",
      },
      action: "CERTIFICATION_APPROVE",
      actionName: "Certificación aprobada",
      entity: "Certificación",
      entityId: "CET-2025-001",
      details: "Aprobación del Curso de Ética Profesional por el comité",
      ip: "192.168.1.150",
      severity: "success",
      status: "Aceptados",
      icon: <CheckCircleIcon />,
      instanceName: "Instancia de Comité",
    },
    {
      id: 14,
      timestamp: "26/02/2026 12:48:00",
      user: {
        name: "María González",
        role: "comite",
        avatar: "MG",
        email: "maria.gonzalez@comite.edu",
      },
      action: "CERTIFICATION_APPROVE",
      actionName: "Certificación aprobada",
      entity: "Certificación",
      entityId: "DCE-2025-002",
      details: "Aprobación del Diplomado en Comercio Exterior por el comité",
      ip: "192.168.1.150",
      severity: "success",
      status: "Aceptados",
      icon: <CheckCircleIcon />,
      instanceName: "Instancia de Comité",
    },

    // ===================================================
    // BLOQUE 5: CIERRE DE SESIÓN DEL COMITÉ
    // ===================================================
    {
      id: 15,
      timestamp: "26/02/2026 12:50:00",
      user: {
        name: "María González",
        role: "comite",
        avatar: "MG",
        email: "maria.gonzalez@comite.edu",
      },
      action: "LOGOUT",
      actionName: "Cierre de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Cierre de sesión exitoso",
      ip: "192.168.1.150",
      severity: "info",
      status: "Aceptados",
      icon: <LogoutIcon />,
      instanceName: "Instancia de Comité",
    },

    // ===================================================
    // BLOQUE 6: AGENTE ADUANAL - SEGUNDA SESIÓN
    // ===================================================
    {
      id: 16,
      timestamp: "26/02/2026 10:43:49",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión exitoso",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicio de sesión desde dispositivo principal",
      ip: "192.168.1.105",
      severity: "info",
      status: "Aceptados",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 17,
      timestamp: "26/02/2026 12:44:12",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "RECONOCIMIENTO_DOWNLOAD",
      actionName: "Documento descargado",
      entity: "Certificaciones",
      entityId: "REC-2026-001",
      details: "Se descargó el reconocimiento de nivel gremial",
      ip: "192.168.1.105",
      severity: "info",
      status: "Aceptados",
      icon: <DownloadingIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 18,
      timestamp: "26/02/2026 12:50:30",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@agencia.edu",
      },
      action: "LOGOUT",
      actionName: "Cierre de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Cierre de sesión exitoso",
      ip: "192.168.1.105",
      severity: "info",
      status: "Aceptados",
      icon: <LogoutIcon />,
      instanceName: "Instancia Principal",
    },

    // ===================================================
    // BLOQUE 7: ADMIN (YO) - AL FINAL
    // ===================================================
    {
      id: 19,
      timestamp: "15/01/2026 10:30:15",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicié sesión en el sistema desde IP 192.168.1.100",
      ip: "192.168.1.100",
      severity: "info",
      status: "Aceptados",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    }
  ];

  const actionTypes = [
    { value: 'all', label: 'Todas las acciones' },
    { value: 'LOGIN', label: 'Accesos al sistema' },
    { value: 'CERTIFICATION', label: 'Certificaciones' },
    { value: 'DOCUMENT', label: 'Documentos' },
    { value: 'DECLARACION', label: 'Declaraciones' },
  ];

  const users = [
    { value: 'all', label: 'Todos los usuarios' },
    { value: 'admin', label: 'Administradores' },
    { value: 'comite', label: 'Comité' },
    { value: 'agente', label: 'Agentes Aduanales' },
    { value: 'asociacion_admin', label: 'Admin. Asociación' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return colors.status.success;
      case 'info': return colors.status.info;
      case 'warning': return colors.status.warning;
      case 'error': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'success': return 'Éxito';
      case 'info': return 'Informativo';
      case 'warning': return 'Advertencia';
      case 'error': return 'Error';
      default: return severity;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return colors.primary.dark;
      case 'comite': return colors.accents.purple;
      case 'agente': return colors.secondary.main;
      case 'asociacion_admin': return colors.accents.blue;
      default: return colors.text.secondary;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'comite': return 'Comité';
      case 'agente': return 'Agente Aduanal';
      case 'asociacion_admin': return 'Admin. Asociación';
      default: return role;
    }
  };

  const getStatusChip = (status) => {
    if (!status) return null;

    const config = statusConfig[status] || statusConfig['Aceptados'];

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.bgColor,
          color: config.color,
          border: `1px solid ${config.color}40`,
          fontWeight: '600',
          fontSize: '0.7rem',
          height: '22px',
          '& .MuiChip-icon': {
            color: config.color,
            fontSize: '14px'
          }
        }}
      />
    );
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' ? true : log.action.includes(filterType);

    const matchesUser =
      filterUser === 'all' ? true : log.user.role === filterUser;

    return matchesSearch && matchesType && matchesUser;
  });

  const reversedLogs = [...filteredLogs].reverse();
  const paginatedLogs = reversedLogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  // Estadísticas
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => log.timestamp.includes('26/02/2026')).length,
    bySeverity: {
      info: auditLogs.filter(log => log.severity === 'info').length,
      success: auditLogs.filter(log => log.severity === 'success').length,
      warning: auditLogs.filter(log => log.severity === 'warning').length,
      error: auditLogs.filter(log => log.severity === 'error').length,
    },
    byUserType: {
      admin: auditLogs.filter(log => log.user.role === 'admin').length,
      comite: auditLogs.filter(log => log.user.role === 'comite').length,
      agente: auditLogs.filter(log => log.user.role === 'agente').length,
      asociacion_admin: auditLogs.filter(log => log.user.role === 'asociacion_admin').length,
    },
    byStatus: {
      aceptados: auditLogs.filter(log => log.status === 'Aceptados').length,
      enRevision: auditLogs.filter(log => log.status === 'En revisión').length,
      registro: auditLogs.filter(log => log.status === 'Registro').length,
    }
  };

  // Función para abrir modal de detalles
  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  // Handlers para exportación
  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };

  const handleExport = async () => {
    setExportLoading(true);

    try {
      const dataToExport = exportScope === 'all' ? auditLogs : filteredLogs;

      // Preparar datos para exportación
      const exportData = dataToExport.map(log => ({
        'Fecha': log.timestamp.split(' ')[0],
        'Hora': log.timestamp.split(' ')[1],
        'Usuario': log.user.name,
        'Rol': getRoleText(log.user.role),
        'Acción': log.actionName,
        'Tipo': getSeverityText(log.severity),
        'Estado': log.status || 'N/A',
        'Entidad': log.entity,
        'ID Entidad': log.entityId,
        'Detalles': log.details,
        'IP': log.ip
      }));

      if (exportFormat === 'excel') {
        exportToExcel(exportData);
      } else {
        exportToPDF(exportData, dataToExport);
      }

      setSnackbar({
        open: true,
        message: `Log exportado exitosamente a ${exportFormat === 'excel' ? 'Excel' : 'PDF'}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al exportar el log',
        severity: 'error'
      });
    } finally {
      setExportLoading(false);
      setExportDialogOpen(false);
    }
  };

  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);

    const colWidths = [
      { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
      { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Auditoría');

    const summaryData = [
      ['Resumen de Auditoría'],
      [''],
      ['Total de Eventos', stats.total],
      ['Eventos de Hoy', stats.today],
      [''],
      ['Por Tipo:'],
      ['Informativos', stats.bySeverity.info],
      ['Éxitos', stats.bySeverity.success],
      ['Advertencias', stats.bySeverity.warning],
      ['Errores', stats.bySeverity.error],
      [''],
      ['Por Rol:'],
      ['Administradores', stats.byUserType.admin],
      ['Comité', stats.byUserType.comite],
      ['Agentes Aduanales', stats.byUserType.agente],
      ['Admin. Asociación', stats.byUserType.asociacion_admin],
      [''],
      ['Por Estado:'],
      ['Aceptados', stats.byStatus.aceptados],
      ['En Revisión', stats.byStatus.enRevision],
      ['Registro', stats.byStatus.registro],
      [''],
      ['Fecha de Exportación:', new Date().toLocaleString()],
      ['Filtros Aplicados:', filterType !== 'all' ? `Tipo: ${filterType}` : 'Todos', filterUser !== 'all' ? `Usuario: ${filterUser}` : 'Todos']
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    const fileName = `auditoria_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const exportToPDF = (data, originalData) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(19, 59, 107);
    doc.text('Reporte de Auditoría', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de exportación: ${new Date().toLocaleString()}`, 14, 30);

    doc.setFontSize(12);
    doc.setTextColor(13, 42, 77);
    doc.text('Resumen', 14, 40);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total de Eventos: ${stats.total}`, 20, 48);
    doc.text(`Eventos de Hoy: ${stats.today}`, 20, 55);
    doc.text(`Informativos: ${stats.bySeverity.info} | Éxitos: ${stats.bySeverity.success} | Advertencias: ${stats.bySeverity.warning} | Errores: ${stats.bySeverity.error}`, 20, 62);

    if (filterType !== 'all' || filterUser !== 'all') {
      doc.text('Filtros aplicados:', 20, 72);
      if (filterType !== 'all') {
        const filterLabel = actionTypes.find(t => t.value === filterType)?.label || filterType;
        doc.text(`- Tipo: ${filterLabel}`, 25, 79);
      }
      if (filterUser !== 'all') {
        const userLabel = users.find(u => u.value === filterUser)?.label || filterUser;
        doc.text(`- Usuario: ${userLabel}`, 25, 86);
      }
    }

    const tableData = data.map(item => [
      item.Fecha, item.Hora, item.Usuario, item.Rol,
      item.Acción, item.Tipo, item.Estado, item.Entidad, item['ID Entidad']
    ]);

    autoTable(doc, {
      head: [['Fecha', 'Hora', 'Usuario', 'Rol', 'Acción', 'Tipo', 'Estado', 'Entidad', 'ID']],
      body: tableData,
      startY: filterType !== 'all' || filterUser !== 'all' ? 95 : 72,
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: {
        fillColor: [19, 59, 107],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 245, 250] },
      columnStyles: {
        0: { cellWidth: 18 }, 1: { cellWidth: 15 }, 2: { cellWidth: 25 },
        3: { cellWidth: 18 }, 4: { cellWidth: 30 }, 5: { cellWidth: 15 },
        6: { cellWidth: 18 }, 7: { cellWidth: 18 }, 8: { cellWidth: 18 }
      }
    });

    const fileName = `auditoria_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterUser('all');
    setPage(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2.5,
      backgroundColor: '#f5f7fa'
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
              Auditoría y Trazabilidad
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Registro completo de todas las acciones realizadas en el sistema
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
              onClick={handleExportClick}
              sx={{
                borderColor: colors.primary.main,
                color: colors.primary.main,
                '&:hover': {
                  borderColor: colors.primary.dark,
                  bgcolor: 'rgba(19, 59, 107, 0.08)'
                }
              }}
            >
              Exportar Log
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              size="small"
              onClick={handleRefresh}
              sx={{
                bgcolor: colors.primary.main,
                '&:hover': { bgcolor: colors.primary.dark }
              }}
            >
              Actualizar
            </Button>
          </Stack>
        </Box>

        {/* Cards de estadísticas */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {[
            { label: 'Total de Eventos', value: stats.total, color: colors.status.info },
            { label: 'Hoy', value: stats.today, color: colors.status.success },
            { label: 'Informativos', value: stats.bySeverity.info, color: colors.status.info },
            { label: 'Éxitos', value: stats.bySeverity.success, color: colors.status.success },
            { label: 'Aceptados', value: stats.byStatus.aceptados, color: colors.status.success },
            { label: 'En Revisión', value: stats.byStatus.enRevision, color: colors.status.warning },
          ].map(({ label, value, color }) => (
            <Card
              key={label}
              sx={{
                borderLeft: `4px solid ${color}`,
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  textAlign: 'center',
                  '&:last-child': { pb: 2 },
                }}
              >
                <Typography variant="h4" sx={{ color, fontWeight: 'bold', mb: 0.5 }}>
                  {value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.text.secondary,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Filtros */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', borderRadius: '8px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar en auditoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: colors.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root.Mui-focused': { color: colors.primary.main },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.main
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.text.secondary }}>Tipo de Acción</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo de Acción"
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary.main } }}
                >
                  {actionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.text.secondary }}>Tipo de Usuario</InputLabel>
                <Select
                  value={filterUser}
                  label="Tipo de Usuario"
                  onChange={(e) => setFilterUser(e.target.value)}
                  sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary.main } }}
                >
                  {users.map(user => (
                    <MenuItem key={user.value} value={user.value}>{user.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterUser('all');
                    setPage(1);
                  }}
                  sx={{
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    '&:hover': {
                      borderColor: colors.primary.dark,
                      bgcolor: 'rgba(19, 59, 107, 0.08)'
                    }
                  }}
                >
                  Limpiar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={1} sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '8px'
        }}>
          <Box sx={{
            p: 2,
            borderBottom: `1px solid ${colors.primary.light}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'white'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
              Registro de Auditoría - {filteredLogs.length} eventos encontrados
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip
                label={`${stats.today} eventos hoy`}
                size="small"
                sx={{ bgcolor: colors.primary.main, color: 'white', fontSize: '0.75rem' }}
              />
              <Chip
                label={`${paginatedLogs.length} mostrados`}
                size="small"
                variant="outlined"
                sx={{ borderColor: colors.primary.main, color: colors.primary.main, fontSize: '0.75rem' }}
              />
            </Stack>
          </Box>

          {/* Tabla de auditoría */}
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '12%' }}>Fecha y Hora</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '15%' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '15%' }}>Acción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '10%' }}>Entidad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '10%' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '28%' }}>Detalles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '5%' }}>IP</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '5%' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'rgba(19, 59, 107, 0.04)' },
                      borderLeft: `3px solid ${getSeverityColor(log.severity)}`,
                      '& .MuiTableCell-root': {
                        borderBottom: `1px solid ${colors.primary.light}`
                      }
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
                          {log.timestamp.split(' ')[0]}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {log.timestamp.split(' ')[1]}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: getRoleColor(log.user.role),
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {log.user.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                            {log.user.name}
                          </Typography>
                          <Chip
                            label={getRoleText(log.user.role)}
                            size="small"
                            sx={{
                              bgcolor: `${getRoleColor(log.user.role)}15`,
                              color: getRoleColor(log.user.role),
                              fontSize: '0.65rem',
                              height: 18
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: getSeverityColor(log.severity) }}>
                          {log.icon}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                            {log.actionName}
                          </Typography>
                          <Chip
                            label={log.severity}
                            size="small"
                            sx={{
                              bgcolor: `${getSeverityColor(log.severity)}15`,
                              color: getSeverityColor(log.severity),
                              fontSize: '0.65rem',
                              height: 18,
                              mt: 0.5
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                          {log.entity}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          ID: {log.entityId}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {getStatusChip(log.status)}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {log.details}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Ver IP">
                        <Chip
                          label={log.ip}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            borderColor: colors.primary.light,
                            color: colors.text.secondary
                          }}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(log)}
                          sx={{
                            color: colors.primary.main,
                            '&:hover': { bgcolor: 'rgba(19, 59, 107, 0.08)' }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Box sx={{
            p: 2,
            borderTop: `1px solid ${colors.primary.light}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'white'
          }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Mostrando {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, filteredLogs.length)} de {filteredLogs.length} eventos
            </Typography>
            <Pagination
              count={Math.ceil(filteredLogs.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              size="small"
              sx={{
                '& .MuiPaginationItem-root.Mui-selected': {
                  bgcolor: colors.primary.main,
                  color: 'white',
                  '&:hover': { bgcolor: colors.primary.dark }
                }
              }}
            />
          </Box>
        </Paper>

        {/* Información de auditoría */}
        <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: '8px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1 }}>
                Distribución por Tipo de Acción
              </Typography>
              <Stack spacing={1}>
                {Object.entries({
                  'Accesos al sistema': auditLogs.filter(log => log.action.includes('LOGIN')).length,
                  'Certificaciones': auditLogs.filter(log => log.action.includes('CERTIFICATION')).length,
                  'Documentos': auditLogs.filter(log => log.action.includes('DOCUMENT') || log.action.includes('RECONOCIMIENTO')).length,
                  'Declaraciones': auditLogs.filter(log => log.action.includes('DECLARACION') || log.action.includes('CONFLICTO')).length,
                }).map(([type, count]) => (
                  <Box key={type} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      {type}:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '60%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(count / stats.total) * 100}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { bgcolor: colors.primary.main }
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 24, color: colors.text.primary }}>
                        {count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1 }}>
                Distribución por Estado
              </Typography>
              <Stack spacing={1}>
                {Object.entries({
                  'Aceptados': stats.byStatus.aceptados,
                  'En Revisión': stats.byStatus.enRevision,
                  'Registro': stats.byStatus.registro,
                }).map(([status, count]) => (
                  <Box key={status} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      {status}:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '60%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(count / stats.total) * 100}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: status === 'Aceptados' ? colors.status.success :
                              status === 'En Revisión' ? colors.status.warning :
                                colors.primary.light
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 24, color: colors.text.primary }}>
                        {count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1 }}>
                  Distribución por Rol
                </Typography>
                {Object.entries(stats.byUserType).map(([role, count]) => (
                  <Box key={role} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      {role === 'admin' ? 'Administradores' :
                        role === 'comite' ? 'Comité' :
                          role === 'agente' ? 'Agentes Aduanales' :
                            role === 'asociacion_admin' ? 'Admin. Asociación' : role}:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '60%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(count / stats.total) * 100}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { bgcolor: getRoleColor(role) }
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 24, color: colors.text.primary }}>
                        {count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>


      {/* Diálogo de exportación */}
      <Dialog open={exportDialogOpen} onClose={handleExportDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          bgcolor: colors.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DownloadIcon />
            <Typography variant="h6">Exportar Log de Auditoría</Typography>
          </Box>
          <IconButton onClick={handleExportDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
          <Button
            onClick={handleExportDialogClose}
            variant="outlined"
            sx={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              '&:hover': { borderColor: colors.primary.dark, bgcolor: 'rgba(19, 59, 107, 0.08)' }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={exportLoading}
            startIcon={exportLoading ? <RefreshIcon className="spin" /> : <DownloadIcon />}
            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
          >
            {exportLoading ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            bgcolor: snackbar.severity === 'success' ? colors.status.success : colors.status.error,
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Estilo para animación de spin */}
      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default AdminAuditLog;