const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { clientId, token } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

    const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] O comando ${filePath} esta faltando as propriedades "data" ou "execute".`);
		}
	}
}

const rest = new REST().setToken(token);


(async () => {
	try {
		console.log(`Iniciando atualização de ${commands.length} (/) comandos.`);

        const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Atualizados ${data.length} (/) comandos com sucesso.`);
	} catch (error) {
        console.error(error);
	}
})();
