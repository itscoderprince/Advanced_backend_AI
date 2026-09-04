# Level 03: System Design & Scaling

This level covers system scaling, load balancing, and microservices architecture.

---

## 📁 Project Structure

```
level_03/
├── phase_01/                   # Phase 1: Load Balancing with Nginx
│   ├── docker-compose.yml      # Orchestrates Nginx + 4 Backend servers
│   ├── nginx/
│   │   └── nginx.conf          # Nginx Reverse Proxy & Round-Robin balancer
│   ├── backend/                # Standard Node.js backend (reused for servers 1-3)
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   └── CustomBackend/          # Custom Node.js backend (server 4 on port 2000)
│       ├── Dockerfile
│       ├── index.js
│       └── package.json
│
└── phase_02/                   # Phase 2: API Gateway & Microservices
```

---

## 🚀 Phase 01: Nginx Load Balancer

### Run the cluster:
```bash
cd "w:\AI Projects\level_03\phase_01"
docker compose up --build
```

### Benchmark with Autocannon:
```bash
npx autocannon -c 100 -d 10 http://localhost:8000
```
