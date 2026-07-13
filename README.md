# Dr.D Portfolio

Plateforme B2C permettant aux professionnels Power BI / Data de créer, publier et partager un
portfolio en ligne.

## Stack technique

| Couche           | Choix                                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| Backend          | Node.js + Express + TypeScript                                                 |
| Base de données  | PostgreSQL                                                                     |
| ORM              | Prisma                                                                         |
| Authentification | JWT access token (mémoire) + refresh token (cookie httpOnly, rotation en base) |
| Validation       | Zod (backend et frontend)                                                      |
| Frontend         | React + TypeScript + Vite                                                      |
| Style            | Tailwind CSS + composants maison inspirés de shadcn/ui                         |
| Formulaires      | React Hook Form + Zod                                                          |
| Requêtes serveur | Axios + TanStack Query                                                         |
| État d'auth      | Zustand (en mémoire uniquement)                                                |

## Prérequis

- Node.js ≥ 18
- npm ≥ 9
- Docker (recommandé pour PostgreSQL local) — ou une instance PostgreSQL existante

## Installation

### 1. Cloner et configurer les variables d'environnement

```bash
git clone <votre-url-de-repo>
cd powerbi-portfolio

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Générez des secrets JWT robustes et remplacez les valeurs de `backend/.env` :

```bash
openssl rand -base64 48   # JWT_ACCESS_SECRET
openssl rand -base64 48   # JWT_REFRESH_SECRET
```

### 2. Démarrer PostgreSQL

```bash
docker compose up -d
```

Cela lance Postgres sur `localhost:5432` avec les identifiants déjà configurés dans
`backend/.env.example` (`drd_user` / `drd_password` / base `drd_portfolio`). Si vous utilisez votre
propre instance PostgreSQL, adaptez simplement `DATABASE_URL` dans `backend/.env`.

### 3. Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init   # crée les tables users / refresh_tokens
npm run prisma:seed                  # optionnel : ajoute un compte de démo
npm run dev                          # http://localhost:4000
```

Compte de démonstration créé par le seed : `demo@drd-portfolio.com` / `Password123`.

### 4. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev                          # http://localhost:5173
```

Ouvrez `http://localhost:5173` dans votre navigateur.
