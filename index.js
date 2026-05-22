const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8820397344:AAG9JiF-pj-BT_qbC3stisDgi2wTzFGUdZ4';
const bot = new TelegramBot(TOKEN, { polling: true });

const mainMenu = {
  reply_markup: {
    keyboard: [
      ['🎁 بونص ترحيبي'],
      ['💳 حسابات تمويل مجانية'],
      ['🔥 عروض'],
      ['💰 مواقع وبوتات الربح المضمون']
    ],
    resize_keyboard: true
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'أهلاً بك! اختر من القائمة:', mainMenu);
});

bot.on('message', (msg) => {
  const text = msg.text;

  if (text === '🎁 بونص ترحيبي') {
    bot.sendMessage(msg.chat.id, 'قريباً...');
  } else if (text === '💳 حسابات تمويل مجانية') {
    bot.sendMessage(msg.chat.id, 'قريباً...');
  } else if (text === '🔥 عروض') {
    bot.sendMessage(msg.chat.id, 'قريباً...');
  } else if (text === '💰 مواقع وبوتات الربح المضمون') {
    bot.sendMessage(msg.chat.id, 'قريباً...');
  }
});

