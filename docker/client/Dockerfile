FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /usr/client/src/app

# Copia os arquivos de definição de dependências
COPY client/package*.json ./

# Instala todas as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY client ./

# Gera a build
RUN npm run build

# Prod
FROM node:18-slim AS production

# Define o diretório de trabalho
WORKDIR /usr/client/src/app

# Copia apenas os arquivos necessários da fase de build
COPY --from=build /usr/client/src/app/package*.json ./
COPY --from=build /usr/client/src/app/node_modules ./node_modules
COPY --from=build /usr/client/src/app/.next ./.next

# Remove as dependências de desenvolvimento
RUN npm prune --production

# Expõe a porta para o Next.js
EXPOSE 3000

USER node

# Comando para iniciar a aplicação
CMD ["npm", "start"]
