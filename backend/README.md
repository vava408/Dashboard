# Gestion des permissions

Le middleware `requirePermission()` permet de contrôler l'accès aux différentes routes de l'API en fonction des permissions de l'utilisateur connecté.

Il vérifie les permissions contenues dans le token JWT après leur validation par `verifyToken`.

## Utilisation

Le middleware accepte une permission unique ou plusieurs permissions.

### Une seule permission

```js
requirePermission("bots.view")
```

L'utilisateur doit posséder la permission `bots.view` pour accéder à la route.

### Plusieurs permissions avec OR

```js
requirePermission(["bots.start", "bots.restart"])
```

L'utilisateur doit posséder **au moins une** des permissions indiquées.

### Plusieurs permissions avec AND

```js
requirePermission(["bots.view", "bots.manage"], "AND")
```

L'utilisateur doit posséder **toutes** les permissions indiquées.

## Codes de réponse

- `401 Unauthorized` : l'utilisateur n'est pas authentifié.
- `403 Forbidden` : l'utilisateur est connecté, mais ne possède pas les permissions nécessaires.
- `200 OK` : l'accès est autorisé et la route peut être exécutée.

Ce système permet de sécuriser les routes de l'API et de gérer précisément les droits de chaque utilisateur.