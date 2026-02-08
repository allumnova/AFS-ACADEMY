import paramiko
import sys

HOSTNAME = '72.61.250.54'
USERNAME = 'root'
PASSWORD = 'Illegal@12345678'
PROJECT_DIR = '/root/AFS-ACADEMY'

def get_logs():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)
        
        cmd = f"cd {PROJECT_DIR} && docker compose logs server --tail=100"
        stdin, stdout, stderr = client.exec_command(cmd)
        
        cmd = f"docker exec afs-db mysql -u root -proot -D afs_academy -e 'DESCRIBE Payments;'"
        stdin, stdout, stderr = client.exec_command(cmd)
        
        output = stdout.read().decode()
        error = stderr.read().decode()
        
        with open('vps_table_structure_cap.txt', 'w', encoding='utf-8') as f:
            f.write(output)
            f.write("\nERRORS:\n")
            f.write(error)
        
        print("Structure saved to vps_table_structure_cap.txt")
            
        client.close()
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    get_logs()
