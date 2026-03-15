import subprocess, json
import os

try:
    cmd = ["docker", "inspect", "-f", "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}", "werpx_mariadb"]
    ip = subprocess.check_output(cmd).decode().strip()
    config = {
        "db_host": ip,
        "db_port": 3306,
        "redis_cache": "redis://redis-cache:6379",
        "redis_queue": "redis://redis-queue:6379",
        "redis_socketio": "redis://redis-socketio:6379"
    }
    with open('common_site_config.json', 'w') as f:
        json.dump(config, f)
    print("SUCCESS: " + ip)
except Exception as e:
    print("FAILED: " + str(e))
