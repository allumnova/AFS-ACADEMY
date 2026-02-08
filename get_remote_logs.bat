@echo off
"C:\Program Files\PuTTY\plink.exe" -pw Illegal@12345678 root@72.61.250.54 "cd AFS-ACADEMY && docker compose logs server --tail=200" < "c:\my_projects\AFS ACADEMY\y.txt"
