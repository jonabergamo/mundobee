# Etapa de construção
FROM node:18 AS builder

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia todo o código da aplicação
COPY . .

# Reconstrói bcrypt dentro do ambiente do Docker
RUN npm rebuild bcrypt --build-from-source

# Compila a aplicação
RUN npm run build

# Etapa final
FROM node:18

# Atualiza e instala o Git
RUN apt-get update -y && apt-get upgrade -y && apt-get install git -y

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do diretório de construção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Copia o arquivo .env
COPY .env .env

# Expõe a porta da aplicação
EXPOSE 3333

# Comando para iniciar a aplicação
CMD [ "npm", "run", "start:prod" ]

