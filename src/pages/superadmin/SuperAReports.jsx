// src/pages/admin/Reports.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  Domain as DomainIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

// Colores institucionales
const institutionalColors = {
  primary: "#133B6B", // Azul oscuro principal
  primaryLight: "#1e4f8a", // Azul más claro
  secondary: "#1a4c7a", // Azul medio
  accent: "#e9e9e9", // Color para acentos (gris claro)
  background: "#f4f6f8", // Fondo claro
  lightBlue: "rgba(19, 59, 107, 0.08)", // Azul transparente para hover
  darkBlue: "#0D2A4D", // Azul más oscuro
  textPrimary: "#2c3e50", // Texto principal
  textSecondary: "#7f8c8d", // Texto secundario
  success: "#27ae60", // Verde para éxito
  successLight: "#d4edda", // Verde claro para fondos
  warning: "#f39c12", // Naranja para advertencias
  warningLight: "#fff3cd", // Naranja claro para fondos
  error: "#e74c3c", // Rojo para errores
  errorLight: "#f8d7da", // Rojo claro para fondos
  info: "#3498db", // Azul para información
  infoLight: "#d1ecf1", // Azul claro para fondos
  gray100: "#f8f9fa",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#6c757d",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
};

const InstanceReports = () => {
  const [reportType, setReportType] = useState("performance");
  const [dateRange, setDateRange] = useState("month");
  const [instanceFilter, setInstanceFilter] = useState("all");
  const [activePieIndex, setActivePieIndex] = useState(0);

  // Estados individuales para cada gráfica
  const [showLineChart, setShowLineChart] = useState(true);
  const [showPieChart, setShowPieChart] = useState(true);
  const [showBarChart, setShowBarChart] = useState(true);

  const reportTypes = [
    {
      value: "performance",
      label: "Rendimiento General",
      icon: <AssessmentIcon />,
    },
    { value: "users", label: "Análisis de Usuarios", icon: <GroupIcon /> },
    { value: "expedientes", label: "Expedientes", icon: <StorageIcon /> },
    { value: "uptime", label: "Disponibilidad", icon: <SpeedIcon /> },
    { value: "alerts", label: "Alertas", icon: <WarningIcon /> },
  ];

  const dateRanges = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year", label: "Este año" },
  ];

  const instanceFilters = [
    { value: "all", label: "Todas las instancias" },
    { value: "CAAREM", label: "CAAREM" },
    { value: "ANAM", label: "ANAM" },
    { value: "SAT", label: "SAT" },
    { value: "SHCP", label: "SHCP" },
    { value: "Aduanas", label: "Aduanas" },
  ];

  // Datos base
  const baseInstanceData = [
    {
      name: "CAAREM",
      code: "CAA-001",
      uptime: 99.9,
      users: 245,
      activeUsers: 198,
      expedientes: 842,
      nuevosExpedientes: 45,
      status: "excelente",
      crecimiento: "+12%",
    },
    {
      name: "ANAM",
      code: "ANA-001",
      uptime: 99.8,
      users: 189,
      activeUsers: 152,
      expedientes: 615,
      nuevosExpedientes: 32,
      status: "bueno",
      crecimiento: "+8%",
    },
    {
      name: "SAT",
      code: "SAT-001",
      uptime: 99.7,
      users: 342,
      activeUsers: 278,
      expedientes: 1204,
      nuevosExpedientes: 78,
      status: "excelente",
      crecimiento: "+15%",
    },
    {
      name: "SHCP",
      code: "SHC-001",
      uptime: 99.5,
      users: 198,
      activeUsers: 165,
      expedientes: 534,
      nuevosExpedientes: 28,
      status: "bueno",
      crecimiento: "+5%",
    },
    {
      name: "Aduanas",
      code: "ADU-001",
      uptime: 99.6,
      users: 271,
      activeUsers: 235,
      expedientes: 647,
      nuevosExpedientes: 41,
      status: "excelente",
      crecimiento: "+10%",
    },
  ];

  // Datos de tendencia por mes
  const baseTrendData = [
    { mes: "Ene", CAAREM: 210, ANAM: 165, SAT: 298, SHCP: 172, Aduanas: 238 },
    { mes: "Feb", CAAREM: 218, ANAM: 171, SAT: 305, SHCP: 178, Aduanas: 245 },
    { mes: "Mar", CAAREM: 225, ANAM: 176, SAT: 315, SHCP: 183, Aduanas: 252 },
    { mes: "Abr", CAAREM: 232, ANAM: 180, SAT: 324, SHCP: 188, Aduanas: 258 },
    { mes: "May", CAAREM: 238, ANAM: 184, SAT: 332, SHCP: 192, Aduanas: 264 },
    { mes: "Jun", CAAREM: 245, ANAM: 189, SAT: 342, SHCP: 198, Aduanas: 271 },
  ];

  // Datos de expedientes por mes
  const expedientesTrendData = [
    { mes: "Ene", CAAREM: 720, ANAM: 540, SAT: 980, SHCP: 460, Aduanas: 550 },
    { mes: "Feb", CAAREM: 745, ANAM: 555, SAT: 1010, SHCP: 475, Aduanas: 565 },
    { mes: "Mar", CAAREM: 770, ANAM: 570, SAT: 1050, SHCP: 490, Aduanas: 585 },
    { mes: "Abr", CAAREM: 795, ANAM: 585, SAT: 1090, SHCP: 505, Aduanas: 605 },
    { mes: "May", CAAREM: 820, ANAM: 600, SAT: 1140, SHCP: 520, Aduanas: 625 },
    { mes: "Jun", CAAREM: 842, ANAM: 615, SAT: 1204, SHCP: 534, Aduanas: 647 },
  ];

  // Datos de uptime por mes
  const uptimeTrendData = [
    {
      mes: "Ene",
      CAAREM: 99.8,
      ANAM: 99.7,
      SAT: 99.6,
      SHCP: 99.4,
      Aduanas: 99.5,
    },
    {
      mes: "Feb",
      CAAREM: 99.8,
      ANAM: 99.7,
      SAT: 99.6,
      SHCP: 99.4,
      Aduanas: 99.5,
    },
    {
      mes: "Mar",
      CAAREM: 99.9,
      ANAM: 99.8,
      SAT: 99.7,
      SHCP: 99.5,
      Aduanas: 99.6,
    },
    {
      mes: "Abr",
      CAAREM: 99.9,
      ANAM: 99.8,
      SAT: 99.7,
      SHCP: 99.5,
      Aduanas: 99.6,
    },
    {
      mes: "May",
      CAAREM: 99.9,
      ANAM: 99.8,
      SAT: 99.7,
      SHCP: 99.5,
      Aduanas: 99.6,
    },
    {
      mes: "Jun",
      CAAREM: 99.9,
      ANAM: 99.8,
      SAT: 99.7,
      SHCP: 99.5,
      Aduanas: 99.6,
    },
  ];

  // Filtrar datos según selección
  const filteredData = useMemo(() => {
    if (instanceFilter === "all") {
      return baseInstanceData;
    }
    return baseInstanceData.filter((item) => item.name === instanceFilter);
  }, [instanceFilter]);

  // Seleccionar datos de tendencia según tipo de reporte
  const trendData = useMemo(() => {
    switch (reportType) {
      case "users":
        return baseTrendData;
      case "expedientes":
        return expedientesTrendData;
      case "uptime":
        return uptimeTrendData;
      default:
        return baseTrendData;
    }
  }, [reportType]);

  const filteredTrendData = useMemo(() => {
    if (instanceFilter === "all") {
      return trendData;
    }
    return trendData.map((item) => ({
      mes: item.mes,
      [instanceFilter]: item[instanceFilter],
    }));
  }, [instanceFilter, trendData]);

  // Calcular estadísticas basadas en filtros
  const stats = useMemo(() => {
    const totalInstances = filteredData.length;
    const totalUsers = filteredData.reduce((sum, item) => sum + item.users, 0);
    const activeUsers = filteredData.reduce(
      (sum, item) => sum + item.activeUsers,
      0,
    );
    const totalExpedientes = filteredData.reduce(
      (sum, item) => sum + item.expedientes,
      0,
    );
    const nuevosExpedientes = filteredData.reduce(
      (sum, item) => sum + (item.nuevosExpedientes || 0),
      0,
    );
    const avgUptime =
      filteredData.reduce((sum, item) => sum + item.uptime, 0) / totalInstances;

    return {
      totalInstances,
      activeInstances: filteredData.length,
      totalUsers,
      activeUsers,
      totalExpedientes,
      nuevosExpedientes,
      avgUptime: avgUptime.toFixed(1),
      avgUsersPerInstance: Math.round(totalUsers / totalInstances) || 0,
      avgExpedientesPerInstance:
        Math.round(totalExpedientes / totalInstances) || 0,
    };
  }, [filteredData]);

  // Datos para gráfica de expedientes
  const expedientesChartData = useMemo(() => {
    return filteredData.map((item) => ({
      name: item.name,
      value: item.expedientes,
      color:
        item.name === "CAAREM"
          ? institutionalColors.primary
          : item.name === "ANAM"
            ? institutionalColors.success
            : item.name === "SAT"
              ? institutionalColors.error
              : item.name === "SHCP"
                ? institutionalColors.warning
                : "#9b59b6",
    }));
  }, [filteredData]);

  // Datos para gráfica de usuarios
  const usersChartData = useMemo(() => {
    return filteredData.map((item) => ({
      name: item.name,
      activos: item.activeUsers,
      inactivos: item.users - item.activeUsers,
    }));
  }, [filteredData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "excelente":
        return institutionalColors.success;
      case "bueno":
        return institutionalColors.success;
      case "regular":
        return institutionalColors.warning;
      case "critico":
        return institutionalColors.error;
      default:
        return institutionalColors.textSecondary;
    }
  };

  const getTrendTitle = () => {
    switch (reportType) {
      case "users":
        return "Tendencia de Usuarios";
      case "expedientes":
        return "Tendencia de Expedientes";
      case "uptime":
        return "Tendencia de Disponibilidad";
      default:
        return "Tendencia General";
    }
  };

  const handleGenerateReport = () => {
    console.log("Generando reporte con:", {
      reportType,
      dateRange,
      instanceFilter,
    });
  };

  const onPieEnter = (_, index) => {
    setActivePieIndex(index);
  };

  // Funciones para toggle individual
  const toggleLineChart = () => {
    setShowLineChart(!showLineChart);
  };

  const togglePieChart = () => {
    setShowPieChart(!showPieChart);
  };

  const toggleBarChart = () => {
    setShowBarChart(!showBarChart);
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    
    // Función para agregar pie de página
    const addFooter = (pageNum) => {
      const footerY = pageHeight - 10;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, footerY);
      doc.text(`Página ${pageNum}`, pageWidth - margin, footerY, { align: "right" });
    };

    let pageNum = 1;

    // ========== PORTADA ==========
    // Fondo de la portada
    doc.setFillColor(institutionalColors.primary);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Logo o ícono (simulado con texto)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("SGI", pageWidth / 2, 100, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Sistema de Gestión de Instancias", pageWidth / 2, 120, { align: "center" });

    // Título del reporte
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE", pageWidth / 2, 180, { align: "center" });
    doc.text("INSTANCIAS", pageWidth / 2, 210, { align: "center" });

    // Línea decorativa
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 50, 195, pageWidth / 2 + 50, 195);

    // Metadatos del reporte
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const reportTypeLabel = reportTypes.find(t => t.value === reportType)?.label || reportType;
    const dateRangeLabel = dateRanges.find(r => r.value === dateRange)?.label || dateRange;
    const instanceLabel = instanceFilters.find(i => i.value === instanceFilter)?.label || instanceFilter;
    
    doc.text(`Tipo: ${reportTypeLabel}`, pageWidth / 2, 250, { align: "center" });
    doc.text(`Período: ${dateRangeLabel}`, pageWidth / 2, 260, { align: "center" });
    doc.text(`Instancia: ${instanceLabel}`, pageWidth / 2, 270, { align: "center" });

    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, pageWidth / 2, 290, { align: "center" });

    addFooter(pageNum);
    pageNum++;

    // ========== PÁGINA 2: RESUMEN EJECUTIVO ==========
    doc.addPage();
    let yPos = 25;
    
    // Encabezado de página
    doc.setFillColor(institutionalColors.primary);
    doc.rect(0, 0, pageWidth, 10, 'F');
    
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN EJECUTIVO", margin, yPos);
    yPos += 5;
    
    doc.setDrawColor(institutionalColors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Información del reporte en formato tarjeta
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 3, 3, 'F');
    
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    
    const colWidth = (pageWidth - margin * 2) / 3;
    doc.text("TIPO DE REPORTE", margin + 5, yPos + 7);
    doc.text("PERIODO", margin + colWidth + 5, yPos + 7);
    doc.text("INSTANCIA", margin + colWidth * 2 + 5, yPos + 7);
    
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.text(reportTypeLabel, margin + 5, yPos + 15);
    doc.text(dateRangeLabel, margin + colWidth + 5, yPos + 15);
    doc.text(instanceLabel, margin + colWidth * 2 + 5, yPos + 15);
    
    yPos += 40;

    // Tarjetas de KPI en grid
    const kpiWidth = (pageWidth - margin * 2 - 15) / 3;
    const kpiData = [
      { label: "Instancias", value: stats.totalInstances, icon: "🏢", color: institutionalColors.primary },
      { label: "Usuarios", value: stats.totalUsers, icon: "👥", color: institutionalColors.success },
      { label: "Expedientes", value: stats.totalExpedientes, icon: "📄", color: institutionalColors.warning },
    ];

    kpiData.forEach((kpi, index) => {
      const xPos = margin + index * (kpiWidth + 5);
      
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(xPos, yPos, kpiWidth, 35, 3, 3, 'F');
      
      doc.setFillColor(kpi.color);
      doc.roundedRect(xPos, yPos, kpiWidth, 4, 2, 2, 'F');
      
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(kpi.icon + " " + kpi.label, xPos + 5, yPos + 12);
      
      doc.setTextColor(kpi.color);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(kpi.value.toString(), xPos + 5, yPos + 28);
    });

    yPos += 50;

    // Segunda fila de KPI
    const kpiData2 = [
      { label: "Usuarios Activos", value: stats.activeUsers, icon: "✅", color: institutionalColors.info },
      { label: "Nuevos Expedientes", value: stats.nuevosExpedientes, icon: "🆕", color: institutionalColors.secondary },
      { label: "Uptime Promedio", value: stats.avgUptime + "%", icon: "⚡", color: institutionalColors.primary },
    ];

    kpiData2.forEach((kpi, index) => {
      const xPos = margin + index * (kpiWidth + 5);
      
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(xPos, yPos, kpiWidth, 35, 3, 3, 'F');
      
      doc.setFillColor(kpi.color);
      doc.roundedRect(xPos, yPos, kpiWidth, 4, 2, 2, 'F');
      
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(kpi.icon + " " + kpi.label, xPos + 5, yPos + 12);
      
      doc.setTextColor(kpi.color);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(kpi.value.toString(), xPos + 5, yPos + 28);
    });

    addFooter(pageNum);
    pageNum++;

    // ========== PÁGINA 3: TABLA DE INSTANCIAS ==========
    doc.addPage();
    yPos = 25;
    
    // Encabezado de página
    doc.setFillColor(institutionalColors.primary);
    doc.rect(0, 0, pageWidth, 10, 'F');
    
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLE DE INSTANCIAS", margin, yPos);
    yPos += 5;
    
    doc.setDrawColor(institutionalColors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Configuración de la tabla
    const tableColumn = [
      "Instancia",
      "Código",
      "Usuarios",
      "Activos",
      "Expedientes",
      "Uptime",
      "Estado",
    ];

    const tableRows = filteredData.map((row) => [
      row.name,
      row.code,
      row.users.toString(),
      row.activeUsers.toString(),
      row.expedientes.toString(),
      `${row.uptime}%`,
      row.status,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: institutionalColors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20, halign: 'right' },
        3: { cellWidth: 20, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 20, halign: 'right' },
        6: { cellWidth: 25, halign: 'center' },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        addFooter(pageNum);
      }
    });

    pageNum++;

    // ========== PÁGINA 4: GRÁFICAS ==========
    doc.addPage();
    yPos = 25;
    
    // Encabezado de página
    doc.setFillColor(institutionalColors.primary);
    doc.rect(0, 0, pageWidth, 10, 'F');
    
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ANÁLISIS GRÁFICO", margin, yPos);
    yPos += 5;
    
    doc.setDrawColor(institutionalColors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Función para capturar elemento del DOM y agregarlo al PDF
    const captureChart = async (elementId, x, y, width, height) => {
      const element = document.getElementById(elementId);
      if (element) {
        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', x, y, width, height);
          return true;
        } catch (error) {
          console.error('Error capturando gráfica:', error);
          return false;
        }
      }
      return false;
    };

    const chartWidth = (pageWidth - margin * 2 - 10) / 2;
    const chartHeight = 70;

    // Línea de tendencia
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(getTrendTitle(), margin, yPos);
    
    await captureChart('line-chart-container', margin, yPos + 5, pageWidth - margin * 2, chartHeight);
    yPos += chartHeight + 20;

    // Gráficas de pastel y barras en la misma fila
    doc.text("Distribución de Expedientes", margin, yPos);
    doc.text("Usuarios Activos por Instancia", margin + chartWidth + 15, yPos);
    
    await captureChart('pie-chart-container', margin, yPos + 5, chartWidth, chartHeight);
    await captureChart('bar-chart-container', margin + chartWidth + 15, yPos + 5, chartWidth, chartHeight);

    addFooter(pageNum);
    pageNum++;

    // ========== PÁGINA 5: CONCLUSIONES ==========
    doc.addPage();
    yPos = 25;
    
    // Encabezado de página
    doc.setFillColor(institutionalColors.primary);
    doc.rect(0, 0, pageWidth, 10, 'F');
    
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CONCLUSIONES", margin, yPos);
    yPos += 5;
    
    doc.setDrawColor(institutionalColors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Resumen y conclusiones
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const conclusions = [
      `• Se analizaron un total de ${stats.totalInstances} instancias con ${stats.totalUsers} usuarios registrados.`,
      `• El uptime promedio del sistema es del ${stats.avgUptime}%, indicando una alta disponibilidad.`,
      `• Se gestionan ${stats.totalExpedientes} expedientes en total, con ${stats.nuevosExpedientes} nuevos en el período.`,
      `• La tasa de usuarios activos es del ${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% del total.`,
      `• La instancia con mejor rendimiento es ${filteredData.reduce((best, current) => 
        (current.uptime > best.uptime ? current : best)).name}.`,
    ];

    conclusions.forEach(conclusion => {
      doc.text(conclusion, margin, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Recomendaciones
    doc.setTextColor(institutionalColors.primary);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RECOMENDACIONES", margin, yPos);
    yPos += 5;
    
    doc.setDrawColor(institutionalColors.primary);
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const recommendations = [
      "• Implementar monitoreo adicional para instancias con uptime inferior al 99.5%",
      "• Realizar capacitación para aumentar la tasa de usuarios activos",
      "• Optimizar el proceso de creación de expedientes para reducir tiempos de respuesta",
      "• Establecer alertas tempranas para prevenir caídas del sistema",
    ];

    recommendations.forEach(rec => {
      doc.text(rec, margin, yPos);
      yPos += 8;
    });

    // Agregar sello de aprobación
    yPos = pageHeight - 40;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text("Aprobado por:", margin, yPos + 8);
    doc.text("Dirección de Sistemas", margin, yPos + 15);
    
    doc.text("Fecha de aprobación:", pageWidth - margin - 60, yPos + 8);
    doc.text(new Date().toLocaleDateString(), pageWidth - margin - 60, yPos + 15);

    addFooter(pageNum);

    // Guardar el PDF
    doc.save(`reporte_instancias_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, md: 3 },
        bgcolor: institutionalColors.background,
      }}
    >
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: institutionalColors.primary }}
            >
              Reportes de Instancias
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              {instanceFilter === "all"
                ? "Información estadística de todas las instancias"
                : `Información detallada de ${instanceFilter}`}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                size="small"
                onClick={handleDownloadPDF}
                sx={{
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Exportar PDF
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* FILTROS */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid #e5e7eb` }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                sx={{ "&.Mui-focused": { color: institutionalColors.primary } }}
              >
                Tipo de Reporte
              </InputLabel>
              <Select
                value={reportType}
                label="Tipo de Reporte"
                onChange={(e) => setReportType(e.target.value)}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                sx={{ "&.Mui-focused": { color: institutionalColors.primary } }}
              >
                Periodo
              </InputLabel>
              <Select
                value={dateRange}
                label="Periodo"
                onChange={(e) => setDateRange(e.target.value)}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                {dateRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                sx={{ "&.Mui-focused": { color: institutionalColors.primary } }}
              >
                Instancia
              </InputLabel>
              <Select
                value={instanceFilter}
                label="Instancia"
                onChange={(e) => setInstanceFilter(e.target.value)}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                {instanceFilters.map((filter) => (
                  <MenuItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleGenerateReport}
                sx={{
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Generar
              </Button>
              <IconButton sx={{ color: institutionalColors.primary }}>
                <FilterIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      
      {/* KPI CARDS */}
      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
          width: "100%",
          margin: 0,
        }}
      >
        <Grid item xs={12} md sx={{ flexGrow: 1 }}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="caption"
                    color={institutionalColors.textSecondary}
                  >
                    Instancias
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {stats.totalInstances}
                  </Typography>
                </Box>
                <DomainIcon
                  sx={{
                    fontSize: 40,
                    color: `${institutionalColors.primary}33`,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md sx={{ flexGrow: 1 }}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="caption"
                    color={institutionalColors.textSecondary}
                  >
                    Usuarios
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <GroupIcon
                  sx={{
                    fontSize: 40,
                    color: `${institutionalColors.success}33`,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md sx={{ flexGrow: 1 }}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="caption"
                    color={institutionalColors.textSecondary}
                  >
                    Expedientes
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {stats.totalExpedientes}
                  </Typography>
                </Box>
                <StorageIcon
                  sx={{
                    fontSize: 40,
                    color: `${institutionalColors.warning}33`,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TABLA DE INSTANCIAS */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          overflow: "hidden",
          mb: 3,
          border: `1px solid #e5e7eb`,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          mb={2}
          sx={{ color: institutionalColors.primary }}
        >
          Detalle de Instancias
        </Typography>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: institutionalColors.primary }}>
                  <strong>Instancia</strong>
                </TableCell>
                <TableCell sx={{ color: institutionalColors.primary }}>
                  <strong>Código</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: institutionalColors.primary }}
                >
                  <strong>Usuarios</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: institutionalColors.primary }}
                >
                  <strong>Activos</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: institutionalColors.primary }}
                >
                  <strong>Expedientes</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: institutionalColors.primary }}
                >
                  <strong>Nuevos</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: institutionalColors.primary }}
                >
                  <strong>Uptime</strong>
                </TableCell>
                <TableCell sx={{ color: institutionalColors.primary }}>
                  <strong>Estado</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: institutionalColors.primary }}
                >
                  <strong>Crecimiento</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.name} hover>
                  <TableCell sx={{ color: institutionalColors.textPrimary }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ color: institutionalColors.textSecondary }}>
                    {row.code}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {row.users}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {row.activeUsers}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {row.expedientes}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {row.nuevosExpedientes}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: institutionalColors.textPrimary }}
                  >
                    {row.uptime}%
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(row.status) + "20",
                        color: getStatusColor(row.status),
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        color: row.crecimiento.includes("+")
                          ? institutionalColors.success
                          : institutionalColors.error,
                      }}
                    >
                      {row.crecimiento}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* SECCIÓN DE GRÁFICAS CON IDs PARA EL PDF */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 3,
          width: "100%",
          border: `1px solid #e5e7eb`,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ mb: 2, color: institutionalColors.primary }}
        >
          Visualización de Datos
        </Typography>

        {/* LINE CHART con ID */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid #e5e7eb` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{ color: institutionalColors.textPrimary }}
              >
                <ShowChartIcon
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                    color: institutionalColors.primary,
                  }}
                />
                {getTrendTitle()}
              </Typography>
              <IconButton
                onClick={toggleLineChart}
                size="small"
                sx={{ color: institutionalColors.primary }}
              >
                {showLineChart ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Collapse in={showLineChart} timeout="auto" unmountOnExit>
              <Box id="line-chart-container" sx={{ height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredTrendData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ fontSize: 14 }} />
                    <Line
                      type="monotone"
                      dataKey="CAAREM"
                      stroke={institutionalColors.primary}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="ANAM"
                      stroke={institutionalColors.success}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="SAT"
                      stroke={institutionalColors.error}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="SHCP"
                      stroke={institutionalColors.warning}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="Aduanas"
                      stroke="#9c27b0"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Collapse>
          </Paper>
        </Grid>
        <br />
        
        {/* PIE CHART con ID */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid #e5e7eb` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{ color: institutionalColors.textPrimary }}
              >
                <PieChartIcon
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                    color: institutionalColors.primary,
                  }}
                />
                Distribución de Expedientes
              </Typography>
              <IconButton
                onClick={togglePieChart}
                size="small"
                sx={{ color: institutionalColors.primary }}
              >
                {showPieChart ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Collapse in={showPieChart} timeout="auto" unmountOnExit>
              <Box id="pie-chart-container" sx={{ height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expedientesChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      label
                    >
                      {expedientesChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Collapse>
          </Paper>
        </Grid>
        <br />
        
        {/* BAR CHART con ID */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid #e5e7eb` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{ color: institutionalColors.textPrimary }}
              >
                <BarChartIcon
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                    color: institutionalColors.primary,
                  }}
                />
                Usuarios Activos
              </Typography>
              <IconButton
                onClick={toggleBarChart}
                size="small"
                sx={{ color: institutionalColors.primary }}
              >
                {showBarChart ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Collapse in={showBarChart} timeout="auto" unmountOnExit>
              <Box id="bar-chart-container" sx={{ height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usersChartData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <RechartsTooltip />
                    <Bar
                      dataKey="activos"
                      fill={institutionalColors.primary}
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Collapse>
          </Paper>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InstanceReports;