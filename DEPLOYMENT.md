# Deployment Guide for AFS Academy

## 1. Accessing your VPS
Use your terminal or Putty to SSH into your server:
```bash
ssh root@72.61.250.54
# Enter your password when prompted
```

## 2. Initial Server Setup
Copy the `scripts/setup_vps.sh` content to your server or pull this repo first.
If you haven't cloned the repo yet, do this first:

```bash
# Install git if missing
apt update && apt install git -y

# Clone repository
git clone https://github.com/allumnova/AFS-ACADEMY.git
cd AFS-ACADEMY
```

**Run the setup script:**
```bash
chmod +x scripts/setup_vps.sh
./scripts/setup_vps.sh
```

Follow the on-screen instructions, especially for **MySQL**.

## 3. Configuration
You must create the environment files manually on the server. **Do not commit these to git.**

**Server .env:**
```bash
nano server/.env
```
Paste your production variables (DB_PASSWORD, JWT_SECRET, etc.). Press `Ctrl+X`, `Y`, `Enter` to save.

**Web .env (if needed):**
```bash
nano web/.env.local
```

## 4. Deploying
To start the app for the first time or update it later, run:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 5. Accessing the App
By default:
- Server will run on port 3000 (or as defined in your .env)
- Web will run on port 3000 (Next.js default) - **Conflict Alert**: Change one of them!

**Recommendation:**
- Set Server PORT=5000 in `server/.env`
- Run Web on Port 3000.
- Use Nginx as a reverse proxy to map domain names to ports 3000/5000.
