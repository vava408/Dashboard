# Frontend du Dashboard

Interface web du tableau de bord, construite avec Vue 3 et Vite. Elle communique avec l'API du backend pour afficher les métriques du serveur et gérer les services.

## Fonctionnalités

- **Connexion** : authentification auprès du backend. Le jeton reçu est conservé dans le stockage local du navigateur.
- **Dashboard** (`/home`) : vue d'ensemble des métriques système, des processus et des bots.
- **Système** (`/systeme`) : suivi du CPU, de la mémoire, de la température, du réseau, du stockage et de la disponibilité.
- **Bots Discord** (`/bot`) : consultation des bots configurés et formulaire d'ajout.
- **PM2** (`/pm2`) : consultation des processus et accès à leurs commandes.
- **Docker** (`/docker`) : liste des conteneurs et de leur état.

Les données de supervision sont actualisées automatiquement par l'interface.

## Technologies

- Vue 3 et Vue Router
- Vite
- Pinia
- Ag Charts et Chart.js
- Nginx et Docker Compose pour le déploiement

## Prérequis

- Node.js `22.18.x` ou `24.12` et versions ultérieures
- npm
- Le backend démarré et accessible depuis le frontend
- Pour le déploiement conteneurisé : Docker avec le plugin Compose

## Installation et démarrage local

Depuis le dossier `frontend` pour installer les package :

```bash
npm i
```

Le proxy de développement Vite transmet les requêtes `/api` au backend. Par défaut, il cible `100.107.194.109:5000`. Pour utiliser une autre adresse, créez un fichier `.env` dans `frontend` et définissez les variables nécessaires :

```dotenv
VITE_API_IP=127.0.0.1
VITE_API_PORT=5000
VITE_APP_NON_BOTS=
```

- `VITE_API_IP` : adresse du backend utilisée par le proxy Vite.
- `VITE_API_PORT` : port du backend (par défaut `5000`).
- `VITE_APP_NON_BOTS` : noms des processus PM2 à exclure des compteurs de bots, séparés par des virgules. Laissez cette variable vide si aucun processus ne doit être exclu.

Démarrez ensuite le serveur de développement :

```bash
npm run dev
```

Vite affiche l'adresse locale à ouvrir dans le navigateur, généralement `http://localhost:5173`.

## Commandes disponibles

À exécuter depuis le dossier `frontend` :

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run build` | Génère la version de production dans `dist/`. |
| `npm run preview` | Sert localement le contenu de `dist/` pour prévisualisation. |
| `npm run lint` | Lance Oxlint et ESLint avec corrections automatiques. |
| `npm run format` | Formate les fichiers de `src/` avec Prettier. |

## Déploiement avec Docker Compose

Le fichier Compose lance le frontend, un proxy Nginx et un tunnel Cloudflare. Le conteneur du frontend rejoint également le réseau Tailscale. Le backend n'est pas démarré par ce fichier : il doit être actif sur la machine hôte et accessible sur le port `5000`.

1. Créez le fichier d'environnement à partir du modèle :

   ```powershell
   Copy-Item .env.example .env
   ```

2. Dans `.env`, renseignez au minimum votre clé d'authentification Tailscale :

   ```dotenv
   TS_AUTHKEY=votre-cle-tailscale
   TS_HOSTNAME=dashboard
   TS_EXTRA_ARGS=
   ```

   `TS_HOSTNAME` est facultatif et vaut `vue-app` par défaut. `TS_EXTRA_ARGS` permet de transmettre des options supplémentaires à Tailscale.

3. Construisez et démarrez les conteneurs :

   ```bash
   docker compose up -d --build
   ```

4. Pour récupérer l'adresse temporaire du tunnel Cloudflare :

   ```bash
   docker compose logs -f cloudflared
   ```

   Repérez l'URL `https://…trycloudflare.com` dans les journaux. Le tunnel Cloudflare est temporaire et son URL est accessible publiquement : ne la considérez pas comme un mécanisme d'authentification.

Pour arrêter les conteneurs :

```bash
docker compose down
```

## Structure du projet

```text
frontend/
├── public/                 # Ressources statiques
├── src/
│   ├── assets/             # Styles et ressources
│   ├── components/         # Composants partagés
│   ├── router/             # Routes Vue Router
│   ├── services/           # Services frontend
│   ├── stores/             # Stores Pinia
│   └── views/              # Pages de l'application
├── Dockerfile
├── docker-compose.yml
└── package.json
```

Le fichier `.env` peut contenir des secrets : ne le commitez pas dans Git.

- [README du projet](../README.md)
- [Documentation backend](../backend/README.md)