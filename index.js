const { Client, GatewayIntentBits, Events } = require('discord.js');
const sistema = require('./sistemaCfc');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'cfc') {
      await sistema.abrirModal(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    await sistema.tratarModal(interaction);
  }

  if (interaction.isButton()) {
    await sistema.tratarBotoes(interaction);
  }

});

client.login(process.env.TOKEN);