# Task Management API

API RESTful para gestión de tareas desarrollada siguiendo el patrón **API First** con especificación OpenAPI 3.0.

## 🎯 Características

- ✅ **API First**: Especificación OpenAPI completa antes de implementación
- 🔒 **Seguridad**: Helmet, CORS, Rate Limiting
- ✔️ **Validación**: Esquemas Joi con mensajes de error detallados
- 📊 **Base de datos**: SQLite con esquema relacional
- 📚 **Documentación**: Swagger UI integrada
- 🚦 **Health Check**: Endpoint de estado del servicio
- 🔄 **CRUD completo**: Operaciones para tareas y categorías
- 📱 **Paginación**: Lista de tareas con filtros
- ⚡ **Async/Await**: Manejo moderno de asíncronia
- 🎨 **Arquitectura limpia**: Separación de responsabilidades

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js >= 16.0.0
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd api-first

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en modo desarrollo
npm run dev

# O iniciar en modo producción
npm start
```

### Variables de Entorno

```bash
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DB_PATH=./database.sqlite

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3001

# Logging
LOG_LEVEL=info
```

## 📚 Documentación de API

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Información general de la API |
| `/docs` | GET | Documentación Swagger UI |
| `/api/v1/health` | GET | Health check del servicio |
| `/api/v1/tasks` | GET | Listar tareas (con filtros y paginación) |
| `/api/v1/tasks` | POST | Crear nueva tarea |
| `/api/v1/tasks/{id}` | GET | Obtener tarea específica |
| `/api/v1/tasks/{id}` | PUT | Actualizar tarea completa |
| `/api/v1/tasks/{id}` | PATCH | Actualizar tarea parcial |
| `/api/v1/tasks/{id}` | DELETE | Eliminar tarea |
| `/api/v1/categories` | GET | Listar categorías |
| `/api/v1/categories` | POST | Crear nueva categoría |
| `/api/v1/categories/{id}` | GET | Obtener categoría específica |
| `/api/v1/categories/{id}` | PUT | Actualizar categoría |
| `/api/v1/categories/{id}` | DELETE | Eliminar categoría |

### Documentación Interactiva

Una vez que el servidor esté ejecutándose, visita:
- **Swagger UI**: http://localhost:3000/docs
- **Especificación OpenAPI**: Ver archivo `api-spec.yaml`

## 🛠️ Ejemplos de Uso

### Health Check

```bash
curl http://localhost:3000/api/v1/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

### Crear una Categoría

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Desarrollo",
    "description": "Tareas de desarrollo de software",
    "color": "#007bff"
  }'
```

### Crear una Tarea

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Completar documentación de API",
    "description": "Escribir la documentación completa de la API REST",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59Z",
    "category_id": 1
  }'
```

### Listar Tareas con Filtros

```bash
# Todas las tareas (paginadas)
curl "http://localhost:3000/api/v1/tasks"

# Filtrar por estado
curl "http://localhost:3000/api/v1/tasks?status=pending"

# Filtrar por categoría con paginación
curl "http://localhost:3000/api/v1/tasks?category_id=1&page=1&limit=5"
```

### Actualizar Tarea Parcialmente

```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

## 🗄️ Esquema de Base de Datos

### Tabla: categories

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PRIMARY KEY | Identificador único |
| name | TEXT NOT NULL UNIQUE | Nombre de la categoría |
| description | TEXT | Descripción opcional |
| color | TEXT | Color hexadecimal |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Fecha de actualización |

### Tabla: tasks

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PRIMARY KEY | Identificador único |
| title | TEXT NOT NULL | Título de la tarea |
| description | TEXT NOT NULL | Descripción detallada |
| status | TEXT | Estado: pending, in_progress, completed, cancelled |
| priority | TEXT | Prioridad: low, medium, high, urgent |
| due_date | DATETIME | Fecha límite opcional |
| category_id | INTEGER | Referencia a categoría |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Fecha de actualización |

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📁 Estructura del Proyecto

```
api-first/
├── src/
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── validators/      # Esquemas de validación Joi
│   └── server.js        # Servidor principal
├── config/
│   └── database.js      # Configuración de base de datos
├── tests/               # Tests unitarios e integración
├── api-spec.yaml        # Especificación OpenAPI
├── .env                 # Variables de entorno
├── package.json
└── README.md
```

## 🔧 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm test` - Ejecutar tests
- `npm run test:watch` - Ejecutar tests en modo watch

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso desde diferentes orígenes
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación de entrada**: Todos los inputs son validados
- **Manejo de errores**: No exposición de información sensible

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Eliminación exitosa |
| 400 | Bad Request - Datos de entrada inválidos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: nombre duplicado) |
| 422 | Unprocessable Entity - Error de validación |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 🆔 Patrón API First

Este proyecto sigue el patrón **API First**, lo que significa:

1. **Especificación primero**: La API se define completamente en OpenAPI antes de escribir código
2. **Contrato claro**: La especificación sirve como contrato entre frontend y backend
3. **Documentación automática**: La documentación se genera automáticamente desde la especificación
4. **Validación consistente**: Los validadores se basan en los esquemas definidos en la especificación
5. **Testing basado en especificación**: Los tests validan que la implementación cumple con la especificación

### Beneficios del Patrón API First

- 📋 **Claridad**: Todos entienden qué hace la API antes de implementarla
- 🚀 **Desarrollo paralelo**: Frontend y backend pueden desarrollarse simultáneamente
- 🔄 **Iteración rápida**: Cambios en la API se reflejan inmediatamente en la documentación
- ✅ **Calidad**: Menos bugs y inconsistencias
- 🎯 **Enfoque**: Desarrolladores se enfocan en el diseño de la API primero