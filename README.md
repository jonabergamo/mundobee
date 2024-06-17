
# API de Controle de Colmeia de Abelhas

Claro! Aqui está o tutorial de inicialização do projeto sem a parte do Traefik.

# Tutorial de Inicialização do Projeto

Este tutorial vai guiá-lo através dos passos necessários para configurar e rodar um projeto de controle de colmeia de abelhas usando Docker e Docker Compose.

## Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## Passo 1: Clonar o Repositório

Primeiro, clone o repositório do projeto para o seu ambiente local:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

## Passo 2: Criar o Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto e preencha com as seguintes variáveis de ambiente:

```env
# Database Configuration
DB_TYPE=mariadb
DB_HOST=mariadb
DB_PORT=3306
DB_USERNAME=prisma
DB_PASSWORD=prisma
DB_DATABASE=mqtt

# MQTT Configuration
MQTT_HOST=mosquitto
MQTT_PORT=1883

# JWT Configuration
JWT_AT_SECRET=awsrgwegwergwdc
JWT_RT_SECRET=qfwrfwrgwegwefqwef

# Frontend
NEXTAUTH_SECRET=hPQQzAarrGM/jhu96Cc03GnQE7LOpiHnp3GspViQqeM=
NEXT_PUBLIC_BACKEND_API_URL=http://nestjs-app:3333/
TOKEN_SECRET_KEY=1GlMKaD3g2hG2+/k59nU2tp/RRSeAUkFanp1p34fOog=
```

## Passo 3: Configurar o `docker-compose.yml`

Certifique-se de que o seu arquivo `docker-compose.yml` está configurado da seguinte maneira:

```yaml
version: "3.7"

services:
  mosquitto:
    image: eclipse-mosquitto:2.0.11
    container_name: mosquitto
    restart: always
    volumes:
      - ./mosquitto/mosquitto.conf:/mosquitto/config/mosquitto.conf
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    ports:
      - "${MQTT_PORT}:1883"
      - "${WS_PORT}:9001"
    networks:
      - iot_network

  nestjs-app:
    build: .
    container_name: nestjs-app
    environment:
      - NODE_ENV=${NODE_ENV}
      - JWT_AT_SECRET=${JWT_AT_SECRET}
      - JWT_RT_SECRET=${JWT_RT_SECRET}
      - DATABASE_URL=${DB_HOST}
    ports:
      - "${APP_PORT}:3333"
    depends_on:
      - mosquitto
      - mariadb
    networks:
      - iot_network
    restart: always

  mariadb:
    image: mariadb:10
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_DATABASE}
      - MYSQL_USER=${DB_USERNAME}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "/usr/local/bin/healthcheck.sh", "--connect"]
      interval: 5s
      timeout: 2s
      retries: 20
    volumes:
      - mariadb-data:/var/lib/mysql
    networks:
      - iot_network

networks:
  iot_network:
    driver: bridge

volumes:
  mariadb-data: {}
```

## Passo 4: Subir os Containers

Navegue até a pasta do seu projeto e execute o comando:

```bash
docker-compose up -d
```

Isso irá baixar as imagens necessárias (caso ainda não estejam baixadas) e iniciar os containers definidos no arquivo `docker-compose.yml`.

## Passo 5: Verificar o Status dos Containers

Você pode verificar se os containers estão rodando corretamente com o comando:

```bash
docker-compose ps
```

## Passo 6: Testar a API

Você pode testar a API acessando os endpoints definidos, como por exemplo:

- Criar uma métrica:
  ```bash
  curl -X POST http://localhost:3333/auth/local/signup -H "Content-Type: application/json" -d '    
  {
      "email": "usuario@exemplo.com",
      "password": "senhaSegura123",
      "fullName": "Nome Completo"
  }'
  ```

- Listar métricas:
  ```bash
  curl http://localhost:3333/metrics
  ```

Isso deve cobrir o básico para inicializar e rodar o projeto. Se você encontrar algum problema, certifique-se de que todas as dependências estão instaladas corretamente e que você seguiu todos os passos mencionados acima.

## Descrição

Esta API RESTful permite o controle e monitoramento de colmeias de abelhas. A API possui autenticação via JWT, com suporte para tokens de acesso e refresh tokens. O token de acesso tem uma validade de 5 minutos, enquanto o refresh token tem uma validade de 3 dias. A API oferece operações CRUD completas para todas as entidades envolvidas.

## Endpoints

### Autenticação

#### POST /auth/local/signup

Cria uma nova conta de usuário.

**Parâmetros:**
- `email` (string, obrigatório)
- `password` (string, obrigatório)
- `fullName` (string, obrigatório)

**Exemplo de corpo de requisição:**

    {
      "email": "usuario@exemplo.com",
      "password": "senhaSegura123",
      "fullName": "Nome Completo"
    }

#### POST /auth/local/signin

Autentica um usuário e retorna um token de acesso e um refresh token.

**Parâmetros:**

-   `email` (string, obrigatório)
-   `password` (string, obrigatório)

**Exemplo de corpo de requisição:**

json

Copiar código

    {
      "email": "usuario@exemplo.com",
      "password": "senhaSegura123"
    }

#### POST /auth/logout

Invalida o token de acesso do usuário.

#### POST /auth/refresh

Gera um novo token de acesso utilizando o refresh token.

## Exemplo de Uso

### Criando uma Conta

Para criar uma nova conta, envie uma requisição POST para `/auth/local/signup` com o seguinte corpo:


    {
      "email": "usuario@exemplo.com",
      "password": "senhaSegura123",
      "fullName": "Nome Completo"
    }

### Autenticando

Para autenticar um usuário, envie uma requisição POST para `/auth/local/signin` com o seguinte corpo:


    {
      "email": "usuario@exemplo.com",
      "password": "senhaSegura123"
    }`

A resposta conterá um token de acesso e um refresh token:


    {
      "accessToken": "jwtAccessToken",
      "refreshToken": "jwtRefreshToken"
    }

### Utilizando o Token de Acesso

Inclua o token de acesso no cabeçalho `Authorization` de suas requisições:

    Authorization: Bearer jwtAccessToken

### Renovando o Token de Acesso

Para renovar o token de acesso, envie uma requisição POST para `/auth/refresh` com o seguinte cabeçalho:


    Authorization: Bearer jwtRefreshToken


A resposta conterá um novo token de acesso e um novo refreshToken.

## Devices

### Criar Device

#### POST /devices

Cria um novo dispositivo.

**Parâmetros:**
- `name` (string, obrigatório): Nome do dispositivo.
- `presetId` (string, obrigatório): ID do preset associado ao dispositivo.
- `ownerId` (number, opcional): ID do usuário proprietário do dispositivo.

**Exemplo de corpo de requisição:**
```json
{
  "name": "Dispositivo 1",
  "presetId": "uuid-do-preset",
  "ownerId": 1
}
```

**Resposta de Sucesso:**
- Código: 201 Created
- Corpo:
```json
{
  "id": "uuid-do-dispositivo",
  "name": "Dispositivo 1",
  "preset": {
    "id": "uuid-do-preset",
    "otherPresetField": "value"
  },
  "owner": {
    "id": 1,
    "email": "proprietario@exemplo.com",
    "fullName": "Nome Completo"
  },
  "viewers": []
}
```

### Listar Dispositivos

#### GET /devices

Lista todos os dispositivos.

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
[
  {
    "id": "uuid-do-dispositivo",
    "name": "Dispositivo 1",
    "preset": {
      "id": "uuid-do-preset",
      "otherPresetField": "value"
    },
    "owner": {
      "id": 1,
      "email": "proprietario@exemplo.com",
      "fullName": "Nome Completo"
    },
    "viewers": []
  }
]
```

### Obter Device por ID

#### GET /devices/:id

Obtém os detalhes de um dispositivo específico por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do dispositivo.

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
{
  "id": "uuid-do-dispositivo",
  "name": "Dispositivo 1",
  "preset": {
    "id": "uuid-do-preset",
    "otherPresetField": "value"
  },
  "owner": {
    "id": 1,
    "email": "proprietario@exemplo.com",
    "fullName": "Nome Completo"
  },
  "viewers": []
}
```

### Atualizar Device

#### PUT /devices/:id

Atualiza os detalhes de um dispositivo específico por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do dispositivo.

**Parâmetros:**
- `name` (string, opcional): Nome do dispositivo.
- `presetId` (string, opcional): ID do preset associado ao dispositivo.
- `ownerId` (number, opcional): ID do usuário proprietário do dispositivo.
- `viewers` (array de numbers, opcional): IDs dos usuários que podem visualizar o dispositivo.

**Exemplo de corpo de requisição:**
```json
{
  "name": "Dispositivo Atualizado",
  "presetId": "uuid-do-novo-preset",
  "ownerId": 2,
  "viewers": [3, 4]
}
```

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
{
  "id": "uuid-do-dispositivo",
  "name": "Dispositivo Atualizado",
  "preset": {
    "id": "uuid-do-novo-preset",
    "otherPresetField": "value"
  },
  "owner": {
    "id": 2,
    "email": "novo_proprietario@exemplo.com",
    "fullName": "Nome Completo"
  },
  "viewers": [
    {
      "id": 3,
      "email": "viewer1@exemplo.com",
      "fullName": "Viewer 1"
    },
    {
      "id": 4,
      "email": "viewer2@exemplo.com",
      "fullName": "Viewer 2"
    }
  ]
}
```

### Deletar Device

#### DELETE /devices/:id

Deleta um dispositivo específico por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do dispositivo.

**Resposta de Sucesso:**
- Código: 204 No Content

### Exemplo de Uso

#### Criando um Dispositivo

Para criar um novo dispositivo, envie uma requisição POST para `/devices` com o seguinte corpo:
```json
{
  "name": "Dispositivo 1",
  "presetId": "uuid-do-preset",
  "ownerId": 1
}
```

#### Listando Dispositivos

Para listar todos os dispositivos, envie uma requisição GET para `/devices`.

#### Obtendo um Dispositivo por ID

Para obter os detalhes de um dispositivo específico, envie uma requisição GET para `/devices/{id}`, substituindo `{id}` pelo ID do dispositivo.

#### Atualizando um Dispositivo

Para atualizar os detalhes de um dispositivo específico, envie uma requisição PUT para `/devices/{id}`, substituindo `{id}` pelo ID do dispositivo e incluindo no corpo da requisição os campos que deseja atualizar.

#### Deletando um Dispositivo

Para deletar um dispositivo específico, envie uma requisição DELETE para `/devices/{id}`, substituindo `{id}` pelo ID do dispositivo.

## User

### Listar Usuários

#### GET /users

Lista todos os usuários.

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
[
  {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "fullName": "Nome Completo",
    "createdAt": "2024-06-16T12:00:00Z",
    "updatedAt": "2024-06-16T12:00:00Z"
  }
]
```

### Obter User por ID

#### GET /users/:id

Obtém os detalhes de um usuário específico por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do usuário.

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
{
  "id": "uuid-do-usuario",
  "email": "usuario@exemplo.com",
  "fullName": "Nome Completo",
  "createdAt": "2024-06-16T12:00:00Z",
  "updatedAt": "2024-06-16T12:00:00Z"
}
```

### Atualizar User

#### PUT /users/:id

Atualiza os detalhes de um usuário específico por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do usuário.

**Parâmetros:**
- `email` (string, opcional): Novo email do usuário.
- `password` (string, opcional): Nova senha do usuário (esta senha será transformada em hash no backend).
- `fullName` (string, opcional): Novo nome completo do usuário.
- `base64` (string, opcional): Novo base64 para qualquer dado adicional.

**Exemplo de corpo de requisição:**
```json
{
  "email": "novo_email@exemplo.com",
  "password": "novaSenhaSegura123",
  "fullName": "Novo Nome Completo",
  "base64": "novosDadosEmBase64"
}
```

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
{
  "id": "uuid-do-usuario",
  "email": "novo_email@exemplo.com",
  "fullName": "Novo Nome Completo",
  "createdAt": "2024-06-16T12:00:00Z",
  "updatedAt": "2024-06-16T12:30:00Z"
}
```

### Deletar User

#### DELETE /users/:id

Deleta um usuário específico por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do usuário.

**Resposta de Sucesso:**
- Código: 204 No Content

## Exemplo de Uso

### Criando um Usuário

Para criar um novo usuário, siga as instruções de autenticação.

### Listando Usuários

Para listar todos os usuários, envie uma requisição GET para `/users`.

### Obtendo um Usuário por ID

Para obter os detalhes de um usuário específico, envie uma requisição GET para `/users/{id}`, substituindo `{id}` pelo ID do usuário.

### Atualizando um Usuário

Para atualizar os detalhes de um usuário específico, envie uma requisição PUT para `/users/{id}`, substituindo `{id}` pelo ID do usuário e incluindo no corpo da requisição os campos que deseja atualizar.

### Deletando um Usuário

Para deletar um usuário específico, envie uma requisição DELETE para `/users/{id}`, substituindo `{id}` pelo ID do usuário.

## Metrics

### Criar Métrica

#### POST /metrics

Cria uma nova métrica.

**Parâmetros:**
- `inCount` (number, obrigatório): Contagem de entradas.
- `outCount` (number, obrigatório): Contagem de saídas.
- `temperature` (number, opcional): Temperatura interna.
- `humidity` (number, opcional): Umidade interna.
- `outsideTemp` (number, opcional): Temperatura externa.
- `outsideHumidity` (number, opcional): Umidade externa.
- `deviceId` (string, obrigatório): ID do dispositivo ao qual a métrica está associada.

**Exemplo de corpo de requisição:**
```json
{
  "inCount": 10,
  "outCount": 8,
  "temperature": 36.5,
  "humidity": 80,
  "outsideTemp": 30,
  "outsideHumidity": 70,
  "deviceId": "uuid-do-dispositivo"
}
```

**Resposta de Sucesso:**
- Código: 201 Created
- Corpo:
```json
{
  "id": "uuid-da-metrica",
  "inCount": 10,
  "outCount": 8,
  "temperature": 36.5,
  "humidity": 80,
  "outsideTemp": 30,
  "outsideHumidity": 70,
  "timestamp": "2024-06-16T12:00:00Z",
  "device": {
    "id": "uuid-do-dispositivo",
    "name": "Nome do Dispositivo"
  }
}
```

### Listar Métricas

#### GET /metrics

Lista todas as métricas.

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
[
  {
    "id": "uuid-da-metrica",
    "inCount": 10,
    "outCount": 8,
    "temperature": 36.5,
    "humidity": 80,
    "outsideTemp": 30,
    "outsideHumidity": 70,
    "timestamp": "2024-06-16T12:00:00Z",
    "device": {
      "id": "uuid-do-dispositivo",
      "name": "Nome do Dispositivo"
    }
  }
]
```

### Obter Métrica por ID

#### GET /metrics/:id

Obtém os detalhes de uma métrica específica por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da métrica.

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
{
  "id": "uuid-da-metrica",
  "inCount": 10,
  "outCount": 8,
  "temperature": 36.5,
  "humidity": 80,
  "outsideTemp": 30,
  "outsideHumidity": 70,
  "timestamp": "2024-06-16T12:00:00Z",
  "device": {
    "id": "uuid-do-dispositivo",
    "name": "Nome do Dispositivo"
  }
}
```

### Atualizar Métrica

#### PUT /metrics/:id

Atualiza os detalhes de uma métrica específica por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da métrica.

**Parâmetros:**
- `inCount` (number, opcional): Nova contagem de entradas.
- `outCount` (number, opcional): Nova contagem de saídas.
- `temperature` (number, opcional): Nova temperatura interna.
- `humidity` (number, opcional): Nova umidade interna.
- `outsideTemp` (number, opcional): Nova temperatura externa.
- `outsideHumidity` (number, opcional): Nova umidade externa.
- `deviceId` (string, opcional): Novo ID do dispositivo ao qual a métrica está associada.

**Exemplo de corpo de requisição:**
```json
{
  "inCount": 12,
  "outCount": 9,
  "temperature": 37,
  "humidity": 85,
  "outsideTemp": 32,
  "outsideHumidity": 72,
  "deviceId": "novo-uuid-do-dispositivo"
}
```

**Resposta de Sucesso:**
- Código: 200 OK
- Corpo:
```json
{
  "id": "uuid-da-metrica",
  "inCount": 12,
  "outCount": 9,
  "temperature": 37,
  "humidity": 85,
  "outsideTemp": 32,
  "outsideHumidity": 72,
  "timestamp": "2024-06-16T12:00:00Z",
  "device": {
    "id": "novo-uuid-do-dispositivo",
    "name": "Novo Nome do Dispositivo"
  }
}
```

### Deletar Métrica

#### DELETE /metrics/:id

Deleta uma métrica específica por ID.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da métrica.

**Resposta de Sucesso:**
- Código: 204 No Content

## Exemplo de Uso

### Criando uma Métrica

Para criar uma nova métrica, envie uma requisição POST para `/metrics` com o seguinte corpo:
```json
{
  "inCount": 10,
  "outCount": 8,
  "temperature": 36.5,
  "humidity": 80,
  "outsideTemp": 30,
  "outsideHumidity": 70,
  "deviceId": "uuid-do-dispositivo"
}
```

### Listando Métricas

Para listar todas as métricas, envie uma requisição GET para `/metrics`.

### Obtendo uma Métrica por ID

Para obter os detalhes de uma métrica específica, envie uma requisição GET para `/metrics/{id}`, substituindo `{id}` pelo ID da métrica.

### Atualizando uma Métrica

Para atualizar os detalhes de uma métrica específica, envie uma requisição PUT para `/metrics/{id}`, substituindo `{id}` pelo ID da métrica e incluindo no corpo da requisição os campos que deseja atualizar.

### Deletando uma Métrica

Para deletar uma métrica específica, envie uma requisição DELETE para `/metrics/{id}`, substituindo `{id}` pelo ID da métrica.





## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorias.
