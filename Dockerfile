# Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Definir argumentos de construcción
ARG REACT_APP_API_URL 

# Hacer que el argumento esté disponible como variable de entorno durante el build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Instalar dependencias primero
COPY package*.json ./
RUN npm install

# Generar el build
COPY . .
RUN npm run build

# Servidor de producción
FROM nginx:stable-alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos desde la etapa de build
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]