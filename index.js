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
   معالج الرسائل — مكان واحد فقط
   ✅ هذا يمنع التكرار
========================= */

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text) return;

  addUser(chatId);

  // ── /start ──
  if (text === '/start') {
    const name = msg.from.first_name || 'صديقي';
    return bot.sendMessage(
      chatId,
      `👋 *أهلاً ${name}!*\n\nمرحباً بك في بوت *Bonus17* 🎯\n\n👥 عدد مستخدمين البوت: *${users.size}*\n\naختر من القائمة أدناه 👇`,
      { parse_mode: 'Markdown', reply_markup: mainMenu }
    );
  }

  // ── /stats ──
  if (text === '/stats') {
    if (chatId !== ADMIN_ID) return bot.sendMessage(chatId, '⛔ غير مسموح');
    return bot.sendMessage(
      chatId,
      `📊 *إحصائيات البوت*\n\n👥 عدد المستخدمين الكلي: *${users.size}*`,
      { parse_mode: 'Markdown' }
    );
  }

  // ── /myid ──
  if (text === '/myid') {
    return bot.sendMessage(chatId, `🆔 ID: \`${chatId}\``, { parse_mode: 'Markdown' });
  }

  // ── /broadcast_bonus ──
  if (text === '/broadcast_bonus') {
    if (chatId !== ADMIN_ID) return;
    await bot.sendMessage(chatId, '⏳ جاري الإرسال...');
    const result = await broadcast(
      `🔔 *إشعار جديد من بوت Bonus17*\n\n🎁 تم إضافة *بونص ترحيبي جديد!*\n\nافتح البوت وتحقق من خانة 👉 *بونص ترحيبي*`
    );
    return bot.sendMessage(chatId, `✅ تم الإرسال!\n✔️ نجح: ${result.success}\n❌ فشل: ${result.failed}`, { parse_mode: 'Markdown' });
  }

  // ── /broadcast_funding ──
  if (text === '/broadcast_funding') {
    if (chatId !== ADMIN_ID) return;
    await bot.sendMessage(chatId, '⏳ جاري الإرسال...');
    const result = await broadcast(
      `🔔 *إشعار جديد من بوت Bonus17*\n\n💳 تم إضافة *حساب تمويل مجاني جديد!*\n\nافتح البوت وتحقق من خانة 👉 *حسابات تمويل مجانية*`
    );
    return bot.sendMessage(chatId, `✅ تم الإرسال!\n✔️ نجح: ${result.success}\n❌ فشل: ${result.failed}`, { parse_mode: 'Markdown' });
  }

  // ── /broadcast_profit ──
  if (text === '/broadcast_profit') {
    if (chatId !== ADMIN_ID) return;
    await bot.sendMessage(chatId, '⏳ جاري الإرسال...');
    const result = await broadcast(
      `🔔 *إشعار جديد من بوت Bonus17*\n\n💰 تم إضافة *موقع أو بوت ربح جديد!*\n\nافتح البوت وتحقق من خانة 👉 *مواقع وبوتات الربح المضمون*`
    );
    return bot.sendMessage(chatId, `✅ تم الإرسال!\n✔️ نجح: ${result.success}\n❌ فشل: ${result.failed}`, { parse_mode: 'Markdown' });
  }

  // ── /broadcast نص مخصص ──
  if (text.startsWith('/broadcast ')) {
    if (chatId !== ADMIN_ID) return;
    const customMsg = text.slice('/broadcast '.length);
    await bot.sendMessage(chatId, '⏳ جاري الإرسال...');
    const result = await broadcast(customMsg);
    return bot.sendMessage(chatId, `✅ تم الإرسال!\n✔️ نجح: ${result.success}\n❌ فشل: ${result.failed}`, { parse_mode: 'Markdown' });
  }

  // ── تجاهل باقي الأوامر ──
  if (text.startsWith('/')) return;

  // ── أزرار القائمة الرئيسية ──
  if (text === '🎁 بونص ترحيبي') {
    return bot.sendMessage(chatId, '🎁 *اختر الشركة:*', {
      parse_mode: 'Markdown',
      reply_markup: bonusMenu
    });
  }

  if (text === '🔥 عروض') {
    return bot.sendMessage(chatId, '🔥 *اختر العرض:*', {
      parse_mode: 'Markdown',
      reply_markup: offersMenu
    });
  }

  if (text === '💰 مواقع وبوتات الربح المضمون') {
    return bot.sendMessage(chatId, '💰 *اختر:*', {
      parse_mode: 'Markdown',
      reply_markup: profitMenu
    });
  }

  if (text === '💳 حسابات تمويل مجانية') {
    return bot.sendMessage(chatId, '💳 *اختر الحساب:*', {
      parse_mode: 'Markdown',
      reply_markup: fundingMenu
    });
  }
});

/* =========================
   الأزرار الداخلية (Inline)
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
      reply_markup: { inline_keyboard: keyboard }
    }).catch(() => {});
  };

  const backBonus   = [[{ text: '🔙 رجوع', callback_data: 'back_bonus' }]];
  const backOffers  = [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]];
  const backProfit  = [[{ text: '🔙 رجوع', callback_data: 'back_profit' }]];
  const backFunding = [[{ text: '🔙 رجوع', callback_data: 'back_funding' }]];

  switch (data) {

    case 'bonus_exclusive':
      return edit(
`🆕 *Exclusive Markets - بونص ترحيبي 20$*

⭐ أهم الشروط:
• لازم تنضم إلى ديسكورد الشركة
• البونص بدون شروط فقط بدون هيدج
• البونص لمدة شهر

🔗 [اضغط هنا للتسجيل](https://linktr.ee/exclusive_markets?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaAR-MnJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadTwsUeqGrx1c2ZuT6MXaimj-AjTlCjZmva9_7afgwWITT_v9F-rTvt6Bitpw_aem_PP-moscLXqoABIrEmPMD0g)`,
        backBonus
      );

    case 'bonus_inzo':
      return edit(
`🏢 *شركة إنزو - بونص ترحيبي 30$*

• البونص بدون شروط
• الحد الأدنى للسحب 70$

🔗 [اضغط هنا للتسجيل](https://my.inzo.co/trading?referral=3336354&lang=ar)`,
        backBonus
      );

    case 'bonus_primex':
      return edit(
`🏦 *شركة PRIME X - بونص ترحيبي 30$*

1️⃣ لازم تحقق 10 لوت
2️⃣ أقل سحب 100$

✅ عدهم IP قوي
🔥 البونص لفترة محدودة

🔗 [اضغط هنا للتسجيل](https://my.primexcapital.com/ar/links/go/507)`,
        backBonus
      );

    case 'bonus_finotive50':
      return edit(
`🎁 *تسجيل مسبق على بونص ترحيبي 50$ من شركة Finotive*

• المعلومات غير متوفرة حالياً
🔥 البونص لفترة محدودة

🔗 [اضغط هنا للتسجيل](https://promo.finotivemarkets.com)`,
        backBonus
      );

    case 'offer_tnks':
      return edit(
`📈 *TNKS - بونص على إيداع 100%*

• متوفر البونص إلى نهاية العيد
• فقط لدولة العراق وسوريا

🔗 [اضغط هنا للتسجيل](https://my.tnfx.co/register?referrer_id=294829&c=811366&utm_campaign=811366&ib_code=335002920)`,
        backOffers
      );

    case 'offer_its':
      return edit(
`📊 *ITS Pros - بونص على الإيداع 100%*

• شركة جديدة

🔗 [اضغط هنا للتسجيل](https://ITCPros.com)`,
        backOffers
      );

    case 'profit_foxi':
      return edit(
`🦊 *بوت FoxiGrow لربح USDT*

• تنفيذ مهام مقابل USDT
• السحب مضمون
• الحد الأدنى للسحب 2 USDT

🔗 [اضغط هنا للتسجيل](https://t.me/FoxiGrowbot?start=ref_6139009028)`,
        backProfit
      );

    case 'profit_beet':
      return edit(
`🎡 *تطبيق Beet لربح 28$*

• يعتمد على الإحالات
• تحتاج تفر العجلة 31 مرة لربح 28$
• كل إحالة تعطيك فرّة عجلة
• وإذا الشخص يدخل غرفة ويأخذ مايك 15 دقيقة هم تنطيك فرّة

✅ السحب مضمون

🆔 رمز الإحالة:
\`590972593\`

🔗 [اضغط هنا للتسجيل](https://os8.me/4f4Ct5)`,
        backProfit
      );

    case 'profit_gemgala':
      return edit(
`💎 *تطبيق Gemgala - كل إحالة 1$*

• الفكرة بسيطة
• كل إحالة تنطيك 1$
• لازم الشخص يسوي تحقق وجه حتى تتحسب الإحالة

🔗 [اضغط هنا للتسجيل](https://getblock.me/u/25458073)`,
        backProfit
      );

    case 'fund_wmt':
      return edit(
`💼 *WE MASTER TRADE - حساب تمويل 25$*

• من 10K إلى 400K
• تداول الأخبار مسموح
• التبييت مسموح
• الاكسبيرت مسموح

🔗 [اضغط هنا للتسجيل](https://my.wemastertrade.com/register?ref=165977)`,
        backFunding
      );

    case 'fund_finotive':
      return edit(
`🆓 *Finotive - حساب تمويل مجاني 2500$*

• حساب مجاني للجميع
• أكمل الاستطلاع واستلم الحساب

🔗 [اضغط هنا للتسجيل](https://finotivefunding.com/k6mENBY)`,
        backFunding
      );

    case 'back_bonus':
      return edit('🎁 *اختر الشركة:*', bonusMenu.inline_keyboard);

    case 'back_offers':
      return edit('🔥 *اختر العرض:*', offersMenu.inline_keyboard);

    case 'back_profit':
      return edit('💰 *اختر:*', profitMenu.inline_keyboard);

    case 'back_funding':
      return edit('💳 *اختر الحساب:*', fundingMenu.inline_keyboard);

    case 'back_main':
      return bot.deleteMessage(chatId, msgId).catch(() => {});
  }
});

bot.on('polling_error', (err) => {
  console.error('polling error:', err.message);
});

bot.on('error', (err) => {
  console.error('bot error:', err.message);
});

console.log('✅ البوت يشتغل...');
