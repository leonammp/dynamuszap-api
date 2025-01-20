FROM node:18-alpine

# Instalar dependências necessárias para o Chrome e otimizar a imagem
RUN apk add --no-cache \
    bash \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont && \
    rm -rf /var/cache/apk/*

# Definir variáveis de ambiente para o Puppeteer e Node.js
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

# Criar e usar um diretório de trabalho
WORKDIR /app

# Criar e configurar um usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copiar arquivos de dependência primeiro (para melhor cache)
COPY --chown=appuser:appgroup package*.json ./

# Instalar apenas dependências de produção
RUN npm install --production

# Copiar o restante dos arquivos
COPY --chown=appuser:appgroup . .

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "./src/app.js"]
