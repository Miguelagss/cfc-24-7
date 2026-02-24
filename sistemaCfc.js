const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const CANAL_RESPOSTAS_ID = '1474945706900066314';
const CORREGEDORIA_ROLE_ID = '1472046999527231660';

// Guardar timers ativos
const timers = new Map();

module.exports = {

  async abrirModal(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal_cfc')
      .setTitle('Formulário – CFC');

    const perguntas = [
      { id: 'q1', label: 'Cabo encontra militar sem farda. O que fazer?' },
      { id: 'q2', label: 'Cabo pode aplicar punições? Justifique.' },
      { id: 'q3', label: 'Três deveres do Cabo.' },
      { id: 'q4', label: 'Procedimento após recrutamento?' },
      { id: 'q5', label: 'Graduado cometendo ilícito. Ação?' }
    ];

    perguntas.forEach(p => {
      const input = new TextInputBuilder()
        .setCustomId(p.id)
        .setLabel(p.label)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
    });

    await interaction.showModal(modal);

    // Timer de 5 minutos
    const timeout = setTimeout(async () => {
      const canal = interaction.guild.channels.cache.get(CANAL_RESPOSTAS_ID);
      const role = interaction.guild.roles.cache.get(CORREGEDORIA_ROLE_ID);

      if (canal && role) {
        await canal.send(`⏰ **O tempo do formulário do usuário ${interaction.user.tag} terminou sem envio! <@&${role.id}>**`);
      }
      timers.delete(interaction.user.id);
    }, 5 * 60 * 1000);

    timers.set(interaction.user.id, timeout);
  },

  async tratarModal(interaction) {
    if (interaction.customId === 'modal_cfc') {

      // Para o timer caso tenha enviado antes
      if (timers.has(interaction.user.id)) {
        clearTimeout(timers.get(interaction.user.id));
        timers.delete(interaction.user.id);
      }

      const respostas = {
        q1: interaction.fields.getTextInputValue('q1'),
        q2: interaction.fields.getTextInputValue('q2'),
        q3: interaction.fields.getTextInputValue('q3'),
        q4: interaction.fields.getTextInputValue('q4'),
        q5: interaction.fields.getTextInputValue('q5'),
      };

      const canal = interaction.guild.channels.cache.get(CANAL_RESPOSTAS_ID);
      const role = interaction.guild.roles.cache.get(CORREGEDORIA_ROLE_ID);

      const botoes = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`aprovar_${interaction.user.id}`)
          .setLabel('Aprovar')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`reprovar_${interaction.user.id}`)
          .setLabel('Reprovar')
          .setStyle(ButtonStyle.Danger)
      );

      if (canal) {
        await canal.send({
          content:
`📋 **Novo Candidato – ${interaction.user.tag}**
${role ? `<@&${role.id}>` : ''}

**1:** ${respostas.q1}
**2:** ${respostas.q2}
**3:** ${respostas.q3}
**4:** ${respostas.q4}
**5:** ${respostas.q5}`,
          components: [botoes]
        });
      }

      await interaction.reply({
        content: "**📨 Formulário enviado para avaliação.**",
        ephemeral: true
      });
    }

    if (interaction.customId.startsWith('modal_reprovar_')) {
      const userId = interaction.customId.split('_')[2];
      const motivo = interaction.fields.getTextInputValue('motivo');
      const user = await interaction.client.users.fetch(userId);
      const reprovador = interaction.user;

      // DM em negrito incluindo nickname de quem reprovou
      await user.send(`**❌ Você foi reprovado no CFC.

Motivo:
${motivo}
(Reprovado por: ${reprovador.tag})**`);

      await interaction.reply({
        content: "**Reprovação enviada.**",
        ephemeral: true
      });
    }
  },

  async tratarBotoes(interaction) {
    if (interaction.customId.startsWith('aprovar_')) {
      const userId = interaction.customId.split('_')[1];
      const user = await interaction.client.users.fetch(userId);
      const aprovador = interaction.user;

      // DM em negrito incluindo nickname de quem aprovou
      await user.send(`**✅ Você foi aprovado no CFC. Parabéns! (Aprovado por: ${aprovador.tag})**`);

      await interaction.reply({
        content: "**Aprovação enviada.**",
        ephemeral: true
      });
    }

    if (interaction.customId.startsWith('reprovar_')) {
      const userId = interaction.customId.split('_')[1];

      const modal = new ModalBuilder()
        .setCustomId(`modal_reprovar_${userId}`)
        .setTitle('Motivo da Reprovação');

      const motivoInput = new TextInputBuilder()
        .setCustomId('motivo')
        .setLabel('Digite o motivo da reprovação')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(motivoInput));
      await interaction.showModal(modal);
    }
  }

};