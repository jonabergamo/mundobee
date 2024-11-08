# Usar a imagem base do Nginx
FROM nginx:alpine

# Copiar o certificado e a chave SSL para o container
# Supondo que os arquivos cloudflare_origin.crt e cloudflare_origin.key estejam no mesmo diretório que o Dockerfile
COPY cloudflare_origin.crt /etc/ssl/certs/cloudflare_origin.crt
COPY cloudflare_origin.key /etc/ssl/private/cloudflare_origin.key

# Copiar o arquivo de configuração do Nginx para o container
COPY default.conf /etc/nginx/default.conf
