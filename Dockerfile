# Usar Node.js v20.18.0 como imagen base
FROM node:20.18.0

# Establecer el directorio de trabajo en /app/proyecto
WORKDIR /app/proyecto

# Copiar package.json y package-lock.json desde la carpeta "proyecto" al directorio de trabajo
COPY proyecto/package*.json ./

# Instalar Angular CLI globalmente y luego las dependencias locales
RUN npm install -g @angular/cli && npm install

# Copiar el resto de los archivos del proyecto (todo lo que está en "proyecto")
COPY proyecto/ ./

# Exponer el puerto en el que se ejecutará Angular (4200)
EXPOSE 4200

# Comando para iniciar la aplicación en modo desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]

