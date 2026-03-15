#!/bin/bash
IP=$(getent hosts mariadb | awk '{print $1}')
echo "Found MariaDB IP: $IP"

cat <<EOF > sites/common_site_config.json
{
  "db_host": "$IP",
  "db_port": 3306,
  "redis_cache": "redis://redis-cache:6379",
  "redis_queue": "redis://redis-queue:6379",
  "redis_socketio": "redis://redis-socketio:6379"
}
EOF
echo "frappe" > sites/apps.txt
echo "erpnext" >> sites/apps.txt
bench new-site erp.werpx.local --force --admin-password "WerpxSecurePass2026!" --mariadb-root-password "WerpxSecurePass2026!"
