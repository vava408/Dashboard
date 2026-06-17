function getNom(bots)
{
    console.log(bots)
    return bots.map(bot => ({
        id: bot.pid,
        name: bot.name
    }))
}

function getStats(bots, id)
{
    return bots[id].monit
}

module.exports = {getNom, getStats}