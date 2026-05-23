const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const TOKEN = process.env.TOKEN || '8820397344:AAE7b6xGaNA47gNRlU12CP3mtgtp4anX3Cw';
const ADMIN_ID = 6139009028;

/* =========================
   تشغيل نظيف + منع 409
========================= */

const bot = new TelegramBot(TOKEN, { polling: false });

async function startBot() {
  try {
    await bot.deleteWebHook();   // تنظيف webhook القديم
    await bot.stopPolling();     // إيقاف أي جلسة قديمة

    console.log('Cleaning old sessions...');

    bot.startPolling();          // تشغيل البوت بشكل نظيف
    console.log('✅ BOT STARTED');
  } catch (e) {
    console.log('Init error:', e.message);
  }
}

startBot();

/* =========================
   نظام حفظ المستخدمين دائم
========================= */

if (!fs.existsSync('users.json')) {
  fs.writeFileSync('users.json', '[]');
}

let users = new Set(
  JSON.parse(fs.readFileSync('users.json')).map(Number)
);

function addUser(chatId) {
  if (!users.has(Number(chatId))) {
    users.add(Number(chatId));
    fs.writeFileSync(
      'users.json',
      JSON.stringify([...users], null, 2)
    );
  }
}

/* =========================
   إرسال رسالة لكل المستخدمين
========================= */

async function broadcast(message) {
  let success = 0;
  let failed = 0;

  for (const userId of users) {
    try {
      await bot.sendMessage(userId, message, { parse_mode: 'Markdown' });
      success++;
      await new Promise(r => setTimeout(r, 50));
    } catch (e) {
      failed++;
    }
  }

  return { success, failed };
}

/* =========================
   القوائم
========================= */

const mainMenu = {
  keyboard: [
    ['🎁 بونص ترحيبي', '💳 حسابات تمويل مجانية'],
    ['🔥 عروض', '💰 مواقع وبوتات الربح المضمون']
  ],
  resize_keyboard: true
};

const bonusMenu = {
  inline_keyboard: [
    [{ text: '🆕 Exclusive Markets - بونص ترحيبي 20$', callback_data: 'bonus_exclusive' }],
    [{ text: '🏢 شركة إنزو - بونص ترحيبي 30$', callback_data: 'bonus_inzo' }],
    [{ text: '🏦 PRIME X - بونص ترحيبي 30$', callback_data: 'bonus_primex' }],
    [{ text: '🎁 Finotive - بونص ترحيبي 50$', callback_data: 'bonus_finotive50' }],
    [{ text: '🔙 رجوع', callback_data: 'back_main' }]
  ]
};

/* باقي القوائم مثل ما هي بدون تغيير */
const offersMenu = { inline_keyboard: [[{ text: '📈 TNKS', callback_data: 'offer_tnks' }],[{ text: '📊 ITS Pros', callback_data: 'offer_its' }],[{ text: '🔙 رجوع', callback_data: 'back_main' }]] };

const profitMenu = { inline_keyboard: [[{ text: '🦊 FoxiGrow', callback_data: 'profit_foxi' }],[{ text: '🎡 Beet', callback_data: 'profit_beet' }],[{ text: '💎 Gemgala', callback_data: 'profit_gemgala' }],[{ text: '🔙 رجوع', callback_data: 'back_main' }]] };

const fundingMenu = { inline_keyboard: [[{ text: '💼 WMT', callback_data: 'fund_wmt' }],[{ text: '🆓 Finotive', callback_data: 'fund_finotive' }],[{ text: '🔙 رجوع', callback_data: 'back_main' }]] };

/* =========================
   الرسائل
========================= */

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text) return;

  addUser(chatId);

  if (text === '/start') {
    const name = msg.from.first_name || 'صديقي';
    return bot.sendMessage(chatId,
      `👋 أهلاً ${name}\n👥 المستخدمين: ${users.size}`,
      { reply_markup: mainMenu }
    );
  }
});

/* =========================
   callback
========================= */

bot.on('callback_query', (query) => {
  bot.answerCallbackQuery(query.id);
});

/* =========================
   errors
========================= */

bot.on('polling_error', (err) => {
  console.log('polling error:', err.message);
});

console.log('BOT FILE READY...');