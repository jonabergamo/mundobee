# Utilizar a imagem base oficial do Node.js
FROM node:18

# Definir o diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar o arquivo package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar todas as dependências
RUN npm install

# Copiar os arquivos restantes do projeto para o container
COPY . .

# Compilar a aplicação
RUN npm run build

# Expõe a porta que o NestJS irá rodar
EXPOSE 3300

# Comando para rodar a aplicação
CMD ["node", "dist/main"]