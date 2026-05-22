const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const TOKEN = '8820397344:AAG9JiF-pj-BT_qbC3stisDgi2wTzFGUdZ4';
const ADMIN_ID = 6139009028;

const bot = new TelegramBot(TOKEN, { polling: true });

const USERS_FILE = 'users.json';

// تحميل المستخدمين المحفوظين
let users = new Set();

if (fs.existsSync(USERS_FILE)) {
  const data = JSON.parse(fs.readFileSync(USERS_FILE));
  users = new Set(data);
}

// حفظ المستخدمين
function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify([...users]));
}

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

const profitMenu = {
  inline_keyboard: [
    [{ text: '🦊 بوت FoxiGrow لربح USDT', callback_data: 'profit_foxi' }],
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

// تسجيل مستخدم جديد
function addUser(chatId) {
  if (!users.has(chatId)) {
    users.add(chatId);
    saveUsers();
  }
}

bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || 'صديقي';
  const chatId = msg.chat.id;

  addUser(chatId);

  bot.sendMessage(
    chatId,
    `👋 *أهلاً ${name}!*\n\nمرحباً بك في بوت *Bonus17* 🎯\n\nاختر من القائمة أدناه 👇`,
    { parse_mode: 'Markdown', ...mainMenu }
  );
});

bot.onText(/\/stats/, (msg) => {
  if (msg.chat.id === ADMIN_ID) {
    bot.sendMessage(
      msg.chat.id,
      `📊 *إحصائيات البوت*\n\n👥 عدد المستخدمين الكلي: *${users.size}*`,
      { parse_mode: 'Markdown' }
    );
  } else {
    bot.sendMessage(msg.chat.id, '⛔ غير مسموح');
  }
});

bot.onText(/\/myid/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🆔 ID: \`${msg.chat.id}\``,
    { parse_mode: 'Markdown' }
  );
});

bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text || text.startsWith('/')) return;

  addUser(chatId);

  if (text === '🎁 بونص ترحيبي') {
    bot.sendMessage(
      chatId,
      '🎁 *اختر الشركة:*',
      { parse_mode: 'Markdown', reply_markup: bonusMenu }
    );

  } else if (text === '🔥 عروض') {
    bot.sendMessage(
      chatId,
      '🔥 *اختر العرض:*',
      { parse_mode: 'Markdown', reply_markup: offersMenu }
    );

  } else if (text === '💰 مواقع وبوتات الربح المضمون') {
    bot.sendMessage(
      chatId,
      '💰 *اختر:*',
      { parse_mode: 'Markdown', reply_markup: profitMenu }
    );

  } else if (text === '💳 حسابات تمويل مجانية') {
    bot.sendMessage(
      chatId,
      '💳 *اختر الحساب:*',
      { parse_mode: 'Markdown', reply_markup: fundingMenu }
    );
  }
});

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
      reply_markup: { inline_keyboard: keyboard }
    });
  };

  if (data === 'bonus_inzo') {

    edit(
      `🏢 *شركة إنزو - بونص ترحيبي 30$*\n\n• البونص بدون شروط\n• الحد الأدنى للسحب 70$\n\n🔗 [سجل من هنا](https://my.inzo.co/trading?referral=3336354&lang=ar)`,
      [[{ text: '🔙 رجوع', callback_data: 'back_bonus' }]]
    );

  } else if (data === 'offer_tnks') {

    edit(
      `📈 *TNKS - بونص على إيداع 100%*\n\n• متوفر البونص إلى نهاية العيد\n• فقط لدولة العراق وسوريا\n\n🔗 [سجل من هنا](https://my.tnfx.co/register?referrer_id=294829&c=811366&utm_campaign=811366&ib_code=335002920)`,
      [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]]
    );

  } else if (data === 'offer_its') {

    edit(
      `📊 *ITS Pros - بونص على الإيداع 100%*\n\n• الدول المشمولة غير معروفة\n• شركة جديدة\n\n🔗 [سجل من هنا](https://ITCPros.com)`,
      [[{ text: '🔙 رجوع', callback_data: 'back_offers' }]]
    );

  } else if (data === 'profit_foxi') {

    edit(
      `🦊 *بوت FoxiGrow لربح USDT*\n\n• بوت إكمال مهام: متابعة، تعليق، إعجاب\n• على كل مهمة يعطيك USDT\n• مضمون السحب\n• الحد الأدنى للسحب: 2 USDT\n\n🔗 [انضم من هنا](https://t.me/FoxiGrowbot?start=ref_6139009028)`,
      [[{ text: '🔙 رجوع', callback_data: 'back_profit' }]]
    );

  } else if (data === 'fund_wmt') {

    edit(
      `💼 *WE MASTER TRADE - حساب تمويل 25$*\n\n━\n🏢 We Master Trade\n🗓 تأسست: 2021\n⭐ التقييم: 4.7/5 على TrustPilot\n━━━━━━━━━━━━━\n💼 *تفاصيل الحساب*\n• من 10K إلى 400K\n• تختار التراجع والهدف بنفسك\n• الرافعة: 1:100\n• بدون حد أدنى لأيام التداول\n• إمكانية تطوير الحساب حتى 1M\n━━━━━━━━━━━━━\n⛔ *شروط التراجع*\n• يومي: 2%\n• كلي: 4% ثابت\n━━━━━━━━━━━━━\n✅ تداول الأخبار مسموح\n✅ التبييت مسموح\n✅ الاكسبيرت مسموح\n✅ بدون قيود IP أو لوت\n━━━━━━━━━━━━━\n💰 *السحب والأرباح*\n• تسحب عند تحقيق: 6%\n🥇 أول سحب: 50%\n🥈 ثاني سحب: 75%\n🥉 بعدها: 90%\n\n🔗 [سجل من هنا](https://my.wemastertrade.com/register?ref=165977)`,
      [[{ text: '🔙 رجوع', callback_data: 'back_funding' }]]
    );

  } else if (data === 'fund_finotive') {

    edit(
      `🆓 *Finotive - حساب تمويل مجاني 2500$*\n\n• حساب تحدي ممول مجاني للجميع 🔥\n• أكمل استطلاع بسيط واحصل على الحساب\n• لا توجد شروط مرفقة\n• دخول مضمون لجائزة 20,000$\n\n🚀 *كيفية الحصول:*\n1️⃣ سجل من الرابط\n2️⃣ ابحث عن قسم استطلاع 2500$\n3️⃣ أكمل الاستطلاع\n4️⃣ احصل على حسابك\n\n🔗 [سجل من هنا](https://finotivefunding.com/k6mENBY)`,
      [[{ text: '🔙 رجوع', callback_data: 'back_funding' }]]
    );

  } else if (data === 'back_bonus') {

    edit(
      '🎁 *اختر الشركة:*',
      bonusMenu.inline_keyboard
    );

  } else if (data === 'back_offers') {

    edit(
      '🔥 *اختر العرض:*',
      offersMenu.inline_keyboard
    );

  } else if (data === 'back_profit') {

    edit(
      '💰 *اختر:*',
      profitMenu.inline_keyboard
    );

  } else if (data === 'back_funding') {

    edit(
      '💳 *اختر الحساب:*',
      fundingMenu.inline_keyboard
    );

  } else if (data === 'back_main') {

    bot.deleteMessage(chatId, msgId);
  }

  bot.answerCallbackQuery(query.id);
});

console.log('✅ البوت يشتغل...');