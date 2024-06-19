# Permitir encaminhamento de conexões estabelecidas
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

# Permitir encaminhamento entre contêineres no mesmo network bridge
iptables -A FORWARD -i docker0 -o docker0 -j ACCEPT

# Logar pacotes rejeitados
iptables -A FORWARD -j LOG --log-prefix "IPTables-Forward-Dropped: " --log-level 4

# Bloquear o resto
iptables -A FORWARD -j DROP
