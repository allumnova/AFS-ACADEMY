Write-Host "Stopping Docker Processes..."
Stop-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
Stop-Process -Name "Docker" -ErrorAction SilentlyContinue
Stop-Service -Name "com.docker.service" -ErrorAction SilentlyContinue

Write-Host "Unregistering WSL Distributions..."
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data

Write-Host "Removing Docker Directories..."
Remove-Item -Recurse -Force "C:\Program Files\Docker" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Docker" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Docker" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.docker" -ErrorAction SilentlyContinue

Write-Host "Cleanup Complete."
