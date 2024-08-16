# Dockerfile para Next.js
FROM node:18

# Define o diretório de trabalho
WORKDIR /usr/client/src/app

# Copia os arquivos de definição de dependências
COPY client/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY client ./

# Gera a build
RUN npm run build

# Expõe a porta para o Next.js
EXPOSE 3000
USER node
# Comando para iniciar a aplicação
CMD ["npm", "start"]
