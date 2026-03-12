
//src > utils >iconosUtils.js
// Colores institucionales
export const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  accent: "#e9e9e9",
  background: "#f5f7fa",
  lightBlue: "rgba(19, 59, 107, 0.08)",
  darkBlue: "#0D2A4D",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  success: "#27ae60",
  warning: "#f39c12",
  error: "#e74c3c",
  info: "#3498db",
};

// Opciones de íconos predefinidos
export const iconOptions = [
  { value: '📁', label: 'Carpeta' },
  { value: '📄', label: 'Documento' },
  { value: '👤', label: 'Persona' },
  { value: '💼', label: 'Trabajo' },
  { value: '🎓', label: 'Educación' },
  { value: '🏢', label: 'Empresa' },
  { value: '📋', label: 'Lista' },
  { value: '⚖️', label: 'Legal' },
  { value: '💰', label: 'Finanzas' },
  { value: '🛡️', label: 'Seguridad' },
  { value: '📊', label: 'Estadísticas' },
  { value: '🔧', label: 'Herramientas' },
  { value: '📈', label: 'Gráfico' },
  { value: '📃', label: 'Archivo' },
  { value: '📑', label: 'Artículo' },
  { value: '🧾', label: 'Recibo' },
];

// Función para obtener ícono por defecto basado en el nombre
export const getDefaultIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("personal")) return "👤";
  if (name.includes("profesional") || name.includes("certificación"))
    return "🎓";
  if (name.includes("legal") || name.includes("jurídico")) return "⚖️";
  if (name.includes("operativo") || name.includes("operación")) return "📊";
  if (name.includes("fiscal") || name.includes("contable")) return "💰";
  if (name.includes("seguro")) return "🛡️";
  return "📁";
};

// Función para obtener color de categoría basado en el nombre
export const getCategoryColor = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("personal")) return institutionalColors.info;
  if (name.includes("profesional")) return institutionalColors.success;
  if (name.includes("legal")) return "#9b59b6";
  if (name.includes("operativo")) return institutionalColors.warning;
  if (name.includes("fiscal")) return "#e67e22";
  if (name.includes("seguro")) return "#16a085";
  return institutionalColors.primary;
};