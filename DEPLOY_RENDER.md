# Guía Completa de Deploy en Render.com

## 📋 Requisitos Previos

- Cuenta en Render.com (https://render.com)
- Código en GitHub (privado o público)
- Variables de entorno configuradas

## 🚀 Paso a Paso

### 1. Preparar el Repositorio

```bash
# Inicializar git si no está iniciado
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Full stack SaaS"

# Subir a GitHub
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### 2. Crear Servicios en Render

#### 2.1 Database PostgreSQL

1. Ir a https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configurar:
   - Name: `chatbot-saas-db`
   - Database: `chatbot_saas`
   - User: `chatbot_user`
   - Region: Tu región más cercana
   - Plan: Starter (gratuito) o standard
4. Click "Create Database"
5. Copiar `Internal Database URL` (será usado en backend)

#### 2.2 Backend API

1. Click "New +" → "Web Service"
2. Conectar con GitHub:
   - Seleccionar repositorio
   - Branch: `main`
3. Configurar:
   - Name: `chatbot-saas-api`
   - Environment: `Node`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Region: Misma que BD
   - Plan: Free o Starter
4. Environment Variables (agregar):
   ```
   DATABASE_URL=<URL interna de PostgreSQL>
   JWT_SECRET=<generar string aleatorio de 32+ caracteres>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=3000
   OPENAI_API_KEY=<tu API key>
   CORS_ORIGIN=https://chatbot-saas-web.onrender.com
   ```
5. Click "Deploy"

#### 2.3 Frontend Web

1. Click "New +" → "Static Site"
2. Conectar GitHub:
   - Seleccionar repositorio
   - Branch: `main`
3. Configurar:
   - Name: `chatbot-saas-web`
   - Build Command: `cd frontend && npm ci && npm run build`
   - Publish Directory: `frontend/dist`
   - Region: Misma que otros servicios
4. Click "Deploy"

### 3. Verificar Deploy

#### Backend API
```bash
curl https://chatbot-saas-api.onrender.com/api/health
```

Debería retornar:
```json
{"status":"OK","timestamp":"..."}
```

#### Frontend
Acceder a: `https://chatbot-saas-web.onrender.com/login`

## 🔧 Variables de Entorno Importantes

### Para Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<debe ser diferente para production>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=sk-...
CORS_ORIGIN=https://tu-frontend.onrender.com
```

### Para Frontend
Las variables REACT_APP_* se inyectan en build time

## ⚙️ Configuración Adicional

### Enable Auto-Deploy
1. En cada servicio, ir a "Settings"
2. Buscar "Auto-Deploy"
3. Habilitar
4. Cada push a main dispara redeploy automático

### Salud Checks
1. Backend → Settings → Health Check
2. Path: `/api/health`
3. Intervalo: 30 segundos

### Logs en Vivo
Dashboard → Tu servicio → Logs

## 🗄️ Inicializar Base de Datos

Después del primer deploy:

```bash
# Conectarse a PostgreSQL desde Render
# Usar pgAdmin u otra herramienta con la Internal Database URL

# O ejecutar script SQL
psql <DATABASE_URL> < database/schema.sql
```

## 📊 Monitoreo

- **Render Dashboard**: Ver estado y logs en tiempo real
- **Uptime**: render.com monitorea automáticamente
- **Errores**: Revisar en Logs

## 💰 Costos Estimados (Mensual)

| Servicio | Plan Gratuito | Plan Starter |
|----------|---------------|-------------|
| PostgreSQL | Incluido | $7 |
| Backend API | $0 | $7 |
| Frontend | $0 | $0 |
| **Total** | **$0** | **$14** |

## 🔐 Seguridad

- [ ] Cambiar JWT_SECRET a algo seguro
- [ ] Habilitar HTTPS (automático en Render)
- [ ] Configurar CORS correctamente
- [ ] Backups de BD habilitados
- [ ] Variables sensibles NO en código

## 🛠️ Troubleshooting

### Backend no se conecta a BD
```
Error: ECONNREFUSED 5432
Solución: Verificar DATABASE_URL y que la BD esté activa
```

### Frontend no carga
```
Logs: Build failed
Solución: Verificar que build command sea correcto
         Revisar npm install
```

### CORS error
```
Solución: Actualizar CORS_ORIGIN en backend
         Debe ser exacta con dominio frontend
```

## 📈 Próximos Pasos

1. ✅ Verificar que todo funcione
2. ✅ Crear usuario de prueba en dashboard
3. ✅ Cargar productos/servicios
4. ✅ Conectar WhatsApp bot
5. ✅ Integrar IA en bot

---

**URL de Acceso (una vez deployed)**
- Dashboard: https://chatbot-saas-web.onrender.com
- API: https://chatbot-saas-api.onrender.com/api
- Database: Interna (no expuesta)

¡Tu SaaS está listo en producción! 🚀
