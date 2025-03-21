# Imagen base de Node.js
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json primero
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Generamos el cliente de Prisma
RUN npx prisma generate

# Copiamos el resto del código
COPY . .

# Expone el puerto que usa la app
EXPOSE 4000

# Comando para arrancar la app
CMD ["npm", "start"]
