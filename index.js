const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const TOKEN = '8820397344:AAEd9GQBhJHTcwW7oak-KF3kHH70SRiUra8';
const ADMIN_ID = 6139009028;

const bot = new TelegramBot(TOKEN, { polling: true });

/* =========================
   نظام حفظ المستخدمين دائم
========================= */

if (!fs.existsSync('users.json')) {
  fs.writeFileSync('users.json', '[]');
}

let users = new Set(
  JSON.parse(fs.readFileSync('users.json'))
);

function addUser(chatId) {
  if (!users.has(chatId)) {
    users.add(chatId);

    fs.writeFileSync(
      'users.json',
      JSON.stringify([...users], null, 2)
    );
  }
}

/* =========================
   القوائم
========================= */

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
   /start
========================= */

bot.onText(/\/start/, (msg) => {

  const name = msg.from.first_name || 'صديقي';
  const chatId = msg.chat.id;

  addUser(chatId);

  bot.sendMessage(
    chatId,
    `👋 *أهلاً ${name}!*

مرحباً بك في بوت *Bonus17* 🎯

👥 عدد مستخدمين البوت: *${users.size}*

اختر من القائمة أدناه 👇`,
    {
      parse_mode: 'Markdown',
      ...mainMenu
    }
  );
});

/* =========================
   إحصائيات البوت
========================= */

bot.onText(/\/stats/, (msg) => {

  if (msg.chat.id !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, '⛔ غير مسموح');
  }

  bot.sendMessage(
    msg.chat.id,
    `📊 *إحصائيات البوت*

👥 عدد المستخدمين الكلي: *${users.size}*`,
    { parse_mode: 'Markdown' }
  );
});

/* =========================
   معرفة ID
========================= */

bot.onText(/\/myid/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    `🆔 ID: \`${msg.chat.id}\``,
    { parse_mode: 'Markdown' }
  );
});

/* =========================
   الأزرار الرئيسية
========================= */

bot.on('message', (msg) => {

  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text || text.startsWith('/')) return;

  addUser(chatId);

  if (text === '🎁 بونص ترحيبي') {

    bot.sendMessage(
      chatId,
      '🎁 *اختر الشركة:*',
      {
        parse_mode: 'Markdown',
        reply_markup: bonusMenu
      }
    );

  } else if (text === '🔥 عروض') {

    bot.sendMessage(
      chatId,
      '🔥 *اختر العرض:*',
      {
        parse_mode: 'Markdown',
        reply_markup: offersMenu
      }
    );

  } else if (text === '💰 مواقع وبوتات الربح المضمون') {

    bot.sendMessage(
      chatId,
      '💰 *اختر:*',
      {
        parse_mode: 'Markdown',
        reply_markup: profitMenu
      }
    );

  } else if (text === '💳 حسابات تمويل مجانية') {

    bot.sendMessage(
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

  const edit = (text, keyboard) => {

    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  };

  if (data === 'bonus_inzo') {

    edit(
`🏢 *شركة إنزو - بونص ترحيبي 30$*

• البونص بدون شروط
• الحد الأدنى للسحب 70$

🔗 [سجل من هنا](https://my.inzo.co/trading?referral=3336354&lang=ar)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_bonus' }]]
    );

  }

  else if (data === 'bonus_primex') {

    edit(
`🏦 *شركة PRIME X - بونص ترحيبي 30$*

1️⃣ لازم تحقق 10 لوت
2️⃣ أقل سحب 100$

✅ عدهم IP قوي
🔥 البونص لفترة محدودة

🔗 [سجل من هنا](https://my.primexcapital.com/ar/links/go/507)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_bonus' }]]
    );

  }

  else if (data === 'bonus_finotive50') {

    edit(
`🎁 *تسجيل مسبق على بونص ترحيبي 50$ من شركة Finotive*

• المعلومات غير متوفرة حالياً
🔥 البونص لفترة محدودة

🔗 [سجل من هنا](https://promo.finotivemarkets.com)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_bonus' }]]
    );

  }

  else if (data === 'offer_tnks') {

    edit(
`📈 *TNKS - بونص على إيداع 100%*

• متوفر البونص إلى نهاية العيد
• فقط لدولة العراق وسوريا

🔗 [سجل من هنا](https://my.tnfx.co/register?referrer_id=294829&c=811366&utm_campaign=811366&ib_code=335002920)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]]
    );

  }

  else if (data === 'offer_its') {

    edit(
`📊 *ITS Pros - بونص على الإيداع 100%*

• شركة جديدة

🔗 [سجل من هنا](https://ITCPros.com)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]]
    );

  }

  else if (data === 'profit_foxi') {

    edit(
`🦊 *بوت FoxiGrow لربح USDT*

• تنفيذ مهام مقابل USDT
• السحب مضمون
• الحد الأدنى للسحب 2 USDT

🔗 [انضم من هنا](https://t.me/FoxiGrowbot?start=ref_6139009028)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_profit' }]]
    );

  }

  else if (data === 'profit_beet') {

    edit(
`🎡 *تطبيق Beet لربح 28$*

• يعتمد على الإحالات
• تحتاج تفر العجلة 31 مرة لربح 28$
• كل إحالة تعطيك فرّة عجلة
• وإذا الشخص يدخل غرفة ويأخذ مايك 15 دقيقة هم تنطيك فرّة

✅ السحب مضمون

🆔 رمز الإحالة:
\`590972593\`

🔗 [سجل من هنا](https://os8.me/4f4Ct5)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_profit' }]]
    );

  }

  else if (data === 'profit_gemgala') {

    edit(
`💎 *تطبيق Gemgala - كل إحالة 1$*

• الفكرة بسيطة
• كل إحالة تنطيك 1$
• لازم الشخص يسوي تحقق وجه حتى تتحسب الإحالة

🔗 [سجل من هنا](https://getblock.me/u/25458073)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_profit' }]]
    );

  }

  else if (data === 'fund_wmt') {

    edit(
`💼 *WE MASTER TRADE - حساب تمويل 25$*

• من 10K إلى 400K
• تداول الأخبار مسموح
• التبييت مسموح
• الاكسبيرت مسموح

🔗 [سجل من هنا](https://my.wemastertrade.com/register?ref=165977)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_funding' }]]
    );

  }

  else if (data === 'fund_finotive') {

    edit(
`🆓 *Finotive - حساب تمويل مجاني 2500$*

• حساب مجاني للجميع
• أكمل الاستطلاع واستلم الحساب

🔗 [سجل من هنا](https://finotivefunding.com/k6mENBY)`,

      [[{ text: '🔙 رجوع', callback_data: 'back_funding' }]]
    );

  }

  else if (data === 'back_bonus') {

    edit(
      '🎁 *اختر الشركة:*',
      bonusMenu.inline_keyboard
    );

  }

  else if (data === 'back_offers') {

    edit(
      '🔥 *اختر العرض:*',
      offersMenu.inline_keyboard
    );

  }

  else if (data === 'back_profit') {

    edit(
      '💰 *اختر:*',
      profitMenu.inline_keyboard
    );

  }

  else if (data === 'back_funding') {

    edit(
      '💳 *اختر الحساب:*',
      fundingMenu.inline_keyboard
    );

  }

  else if (data === 'back_main') {

    bot.deleteMessage(chatId, msgId);
  }

  bot.answerCallbackQuery(query.id);
});

console.log('✅ البوت يشتغل...');