# VUGAA Frontend
Frontend del sistema VUGAA - Ventanilla Única de Gestión de Agentes Aduanales

## 🚀 Tecnologías
- React 18+
- Material-UI (MUI) v5
- React Router v6
- Axios para peticiones HTTP
- Context API para estado global

## 📋 Requisitos previos
- Node.js 18+
- npm 9+ o yarn 1.22+

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone [tu-repo]

# Entrar al directorio
cd vugaa-frontend

# Instalar dependencias
npm install
```

## ⚙️ Configuración del entorno

Crear archivo `.env` en la raíz:

```env
REACT_APP_API_URL=http://localhost:8081/api/v1
```

## 🚀 Ejecución

### Modo desarrollo
```bash
npm start
# o
yarn start
```

La aplicación estará disponible en `http://localhost:3000`

### Construir para producción
```bash
npm run build
# o
yarn build
```

## 🧪 Datos de prueba

### Credenciales de acceso
Todos los usuarios tienen contraseña: **`123456`**

| Rol | Email | Dashboard |
|-----|-------|-----------|
| Super Admin | superadmin@vugaa.com | `/supera/dashboard` |
| Admin | admin@caaarem.com | `/admin/dashboard` |
| Comité | comite@caaarem.com | `/committee/dashboard` |
| Agente | agente@caaarem.com | `/dashboard` |
| Profesionista | profesionista@caaarem.com | `/dashboard` |
| Empresario | empresario@caaarem.com | `/dashboard` |

### Instancias disponibles
- `caaarem` - Instancia principal

## 📁 Estructura del proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── layout/         # Layouts por rol
│   └── Instancias/     # Gestión de instancias
├── context/            # Contextos (AuthContext)
├── pages/              # Páginas de la aplicación
│   ├── auth/           # Login, recuperación
│   ├── superadmin/     # Paneles Super Admin
│   ├── admin/          # Paneles Admin
│   ├── committee/      # Paneles Comité
│   └── user/           # Paneles Usuario
├── services/           # Servicios API
├── theme/              # Configuración de tema MUI
└── utils/              # Utilidades
```

## 🔐 Funcionalidades implementadas

### Sprint 1 - Autenticación y Seguridad ✅
- [x] Login con JWT
- [x] Multi-tenancy (header X-Tenant-ID)
- [x] Control de intentos fallidos
- [x] Recuperación de contraseña
- [x] Roles y permisos
- [x] Auditoría de acciones

## 📝 Notas importantes
- El header `X-Tenant-ID` es obligatorio para todas las peticiones
- El token JWT se almacena en localStorage
- La sesión expira después de 24 horas
- Los dashboards son específicos por rol

## 🛠️ Scripts disponibles
- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la app para producción
- `npm test` - Ejecuta los tests
- `npm eject` - Expone la configuración de react-scripts

## 🤝 Contribuir
1. Crear una rama desde `develop`
2. Hacer cambios
3. Crear Pull Request a `develop`

## 📄 Licencia
[Tu licencia aquí]