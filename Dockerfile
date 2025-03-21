# Imagen base de Node.js
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json primero
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Copiar el entrypoint script
COPY entrypoint.sh ./

# Asegurar que tiene permisos de ejecución (en el contenedor)
RUN chmod +x ./entrypoint.sh

# Expone el puerto que usa la app
EXPOSE 4000

# Comando para arrancar la app
# Usar el script como entrypoint
ENTRYPOINT ["./entrypoint.sh"]
