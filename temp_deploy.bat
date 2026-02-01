@echo off
"C:\Program Files\PuTTY\plink.exe" -pw Illegal@12345678 root@72.61.250.54 "cd AFS-ACADEMY && git pull origin main && ./scripts/deploy.sh" < c:\my_projects\AFS ACADEMY\y.txt
