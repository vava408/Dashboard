const { execSync } = require('child_process');

function dockerPs()
{
    try {
        const sortieBrute = execSync('docker ps --format "{{.ID}}|{{.Image}}|{{.Command}}|{{.CreatedAt}}|{{.Status}}|{{.Ports}}|{{.Names}}"',{
            encoding: 'utf-8'
        });
		console.log(sortieBrute);
		
		sortiePropre = getSortiePropre(sortieBrute)

        return sortiePropre;
    } catch (error) {
        console.error('Erreur Docker :');
        console.error(error.message);
        console.error(error.stderr?.toString());
    }
}

function getSortiePropre(sortieBrute)
{
	var sortie;
	sortie = sortieBrute.trim().split('\n').map(ligne => ligne.split('|'));
	return sortie
}



module.exports = { dockerPs };

