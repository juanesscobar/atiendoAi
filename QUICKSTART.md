# 🚀 INICIO RÁPIDO - SaaS Chat Bot

## ⚡ En 5 Minutos: Local + Docker

### 1️⃣ Clonar y Preparar
```bash
cd chatbot1
cp backend/.env.example backend/.env
```

### 2️⃣ Iniciar con Docker
```bash
docker-compose up -d
```

### 3️⃣ Acceder
- **Dashboard**: http://localhost:3001
- **API**: http://localhost:3000/api/health
- **BD**: localhost:5432

### 4️⃣ Registrarse
1. Ir a http://localhost:3001/register
2. Crear cuenta:
   - Email: tu@email.com
   - Password: 123456
   - Nombre: Tu Nombre
   - Empresa: Tu Negocio

### 5️⃣ Empezar a Usar
1. Login en http://localhost:3001/login
2. Ir a "Configurar Tienda"
3. Llenar información del negocio
4. Ir a "Productos" y agregar algunos
5. Ir a "Servicios" y crear servicios
6. Ir a "Medios de Pago" y agregar alias

---

## 🛑 Detener Servicios
```bash
docker-compose down
```

## 📊 Ver Logs
```bash
# Todos
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo BD
docker-compose logs -f postgres
```

## 🗄️ Acceder a BD desde Terminal
```bash
docker exec -it chatbot_saas_db psql -U chatbot_user -d chatbot_saas

# Dentro de psql:
\dt  -- Ver tablas
SELECT * FROM usuarios;  -- Ver usuarios
\q   -- Salir
```

## 🔄 Reconstruir Contenedores
```bash
docker-compose down
docker-compose up --build -d
```

---

## 📱 Stack Tecnológico

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| Frontend | React 18 + Vite + Tailwind | 3001 |
| Backend | Node.js 20 + Express + TypeScript | 3000 |
| Database | PostgreSQL 15 | 5432 |
| Admin | pgAdmin (opcional) | 5050 |

---

## 🎯 Primeros Pasos en Dashboard

1. **Dashboard** (http://localhost:3001/dashboard)
   - Ver métricas resumen
   - Últimos contactos y reservas

2. **Configurar Tienda** (http://localhost:3001/configurar-tienda)
   - Nombre de tu empresa
   - Descripción corta
   - Contexto (para IA)
   - Ubicación
   - Contacto

3. **Productos** (http://localhost:3001/productos)
   - Click "+ Nuevo Producto"
   - Cargar: Nombre, Descripción, Precio, Imagen
   - Ver listado de productos

4. **Servicios** (próxima página a implementar)
   - Crear servicios con duración y precios

5. **Pagos** (próxima página a implementar)
   - Agregar medios: Transferencias, alias, tarjeta

---

## ✨ Funcionalidades Lista

- ✅ Autenticación (Login/Registro)
- ✅ Dashboard con métricas
- ✅ Configuración de tienda
- ✅ Gestión de productos
- ✅ Base de datos PostgreSQL
- ⏳ Gestión de servicios (código listo)
- ⏳ Gestión de horarios (código listo)
- ⏳ Medios de pago (código listo)
- ⏳ Integración WhatsApp bot
- ⏳ Deploy en Render

---

## 🐛 Si Algo Falla

### "Cannot GET /api/..."
Solución: Asegurar que backend está corriendo:
```bash
docker ps  # Debe mostrar backend activo
```

### "Connection refused - PostgreSQL"
Solución: Base de datos necesita tiempo para iniciar:
```bash
docker-compose logs postgres
# Esperar mensaje "accepting connections"
```

### "Module not found"
Solución: Reinstalar dependencias:
```bash
docker-compose down
docker-compose up --build
```

---

## 📚 Ver Más

- **Deploy**: Ver [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)
- **APIs**: Ver [README.md](./README.md)
- **Arquitectura**: Ver [PLAN_ESCALABILIDAD.md](./PLAN_ESCALABILIDAD.md)

---

**¡Tu SaaS está corriendo! 🎉**

Siguiente paso: Conectar con WhatsApp bot y agregar IA
