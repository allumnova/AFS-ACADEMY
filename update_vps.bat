@echo off
"C:\Program Files\PuTTY\plink.exe" -pw Illegal@12345678 root@72.61.250.54 "cd AFS-ACADEMY && echo '>>> PULLING UPDATES...' && git pull origin main && echo '>>> REBUILDING CONTAINERS...' && docker compose up -d --build" < "c:\my_projects\AFS ACADEMY\y.txt"
