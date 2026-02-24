const { spawn } = require('child_process');

// Caminho do seu bot principal
const BOT_PATH = './bot.js'; // troque se o seu arquivo principal tiver outro nome

function iniciarBot() {
  const bot = spawn('node', [BOT_PATH], {
    stdio: 'inherit',
    shell: true
  });

  bot.on('exit', (code) => {
    console.log(`Bot caiu com código ${code}. Reiniciando em 5s...`);
    setTimeout(iniciarBot, 5000); // reinicia após 5 segundos
  });

  bot.on('error', (err) => {
    console.log('Erro no processo do bot:', err);
    setTimeout(iniciarBot, 5000);
  });
}

// Captura erros globais do wrapper
process.on('unhandledRejection', err => {
  console.log('Erro não tratado no wrapper:', err);
});
process.on('uncaughtException', err => {
  console.log('Exceção não capturada no wrapper:', err);
});

// Inicia o bot
iniciarBot();