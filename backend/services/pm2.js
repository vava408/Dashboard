function getNom(bots)
{
    console.log(bots)
    return bots.map(bot => ({
        id: bot.pid,
        name: bot.name,
        status: bot.pm2_env?.status
    }))
}

function getStats(bots, id)
{
    return bots[id].monit
}

module.exports = {getNom, getStats}