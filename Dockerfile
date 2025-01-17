# FROM node:18-slim

# # Instalar dependências necessárias para o Chrome
# RUN apt-get update && apt-get install -y \
#     chromium \
#     chromium-driver \
#     fonts-ipafont-gothic \
#     fonts-wqy-zenhei \
#     fonts-thai-tlwg \
#     fonts-kacst \
#     fonts-freefont-ttf \
#     libxss1 \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# # Definir variáveis de ambiente para o Chrome
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["node", "./src/app.js"]

# Use uma imagem base menor
FROM node:18-alpine

# Instalar dependências necessárias para o Chrome
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont

# Definir variáveis de ambiente para o Puppeteer e Node.js
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

WORKDIR /app

# Copiar arquivos de dependência primeiro (para melhor cache)
COPY package*.json ./

# Instalar dependências com cache otimizado
RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "./src/app.js"]
