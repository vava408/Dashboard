function getNom(bots)
{
    console.log(bots)
    return bots.map(bot => ({
		id: bot.pm_id,
		pid: bot.pid,
        name: bot.name,
        status: bot.pm2_env?.status,
        monit: bot.monit,
        uptime: getTempsToString(Date.now() - bot.pm2_env.pm_uptime)
    }))
}

function getTempsToString(tempsEnMs)
{
    const ms = Math.max(0, Number(tempsEnMs) || 0)
    const totalSeconds = Math.floor(ms / 1000)
    const jours = Math.floor(totalSeconds / 86400)
    const heures = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secondes = totalSeconds % 60

    let resultat = ''

    if (jours > 0) resultat += `${jours}j `
    if (heures > 0 || resultat) resultat += `${String(heures).padStart(2, '0')}h `
    if (minutes > 0 || resultat) resultat += `${String(minutes).padStart(2, '0')}m `
    resultat += `${String(secondes).padStart(2, '0')}s`

    return resultat.trim()
}

function getStats(bots, identifier)
{
    const target = String(identifier)
    const bot = bots.find((process) =>
        String(process.pm_id) === target || String(process.name) === target)
        || bots[Number(identifier)]

    return bot?.monit
}

module.exports = {getNom, getStats}