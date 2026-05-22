const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8820397344:AAG9JiF-pj-BT_qbC3stisDgi2wTzFGUdZ4';
const ADMIN_ID = null; // حط ID تيليغرام الخاص فيك هنا

const bot = new TelegramBot(TOKEN, { polling: true });

// محتوى الأقسام - عدّلها متى تبي
const content = {
  bonus: `🎁 *بونص ترحيبي*\n\n_قريباً..._`,
  accounts: `💳 *حسابات تمويل مجانية*\n\n_قريباً..._`,
  offers: `🔥 *عروض*\n\n_قريباً..._`,
  profit: `💰 *مواقع وبوتات الربح المضمون*\n\n_قريباً..._`
};

const mainMenu = {
  reply_markup: {
    keyboard: [
      ['🎁 بونص ترحيبي', '💳 حسابات تمويل مجانية'],
      ['🔥 عروض', '💰 مواقع وبوتات الربح المضمون']
    ],
    resize_keyboard: true,
    persistent: true
  }
};

bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || 'صديقي';
  bot.sendMessage(
    msg.chat.id,
    `👋 *أهلاً ${name}!*\n\nمرحباً بك في بوت *Bonus17* 🎯\n\nاختر من القائمة أدناه 👇`,
    { parse_mode: 'Markdown', ...mainMenu }
  );
});

bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === '🎁 بونص ترحيبي') {
    bot.sendMessage(chatId, content.bonus, { parse_mode: 'Markdown' });
  } else if (text === '💳 حسابات تمويل مجانية') {
    bot.sendMessage(chatId, content.accounts, { parse_mode: 'Markdown' });
  } else if (text === '🔥 عروض') {
    bot.sendMessage(chatId, content.offers, { parse_mode: 'Markdown' });
  } else if (text === '💰 مواقع وبوتات الربح المضمون') {
    bot.sendMessage(chatId, content.profit, { parse_mode: 'Markdown' });
  }
});

console.log('✅ البوت يشتغل...');
