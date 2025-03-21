#!/bin/sh

# Mostrar en consola que arranca el script
echo "Ejecutando migraciones en producción..."

# Correr las migraciones pendientes (comando recomendado en producción)
npx prisma migrate deploy

echo "Migraciones aplicadas. Iniciando el servidor..."

# Ejecutar la app
npm start
