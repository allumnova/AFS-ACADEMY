#!/bin/bash

# AFS Academy - Deployment Script
# Assumes you are inside the project root directory.

echo ">>> Pulling latest changes..."
git pull origin main

echo ">>> Building Server..."
cd server
npm install
# Add any build steps for server if needed (e.g. tsc)

echo ">>> Building Web..."
cd ../web
npm install
npm run build

echo ">>> Managing Processes with PM2..."
cd ..
# Example PM2 startup (this might need customization based on ecosystem.config.js if you create one)
# For now, we'll try to start/restart straightforwardly using typical names.

# Check if 'afs-server' exists, if so restart, else start
if pm2 list | grep -q "afs-server"; then
    pm2 restart afs-server
else
    cd server
    pm2 start app.js --name afs-server
    cd ..
fi

# Check if 'afs-web' exists, if so restart, else start
if pm2 list | grep -q "afs-web"; then
    pm2 restart afs-web
else
    cd web
    pm2 start npm --name "afs-web" -- start
    cd ..
fi

pm2 save

echo ">>> Deployment Complete!"
