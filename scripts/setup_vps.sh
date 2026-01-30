#!/bin/bash

# AFS Academy - VPS Setup Script
# Run this script as root on your VPS to install dependencies.

echo ">>> Updating System..."
apt-get update && apt-get upgrade -y

echo ">>> Installing Curl & Git..."
apt-get install -y curl git unzip

echo ">>> Installing Node.js (v20)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo ">>> Verifying Node Version..."
node -v
npm -v

echo ">>> Installing Global Packages (PM2)..."
npm install -g pm2

echo ">>> Installing MySQL Server..."
apt-get install -y mysql-server

echo ">>> MySQL Installation Complete."
echo "IMPORTANT: You must run 'mysql_secure_installation' manually to set the root password."
echo "Then, log in to mysql and create your database:"
echo "  mysql -u root -p"
echo "  CREATE DATABASE afs_academy;"
echo "  exit"

echo ">>> Setup Complete!"
