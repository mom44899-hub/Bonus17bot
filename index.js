const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8820397344:AAG9JiF-pj-BT_qbC3stisDgi2wTzFGUdZ4';
const bot = new TelegramBot(TOKEN, { polling: true });

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

const bonusMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🏢 شركة إنزو - بونص ترحيبي 30$', callback_data: 'bonus_inzo' }],
      [{ text: '🔙 رجوع', callback_data: 'back_main' }]
    ]
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
    bot.sendMessage(chatId, '🎁 *اختر الشركة:*', {
      parse_mode: 'Markdown',
      ...bonusMenu
    });
  } else if (text === '💳 حسابات تمويل مجانية') {
    bot.sendMessage(chatId, '💳 *حسابات تمويل مجانية*\n\n_قريباً..._', { parse_mode: 'Markdown' });
  } else if (text === '🔥 عروض') {
    bot.sendMessage(chatId, '🔥 *عروض*\n\n_قريبا..._', { parse_mode: 'Markdown' });
  } else if (text === '💰 مواقع وبوتات الربح المضمون') {
    bot.sendMessage(chatId, '💰 *مواقع وبوتات الربح المضمون*\n\n_قريباً..._', { parse_mode: 'Markdown' });
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  if (data === 'bonus_inzo') {
    bot.editMessageText(
      `🏢 *شركة إنزو - بونص ترحيبي 30$*\n\n• البونص بدون شروط\n• الحد الأدنى للسحب 70$\n\n🔗 [سجل من هنا](https://my.inzo.co/trading?referral=3336354&lang=ar)`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 رجوع', callback_data: 'back_bonus' }]
          ]
        }
      }
    );
  } else if (data === 'back_bonus') {
    bot.editMessageText('🎁 *اختر الشركة:*', {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      reply_markup: bonusMenu.reply_markup
    });
  } else if (data === 'back_main') {
    bot.deleteMessage(chatId, msgId);
  }

  bot.answerCallbackQuery(query.id);
});

console.log('✅ البوت يشتغل...');
