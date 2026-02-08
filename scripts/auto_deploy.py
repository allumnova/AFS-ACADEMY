import paramiko
import sys
import time

# VPS Configuration
HOSTNAME = '72.61.250.54'
USERNAME = 'root'
PASSWORD = 'Illegal@12345678'
PROJECT_DIR = '/root/AFS-ACADEMY' 

def remote_deploy():
    print(f"\n[Auto-Deploy] Connecting to {HOSTNAME}...")
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)
        print("[Auto-Deploy] Connected successfully.")

        # Commands to execute on the server
        # 1. Fetch latest changes
        # 2. Hard reset to match origin (avoids merge conflicts)
        # 3. Ensure deploy script is executable
        # 4. Run deploy script
        commands = [
            f"cd {PROJECT_DIR} && git fetch origin main",
            f"cd {PROJECT_DIR} && git reset --hard origin/main",
            f"cd {PROJECT_DIR} && chmod +x scripts/deploy.sh",
            f"cd {PROJECT_DIR} && ./scripts/deploy.sh"
        ]

        for cmd in commands:
            print(f"\n[Remote] Executing: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            
            # Stream output
            while True:
                line = stdout.readline()
                if not line:
                    break
                print(f"[Remote] {line.strip()}")
            
            # Check for errors
            exit_status = stdout.channel.recv_exit_status()
            if exit_status != 0:
                err = stderr.read().decode()
                print(f"[Remote] Error (Exit Code {exit_status}): {err}")
                return False

        print("\n[Auto-Deploy] Deployment completed successfully!")
        client.close()
        return True

    except Exception as e:
        print(f"[Auto-Deploy] Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = remote_deploy()
    sys.exit(0 if success else 1)
