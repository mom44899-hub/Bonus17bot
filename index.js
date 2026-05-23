const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

/* =========================
   معلومات البوت
========================= */

const TOKEN = '8820397344:AAEd9GQBhJHTcwW7oak-KF3kHH70SRiUra8';
const ADMIN_ID = 6139009028;

const bot = new TelegramBot(TOKEN, {
  polling: true
});

/* =========================
   حفظ المستخدمين
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
   البث
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

  return {
    success,
    failed
  };
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

    [{
      text: '🏢 شركة إنزو - بونص 30$',
      callback_data: 'bonus_inzo'
    }],

    [{
      text: '🏦 PRIME X - بونص 30$',
      callback_data: 'bonus_primex'
    }],

    [{
      text: '🎁 Finotive - بونص 50$',
      callback_data: 'bonus_finotive50'
    }],

    [{
      text: '🔙 رجوع',
      callback_data: 'back_main'
    }]
  ]
};

const offersMenu = {
  inline_keyboard: [

    [{
      text: '📈 TNKS - بونص إيداع 100%',
      callback_data: 'offer_tnks'
    }],

    [{
      text: '📊 ITS Pros - بونص إيداع 100%',
      callback_data: 'offer_its'
    }],

    [{
      text: '🔙 رجوع',
      callback_data: 'back_main'
    }]
  ]
};

const profitMenu = {
  inline_keyboard: [

    [{
      text: '🦊 FoxiGrow',
      callback_data: 'profit_foxi'
    }],

    [{
      text: '🎡 Beet',
      callback_data: 'profit_beet'
    }],

    [{
      text: '💎 Gemgala',
      callback_data: 'profit_gemgala'
    }],

    [{
      text: '🔙 رجوع',
      callback_data: 'back_main'
    }]
  ]
};

const fundingMenu = {
  inline_keyboard: [

    [{
      text: '💼 WE MASTER TRADE',
      callback_data: 'fund_wmt'
    }],

    [{
      text: '🆓 Finotive Funding',
      callback_data: 'fund_finotive'
    }],

    [{
      text: '🔙 رجوع',
      callback_data: 'back_main'
    }]
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

🔥 بوت *Bonus17*

👥 *عدد مستخدمين البوت:* ${users.size}

📌 الأقسام:
🎁 بونصات ترحيبية
💳 حسابات تمويل مجانية
💰 مواقع ربح مضمونة

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

      return bot.sendMessage(
        chatId,
        '⛔ غير مسموح'
      );
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

  /* ===== BROADCAST ===== */

  if (text.startsWith('/broadcast ')) {

    if (chatId !== ADMIN_ID) return;

    const customMsg = text.slice('/broadcast '.length);

    await bot.sendMessage(
      chatId,
      '⏳ جاري الإرسال...'
    );

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

  /* ===== تجاهل باقي الأوامر ===== */

  if (text.startsWith('/')) return;

  /* ===== القائمة الرئيسية ===== */

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

    bot.editMessageText(

      text,

      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,

        reply_markup: {
          inline_keyboard: keyboard
        }
      }

    ).catch(() => {});
  };

  const backBonus = [
    [{
      text: '🔙 رجوع',
      callback_data: 'back_bonus'
    }]
  ];

  switch (data) {

    case 'bonus_inzo':

      return edit(

`🏢 *شركة إنزو - بونص ترحيبي 30$*

• البونص بدون شروط
• الحد الأدنى للسحب 70$

🔗 https://my.inzo.co/trading?referral=3336354&lang=ar`,

        backBonus
      );

    case 'bonus_primex':

      return edit(

`🏦 *شركة PRIME X - بونص 30$*

• تحقق 10 لوت
• أقل سحب 100$

🔗 https://my.primexcapital.com/ar/links/go/507`,

        backBonus
      );

    case 'bonus_finotive50':

      return edit(

`🎁 *Finotive - بونص 50$*

🔥 لفترة محدودة

🔗 https://promo.finotivemarkets.com`,

        backBonus
      );

    case 'offer_tnks':

      return edit(

`📈 *TNKS - بونص إيداع 100%*

🔗 https://my.tnfx.co/register?referrer_id=294829&c=811366&utm_campaign=811366&ib_code=335002920`,

        backBonus
      );

    case 'offer_its':

      return edit(

`📊 *ITS Pros - بونص إيداع 100%*

🔗 https://ITCPros.com`,

        backBonus
      );

    case 'profit_foxi':

      return edit(

`🦊 *FoxiGrow*

💰 ربح USDT من المهام

🔗 https://t.me/FoxiGrowbot?start=ref_6139009028`,

        backBonus
      );

    case 'profit_beet':

      return edit(

`🎡 *Beet*

🆔 كود الإحالة:
\`590972593\`

🔗 https://os8.me/4f4Ct5`,

        backBonus
      );

    case 'profit_gemgala':

      return edit(

`💎 *Gemgala*

💰 كل إحالة = 1$

🔗 https://getblock.me/u/25458073`,

        backBonus
      );

    case 'fund_wmt':

      return edit(

`💼 *WE MASTER TRADE*

🔗 https://my.wemastertrade.com/register?ref=165977`,

        backBonus
      );

    case 'fund_finotive':

      return edit(

`🆓 *Finotive Funding*

🔗 https://finotivefunding.com/k6mENBY`,

        backBonus
      );

    case 'back_bonus':

      return edit(
        '🎁 *اختر الشركة:*',
        bonusMenu.inline_keyboard
      );

    case 'back_main':

      return bot.deleteMessage(
        chatId,
        msgId
      ).catch(() => {});
  }
});

/* =========================
   الأخطاء
========================= */

bot.on('polling_error', (err) => {
  console.log(err.message);
});

bot.on('error', (err) => {
  console.log(err.message);
});

console.log('✅ البوت شغال...');