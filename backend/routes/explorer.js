const router = require("express").Router();

const endpoints = [
    { method: "GET", path: "/", label: "Etat de l'API", description: "Vérifie que le backend est en ligne." },
    { method: "GET", path: "/api", label: "Index de l'API", description: "Liste les endpoints disponibles." },
    { method: "GET", path: "/api/system/stats", label: "Statistiques système", description: "CPU, mémoire, température, disque et uptime." },
    { method: "GET", path: "/api/bots/getBots", label: "Liste des bots", description: "Retourne les processus PM2 détectés." },
    { method: "GET", path: "/api/bots/stats?botId=0", label: "Statistiques d'un bot", description: "Retourne les métriques PM2 du bot indiqué." },
    { method: "GET", path: "/api/bots/start?botId=0", label: "Démarrer un bot", description: "Démarre le bot PM2 indiqué." },
    { method: "GET", path: "/api/bots/stop?botId=0", label: "Arrêter un bot", description: "Arrête le bot PM2 indiqué." },
    { method: "GET", path: "/api/bots/restart?botId=0", label: "Redémarrer un bot", description: "Redémarre le bot PM2 indiqué." },
	{ method: "GET", path: "/api/docker/getDockerContainers", label: "Obtenir les conteneurs Docker", description: "Retourne la liste des conteneurs Docker." }
];

router.get("/", (req, res) => {
    res.json({
        name: "AirPanel Pro API",
        status: "online",
        documentation: "/docs",
        endpoints
    });
});

function renderExplorer(req, res) {
    const endpointData = JSON.stringify(endpoints).replace(/</g, "\\u003c");

    res.type("html").send(`<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AirPanel Pro API</title>
    <style>
        :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #111827; color: #e5e7eb; }
        * { box-sizing: border-box; }
        body { margin: 0; background: radial-gradient(circle at 15% 0%, #243b53, #111827 45%); min-height: 100vh; }
        main { max-width: 1180px; margin: 0 auto; padding: 42px 22px 64px; }
        header { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 30px; }
        h1 { margin: 0 0 8px; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.04em; }
        p { color: #aeb9c8; }
        .tag { color: #67e8f9; font: 700 0.75rem ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; }
        .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .8fr); gap: 22px; }
        .panel, .endpoint { border: 1px solid #334155; background: rgba(15, 23, 42, .82); border-radius: 12px; }
        .panel { padding: 20px; }
        .endpoint { padding: 18px; margin-bottom: 12px; transition: border-color .2s, transform .2s; }
        .endpoint:hover { border-color: #22d3ee; transform: translateY(-2px); }
        .endpoint-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
        .method { color: #34d399; font: 700 .75rem ui-monospace, monospace; }
        code { color: #f8fafc; font: .92rem ui-monospace, monospace; overflow-wrap: anywhere; }
        .endpoint p { margin: 10px 0 16px; font-size: .92rem; }
        button { border: 0; border-radius: 7px; padding: 9px 14px; color: #082f49; background: #67e8f9; cursor: pointer; font-weight: 700; }
        button:hover { background: #a5f3fc; }
        .field { display: none; margin: 0 0 12px; }
        .field.visible { display: block; }
        label { display: block; color: #aeb9c8; font-size: .8rem; margin-bottom: 6px; }
        input { width: 100%; border: 1px solid #475569; border-radius: 7px; padding: 10px; color: #f8fafc; background: #0f172a; }
        pre { min-height: 280px; max-height: 65vh; overflow: auto; margin: 0; padding: 16px; border-radius: 8px; color: #d1fae5; background: #020617; font: .82rem/1.6 ui-monospace, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
        .result-head { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
        #status { color: #94a3b8; font: .82rem ui-monospace, monospace; }
        @media (max-width: 800px) { header, .layout { display: block; } header { margin-bottom: 22px; } .panel { margin-top: 22px; } }
    </style>
</head>
<body>
<main>
    <header>
        <div><div class="tag">Browsable API</div><h1>AirPanel Pro</h1><p>Explore les routes Express et consulte leurs réponses JSON.</p></div>
        <a href="/api" style="color:#67e8f9">/api</a>
    </header>
    <div class="layout">
        <section><div id="endpoints"></div></section>
        <section class="panel">
            <div class="result-head"><strong>Réponse</strong><span id="status">Aucune requête</span></div>
            <pre id="result">Sélectionne un endpoint pour afficher son résultat.</pre>
        </section>
    </div>
</main>
<script>
const endpoints = ${endpointData};
const endpointContainer = document.querySelector('#endpoints');
const result = document.querySelector('#result');
const status = document.querySelector('#status');

endpoints.forEach((endpoint, index) => {
    const card = document.createElement('article');
    card.className = 'endpoint';
    const needsBotId = endpoint.path.includes('botId');
    card.innerHTML = '<div class="endpoint-top"><span class="method">' + endpoint.method + '</span><code>' + endpoint.path + '</code></div>' +
        '<p>' + endpoint.description + '</p>' +
        '<div class="field' + (needsBotId ? ' visible' : '') + '"><label for="bot-' + index + '">botId</label><input id="bot-' + index + '" value="0" inputmode="numeric"></div>' +
        '<button type="button">Exécuter</button>';
    card.querySelector('button').addEventListener('click', () => callEndpoint(endpoint, index));
    endpointContainer.appendChild(card);
});

async function callEndpoint(endpoint, index) {
    const botId = document.querySelector('#bot-' + index)?.value || '0';
    const path = endpoint.path.replace('botId=0', 'botId=' + encodeURIComponent(botId));
    const startedAt = performance.now();
    status.textContent = 'Chargement...';
    result.textContent = '';
    try {
        const response = await fetch(path);
        const body = await response.json();
        status.textContent = response.status + ' ' + response.statusText + ' · ' + Math.round(performance.now() - startedAt) + ' ms';
        result.textContent = JSON.stringify(body, null, 2);
    } catch (error) {
        status.textContent = 'Erreur réseau';
        result.textContent = error.message;
    }
}
</script>
</body>
</html>`);
}

module.exports = { router, renderExplorer };