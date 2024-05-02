# Usando a imagem oficial do Python
FROM python:3.9-slim

# Definindo o diretório de trabalho
WORKDIR /usr/src/app

# Copiando os arquivos necessários
COPY requirements.txt ./
COPY mqtt_client.py ./

# Instalando as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Comando para rodar o script Python
CMD ["python", "./mqtt_client.py"]
