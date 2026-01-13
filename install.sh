#!/bin/bash
# Script para instalar y ejecutar el proyecto en desarrollo

set -e

echo "📦 Instalando dependencias..."

# Backend
echo ""
echo "🔧 Backend..."
cd backend
npm install
cd ..

# Frontend
echo ""
echo "⚛️  Frontend..."
cd frontend
npm install
cd ..

# PostgreSQL
echo ""
echo "🗄️  Base de datos..."

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado"
    echo "   Instala PostgreSQL 15+ y luego ejecuta:"
    echo "   psql -U postgres -c \"CREATE DATABASE chatbot_saas;\""
    echo "   psql -U postgres -d chatbot_saas < database/schema.sql"
else
    # Crear BD si no existe
    createdb chatbot_saas 2>/dev/null || true
    psql -U postgres -d chatbot_saas < database/schema.sql
    echo "✅ Base de datos inicializada"
fi

echo ""
echo "✅ Instalación completada"
echo ""
echo "Para iniciar en desarrollo:"
echo "  - Backend: cd backend && npm run dev"
echo "  - Frontend: cd frontend && npm run dev"
echo ""
echo "O con Docker:"
echo "  - docker-compose up"
