# Permitir tráfego de loopback e conexões estabelecidas
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

# Logar pacotes rejeitados (opcional)
iptables -A OUTPUT -j LOG --log-prefix "IPTables-Output-Dropped: " --log-level 4

# Bloquear o resto
iptables -A OUTPUT -j DROP
