// src/pages/admin/Reports.jsx
import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, Button,
  MenuItem, FormControl, InputLabel, Select, Stack, IconButton,
  Chip, Collapse, Divider, Alert, Tooltip, Checkbox, ListItemText,
  OutlinedInput
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Equalizer as EqualizerIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  Cell,
  ComposedChart,
} from 'recharts';

// ─── PALETA CORPORATIVA ───────────────────────────────────────────────────────
const C = {
  primary:   { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
  secondary: { main: '#00A8A8', light: '#00C2D1' },
  accents:   { blue: '#0099FF', purple: '#6C5CE7' },
  text:      { primary: '#0D2A4D', secondary: '#3A6EA5' },
};

const CHART_COLORS = {
  green:  C.secondary.main,
  yellow: C.accents.blue,
  red:    C.primary.dark,
  purple: C.accents.purple,
  navy:   C.primary.main,
  light:  C.primary.light,
  teal:   C.secondary.light,
  semaforo: {
    verde: '#4CAF50',
    amarillo: '#FFC107',
    rojo: '#F44336'
  }
};

// ─── DATOS MOCK ENRIQUECIDOS ─────────────────────────────────────────────────
const DATA = {
  complianceByRegion: [
    { region: 'Norte',        verde: 35, amarillo: 7,  rojo: 3,  total: 45, pct: 92, 
      tendencia: '+2.5%', alertas: 2, cumplimientoMeta: 90, estatus: 'Excelente' },
    { region: 'Centro',       verde: 52, amarillo: 10, rojo: 6,  total: 68, pct: 88,
      tendencia: '-0.8%', alertas: 5, cumplimientoMeta: 90, estatus: 'Regular' },
    { region: 'Sur',          verde: 22, amarillo: 6,  rojo: 4,  total: 32, pct: 85,
      tendencia: '+1.2%', alertas: 4, cumplimientoMeta: 90, estatus: 'Regular' },
    { region: 'Metropolitana',verde: 48, amarillo: 5,  rojo: 3,  total: 56, pct: 95,
      tendencia: '+3.1%', alertas: 1, cumplimientoMeta: 90, estatus: 'Excelente' },
    { region: 'Noroeste',     verde: 20, amarillo: 5,  rojo: 3,  total: 28, pct: 87,
      tendencia: '-1.5%', alertas: 6, cumplimientoMeta: 90, estatus: 'Crítico' },
    { region: 'Golfo',        verde: 30, amarillo: 5,  rojo: 3,  total: 38, pct: 91,
      tendencia: '+0.5%', alertas: 2, cumplimientoMeta: 90, estatus: 'Bueno' },
  ],
  complianceTrend: [
    { mes: 'Ago', Norte: 86, Centro: 83, Sur: 79, Metropolitana: 91, Noroeste: 82, Golfo: 85, promedio: 84, meta: 90 },
    { mes: 'Sep', Norte: 88, Centro: 84, Sur: 80, Metropolitana: 92, Noroeste: 83, Golfo: 87, promedio: 85.6, meta: 90 },
    { mes: 'Oct', Norte: 89, Centro: 85, Sur: 82, Metropolitana: 93, Noroeste: 84, Golfo: 88, promedio: 86.8, meta: 90 },
    { mes: 'Nov', Norte: 90, Centro: 86, Sur: 83, Metropolitana: 94, Noroeste: 85, Golfo: 89, promedio: 87.8, meta: 90 },
    { mes: 'Dic', Norte: 91, Centro: 87, Sur: 84, Metropolitana: 94, Noroeste: 86, Golfo: 90, promedio: 88.6, meta: 90 },
    { mes: 'Ene', Norte: 92, Centro: 88, Sur: 85, Metropolitana: 95, Noroeste: 87, Golfo: 91, promedio: 89.6, meta: 90 },
  ],
  certifications: [
    { nombre: 'Gestión Aduanera',    activas: 145, pendientes: 12, vencidas: 8,  
      renovacion: '92%', vigenciaPromedio: '8 meses', criticas: 3 },
    { nombre: 'Legislación Fiscal',  activas: 98,  pendientes: 8,  vencidas: 5,
      renovacion: '88%', vigenciaPromedio: '10 meses', criticas: 2 },
    { nombre: 'Comercio Exterior',   activas: 210, pendientes: 15, vencidas: 10,
      renovacion: '95%', vigenciaPromedio: '12 meses', criticas: 5 },
    { nombre: 'Valoración Aduanera', activas: 75,  pendientes: 6,  vencidas: 12,
      renovacion: '75%', vigenciaPromedio: '6 meses', criticas: 8 },
    { nombre: 'Auditoría Aduanera',  activas: 62,  pendientes: 4,  vencidas: 3,
      renovacion: '91%', vigenciaPromedio: '9 meses', criticas: 1 },
  ],
  certTrend: [
    { mes: 'Ago', renovadas: 42, vencidas: 8,  nuevas: 18, total: 520, tasaExito: '84%' },
    { mes: 'Sep', renovadas: 48, vencidas: 6,  nuevas: 22, total: 536, tasaExito: '86%' },
    { mes: 'Oct', renovadas: 51, vencidas: 9,  nuevas: 19, total: 546, tasaExito: '85%' },
    { mes: 'Nov', renovadas: 55, vencidas: 7,  nuevas: 24, total: 563, tasaExito: '87%' },
    { mes: 'Dic', renovadas: 58, vencidas: 5,  nuevas: 21, total: 579, tasaExito: '89%' },
    { mes: 'Ene', renovadas: 62, vencidas: 8,  nuevas: 25, total: 596, tasaExito: '88%' },
  ],
  declarations: [
    { nombre: 'Decl. Intereses',           presentadas: 185, pendientes: 22, vencidas: 5,
      cumplimiento: '92%', responsables: 15, proximas: 8 },
    { nombre: 'Ausencia Delitos Fiscales', presentadas: 201, pendientes: 15, vencidas: 3,
      cumplimiento: '96%', responsables: 18, proximas: 5 },
    { nombre: 'Cumplimiento Normativo',    presentadas: 120, pendientes: 35, vencidas: 10,
      cumplimiento: '78%', responsables: 22, proximas: 12 },
    { nombre: 'Cumplimiento Fiscal',       presentadas: 195, pendientes: 18, vencidas: 7,
      cumplimiento: '89%', responsables: 20, proximas: 6 },
  ],
  declTrend: [
    { mes: 'Ago', presentadas: 155, pendientes: 40, vencidas: 12, eficiencia: '79%' },
    { mes: 'Sep', presentadas: 162, pendientes: 36, vencidas: 10, eficiencia: '82%' },
    { mes: 'Oct', presentadas: 170, pendientes: 32, vencidas: 9,  eficiencia: '84%' },
    { mes: 'Nov', presentadas: 178, pendientes: 28, vencidas: 8,  eficiencia: '86%' },
    { mes: 'Dic', presentadas: 185, pendientes: 25, vencidas: 7,  eficiencia: '88%' },
    { mes: 'Ene', presentadas: 195, pendientes: 22, vencidas: 6,  eficiencia: '90%' },
  ],
  committeeTrend: [
    { mes: 'Ago', revisiones: 120, aprobadas: 108, rechazadas: 12, tiempoPromedio: 2.8, eficiencia: '90%' },
    { mes: 'Sep', revisiones: 132, aprobadas: 119, rechazadas: 13, tiempoPromedio: 2.6, eficiencia: '90%' },
    { mes: 'Oct', revisiones: 128, aprobadas: 116, rechazadas: 12, tiempoPromedio: 2.5, eficiencia: '91%' },
    { mes: 'Nov', revisiones: 145, aprobadas: 132, rechazadas: 13, tiempoPromedio: 2.4, eficiencia: '91%' },
    { mes: 'Dic', revisiones: 138, aprobadas: 126, rechazadas: 12, tiempoPromedio: 2.3, eficiencia: '91%' },
    { mes: 'Ene', revisiones: 156, aprobadas: 143, rechazadas: 13, tiempoPromedio: 2.1, eficiencia: '92%' },
  ],
  committeeByMember: [
    { nombre: 'Juan Pérez',     cargo: 'Presidente', revisiones: 52, aprobadas: 48, rechazadas: 4, 
      eficiencia: '92%', tiempoProm: 1.8, satisfaccion: 4.5 },
    { nombre: 'María González', cargo: 'Secretario', revisiones: 48, aprobadas: 43, rechazadas: 5,
      eficiencia: '90%', tiempoProm: 2.2, satisfaccion: 4.3 },
    { nombre: 'Carlos Rodríguez',cargo:'Vocal',      revisiones: 56, aprobadas: 50, rechazadas: 6,
      eficiencia: '89%', tiempoProm: 2.4, satisfaccion: 4.2 },
  ],
  associations: [
    { nombre: 'Aduanal Norte',       region: 'Norte',        cumplimiento: 96, miembros: 32, activos: 28,
      antiguedad: '12 años', ultimaEvaluacion: '2024-01-10' },
    { nombre: 'Agentes Centro',      region: 'Centro',       cumplimiento: 94, miembros: 45, activos: 42,
      antiguedad: '8 años', ultimaEvaluacion: '2024-01-12' },
    { nombre: 'Fronteriza Comercio', region: 'Fronteriza',   cumplimiento: 88, miembros: 25, activos: 18,
      antiguedad: '5 años', ultimaEvaluacion: '2024-01-08' },
    { nombre: 'Pacífico Aduanal',    region: 'Pacífico Sur', cumplimiento: 91, miembros: 22, activos: 22,
      antiguedad: '6 años', ultimaEvaluacion: '2024-01-14' },
    { nombre: 'Sureste Aduanal',     region: 'Sureste',      cumplimiento: 85, miembros: 20, activos: 15,
      antiguedad: '4 años', ultimaEvaluacion: '2024-01-11' },
    { nombre: 'Noroeste Agentes',    region: 'Noroeste',     cumplimiento: 93, miembros: 35, activos: 30,
      antiguedad: '10 años', ultimaEvaluacion: '2024-01-15' },
    { nombre: 'Golfo de México',     region: 'Golfo',        cumplimiento: 90, miembros: 28, activos: 25,
      antiguedad: '7 años', ultimaEvaluacion: '2024-01-13' },
    { nombre: 'Comercio Bajío',      region: 'Centro Occ.',  cumplimiento: 95, miembros: 40, activos: 35,
      antiguedad: '9 años', ultimaEvaluacion: '2024-01-15' },
  ],
  assocTrend: [
    { mes: 'Ago', promedio: 88, maximo: 94, minimo: 82, brecha: 12, cumplenMeta: 5 },
    { mes: 'Sep', promedio: 89, maximo: 94, minimo: 83, brecha: 11, cumplenMeta: 5 },
    { mes: 'Oct', promedio: 90, maximo: 95, minimo: 84, brecha: 11, cumplenMeta: 6 },
    { mes: 'Nov', promedio: 91, maximo: 96, minimo: 85, brecha: 11, cumplenMeta: 6 },
    { mes: 'Dic', promedio: 91, maximo: 96, minimo: 85, brecha: 11, cumplenMeta: 6 },
    { mes: 'Ene', promedio: 92, maximo: 96, minimo: 85, brecha: 11, cumplenMeta: 7 },
  ],
  summary: {
    totalUsuarios: 267,
    totalCertificaciones: 596,
    totalDeclaraciones: 701,
    cumplimientoGeneral: '89.6%',
    alertasActivas: 18,
    regionesCriticas: 1,
    proximosVencimientos: 34,
    eficienciaGeneral: '91%'
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getCompColor = (v) => v >= 90 ? C.secondary.main : v >= 80 ? C.accents.blue : C.primary.dark;

const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num);

const CustomTooltip = ({ active, payload, label, suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={3} sx={{ p: 1.5, minWidth: 180, bgcolor: '#fff', border: '1px solid #e0e0e0' }}>
      <Typography variant="caption" sx={{ color: C.primary.dark, fontWeight: 'bold', display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: C.text.secondary }}>{p.name}:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: C.primary.dark }}>
            {typeof p.value === 'number' && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}{suffix}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

// ─── KPI CARD COMPACTA (una sola fila) ───────────────────────────────────────
const KpiCard = ({ label, value, color, icon, trend, subtitle }) => (
  <Card sx={{
    height: 90,
    borderLeft: `3px solid ${color}`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
  }}>
    <CardContent sx={{ p: '10px 12px !important', display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
      <Box sx={{ color, opacity: 0.85, flexShrink: 0, '& svg': { fontSize: 24 } }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h5" sx={{ color, fontWeight: 'bold', lineHeight: 1.1, fontSize: '1.25rem', mb: 0.2 }}>
          {value}
        </Typography>
        <Typography sx={{ color: C.text.secondary, display: 'block', fontWeight: 500, fontSize: '0.7rem', lineHeight: 1.2 }}>
          {label}
        </Typography>
        {trend && (
          <Typography variant="caption" sx={{ color: trend.includes('+') ? C.secondary.main : C.primary.dark, fontSize: '0.65rem' }}>
            {trend} {subtitle && `· ${subtitle}`}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

// ─── CHART WRAPPER ────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, isExpanded, onToggle, chartId, metadata }) => (
  <Paper elevation={1} sx={{ mb: 3, overflow: 'hidden', borderRadius: '10px' }}>
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        p: 2, cursor: 'pointer',
        bgcolor: isExpanded ? '#fff' : '#f8f9fa',
        borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
        '&:hover': { bgcolor: '#f0f4f8' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: C.primary.dark }}>{title}</Typography>
          {subtitle && <Typography variant="caption" sx={{ color: C.text.secondary }}>{subtitle}</Typography>}
        </Box>
        {metadata && (
          <Chip label={metadata} size="small" sx={{ bgcolor: C.primary.light, color: 'white', fontSize: '0.7rem' }} />
        )}
      </Box>
      <IconButton size="small" sx={{
        color: C.primary.main,
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
        transition: '0.25s', pointerEvents: 'none'
      }}>
        <ExpandMoreIcon fontSize="small" />
      </IconButton>
    </Box>
    <Collapse in={isExpanded}>
      <Box sx={{ p: 3 }} data-chart-id={chartId}>{children}</Box>
    </Collapse>
  </Paper>
);

// ─── GRÁFICA 1: SEMÁFORO + % HORIZONTAL ──────────────────────────────────────
const ComplianceBarChart = ({ data }) => {
  const regionesSobreMeta = data.filter(r => r.pct >= 90).length;
  const regionesCriticas  = data.filter(r => r.estatus === 'Crítico').length;
  const totalAlertas      = data.reduce((sum, r) => sum + r.alertas, 0);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Alert severity="info" sx={{ bgcolor: '#e8f0fe' }}>
            <Typography variant="body2"><strong>{regionesSobreMeta}</strong> de {data.length} regiones sobre meta</Typography>
          </Alert>
        </Grid>
        <Grid item xs={4}>
          <Alert severity={regionesCriticas > 0 ? 'error' : 'success'} sx={{ bgcolor: regionesCriticas > 0 ? '#ffebee' : '#e0f2e9' }}>
            <Typography variant="body2"><strong>{regionesCriticas}</strong> regiones en estado crítico</Typography>
          </Alert>
        </Grid>
        <Grid item xs={4}>
          <Alert severity={totalAlertas > 10 ? 'warning' : 'info'} sx={{ bgcolor: '#fff4e5' }}>
            <Typography variant="body2"><strong>{totalAlertas}</strong> alertas activas</Typography>
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 380px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>
            Distribución Semáforo por Región
          </Typography>
          <Box sx={{ width: '100%', height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 10, bottom: 90 }}
                barCategoryGap="25%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11, fill: C.text.secondary }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                  height={90}
                />
                <YAxis tick={{ fontSize: 11, fill: C.text.secondary }} width={38} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <Bar dataKey="verde"    name="Verde (Cumple)"       stackId="a" fill={CHART_COLORS.semaforo.verde} />
                <Bar dataKey="amarillo" name="Amarillo (Pendiente)" stackId="a" fill={CHART_COLORS.semaforo.amarillo} />
                <Bar dataKey="rojo"     name="Rojo (Incumple)"      stackId="a" fill={CHART_COLORS.semaforo.rojo} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>
            % Cumplimiento por Región
          </Typography>
          <Box sx={{ width: '100%', height: Math.max(260, data.length * 46 + 60) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 40, left: 100, bottom: 10 }}
                barSize={22}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: C.text.secondary }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 11, fill: C.text.secondary }} width={96} />
                <ReTooltip content={<CustomTooltip suffix="%" />} />
                <Bar dataKey="pct" name="Cumplimiento" radius={[0, 4, 4, 0]}>
                  {data.map((e, i) => <Cell key={i} fill={getCompColor(e.pct)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// ─── GRÁFICA 2: TENDENCIA CUMPLIMIENTO ───────────────────────────────────────
const REGION_LINE_COLORS = [C.primary.main, C.secondary.main, C.accents.blue, C.accents.purple, C.primary.light, C.secondary.light];

const ComplianceTrendChart = ({ data, regions }) => {
  const ultimoPromedio = data[data.length - 1].promedio;
  const primerPromedio = data[0].promedio;
  const mejoraTotal    = (ultimoPromedio - primerPromedio).toFixed(1);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ color: C.text.secondary, fontWeight: 600 }}>
          Tendencia de Cumplimiento (últimos 6 meses)
        </Typography>
        <Chip
          icon={<TrendingUpIcon />}
          label={`Mejora acumulada: +${mejoraTotal}%`}
          size="small" color="success" sx={{ fontWeight: 500 }}
        />
      </Box>
      <Box sx={{ width: '100%', height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.text.secondary }} />
            <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: C.text.secondary }} tickFormatter={v => `${v}%`} width={42} />
            <ReTooltip content={<CustomTooltip suffix="%" />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            {regions.map((r, i) => (
              <Line key={r} type="monotone" dataKey={r} name={r}
                stroke={REGION_LINE_COLORS[i % REGION_LINE_COLORS.length]}
                strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
            <Line type="monotone" dataKey="promedio" name="Promedio General" stroke={C.accents.purple} strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="meta"     name="Meta (90%)"       stroke={C.primary.dark}  strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

// ─── GRÁFICA 3: CERTIFICACIONES ───────────────────────────────────────────────
const CertificationsChart = ({ barData, trendData }) => {
  const totalActivas  = barData.reduce((sum, c) => sum + c.activas, 0);
  const totalCriticas = barData.reduce((sum, c) => sum + c.criticas, 0);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Alert severity="info" sx={{ bgcolor: '#e8f0fe' }}>
            <Typography variant="body2"><strong>{formatNumber(totalActivas)}</strong> certificaciones activas</Typography>
          </Alert>
        </Grid>
        <Grid item xs={6}>
          <Alert severity={totalCriticas > 10 ? 'error' : 'warning'} sx={{ bgcolor: totalCriticas > 10 ? '#ffebee' : '#fff4e5' }}>
            <Typography variant="body2"><strong>{totalCriticas}</strong> certificaciones en estado crítico</Typography>
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 380px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>Estado por Certificación</Typography>
          <Box sx={{ width: '100%', height: 440 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 15, left: 10, bottom: 120 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 10, fill: C.text.secondary }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={120}
                />
                <YAxis tick={{ fontSize: 11, fill: C.text.secondary }} width={38} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <Bar dataKey="activas"    name="Activas"    fill={CHART_COLORS.green}  radius={[2,2,0,0]} />
                <Bar dataKey="pendientes" name="Pendientes" fill={CHART_COLORS.yellow} radius={[2,2,0,0]} />
                <Bar dataKey="vencidas"   name="Vencidas"   fill={CHART_COLORS.red}    radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>Tendencia Mensual de Certificaciones</Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="gRenovadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.secondary.main} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.secondary.main} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gNuevas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.accents.blue} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.accents.blue} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.text.secondary }} />
                <YAxis tick={{ fontSize: 11, fill: C.text.secondary }} width={38} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="renovadas" name="Renovadas" stroke={C.secondary.main} strokeWidth={2} fill="url(#gRenovadas)" />
                <Area type="monotone" dataKey="nuevas"    name="Nuevas"    stroke={C.accents.blue}   strokeWidth={2} fill="url(#gNuevas)" />
                <Line type="monotone" dataKey="vencidas"  name="Vencidas"  stroke={C.primary.dark}   strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// ─── GRÁFICA 4: DECLARACIONES ─────────────────────────────────────────────────
const DeclarationsChart = ({ barData, trendData }) => {
  const eficienciaActual  = trendData[trendData.length - 1].eficiencia;
  const mejoraEficiencia  = trendData[trendData.length - 1].eficiencia.replace('%', '') - trendData[0].eficiencia.replace('%', '');

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Alert severity="success" sx={{ bgcolor: '#e0f2e9' }}>
            <Typography variant="body2">Eficiencia actual: <strong>{eficienciaActual}</strong></Typography>
          </Alert>
        </Grid>
        <Grid item xs={6}>
          <Alert severity="info" sx={{ bgcolor: '#e8f0fe' }}>
            <Typography variant="body2">Mejora: <strong>+{mejoraEficiencia}%</strong> vs hace 6 meses</Typography>
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 380px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>Estado por Declaración</Typography>
          <Box sx={{ width: '100%', height: 440 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 15, left: 10, bottom: 130 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 10, fill: C.text.secondary }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={130}
                />
                <YAxis tick={{ fontSize: 11, fill: C.text.secondary }} width={38} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <Bar dataKey="presentadas" name="Presentadas" fill={CHART_COLORS.green}  radius={[2,2,0,0]} />
                <Bar dataKey="pendientes"  name="Pendientes"  fill={CHART_COLORS.yellow} radius={[2,2,0,0]} />
                <Bar dataKey="vencidas"    name="Vencidas"    fill={CHART_COLORS.red}    radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>Evolución Mensual de Declaraciones</Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="gPresentadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.secondary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.secondary.main} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.text.secondary }} />
                <YAxis tick={{ fontSize: 11, fill: C.text.secondary }} width={38} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="presentadas" name="Presentadas" stroke={C.secondary.main} strokeWidth={2} fill="url(#gPresentadas)" />
                <Line type="monotone" dataKey="pendientes"  name="Pendientes"  stroke={C.accents.blue}   strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="vencidas"    name="Vencidas"    stroke={C.primary.dark}   strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// ─── GRÁFICA 5: COMITÉ ────────────────────────────────────────────────────────
const CommitteeChart = ({ trendData, memberData }) => {
  const eficienciaPromedio = Math.round(memberData.reduce((sum, m) => sum + parseInt(m.eficiencia), 0) / memberData.length);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ bgcolor: '#e8f0fe' }}>
            <Typography variant="body2">
              Eficiencia promedio del comité: <strong>{eficienciaPromedio}%</strong> |&nbsp;
              Tiempo promedio de respuesta: <strong>{trendData[trendData.length-1].tiempoPromedio} días</strong>
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 420px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>
            Revisiones Mensuales y Tiempo Promedio de Respuesta
          </Typography>
          <Box sx={{ width: '100%', height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: 40, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.text.secondary }} />
                <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: C.text.secondary }} width={35} />
                <YAxis yAxisId="right" orientation="right" domain={[1, 4]} tick={{ fontSize: 11, fill: C.text.secondary }} tickFormatter={v => `${v}d`} width={30} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar yAxisId="left" dataKey="aprobadas"  name="Aprobadas"  fill={CHART_COLORS.green} radius={[3,3,0,0]} />
                <Bar yAxisId="left" dataKey="rechazadas" name="Rechazadas" fill={CHART_COLORS.red}   radius={[3,3,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="tiempoPromedio" name="T. Promedio (días)"
                  stroke={C.accents.purple} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>
            Actividad por Miembro del Comité
          </Typography>
          <Box sx={{ width: '100%', height: Math.max(280, memberData.length * 80 + 80) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData} layout="vertical" margin={{ top: 10, right: 20, left: 125, bottom: 10 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: C.text.secondary }} />
                <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11, fill: C.text.secondary }} width={122} />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="aprobadas"  name="Aprobadas"  fill={CHART_COLORS.green} radius={[0,3,3,0]} />
                <Bar dataKey="rechazadas" name="Rechazadas" fill={CHART_COLORS.red}   radius={[0,3,3,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// ─── GRÁFICA 6: ASOCIACIONES ──────────────────────────────────────────────────
const AssociationsChart = ({ assocData, trendData }) => {
  const asociacionesSobreMeta = assocData.filter(a => a.cumplimiento >= 90).length;
  const barHeight = Math.max(300, assocData.length * 48 + 80);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Alert severity="success" sx={{ bgcolor: '#e0f2e9' }}>
            <Typography variant="body2">
              <strong>{asociacionesSobreMeta}</strong> de {assocData.length} asociaciones cumplen la meta (90%)
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 350px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>
            % Cumplimiento por Asociación
          </Typography>
          <Box sx={{ width: '100%', height: barHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assocData} layout="vertical" margin={{ top: 10, right: 30, left: 140, bottom: 10 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 11, fill: C.text.secondary }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10, fill: C.text.secondary }} width={136} />
                <ReTooltip content={<CustomTooltip suffix="%" />} />
                <Bar dataKey="cumplimiento" name="Cumplimiento" radius={[0, 4, 4, 0]}>
                  {assocData.map((e, i) => <Cell key={i} fill={getCompColor(e.cumplimiento)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: C.text.secondary, mb: 1, fontWeight: 600 }}>
            Tendencia Gremial (Mín / Promedio / Máx)
          </Typography>
          <Box sx={{ width: '100%', height: barHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="gMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.secondary.main} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.secondary.main} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.primary.dark} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.primary.dark} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.text.secondary }} />
                <YAxis domain={[78, 100]} tick={{ fontSize: 11, fill: C.text.secondary }} tickFormatter={v => `${v}%`} width={38} />
                <ReTooltip content={<CustomTooltip suffix="%" />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="maximo"   name="Máximo"  stroke={C.secondary.main} strokeWidth={1.5} strokeDasharray="4 2" fill="url(#gMax)" />
                <Line type="monotone" dataKey="promedio" name="Promedio" stroke={C.primary.main}  strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="minimo"   name="Mínimo"  stroke={C.primary.dark}  strokeWidth={1.5} strokeDasharray="4 2" fill="url(#gMin)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// ─── SECCIONES ────────────────────────────────────────────────────────────────
const CHART_SECTIONS = [
  { id: 'compliance', label: 'Cumplimiento', icon: <EqualizerIcon /> },
  { id: 'certs',      label: 'Certificaciones', icon: <SchoolIcon /> },
  { id: 'decl',       label: 'Declaraciones', icon: <GavelIcon /> },
  { id: 'committee',  label: 'Comité', icon: <SecurityIcon /> },
  { id: 'assoc',      label: 'Asociaciones', icon: <BusinessIcon /> },
];

const DATE_RANGES = [
  { value: 'today',   label: 'Hoy' },
  { value: 'week',    label: 'Esta semana' },
  { value: 'month',   label: 'Este mes' },
  { value: 'quarter', label: 'Este trimestre' },
  { value: 'year',    label: 'Este año' },
];

const REGION_OPTIONS = [
  { value: 'Norte',        label: 'Norte' },
  { value: 'Centro',       label: 'Centro' },
  { value: 'Sur',          label: 'Sur' },
  { value: 'Metropolitana',label: 'Metropolitana' },
  { value: 'Golfo',        label: 'Golfo' },
  { value: 'Noroeste',     label: 'Noroeste' },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
const Reports = () => {
  const [dateRange, setDateRange]   = useState('month');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [activeSections, setActive] = useState(new Set(['compliance', 'certs', 'decl', 'committee', 'assoc']));
  const [expanded, setExpanded]     = useState(new Set(['compliance', 'certs', 'decl', 'committee', 'assoc']));

  const isAllRegions = selectedRegions.length === 0;

  const filteredCompliance = useMemo(() =>
    isAllRegions
      ? DATA.complianceByRegion
      : DATA.complianceByRegion.filter(r => selectedRegions.includes(r.region)),
    [selectedRegions, isAllRegions]);

  const filteredAssoc = useMemo(() =>
    isAllRegions
      ? DATA.associations
      : DATA.associations.filter(a => selectedRegions.includes(a.region)),
    [selectedRegions, isAllRegions]);

  const visibleRegions = useMemo(() =>
    isAllRegions
      ? REGION_OPTIONS.map(r => r.value)
      : selectedRegions,
    [selectedRegions, isAllRegions]);

  const handleRegionChange = (e) => {
    const val = e.target.value;
    setSelectedRegions(val);
  };

  const toggleSection = (id) => {
    setActive(prev => {
      const n = new Set(prev);
      if (n.has(id)) { 
        n.delete(id); 
        setExpanded(e => { 
          const ne = new Set(e); 
          ne.delete(id); 
          return ne; 
        }); 
      } else { 
        n.add(id); 
        setExpanded(e => new Set([...e, id])); 
      }
      return n;
    });
  };

  const toggleExpand = (id) => setExpanded(prev => { 
    const n = new Set(prev); 
    n.has(id) ? n.delete(id) : n.add(id); 
    return n; 
  });

  const totalUsers  = filteredCompliance.reduce((s, r) => s + r.total, 0);
  const totalGreen  = filteredCompliance.reduce((s, r) => s + r.verde, 0);
  const totalYellow = filteredCompliance.reduce((s, r) => s + r.amarillo, 0);
  const totalRed    = filteredCompliance.reduce((s, r) => s + r.rojo, 0);
  const avgComp     = filteredCompliance.length
    ? Math.round(filteredCompliance.reduce((s, r) => s + r.pct, 0) / filteredCompliance.length) : 0;
  const activeCerts = DATA.certifications.reduce((s, c) => s + c.activas, 0);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 2, md: 3 } }}>

      {/* ── HEADER ── */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ color: C.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
              Reportes y BI Gremial
            </Typography>
            <Typography variant="body2" sx={{ color: C.text.secondary }}>
              Análisis estadístico consolidado — {activeSections.size} gráfica(s) activa(s)
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} size="small"
              sx={{ color: C.primary.main, borderColor: C.primary.main, '&:hover': { borderColor: C.primary.dark, bgcolor: '#e8f0fe' } }}>
              Actualizar
            </Button>
          </Stack>
        </Box>

        {/* Filtros globales */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: C.primary.main }}>Período</InputLabel>
                <Select value={dateRange} label="Período" onChange={e => setDateRange(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: C.primary.main } }}>
                  {DATE_RANGES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: C.primary.main }}>Región</InputLabel>
                <Select
                  multiple
                  value={selectedRegions}
                  onChange={handleRegionChange}
                  input={<OutlinedInput label="Región" />}
                  displayEmpty
                  renderValue={(selected) =>
                    selected.length === 0
                      ? <Typography variant="body2" sx={{ color: '#aaa' }}>Todas las regiones</Typography>
                      : selected.length === 1
                        ? selected[0]
                        : `${selected.length} regiones`
                  }
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: C.primary.main },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: C.primary.dark },
                  }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 280 } } }}
                >
                  <MenuItem
                    onClick={() => setSelectedRegions([])}
                    sx={{ fontStyle: 'italic', color: C.text.secondary }}
                  >
                    <Checkbox checked={selectedRegions.length === 0} sx={{ color: C.primary.main, '&.Mui-checked': { color: C.primary.main } }} />
                    <ListItemText primary="Todas las regiones" />
                  </MenuItem>
                  <Divider />
                  {REGION_OPTIONS.map(r => (
                    <MenuItem key={r.value} value={r.value}>
                      <Checkbox
                        checked={selectedRegions.includes(r.value)}
                        sx={{ color: C.primary.main, '&.Mui-checked': { color: C.primary.main } }}
                      />
                      <ListItemText primary={r.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedRegions.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.8 }}>
                  {selectedRegions.map(r => (
                    <Chip
                      key={r}
                      label={r}
                      size="small"
                      onDelete={() => setSelectedRegions(prev => prev.filter(x => x !== r))}
                      sx={{
                        bgcolor: C.primary.light,
                        color: 'white',
                        fontSize: '0.65rem',
                        height: 20,
                        '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" sx={{ color: C.text.secondary, fontWeight: 600, mr: 0.5, whiteSpace: 'nowrap' }}>
                  Gráficas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {CHART_SECTIONS.map(s => (
                    <Tooltip key={s.id} title={activeSections.has(s.id) ? 'Ocultar' : 'Mostrar'}>
                      <Chip
                        icon={React.cloneElement(s.icon, { style: { fontSize: 14 } })}
                        label={s.label}
                        size="small"
                        onClick={() => toggleSection(s.id)}
                        variant={activeSections.has(s.id) ? 'filled' : 'outlined'}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: activeSections.has(s.id) ? C.primary.main : 'transparent',
                          color: activeSections.has(s.id) ? 'white' : C.primary.main,
                          borderColor: C.primary.main,
                          fontWeight: activeSections.has(s.id) ? 600 : 400,
                          fontSize: '0.68rem',
                          height: 26,
                          '& .MuiChip-icon': { color: activeSections.has(s.id) ? 'white' : C.primary.main },
                          '&:hover': { bgcolor: activeSections.has(s.id) ? C.primary.dark : '#e8f0fe' },
                          transition: 'all 0.2s',
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── KPI CARDS ── */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          mb: 2,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Usuarios Totales', value: formatNumber(totalUsers),  color: C.primary.main,   icon: <GroupIcon />,        trend: '+8%',   subtitle: 'vs mes anterior' },
            { label: 'En Verde',         value: formatNumber(totalGreen),  color: C.secondary.main, icon: <CheckCircleIcon />,  trend: '+5%',   subtitle: '82% del total' },
            { label: 'En Amarillo',      value: formatNumber(totalYellow), color: C.accents.blue,   icon: <WarningIcon />,      trend: '-2%',   subtitle: 'Req. atención' },
            { label: 'En Rojo',          value: formatNumber(totalRed),    color: C.primary.dark,   icon: <WarningIcon />,      trend: '-15%',  subtitle: 'Mejora sig.' },
            { label: 'Cert. Activas',    value: formatNumber(activeCerts), color: C.accents.purple, icon: <SchoolIcon />,       trend: '+12',   subtitle: 'nuevas este mes' },
            { label: 'Cumpl. Promedio',  value: `${avgComp}%`,            color: getCompColor(avgComp), icon: <EqualizerIcon />, trend: avgComp >= 90 ? '+2.5%' : '-1.2%', subtitle: avgComp >= 90 ? 'Meta superada' : 'Req. mejora' },
          ].map((kpi, i) => (
            <Box key={i} sx={{ flex: '1 1 0', minWidth: 0 }}>
              <KpiCard {...kpi} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── GRÁFICAS ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5, minHeight: 0 }}>

        {activeSections.has('compliance') && (
          <ChartCard title="Cumplimiento por Región" subtitle="Semáforo de cumplimiento y evolución mensual"
            isExpanded={expanded.has('compliance')} onToggle={() => toggleExpand('compliance')}
            chartId="compliance" metadata={`${filteredCompliance.length} regiones`}>
            <ComplianceBarChart data={filteredCompliance} />
            <Box sx={{ mt: 3 }}>
              <ComplianceTrendChart data={DATA.complianceTrend} regions={visibleRegions} />
            </Box>
          </ChartCard>
        )}

        {activeSections.has('certs') && (
          <ChartCard title="Certificaciones" subtitle="Estado actual y tendencia de renovaciones"
            isExpanded={expanded.has('certs')} onToggle={() => toggleExpand('certs')}
            chartId="certs" metadata={`${DATA.certifications.length} tipos`}>
            <CertificationsChart barData={DATA.certifications} trendData={DATA.certTrend} />
          </ChartCard>
        )}

        {activeSections.has('decl') && (
          <ChartCard title="Declaraciones Presentadas vs Pendientes" subtitle="Cumplimiento normativo y evolución mensual"
            isExpanded={expanded.has('decl')} onToggle={() => toggleExpand('decl')}
            chartId="decl" metadata={`${DATA.declarations.length} tipos`}>
            <DeclarationsChart barData={DATA.declarations} trendData={DATA.declTrend} />
          </ChartCard>
        )}

        {activeSections.has('committee') && (
          <ChartCard title="Actividad del Comité" subtitle="Revisiones, aprobaciones y tiempo promedio"
            isExpanded={expanded.has('committee')} onToggle={() => toggleExpand('committee')}
            chartId="committee" metadata={`${DATA.committeeByMember.length} miembros`}>
            <CommitteeChart trendData={DATA.committeeTrend} memberData={DATA.committeeByMember} />
          </ChartCard>
        )}

        {activeSections.has('assoc') && (
          <ChartCard title="Asociaciones y Cumplimiento" subtitle="Comparativa individual y tendencia gremial"
            isExpanded={expanded.has('assoc')} onToggle={() => toggleExpand('assoc')}
            chartId="assoc" metadata={`${filteredAssoc.length} asociaciones`}>
            <AssociationsChart assocData={filteredAssoc} trendData={DATA.assocTrend} />
          </ChartCard>
        )}

        {activeSections.size === 0 && (
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', bgcolor: '#f8f9fa', borderRadius: '10px' }}>
            <BarChartIcon sx={{ fontSize: 52, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" sx={{ color: C.text.secondary, mb: 1 }}>No hay gráficas seleccionadas</Typography>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Usa los chips de arriba para activar las gráficas que deseas visualizar.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Reports;