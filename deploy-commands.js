const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// Coloque o token do seu bot
const TOKEN = 'MTQ3NTU4OTA0NTg1MjU2OTYyMA.GZ0Ke4.2U_gHcglXB2rZ8IaVA9m9NLGqkll7ApG_DqX3w';

// Coloque o ID do bot
const CLIENT_ID = '1475589045852569620';

// ID do servidor
const GUILD_ID = '1465837557828026596';

// Comando /cfc
const commands = [
  new SlashCommandBuilder()
    .setName('cfc')
    .setDescription('Abre o formulário do Curso de Formação de Cabos')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🚀 Registrando comando /cfc...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comando /cfc registrado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comando:', error);
  }
})();