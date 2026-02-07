@echo off
"C:\Program Files\PuTTY\plink.exe" -pw Illegal@12345678 root@72.61.250.54 "echo '--- SERVER PKG ---' && cat AFS-ACADEMY/server/package.json && echo '--- WEB PKG ---' && cat AFS-ACADEMY/web/package.json && echo '--- SERVER ENV ---' && cat AFS-ACADEMY/server/.env" < "c:\my_projects\AFS ACADEMY\y.txt"
