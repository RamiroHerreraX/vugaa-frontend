import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  MenuItem,
  InputAdornment,
  FormControl,
  Select,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import CreateInstanceDialog from "../../components/Instancias/CreateInstanceDialog";
import ViewInstanceDialog from "../../components/Instancias/ViewInstanceDialog";
import EditInstanceDialog from "../../components/Instancias/EditInstanceDialog";
import { getInstancias } from "../../services/Instancia";

/* ---------- STATUS ---------- */

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "ACTIVE", label: "Activa", color: "#4caf50" },
  { value: "INACTIVE", label: "Inactiva", color: "#f44336" },
  { value: "MAINTENANCE", label: "Mantenimiento", color: "#ff9800" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "#4caf50";
    case "INACTIVE":
      return "#f44336";
    case "MAINTENANCE":
      return "#ff9800";
    default:
      return "#757575";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "INACTIVE":
      return "Inactiva";
    case "MAINTENANCE":
      return "Mantenimiento";
    default:
      return status;
  }
};

/* ---------- FILA ESTABLE ---------- */

const InstanceRow = React.memo(({ instance, onView, onEdit }) => {
  return (
    <TableRow hover sx={{ cursor: "pointer" }}>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: instance.colorPrimario || "#1976d2",
            }}
          >
            {instance.nombre?.charAt(0) || "I"}
          </Avatar>

          <Box>
            <Typography fontWeight="bold">{instance.nombre}</Typography>

            <Typography variant="caption" color="text.secondary">
              {instance.codigo} • {instance.descripcion || ""}
            </Typography>

            <Typography variant="caption" display="block">
              <CalendarIcon sx={{ fontSize: 12, mr: 0.5 }} />

              {instance.fechaCreacion
                ? new Date(instance.fechaCreacion).toLocaleDateString()
                : ""}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Chip
          size="small"
          label={getStatusLabel(instance.estado)}
          sx={{
            bgcolor: `${getStatusColor(instance.estado)}20`,
            color: getStatusColor(instance.estado),
            fontWeight: 600,
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" spacing={1}>
          <PersonIcon fontSize="small" />
          <Typography fontWeight="bold">
            {instance.totalUsuarios ?? 0}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" spacing={1}>
          <BookIcon fontSize="small" />
          <Typography fontWeight="bold">
            {instance.totalCertificaciones ?? 0}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28 }}>
            {(instance.adminNombre || "S").charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="body2">
              {instance.adminNombre || "Sin asignar"}
            </Typography>

            <Typography variant="caption">
              {instance.adminEmail || ""}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row">
          <Tooltip title="Ver">
            <IconButton onClick={() => onView(instance)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(instance)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
});

/* ---------- COMPONENTE PRINCIPAL ---------- */

const SystemInstances = () => {
  const [instances, setInstances] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ---------- LOAD ---------- */

  useEffect(() => {
    const load = async () => {
      const data = await getInstancias();
      console.log(data);
      if (Array.isArray(data)) {
        setInstances(data.filter((i) => i?.id));
      }
    };

    load();
  }, []);

  /* ---------- FILTRO ESTABLE ---------- */

  const filtered = useMemo(() => {
    const text = search.toLowerCase();
    return instances.filter((i) => {
      const matchesText =
        i.nombre?.toLowerCase().includes(text) ||
        i.codigo?.toLowerCase().includes(text);

      const matchesStatus = status === "all" || i.estado === status;

      return matchesText && matchesStatus;
    });
  }, [instances, search, status]);

  /* ---------- CREATE ---------- */
const handleCreated = useCallback((newInstance) => {
  if (!newInstance?.id) return;

  setInstances((prev) => {
    const exists = prev.some((i) => i.id === newInstance.id);

    if (exists) return prev;

    return [newInstance, ...prev];
  });

  // ❌ NO cerrar modal aquí tampoco
}, []);



  /* ---------- UPDATE ---------- */

  const handleUpdated = (updated) => {
    if (!updated?.id) return;
    setInstances((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i)),
    );
    setEditOpen(false);
  };

  /* ---------- UI ---------- */

  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Instancias del Sistema</Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setCreateOpen(true)}
        >
          Nueva
        </Button>
      </Stack>

      {/* FILTROS */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <Button
              fullWidth
              onClick={() => {
                setSearch("");
                setStatus("all");
              }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* TABLA */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instancia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Usuarios</TableCell>
              <TableCell>Certificaciones</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Sin resultados
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inst) => (
                <InstanceRow
                  key={inst.id}
                  instance={inst}
                  onView={(i) => {
                    setSelected(i);
                    setViewOpen(true);
                  }}
                  onEdit={(i) => {
                    setSelected(i);
                    setEditOpen(true);
                  }}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOGS */}

      <CreateInstanceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <ViewInstanceDialog
        open={viewOpen}
        instance={selected}
        onClose={() => setViewOpen(false)}
      />

      <EditInstanceDialog
        open={editOpen}
        instance={selected}
        onClose={() => setEditOpen(false)}
        onUpdated={handleUpdated}
      />
    </Box>
  );
};

export default SystemInstances;
