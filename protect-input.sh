# Permitir tráfego de loopback e conexões estabelecidas
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

# Permitir SSH somente de IPs específicos (exemplo: 192.168.1.100)
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.100 -j ACCEPT

# Permitir HTTP e HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Permitir MariaDB apenas da rede interna do Docker
iptables -A INPUT -p tcp --dport 3306 -s 172.19.0.0/24 -j ACCEPT

# Permitir portas MQTT
iptables -A INPUT -p tcp --dport 1883 -j ACCEPT
iptables -A INPUT -p tcp --dport 9001 -j ACCEPT

# Logar pacotes rejeitados
iptables -A INPUT -j LOG --log-prefix "IPTables-Dropped: " --log-level 4

# Bloquear o resto
iptables -A INPUT -j DROP
