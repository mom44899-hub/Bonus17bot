const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8820397344:AAG9JiF-pj-BT_qbC3stisDgi2wTzFGUdZ4';
const ADMIN_ID = 6139009028;

const bot = new TelegramBot(TOKEN, { polling: true });

const users = new Set();

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
  inline_keyboard: [
    [{ text: '🏢 شركة إنزو - بونص ترحيبي 30$', callback_data: 'bonus_inzo' }],
    [{ text: '🔙 رجوع', callback_data: 'back_main' }]
  ]
};

const offersMenu = {
  inline_keyboard: [
    [{ text: '📈 TNKS - بونص على إيداع 100%', callback_data: 'offer_tnks' }],
    [{ text: '📊 ITS Pros - بونص على الإيداع 100%', callback_data: 'offer_its' }],
    [{ text: '🔙 رجوع', callback_data: 'back_main' }]
  ]
};

bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || 'صديقي';
  const chatId = msg.chat.id;
  users.add(chatId);
  bot.sendMessage(
    chatId,
    `👋 *أهلاً ${name}!*\n\nمرحباً بك في بوت *Bonus17* 🎯\n\nاختر من القائمة أدناه 👇`,
    { parse_mode: 'Markdown', ...mainMenu }
  );
});

bot.onText(/\/stats/, (msg) => {
  if (msg.chat.id === ADMIN_ID) {
    bot.sendMessage(msg.chat.id,
      `📊 *إحصائيات البوت*\n\n👥 عدد المستخدمين: ${users.size}`,
      { parse_mode: 'Markdown' }
    );
  }
});

bot.onText(/\/myid/, (msg) => {
  bot.sendMessage(msg.chat.id, `🆔 ID الخاص فيك: \`${msg.chat.id}\``, { parse_mode: 'Markdown' });
});

bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  users.add(chatId);

  if (text === '🎁 بونص ترحيبي') {
    bot.sendMessage(chatId, '🎁 *اختر الشركة:*', {
      parse_mode: 'Markdown',
      reply_markup: bonusMenu
    });
  } else if (text === '🔥 عروض') {
    bot.sendMessage(chatId, '🔥 *اختر العرض:*', {
      parse_mode: 'Markdown',
      reply_markup: offersMenu
    });
  } else if (text === '💳 حسابات تمويل مجانية') {
    bot.sendMessage(chatId, '💳 *حسابات تمويل مجانية*\n\n_قريباً..._', { parse_mode: 'Markdown' });
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
        reply_markup: { inline_keyboard: [[{ text: '🔙 رجوع', callback_data: 'back_bonus' }]] }
      }
    );
  } else if (data === 'offer_tnks') {
    bot.editMessageText(
      `📈 *TNKS - بونص على إيداع 100%*\n\n• متوفر البونص إلى نهاية العيد\n• فقط لدولة العراق وسوريا\n\n🔗 [سجل من هنا](https://my.tnfx.co/register?referrer_id=294829&c=811366&utm_campaign=811366&ib_code=335002920)`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]] }
      }
    );
  } else if (data === 'offer_its') {
    bot.editMessageText(
      `📊 *ITS Pros - بونص على الإيداع 100%*\n\n• الدول المشمولة غير معروفة\n• شركة جديدة\n\n🔗 [سجل من هنا](https://ITCPros.com)`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]] }
      }
    );
  } else if (data === 'back_bonus') {
    bot.editMessageText('🎁 *اختر الشركة:*', {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      reply_markup: bonusMenu
    });
  } else if (data === 'back_offers') {
    bot.editMessageText('🔥 *اختر العرض:*', {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      reply_markup: offersMenu
    });
  } else if (data === 'back_main') {
    bot.deleteMessage(chatId, msgId);
  }

  bot.answerCallbackQuery(query.id);
});

console.log('✅ البوت يشتغل...');
