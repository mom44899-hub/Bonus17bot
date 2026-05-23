const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

/* =========================
   الإعدادات
========================= */

const TOKEN = '8820397344:AAEd9GQBhJHTcwW7oak-KF3kHH70SRiUra8';
const ADMIN_ID = 6139009028;

const bot = new TelegramBot(TOKEN, {
  polling: true
});

/* =========================
   نظام حفظ المستخدمين
========================= */

const USERS_FILE = './users.json';

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

let users = new Set();

try {

  const data = fs.readFileSync(USERS_FILE, 'utf8');

  users = new Set(JSON.parse(data));

} catch (err) {

  console.log('users.json error');

  users = new Set();
}

function saveUsers() {

  try {

    fs.writeFileSync(
      USERS_FILE,
      JSON.stringify([...users], null, 2)
    );

  } catch (err) {

    console.log('Save Error:', err.message);
  }
}

function addUser(chatId) {

  chatId = Number(chatId);

  if (!users.has(chatId)) {

    users.add(chatId);

    saveUsers();

    console.log(`✅ مستخدم جديد: ${chatId}`);
  }
}

/* =========================
   إرسال رسالة جماعية
========================= */

async function broadcast(message) {

  let success = 0;
  let failed = 0;

  for (const userId of users) {

    try {

      await bot.sendMessage(
        userId,
        message,
        {
          parse_mode: 'Markdown'
        }
      );

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
  resize_keyboard: true,
  persistent: true
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

const offersMenu = {
  inline_keyboard: [
    [{ text: '📈 TNKS - بونص على إيداع 100%', callback_data: 'offer_tnks' }],
    [{ text: '📊 ITS Pros - بونص على الإيداع 100%', callback_data: 'offer_its' }],
    [{ text: '🔙 رجوع', callback_data: 'back_main' }]
  ]
};

const profitMenu = {
  inline_keyboard: [
    [{ text: '🦊 بوت FoxiGrow لربح USDT', callback_data: 'profit_foxi' }],
    [{ text: '🎡 تطبيق Beet لربح 28$', callback_data: 'profit_beet' }],
    [{ text: '💎 Gemgala - كل إحالة 1$', callback_data: 'profit_gemgala' }],
    [{ text: '🔙 رجوع', callback_data: 'back_main' }]
  ]
};

const fundingMenu = {
  inline_keyboard: [
    [{ text: '💼 WE MASTER TRADE - حساب تمويل 25$', callback_data: 'fund_wmt' }],
    [{ text: '🆓 Finotive - حساب تمويل مجاني 2500$', callback_data: 'fund_finotive' }],
    [{ text: '🔙 رجوع', callback_data: 'back_main' }]
  ]
};

/* =========================
   الرسائل
========================= */

bot.on('message', async (msg) => {

  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text) return;

  addUser(chatId);

  /* ===== START ===== */

  if (text === '/start') {

    const name = msg.from.first_name || 'صديقي';

    return bot.sendMessage(
      chatId,

`🎯 *مرحباً بك ${name}*

🔥 بوت *Bonus17* الرسمي

👥 عدد مستخدمين البوت: *${users.size}*

📌 الأقسام المتوفرة:
🎁 بونصات ترحيبية
💳 حسابات تمويل مجانية
💰 مواقع وبوتات ربح مضمونة

اختر من القائمة أدناه 👇`,

      {
        parse_mode: 'Markdown',
        reply_markup: mainMenu
      }
    );
  }

  /* ===== STATS ===== */

  if (text === '/stats') {

    if (chatId !== ADMIN_ID) {
      return bot.sendMessage(chatId, '⛔ غير مسموح');
    }

    return bot.sendMessage(
      chatId,

`📊 *إحصائيات البوت*

👥 عدد المستخدمين: *${users.size}*
🤖 حالة البوت: شغال ✅`,

      {
        parse_mode: 'Markdown'
      }
    );
  }

  /* ===== USERS ===== */

  if (text === '/users') {

    if (chatId !== ADMIN_ID) return;

    return bot.sendMessage(
      chatId,

`👥 *قائمة المستخدمين*

📦 العدد الكلي: *${users.size}*

${[...users].join('\n') || 'لا يوجد مستخدمين'}`,

      {
        parse_mode: 'Markdown'
      }
    );
  }

  /* ===== MY ID ===== */

  if (text === '/myid') {

    return bot.sendMessage(
      chatId,
      `🆔 ID: \`${chatId}\``,
      {
        parse_mode: 'Markdown'
      }
    );
  }

  /* ===== بث ===== */

  if (text.startsWith('/broadcast ')) {

    if (chatId !== ADMIN_ID) return;

    const customMsg = text.slice('/broadcast '.length);

    await bot.sendMessage(chatId, '⏳ جاري الإرسال...');

    const result = await broadcast(customMsg);

    return bot.sendMessage(
      chatId,

`✅ تم الإرسال

✔️ نجح: ${result.success}
❌ فشل: ${result.failed}`,

      {
        parse_mode: 'Markdown'
      }
    );
  }

  /* ===== بث البونص ===== */

  if (text === '/broadcast_bonus') {

    if (chatId !== ADMIN_ID) return;

    const result = await broadcast(
`🔔 *إشعار جديد*

🎁 تم إضافة بونص ترحيبي جديد داخل البوت`
    );

    return bot.sendMessage(
      chatId,
      `✅ تم الإرسال لـ ${result.success}`,
      {
        parse_mode: 'Markdown'
      }
    );
  }

  /* ===== تجاهل الأوامر ===== */

  if (text.startsWith('/')) return;

  /* ===== القوائم ===== */

  if (text === '🎁 بونص ترحيبي') {

    return bot.sendMessage(
      chatId,
      '🎁 *اختر الشركة:*',
      {
        parse_mode: 'Markdown',
        reply_markup: bonusMenu
      }
    );
  }

  if (text === '🔥 عروض') {

    return bot.sendMessage(
      chatId,
      '🔥 *اختر العرض:*',
      {
        parse_mode: 'Markdown',
        reply_markup: offersMenu
      }
    );
  }

  if (text === '💰 مواقع وبوتات الربح المضمون') {

    return bot.sendMessage(
      chatId,
      '💰 *اختر:*',
      {
        parse_mode: 'Markdown',
        reply_markup: profitMenu
      }
    );
  }

  if (text === '💳 حسابات تمويل مجانية') {

    return bot.sendMessage(
      chatId,
      '💳 *اختر الحساب:*',
      {
        parse_mode: 'Markdown',
        reply_markup: fundingMenu
      }
    );
  }
});

/* =========================
   الأزرار الداخلية
========================= */

bot.on('callback_query', (query) => {

  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  const edit = (text, keyboard) => {

    bot.editMessageText(text, {

      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: keyboard
      }

    }).catch(() => {});
  };

  const backBonus = [[
    { text: '🔙 رجوع', callback_data: 'back_bonus' }
  ]];

  const backOffers = [[
    { text: '🔙 رجوع', callback_data: 'back_offers' }
  ]];

  const backProfit = [[
    { text: '🔙 رجوع', callback_data: 'back_profit' }
  ]];

  const backFunding = [[
    { text: '🔙 رجوع', callback_data: 'back_funding' }
  ]];

  switch (data) {

    case 'bonus_exclusive':

      return edit(
`🆕 *Exclusive Markets - بونص ترحيبي 20$*

⭐ أهم الشروط:
• لازم تنضم إلى ديسكورد الشركة
• البونص بدون شروط
• البونص لمدة شهر

🔗 https://linktr.ee/exclusive_markets`,
        backBonus
      );

    case 'bonus_inzo':

      return edit(
`🏢 *شركة إنزو - بونص ترحيبي 30$*

• البونص بدون شروط
• أقل سحب 70$

🔗 https://my.inzo.co/trading?referral=3336354&lang=ar`,
        backBonus
      );

    case 'bonus_primex':

      return edit(
`🏦 *PRIME X - بونص ترحيبي 30$*

• لازم تحقق 10 لوت
• أقل سحب 100$

🔗 https://my.primexcapital.com/ar/links/go/507`,
        backBonus
      );

    case 'bonus_finotive50':

      return edit(
`🎁 *Finotive - بونص 50$*

🔗 https://promo.finotivemarkets.com`,
        backBonus
      );

    case 'offer_tnks':

      return edit(
`📈 *TNKS - بونص إيداع 100%*

🔗 https://my.tnfx.co/register?referrer_id=294829`,
        backOffers
      );

    case 'offer_its':

      return edit(
`📊 *ITS Pros - بونص إيداع 100%*

🔗 https://ITCPros.com`,
        backOffers
      );

    case 'profit_foxi':

      return edit(
`🦊 *FoxiGrow Bot*

• تنفيذ مهام مقابل USDT

🔗 https://t.me/FoxiGrowbot?start=ref_6139009028`,
        backProfit
      );

    case 'profit_beet':

      return edit(
`🎡 *تطبيق Beet*

🆔 رمز الإحالة:
\`590972593\`

🔗 https://os8.me/4f4Ct5`,
        backProfit
      );

    case 'profit_gemgala':

      return edit(
`💎 *Gemgala*

• كل إحالة = 1$

🔗 https://getblock.me/u/25458073`,
        backProfit
      );

    case 'fund_wmt':

      return edit(
`💼 *WE MASTER TRADE*

🔗 https://my.wemastertrade.com/register?ref=165977`,
        backFunding
      );

    case 'fund_finotive':

      return edit(
`🆓 *Finotive Funding*

🔗 https://finotivefunding.com/k6mENBY`,
        backFunding
      );

    case 'back_bonus':

      return edit(
        '🎁 *اختر الشركة:*',
        bonusMenu.inline_keyboard
      );

    case 'back_offers':

      return edit(
        '🔥 *اختر العرض:*',
        offersMenu.inline_keyboard
      );

    case 'back_profit':

      return edit(
        '💰 *اختر:*',
        profitMenu.inline_keyboard
      );

    case 'back_funding':

      return edit(
        '💳 *اختر الحساب:*',
        fundingMenu.inline_keyboard
      );

    case 'back_main':

      return bot.deleteMessage(chatId, msgId)
        .catch(() => {});
  }
});

/* =========================
   الأخطاء
========================= */

bot.on('polling_error', (err) => {
  console.log('Polling Error:', err.message);
});

bot.on('error', (err) => {
  console.log('Bot Error:', err.message);
});

console.log('✅ البوت شغال...');