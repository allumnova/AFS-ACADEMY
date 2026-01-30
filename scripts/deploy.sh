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

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
fi

# Pull latest code (already done at the beginning, but good for redundancy if this script is run standalone)
git pull origin main

# Stop old PM2 processes (if any are still running from previous deployments)
pm2 delete all || true

# Deploy with Docker Compose
docker compose up -d --build

# Prune unused images
docker image prune -f

echo "Deployment via Docker complete!"

echo ">>> Deployment Complete!"
