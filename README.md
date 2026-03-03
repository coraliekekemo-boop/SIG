# Application SIG - Suivi de vehicules en temps reel

Application web complete pour gerer une flotte de vehicules et visualiser leurs positions GPS sur une carte.

## Stack technique

- Frontend: React + React Leaflet (Vite)
- Backend: Node.js + Express
- Base de donnees: PostgreSQL + PostGIS
- Authentification: login/mot de passe + JWT

## Fonctionnalites implementees

- Connexion utilisateur simple avec validation basique
- CRUD vehicules (create, read, update, delete)
- Enregistrement des positions GPS
- Affichage des derniers points sur carte OpenStreetMap
- Historique de trajet d un vehicule (polyline)
- Recherche geographique:
  - vehicules dans un rayon donne
  - vehicule le plus proche

## Architecture backend

Structure du backend (`backend/src`):

- `routes/`: declaration des endpoints
- `controllers/`: orchestration HTTP (req/res)
- `services/`: logique metier + SQL/PostGIS
- `middleware/`: auth JWT + gestion erreurs
- `config/`: connexion PostgreSQL
- `utils/`: validation de requetes

## Utilisation de PostGIS et indexation

La table `vehicle_positions` utilise `geom GEOMETRY(Point, 4326)`.

Requetes spatiales utilisees:

- `ST_DWithin` pour la recherche dans un rayon
- `ST_Distance` pour le plus proche vehicule
- `ST_Point`/`ST_SetSRID` pour stocker les coordonnees GPS

Index creees:

- Index GIST sur `geom` (`idx_vehicle_positions_geom`)
- Index B-tree sur `vehicle_id`
- Index B-tree sur `recorded_at`

## Prerequis

- Node.js 18+
- PostgreSQL 14+ avec extension PostGIS
- `psql` (ou pgAdmin) pour executer le script SQL

## Installation et lancement

### 1) Base de donnees PostGIS (sans Docker)

Creer une base locale (exemple):

```sql
CREATE USER siguser WITH PASSWORD 'sigpass';
CREATE DATABASE sigdb OWNER siguser;
```

Executer ensuite le script d initialisation:

```bash
psql -U siguser -d sigdb -f database/init.sql
```

Le script `database/init.sql`:

- active `postgis` et `pgcrypto`
- cree les tables (`users`, `vehicles`, `vehicle_positions`)
- cree les index (GIST + B-tree)
- ajoute un utilisateur seed:
  - username: `admin`
  - password: `admin123`
- ajoute 2 vehicules de demonstration

Si `CREATE EXTENSION` est refuse, execute le script avec un compte PostgreSQL superuser.

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend disponible sur `http://localhost:4000`.

### 3) Frontend

Dans un second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur `http://localhost:5173`.

## API principale

- `POST /api/auth/login`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`
- `POST /api/positions`
- `GET /api/positions/latest`
- `GET /api/positions/vehicle/:vehicleId/history`
- `GET /api/positions/search/radius?lat=...&lng=...&radius=...`
- `GET /api/positions/search/nearest?lat=...&lng=...`

## Exemples rapides

Connexion:

```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

Insertion d une position:

```json
POST /api/positions
{
  "vehicle_id": 1,
  "latitude": 5.347,
  "longitude": -4.009
}
```

## Notes

- Le frontend envoie le token JWT via `Authorization: Bearer <token>`.
- Le tracage polyline apparait l orsque l utilisateur clique sur `Trajet` dans la liste des vehicules.
- Cette version ne depend pas de Docker: backend, frontend et PostgreSQL/PostGIS tournent en local.
- Toutes les contraintes demandees (stack, architecture, PostGIS, indexation, README) sont couvertes.
 