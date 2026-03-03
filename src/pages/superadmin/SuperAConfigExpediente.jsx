import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';

// Importar los modales separados
import CreateCategoryDialog from '../../components/expediente/CreateCategoryDialog';
import EditCategoryDialog from '../../components/expediente/EditCategoryDialog';
import CreateDocumentDialog from '../../components/expediente/CreateDocumentDialog';
import EditDocumentDialog from '../../components/expediente/EditDocumentDialog';

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  accent: '#e9e9e9',
  background: '#f5f7fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  darkBlue: '#0D2A4D',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
};

const ConfigExpediente = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'DOCUMENTACIÓN PERSONAL',
      description: 'Documentos de identificación y datos personales del solicitante',
      required: true,
      icon: '👤',
      color: institutionalColors.info,
      documents: [
        { 
          id: 101, 
          name: 'Identificación Oficial', 
          description: 'INE, Pasaporte o Cédula profesional vigente', 
          required: true, 
          format: 'PDF/JPG/PNG', 
          maxSize: '5MB',
          validation: 'OCR y validez',
          tags: ['obligatorio', 'identificación'],
          order: 1,
          periodicReview: '365',
          committeeReview: false,
          reviewDescription: 'Revisión anual por renovación'
        },
        { 
          id: 102, 
          name: 'Comprobante de Domicilio', 
          description: 'No mayor a 3 meses de antigüedad', 
          
          required: true, 
          format: 'PDF', 
          maxSize: '5MB',
          validation: 'Fecha y domicilio',
          tags: ['obligatorio', 'domicilio'],
          order: 2,
          periodicReview: '90',
          committeeReview: false,
          reviewDescription: 'Revisión trimestral'
        },
        { 
          id: 103, 
          name: 'Acta de Nacimiento', 
          description: 'Documento oficial vigente', 
          required: true, 
          format: 'PDF', 
          maxSize: '10MB',
          validation: 'Autenticidad',
          tags: ['obligatorio', 'identificación'],
          order: 3,
          periodicReview: '0',
          committeeReview: true,
          reviewDescription: 'No requiere revisión periódica'
        },
        { 
          id: 104, 
          name: 'CURP', 
          description: 'Clave Única de Registro de Población', 
          required: true, 
          format: 'PDF', 
          maxSize: '5MB',
          validation: 'Vigencia y datos',
          tags: ['obligatorio', 'identificación'],
          order: 4,
          periodicReview: '0',
          committeeReview: false,
          reviewDescription: 'Documento permanente'
        },
      ],
      order: 1
    },
    {
      id: 2,
      name: 'CERTIFICACIONES PROFESIONALES',
      description: 'Certificaciones y credenciales profesionales requeridas',
      required: true,
      icon: '🎓',
      color: institutionalColors.success,
      documents: [
        { 
          id: 201, 
          name: 'Patente Aduanal', 
          description: 'Patente vigente y legible', 
          required: true, 
          format: 'PDF', 
          maxSize: '10MB',
          validation: 'Vigencia y registro',
          tags: ['obligatorio', 'profesional'],
          order: 1,
          periodicReview: '365',
          committeeReview: true,
          reviewDescription: 'Renovación anual obligatoria'
        },
        { 
          id: 202, 
          name: 'Cédula Profesional', 
          description: 'Registro profesional vigente', 
          required: true, 
          format: 'PDF', 
          maxSize: '10MB',
          validation: 'Registro y especialidad',
          tags: ['obligatorio', 'profesional'],
          order: 2,
          periodicReview: '730',
          committeeReview: false,
          reviewDescription: 'Revisión bianual'
        },
      ],
      order: 2
    },
    {
      id: 3,
      name: 'DOCUMENTACIÓN LEGAL',
      description: 'Documentos legales y poderes notariales',
      required: false,
      icon: '⚖️',
      color: '#9b59b6',
      documents: [
        { 
          id: 301, 
          name: 'Acta Constitutiva', 
          description: 'Documento legal de constitución', 
          required: true, 
          format: 'PDF', 
          maxSize: '15MB',
          validation: 'Firma y registro notarial',
          tags: ['legal'],
          order: 1,
          periodicReview: '0',
          committeeReview: true,
          reviewDescription: 'Documento permanente - revisión inicial'
        },
        { 
          id: 302, 
          name: 'RFC', 
          description: 'Registro Federal de Contribuyentes', 
          required: true, 
          format: 'PDF', 
          maxSize: '5MB',
          validation: 'Vigencia y datos',
          tags: ['obligatorio', 'fiscal'],
          order: 2,
          periodicReview: '365',
          committeeReview: false,
          reviewDescription: 'Revisión anual por cambios fiscales'
        },
      ],
      order: 3
    },
    {
      id: 4,
      name: 'DOCUMENTACIÓN OPERATIVA',
      description: 'Documentos relacionados con operaciones aduanales',
      required: true,
      icon: '📊',
      color: institutionalColors.warning,
      documents: [
        { 
          id: 401, 
          name: 'Política de Cumplimiento', 
          description: 'Política interna de cumplimiento normativo', 
          required: true, 
          format: 'PDF', 
          maxSize: '10MB',
          validation: 'Firmas y vigencia',
          tags: ['obligatorio', 'operativo'],
          order: 1,
          periodicReview: '180',
          committeeReview: true,
          reviewDescription: 'Revisión semestral por cambios normativos'
        },
        { 
          id: 402, 
          name: 'Seguro de Responsabilidad Civil', 
          description: 'Póliza vigente de responsabilidad civil', 
          required: true, 
          format: 'PDF', 
          maxSize: '10MB',
          validation: 'Vigencia y cobertura',
          tags: ['obligatorio', 'seguro'],
          order: 2,
          periodicReview: '365',
          committeeReview: false,
          reviewDescription: 'Renovación anual'
        },
      ],
      order: 4
    }
  ]);

  // Estados para los diálogos
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openCreateDocument, setOpenCreateDocument] = useState(false);
  const [openEditDocument, setOpenEditDocument] = useState(false);
  
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const [expandedCategory, setExpandedCategory] = useState(1);

  const stats = {
    totalCategories: categories.length,
    totalDocuments: categories.reduce((total, cat) => total + cat.documents.length, 0),
    requiredDocuments: categories.reduce((total, cat) => 
      total + cat.documents.filter(doc => doc.required).length, 0),
    requiredCategories: categories.filter(cat => cat.required).length,
    committeeReviewDocuments: categories.reduce((total, cat) => 
      total + cat.documents.filter(doc => doc.committeeReview).length, 0)
  };

  // Handlers para categorías
  const handleAddCategory = () => {
    setOpenCreateCategory(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setOpenEditCategory(true);
  };

  const handleCreateCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setOpenCreateCategory(false);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(categories.map(c => 
      c.id === updatedCategory.id ? updatedCategory : c
    ));
    setOpenEditCategory(false);
    setCurrentCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría y todos sus documentos?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  // Handlers para documentos
  const handleAddDocument = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setCurrentCategory(category);
    setSelectedCategoryId(categoryId);
    setOpenCreateDocument(true);
  };

  const handleEditDocument = (category, document) => {
    setCurrentCategory(category);
    setCurrentDocument(document);
    setOpenEditDocument(true);
  };

  const handleCreateDocument = (categoryId, newDocument) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          documents: [...category.documents, newDocument]
        };
      }
      return category;
    }));
    setOpenCreateDocument(false);
    setCurrentCategory(null);
  };

  const handleUpdateDocument = (categoryId, updatedDocument) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          documents: category.documents.map(doc => 
            doc.id === updatedDocument.id ? updatedDocument : doc
          )
        };
      }
      return category;
    }));
    setOpenEditDocument(false);
    setCurrentCategory(null);
    setCurrentDocument(null);
  };

  const handleDeleteDocument = (categoryId, documentId) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      setCategories(categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            documents: category.documents.filter(doc => doc.id !== documentId)
          };
        }
        return category;
      }));
    }
  };

  const handleToggleRequired = (categoryId, documentId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          documents: category.documents.map(doc => 
            doc.id === documentId ? { ...doc, required: !doc.required } : doc
          )
        };
      }
      return category;
    }));
  };

  const handleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const formatOptions = ['PDF', 'JPG', 'PNG', 'DOC', 'DOCX', 'XLS', 'XLSX', 'TXT'];
  const sizeOptions = ['1MB', '5MB', '10MB', '25MB', '50MB', '100MB'];

  const getReviewDescription = (document) => {
    if (parseInt(document.periodicReview) === 0) return 'No requiere revisión periódica';
    const days = parseInt(document.periodicReview);
    if (days === 30) return 'Revisión mensual';
    if (days === 60) return 'Revisión bimestral';
    if (days === 90) return 'Revisión trimestral';
    if (days === 180) return 'Revisión semestral';
    if (days === 365) return 'Revisión anual';
    if (days === 730) return 'Revisión bianual';
    return `Revisión cada ${document.periodicReview} días`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: institutionalColors.background }}>
      {/* Header */}
      <Box sx={{ mb: 3, p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: institutionalColors.primary, fontWeight: 'bold', mb: 0.5 }}>
              Configuración de Expedientes
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              Panel de administración - Gestión de categorías y documentos del expediente
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<AdminPanelSettingsIcon />}
                label="Panel de Administración"
                size="small"
                sx={{ 
                  bgcolor: institutionalColors.primary,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{ 
                bgcolor: institutionalColors.primary,
                '&:hover': { bgcolor: institutionalColors.secondary }
              }}
            >
              Nueva Categoría
            </Button>
          </Stack>
        </Box>

        {/* 4 CARDS CON ESTADÍSTICAS */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3,
          width: '100%',
          '@media (max-width: 1200px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
          }
        }}>
          {/* Card 1: Categorías Totales */}
          <Card sx={{
            borderLeft: `4px solid ${institutionalColors.primary}`,
            height: 120,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <CardContent sx={{
              p: 1.5,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: institutionalColors.primary }}>
                    <FolderIcon />
                  </Box>
                  <Typography variant="body2" sx={{
                    color: institutionalColors.textSecondary,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    lineHeight: 1.2
                  }}>
                    Categorías Totales
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{
                  color: institutionalColors.textPrimary,
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  textAlign: 'right'
                }}>
                  {stats.totalCategories}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 0.5
              }}>
                <Typography variant="caption" sx={{
                  color: institutionalColors.textSecondary,
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {stats.requiredCategories} obligatorias
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Card 2: Documentos Totales */}
          <Card sx={{
            borderLeft: `4px solid ${institutionalColors.success}`,
            height: 120,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <CardContent sx={{
              p: 1.5,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: institutionalColors.success }}>
                    <DescriptionIcon />
                  </Box>
                  <Typography variant="body2" sx={{
                    color: institutionalColors.textSecondary,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    lineHeight: 1.2
                  }}>
                    Documentos Totales
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{
                  color: institutionalColors.textPrimary,
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  textAlign: 'right'
                }}>
                  {stats.totalDocuments}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 0.5
              }}>
                <Typography variant="caption" sx={{
                  color: institutionalColors.textSecondary,
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {stats.requiredDocuments} obligatorios
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Card 3: Rev. Comité */}
          <Card sx={{
            borderLeft: `4px solid ${institutionalColors.warning}`,
            height: 120,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <CardContent sx={{
              p: 1.5,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: institutionalColors.warning }}>
                    <PeopleIcon />
                  </Box>
                  <Typography variant="body2" sx={{
                    color: institutionalColors.textSecondary,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    lineHeight: 1.2
                  }}>
                    Rev. Comité
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{
                  color: institutionalColors.textPrimary,
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  textAlign: 'right'
                }}>
                  {stats.committeeReviewDocuments}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 0.5
              }}>
                <Typography variant="caption" sx={{
                  color: institutionalColors.textSecondary,
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {Math.round((stats.committeeReviewDocuments / stats.totalDocuments) * 100)}% del total
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Card 4: Categorías Obligatorias */}
          <Card sx={{
            borderLeft: `4px solid ${institutionalColors.info}`,
            height: 120,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <CardContent sx={{
              p: 1.5,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: institutionalColors.info }}>
                    <SaveIcon />
                  </Box>
                  <Typography variant="body2" sx={{
                    color: institutionalColors.textSecondary,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    lineHeight: 1.2
                  }}>
                    Obligatorias
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{
                  color: institutionalColors.textPrimary,
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  textAlign: 'right'
                }}>
                  {stats.requiredCategories}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 0.5
              }}>
                <Typography variant="caption" sx={{
                  color: institutionalColors.textSecondary,
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  De {stats.totalCategories} categorías
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0, 
        p: 2.5, 
        pt: 0
      }}>
        <Paper elevation={1} sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          borderRadius: '8px',
          height: '100%',
          border: `1px solid #e5e7eb`,
        }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid #e5e7eb`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#fff'
          }}>
            <Typography variant="h6" sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>
              Estructura del Expediente
            </Typography>
          </Box>

          {/* Lista de categorías */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: institutionalColors.background }}>
            {categories.sort((a, b) => a.order - b.order).map((category) => (
              <Accordion 
                key={category.id}
                expanded={expandedCategory === category.id}
                onChange={() => handleCategoryExpand(category.id)}
                sx={{ 
                  mb: 2, 
                  borderRadius: '8px !important', 
                  overflow: 'hidden',
                  border: `1px solid #e5e7eb`,
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#fff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '8px',
                      bgcolor: `${category.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography variant="h5" sx={{ color: category.color }}>
                        {category.icon}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: institutionalColors.textPrimary }}>
                          {category.name}
                        </Typography>
                        {category.required && (
                          <Chip 
                            label="OBLIGATORIO" 
                            size="small" 
                            color="error"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                        <Chip 
                          label={`${category.documents.length} docs`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem',
                            borderColor: institutionalColors.textSecondary,
                            color: institutionalColors.textSecondary
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                        {category.description}
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Editar categoría">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          sx={{ color: institutionalColors.primary }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar categoría">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          sx={{ color: institutionalColors.error }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ bgcolor: '#fff' }}>
                  <Box sx={{ pl: 6 }}>
                    {/* Lista de documentos */}
                    <List sx={{ p: 0 }}>
                      {category.documents.sort((a, b) => a.order - b.order).map((document) => (
                        <ListItem 
                          key={document.id}
                          sx={{ 
                            p: 1.5,
                            mb: 1,
                            borderRadius: '6px',
                            bgcolor: institutionalColors.background,
                            borderLeft: `3px solid ${document.required ? institutionalColors.error : institutionalColors.textSecondary}`
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <DragIndicatorIcon sx={{ color: institutionalColors.textSecondary }} />
                          </ListItemIcon>
                          
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <DescriptionIcon sx={{ color: document.required ? institutionalColors.error : institutionalColors.textSecondary }} />
                          </ListItemIcon>
                          
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: institutionalColors.textPrimary }}>
                                {document.name}
                              </Typography>
                              {document.required ? (
                                <Chip 
                                  label="OBLIGATORIO" 
                                  size="small" 
                                  color="error"
                                  sx={{ height: 18, fontSize: '0.6rem' }}
                                />
                              ) : (
                                <Chip 
                                  label="OPCIONAL" 
                                  size="small" 
                                  color="default"
                                  sx={{ height: 18, fontSize: '0.6rem' }}
                                />
                              )}
                              {/* Mostrar icono de revisión por comité */}
                              {document.committeeReview && (
                                <Tooltip title="Requiere revisión por comité">
                                  <PeopleIcon sx={{ fontSize: 16, color: institutionalColors.warning }} />
                                </Tooltip>
                              )}
                              {/* Mostrar icono de revisión periódica si es mayor a 0 */}
                              {parseInt(document.periodicReview) > 0 && (
                                <Tooltip title={getReviewDescription(document)}>
                                  <TimerIcon sx={{ fontSize: 16, color: institutionalColors.info }} />
                                </Tooltip>
                              )}
                            </Box>
                            
                            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block', mb: 1 }}>
                              {document.description}
                            </Typography>
                            
                            {/* INFORMACIÓN SIMPLIFICADA */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                <strong>Formato:</strong> {document.format}
                              </Typography>
                              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                <strong>Tamaño:</strong> {document.maxSize}
                              </Typography>
                              {parseInt(document.periodicReview) > 0 && (
                                <Typography variant="caption" sx={{ color: institutionalColors.info }}>
                                  <strong>Revisión:</strong> {getReviewDescription(document)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          
                          <ListItemSecondaryAction>
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title={document.required ? "Marcar como opcional" : "Marcar como obligatorio"}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      size="small"
                                      checked={document.required}
                                      onChange={() => handleToggleRequired(category.id, document.id)}
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                          color: institutionalColors.primary,
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                          backgroundColor: institutionalColors.primary,
                                        }
                                      }}
                                    />
                                  }
                                  label=""
                                />
                              </Tooltip>
                              <Tooltip title="Editar documento">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleEditDocument(category, document)}
                                  sx={{ color: institutionalColors.primary }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar documento">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleDeleteDocument(category.id, document.id)}
                                  sx={{ color: institutionalColors.error }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      startIcon={<AddIcon />}
                      size="small"
                      onClick={() => handleAddDocument(category.id)}
                      sx={{ 
                        mt: 2,
                        color: institutionalColors.primary,
                        '&:hover': {
                          bgcolor: institutionalColors.lightBlue,
                        }
                      }}
                    >
                      Agregar Documento a esta Categoría
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Modales */}
      <CreateCategoryDialog
        open={openCreateCategory}
        onClose={() => setOpenCreateCategory(false)}
        onSave={handleCreateCategory}
      />

      <EditCategoryDialog
        open={openEditCategory}
        onClose={() => {
          setOpenEditCategory(false);
          setCurrentCategory(null);
        }}
        onSave={handleUpdateCategory}
        category={currentCategory}
      />

      <CreateDocumentDialog
        open={openCreateDocument}
        onClose={() => {
          setOpenCreateDocument(false);
          setCurrentCategory(null);
        }}
        onSave={handleCreateDocument}
        categoryId={selectedCategoryId}
      />

      <EditDocumentDialog
        open={openEditDocument}
        onClose={() => {
          setOpenEditDocument(false);
          setCurrentCategory(null);
          setCurrentDocument(null);
        }}
        onSave={handleUpdateDocument}
        categoryId={currentCategory?.id}
        document={currentDocument}
      />
    </Box>
  );
};

export default ConfigExpediente;