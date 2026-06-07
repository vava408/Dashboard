function getNom(bots)
{
    console.log(bots)
    return bots.map(bot => ({
        id: bot.pid,
        name: bot.name
    }))
}

module.exports = {getNom}