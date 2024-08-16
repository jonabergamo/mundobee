# Etapa de desenvolvimento
FROM node:18-alpine AS development

WORKDIR /usr/backend/src/app

# Copia os arquivos de dependências
COPY backend/package*.json ./

# Instala as dependências da aplicação
RUN npm install

COPY backend ./

# Compila a aplicação
RUN npm run build

# Etapa de produção
FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/backend/src/app

# Copia apenas o package.json e package-lock.json
COPY backend/package*.json ./

# Instala as dependências de produção
RUN npm install --only=production

# Copia apenas os arquivos necessários para a produção
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
