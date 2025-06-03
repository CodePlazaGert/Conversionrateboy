const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = 'YOUR_BOT_TOKEN_HERE';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!convert')) {
    const args = message.content.trim().split(/\s+/);

    if (args.length !== 4) {
      return message.reply('Usage: !convert <amount> <from_currency> <to_currency>\nExample: !convert 100 USD EUR');
    }

    const amount = parseFloat(args[1]);
    const fromCurrency = args[2].toUpperCase();
    const toCurrency = args[3].toUpperCase();

    if (isNaN(amount) || amount <= 0) {
      return message.reply('Please provide a valid positive number for the amount.');
    }

    try {
      const response = await axios.get(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`);
      const rate = response.data.rates[toCurrency];

      if (!rate) {
        return message.reply(`Sorry, I don't recognize one of these currency codes: ${fromCurrency} or ${toCurrency}`);
      }

      const converted = (amount * rate).toFixed(2);

      message.reply(`💱 ${amount} ${fromCurrency} is approximately ${converted} ${toCurrency}.`);
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      message.reply('Sorry, I could not get the exchange rate at this time.');
    }
  }
});

client.login(TOKEN);
