// startBot.js
const { exec } = require('child_process');

exec('pm2 start index.js --name cfc-bot', (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro ao iniciar o bot: ${err}`);
    return;
  }
  console.log(stdout);
  if (stderr) console.error(stderr);
});