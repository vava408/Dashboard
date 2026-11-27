# API Backend

API Express du dashboard AirPanel. Elle fournit l'authentification JWT, les métriques système, la gestion des processus PM2, la consultation Docker et les opérations MySQL nécessaires à l'interface.

## Fonctionnalités

- authentification des utilisateurs avec JWT ;
- récupération des informations CPU, mémoire, disque, température et uptime ;
- récupération du trafic réseau ;
- consultation et contrôle des processus PM2 ;
- consultation des conteneurs Docker ;
- sauvegarde des configurations de bots Discord ;
- documentation interactive disponible sur `/docs`.

## Technologies

- Node.js
- Express 5
- JWT
- bcrypt
- MySQL2
- PM2
- Dockerode
- Systeminformation
- Multer
- dotenv
- CORS

## Prérequis

- Node.js ;
- npm ;
- une base MySQL ;
- PM2 installé pour les routes liées aux processus ;
- Docker installé pour les routes liées aux conteneurs ;
- les permissions nécessaires pour accéder aux ressources Docker, PM2 et système.

## Installation

Depuis la racine du projet :

```bash
cd backend
npm install
```

Créez ensuite un fichier `backend/.env`.

```dotenv
PORT=5000
JWT_SECRET=votre-secret-long-et-aleatoire

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=votre_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_CONNECTION_LIMIT=10

CHOIX_RESEAU=
```

### Variables disponibles

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `PORT` | Port d'écoute de l'API | `5000` |
| `JWT_SECRET` | Secret utilisé pour signer les jetons JWT | Aucun |
| `DB_HOST` | Adresse du serveur MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_USER` | Utilisateur MySQL | `BD_USER` si défini |
| `DB_PASSWORD` | Mot de passe MySQL | `BD_PASSWORD` si défini |
| `DB_NAME` | Nom de la base de données | Aucun |
| `DB_CONNECTION_LIMIT` | Nombre maximal de connexions du pool | `10` |
| `CHOIX_RESEAU` | Interface réseau à surveiller | Sélection automatique |

Les anciennes variables `BD_USER` et `BD_PASSWORD` sont prises en compte comme solutions de repli, mais `DB_USER` et `DB_PASSWORD` sont recommandées.

## Structure de la base

L'application attend au minimum les données suivantes :

- une table `user` contenant `id`, `username` et un mot de passe bcrypt ;
- une table `bot_discord` contenant `nom`, `process_pm2` et `image`.

L'application doit pouvoir lire la table `user` lors de la connexion et lire ou modifier `bot_discord` selon l'endpoint utilisé.

## Démarrage

```bash
npm start
```

Le serveur démarre normalement sur `http://localhost:5000`.

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

## Scripts

| Commande | Description |
| --- | --- |
| `npm start` | Lance `server.js` |
| `npm run dev` | Lance l'API avec nodemon |

## Endpoints

### API générale

| Méthode | Route | Authentification | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Non | Vérifie que l'API est en ligne |
| `GET` | `/api` | Non | Liste les endpoints exposés |
| `GET` | `/docs` | Non | Affiche la documentation interactive |

### Authentification

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/api/login/login` | Vérifie les identifiants et retourne un utilisateur et un JWT |

Corps JSON attendu :

```json
{
  "username": "nom-utilisateur",
  "password": "mot-de-passe"
}
```

Réponse réussie :

```json
{
  "success": true,
  "user": {},
  "token": "jwt"
}
```

Les jetons expirent après une heure.

### Système

Toutes les routes suivantes sont protégées par JWT.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/system/stats` | CPU, mémoire, température, disque et uptime |
| `GET` | `/api/system/reseau` | Statistiques de l'interface réseau sélectionnée |
| `GET` | `/api/system/disk` | Liste des disques et leurs statistiques |

### PM2

Toutes les routes suivantes sont protégées par JWT.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/bots/getBots` | Liste les processus PM2 |
| `GET` | `/api/bots/stats?botId=<id>` | Retourne les métriques d'un processus |
| `GET` | `/api/bots/start?botId=<id>` | Démarre un processus |
| `GET` | `/api/bots/stop?botId=<id>` | Arrête un processus |
| `GET` | `/api/bots/restart?botId=<id>` | Redémarre un processus |
| `GET` | `/api/bots/saveBot` | Liste les bots enregistrés dans MySQL |

`botId` accepte l'identifiant PM2 ou le nom du processus.

### Docker

Toutes les routes suivantes sont protégées par JWT.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/docker/getDockerContainers` | Liste les conteneurs Docker actifs |

### Base de données

Toutes les routes suivantes sont protégées par JWT.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/bdd/test` | Vérifie la connexion à MySQL |
| `POST` | `/api/bdd/creerBot` | Enregistre un bot avec une image PNG |

Le multipart de création attend les champs suivants :

| Champ | Type | Obligatoire | Description |
| --- | --- | --- | --- |
| `processPM2` | texte | Oui | Nom ou identifiant du processus |
| `nomBot` | texte | Oui | Nom du bot |
| `image` | fichier PNG | Non | Image du bot |

## Authentification

Les routes protégées attendent un en-tête HTTP :

```text
Authorization: Bearer <token>
```

Exemple :

```bash
curl -H "Authorization: Bearer VOTRE_JWT" http://localhost:5000/api/system/stats
```

Le middleware `verifyToken` vérifie la signature, l'algorithme HS256 et l'expiration du jeton.

## Gestion des permissions

Le middleware `requirePermission()` peut restreindre une route selon les permissions présentes dans le jeton JWT.

### Une permission

```js
requirePermission("bots.view")
```

### Plusieurs permissions avec OR

```js
requirePermission(["bots.start", "bots.restart"])
```

L'utilisateur doit posséder au moins une permission.

### Plusieurs permissions avec AND

```js
requirePermission(["bots.view", "bots.manage"], "AND")
```

L'utilisateur doit posséder toutes les permissions.

## Codes de réponse

| Code | Signification |
| --- | --- |
| `200` | Requête réussie |
| `400` | Paramètre requis manquant |
| `401` | Jeton absent, invalide ou expiré |
| `403` | Permission insuffisante |
| `404` | Ressource introuvable |
| `500` | Erreur interne |
| `503` | Configuration ou service externe indisponible |

## Sécurité

- ne commitez jamais `.env` ;
- utilisez un secret JWT long et unique ;
- utilisez HTTPS derrière un reverse proxy lorsque l'API est exposée ;
- limitez les permissions Linux du compte exécutant l'API ;
- restreignez l'accès au socket Docker ;
- protégez les identifiants MySQL ;
- évitez d'exposer directement le port de l'API sur Internet.

## Dépannage

**Le serveur indique que `JWT_SECRET` est manquant**  
Définissez `JWT_SECRET` dans `backend/.env`, puis redémarrez l'API.

**La connexion MySQL échoue**  
Vérifiez les paramètres `DB_*`, l'accès réseau et les droits du compte MySQL. Testez ensuite `/api/bdd/test`.

**PM2 ne répond pas**  
Vérifiez que le démon PM2 est actif et que l'utilisateur qui lance Node.js possède les droits nécessaires.

**Docker ne répond pas**  
Vérifiez que Docker est démarré et que l'utilisateur peut exécuter `docker ps`.

**Une route retourne une erreur 401**  
Récupérez d'abord un jeton avec `/api/login/login`, puis utilisez `Authorization: Bearer <token>`.

## Documentation principale

- [README du projet](../README.md)
- [Documentation frontend](../frontend/README.md)