# Dashboard Raspberry Pi

Un tableau de bord personnel permettant de surveiller et de contrôler un Raspberry Pi 5 à distance depuis n'importe où. Ce projet centralise plusieurs informations système et services, afin de suivre l'état du serveur et d'interagir avec certains processus sans avoir à se connecter directement au terminal.

## Objectif

Ce dashboard a été conçu pour répondre à un besoin concret : disposer d'une interface simple et rapide pour :

- surveiller les ressources système du Raspberry Pi ;
- suivre l'état des services et conteneurs ;
- contrôler certains processus PM2 ;
- vérifier l'activité de Jellyfin ;
- gérer des bots Discord depuis une interface web.

## Fonctionnalités

### Surveillance du système

- utilisation du CPU
- utilisation de la RAM
- espace de stockage restant
- température du processeur
- uptime
- état du réseau

### Services et applications

- gestion des processus PM2
- liste des conteneurs Docker actifs ou arrêtés
- détails des conteneurs :
  - nom
  - RAM utilisée
  - CPU utilisé

### Gestion de Jellyfin
- suivi des utilisateurs connectés à Jellyfin
- information sur le film actuellement diffusé

### Gestion des bots Discord

- afficher le nombre de bots actifs
- démarrer, redémarrer ou arrêter un bot
- consulter l'utilisation CPU et RAM de chaque bot

## Stack technique

- Frontend : Vue.js
- Backend : Node.js / Express
- Monitoring système : commandes système et API locale
- Conteneurs : Docker
- Gestion des processus : PM2



## Structure du projet

```bash
Dashboard/
├── backend/
│   ├── data/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── docker-compose.yml
├── README.md
└── package.json
```

## Prérequis

- Node.js installé
- Docker installé et fonctionnel
- Raspberry Pi ou machine Linux compatible
- PM2 installé

## Installation

1. Cloner le projet :

```bash
git clone https://github.com/vava408/Dashboard
cd Dashboard
```

2. Installer les dépendances backend :

```bash
cd backend
npm install
```

3. Installer les dépendances frontend :

```bash
cd ../frontend
npm install
```

## Démarrage

### Backend

```bash
cd backend
pm2 start server.js --name dashboard-api
```

### Frontend

```bash
cd frontend
npm run dev
```

## Utilisation

Une fois le projet démarré, ouvrez l'interface web et allé a l'url http://localhost:5173/ dans le navigateur et accédez au dashboard pour :

- contrôler les ressources du système,
- suivre les conteneurs Docker,
- visualiser les services actifs,
- gérer les bots Discord,
- consulter l'état de Jellyfin.

## À venir

- amélioration de l'interface utilisateur
- ajout de graphiques historiques
- notifications d'alertes
- optimisation du système de monitoring

## Plus de détaille

Aller voir le readme du frontend pour plus de detaille dessus

Aller voir le readme du backend pour plus de detaille dessus
