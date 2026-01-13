@echo off
REM Script para instalar y ejecutar el proyecto en desarrollo (Windows)

echo.
echo 📦 Instalando dependencias...
echo.

REM Backend
echo 🔧 Backend...
cd backend
call npm install
cd ..

REM Frontend
echo.
echo ⚛️  Frontend...
cd frontend
call npm install
cd ..

REM PostgreSQL
echo.
echo 🗄️  Base de datos...
echo.
echo ❓ Asegurate de tener PostgreSQL 15+ instalado
echo.
echo Para iniciar la base de datos:
echo.
echo   1. Abre pgAdmin o PostgreSQL Shell
echo.
echo   2. Ejecuta:
echo      CREATE DATABASE chatbot_saas;
echo.
echo   3. Luego ejecuta el schema:
echo      psql -U postgres -d chatbot_saas ^< database\schema.sql
echo.

echo.
echo ✅ Instalación de dependencias completada
echo.
echo Para iniciar en desarrollo:
echo.
echo   Backend:  cd backend && npm run dev
echo   Frontend: cd frontend && npm run dev
echo.
echo O con Docker:
echo.
echo   docker-compose up
echo.

pause
