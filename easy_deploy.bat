@echo off
echo ==========================================
echo      AFS ACADEMY - EASY DEPLOYMENT
echo ==========================================

echo [1/2] Pushing changes to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] Git push failed. Please check your changes.
    pause
    exit /b %errorlevel%
)

echo [2/2] Triggering Remote Deployment...
python scripts/auto_deploy.py
if %errorlevel% neq 0 (
    echo [ERROR] Remote deployment failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo      DEPLOYMENT SUCCESSFUL!
echo ==========================================
pause
