const { execSync } = require('child_process');


function dockerPs()
{
	try {
		// Exemple avec une commande qui renvoie du texte ou du JSON (ex: uname)
		const sortieBrute = execSync('uname -a', { encoding: 'utf-8' })
	
		return sortieBrute;
	} catch (error) {
		console.error(JSON.stringify({ status: 'erreur', message: error.message }));
	}
}

module.exports = { dockerPs }
