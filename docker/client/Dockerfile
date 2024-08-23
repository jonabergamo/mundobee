FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /usr/client/src/app

# Copia os arquivos de definição de dependências
COPY client/package*.json ./

# Instala as dependências de produção
RUN npm install --production

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
COPY --from=build /usr/client/src/app/public ./public

# Instala as dependências de produção
RUN npm install --production

# Expõe a porta para o Next.js
EXPOSE 3000

# Executa o contêiner como um usuário não root
USER node

# Comando para iniciar a aplicação
CMD ["npm", "start"]
