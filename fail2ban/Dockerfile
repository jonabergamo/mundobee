FROM debian:latest

RUN apt-get update && apt-get install -y fail2ban

COPY jail.local /etc/fail2ban/jail.local
COPY mysqld-auth.conf /etc/fail2ban/filter.d/mysqld-auth.conf

CMD ["fail2ban-client", "-x", "start"]
