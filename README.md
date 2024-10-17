# 🐝 Projeto de Monitoramento de Colmeias

Este projeto monitora colmeias de abelhas utilizando diversas tecnologias, coletando dados de sensores instalados em dispositivos ESP32 para monitorar temperatura, umidade e a movimentação de abelhas. Esses dados são visualizados em dashboards interativos e armazenados em um banco de dados. O sistema também utiliza ferramentas como Grafana e Node-RED para monitoramento e simulação de dados.

## Tecnologias Utilizadas

As tecnologias e ferramentas empregadas neste projeto são:

- ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) **Docker** (versão 25 ou superior) para orquestração de contêineres.
- ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?logo=docker&logoColor=white) **Docker Compose** para gerenciamento de múltiplos serviços.
- ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white) **Next.js** com **Tailwind CSS** para o frontend.
- ![Mosquitto](https://img.shields.io/badge/Mosquitto-3C5280?logo=eclipse&logoColor=white) **Mosquitto** para comunicação MQTT.
- ![MariaDB](https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white) **MariaDB** como banco de dados relacional.
- ![Grafana](https://img.shields.io/badge/Grafana-F46800?logo=grafana&logoColor=white) **Grafana** para visualização de métricas.
- ![Node-RED](https://img.shields.io/badge/Node--RED-8F0000?logo=nodered&logoColor=white) **Node-RED** para simulação e teste de sistemas embarcados.

## Requisitos Mínimos do Sistema

Para rodar o projeto, sua máquina deve atender aos seguintes requisitos mínimos:

- **Memória RAM:** 4 GB
- **Processador:** 2 núcleos
- **Armazenamento:** 10 GB livres
- **Sistema Operacional:** Compatível com Docker (Linux, macOS, Windows)

## Passo a Passo para Rodar o Projeto

1. Clone este repositório:
    ```bash
    git clone https://github.com/jonabergamo/mundobee.git
    cd mundobee
    ```

2. Execute o projeto com Docker Compose:
    ```bash
    docker-compose up -d
    ```

3. Verifique se todos os serviços estão rodando corretamente:
    ```bash
    docker ps
    ```

4. Acesse os serviços nos seguintes URLs:

- Frontend: [http://localhost](http://localhost)
- Portainer: [http://localhost/portainer](http://localhost/portainer)
- Grafana: [http://localhost/grafana](http://localhost/grafana)
- Node-RED: [http://localhost/node-red](http://localhost/node-red)

## Descrição dos Serviços

### Frontend (Next.js com Tailwind CSS)
Este serviço hospeda o frontend da aplicação, onde os dashboards são exibidos, e também permite o cadastro e gerenciamento de colmeias de abelhas. A interface é construída com **Next.js** e estilizada com **Tailwind CSS**.

- URL de Acesso: [http://localhost](http://localhost)

### Grafana
O Grafana é utilizado para monitorar métricas e visualizar dados, como o consumo de recursos da aplicação e informações de desempenho, integrando-se ao **Prometheus** para coleta de métricas.

- URL de Acesso: [http://localhost/grafana](http://localhost/grafana)

### Mosquitto (Broker MQTT)
O **Mosquitto** é responsável por gerenciar a comunicação MQTT, recebendo dados de sensores de temperatura, umidade e movimentação das abelhas. Esses dados são enviados pelos dispositivos ESP32 instalados nas colmeias e armazenados no **MariaDB**.

- Porta Padrão: `1883` (configurado internamente no Docker)

### MariaDB
O **MariaDB** é o banco de dados relacional utilizado para armazenar os dados coletados pelo Mosquitto e gerenciar as informações acessadas pelo frontend.

- Porta Padrão: `3306` (configurado internamente no Docker)

### Node-RED
O **Node-RED** é utilizado para simulação e testes dos dispositivos embarcados (ESP32 e Arduino). Ele facilita o desenvolvimento de fluxos de dados simulados que podem ser testados antes da implantação real.

- URL de Acesso: [http://localhost/node-red](http://localhost/node-red)

### Portainer
O **Portainer** é uma ferramenta de gerenciamento de contêineres Docker que pode ser acessada para monitorar e gerenciar todos os serviços rodando no ambiente Docker.

- URL de Acesso: [http://localhost/portainer](http://localhost/portainer)

## Como Acessar a Aplicação

- Frontend: [http://localhost](http://localhost)
- Grafana: [http://localhost/grafana](http://localhost/grafana)
- Node-RED: [http://localhost/node-red](http://localhost/node-red)
- Portainer: [http://localhost/portainer](http://localhost/portainer)

---

### Observações
- Certifique-se de que as portas usadas pelos serviços estejam disponíveis no seu host.
- Para parar o projeto, utilize o comando:
    ```bash
    docker-compose down
    ```