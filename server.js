require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);

// ВРЕМЕННО ЗАШИЛИ ТОКЕН И ID ПРЯМО В КОД
const BOT_TOKEN = '9043962624:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw'; 
const CHAT_ID = '1198178866'; 

const MIN_PROMO_AMOUNT = 1000;
const JWT_SECRET = 'gyros-super-secret-key-2026';

const ADMIN_PHONE = process.env.ADMIN_PHONE || '+79200165232';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'arsenadmin';
const ADMIN_IP = process.env.ADMIN_IP || '127.0.0.1';

const PROMO_FILE = path.join(__dirname, 'promo.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const PRICES_FILE = path.join(__dirname, 'prices.json');

function cleanPhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('8')) cleaned = '7' + cleaned.slice(1);
  if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
  return cleaned;
}

function getClientIp(req) {
  let ip = req.ip || req.connection.remoteAddress || '';
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  return ip;
}

function isIpAllowed(req) {
  const clientIp = getClientIp(req);
  if (ADMIN_IP === '127.0.0.1' && (clientIp === '127.0.0.1' || clientIp === '::1')) {
    return true;
  }
  return clientIp === ADMIN_IP;
}

function readDB(file) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) { console.error(`Ошибка чтения ${file}:`, e); }
  return null;
}

function writeDB(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) { console.error(`Ошибка записи ${file}:`, e); }
}

const defaultPrices = {
  "Шаурма Классическая": 260, "Шаурма Сырная": 280, "Шаурма В булочке": 260, "Хот-дог": 220,
  "Шаурма Классическая XL": 280, "Шаурма Сырная XL": 300,
  "Frustyle Лайм-лимон": 80, "Вода AQUA MINERALE (с лаймом)": 80, "Вода AQUA MINERALE (с лимоном)": 80, "Вода AQUA MINERALE (без газа)": 80, "Вода AQUA MINERALE (газ)": 80,
  "Lipton Холодный чай Лимонад": 100, "Lipton Холодный чай Зеленый": 100, "Lipton Холодный чай Персик": 100, "Drive Me Original": 100, "Adrenaline Rush": 150,
  "Drive Me Zero Sugar": 100, "Drive Me Cactus Vibe": 100, "Drive Me Гуава-Манго (Zero)": 100, "Adrenaline Rush Тропический": 150,
  "Drive Me Berry Kick": 100, "Adrenaline Rush Zero Sugar": 150, "Frustyle Лимонад": 100, "Evervess Кола": 80, "Frustyle Апельсин": 80, "Frustyle Апельсин (ж/б)": 80, "Evervess Кола (стекло)": 100
};

let currentPrices = readDB(PRICES_FILE) || {};
let pricesChanged = false;
for (const [key, val] of Object.entries(defaultPrices)) {
  if (currentPrices[key] === undefined) {
    currentPrices[key] = val;
    pricesChanged = true;
  }
}
if (pricesChanged || Object.keys(currentPrices).length === 0) {
  writeDB(PRICES_FILE, currentPrices);
}

let users = readDB(USERS_FILE) || [];
const cleanAdminPhone = cleanPhone(ADMIN_PHONE);
if (cleanAdminPhone && ADMIN_PASSWORD && !users.find(u => cleanPhone(u.phone) === cleanAdminPhone)) {
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  users.push({ phone: cleanAdminPhone, password: hash, role: 'admin', name: 'Администратор' });
  writeDB(USERS_FILE, users);
}

const ADDON_PRICES = {
  "Больше овощей": 20, "Больше мяса": 30, "Томатный соус": 15, "Сырный соус": 15, "Фирменный соус": 20, "Больше остроты": 20
};

app.get('/api/check-ip', (req, res) => {
  res.json({ allowed: isIpAllowed(req) });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, error: 'Требуется авторизация' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ ok: false, error: 'Неверный токен' });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ ok: false, error: 'Доступ запрещен' });
  next();
}

app.post('/api/auth/register', async (req, res) => {
  if (!isIpAllowed(req)) {
    return res.status(403).json({ ok: false, error: 'Регистрация доступна только с определенного компьютера' });
  }

  const { name, phone, password } = req.body;
  const cleanReqPhone = cleanPhone(phone);

  if (!name || !cleanReqPhone || !password) {
    return res.status(400).json({ ok: false, error: 'Заполните все поля' });
  }

  let currentUsers = readDB(USERS_FILE) || [];
  if (currentUsers.find(u => cleanPhone(u.phone) === cleanReqPhone)) {
    return res.status(400).json({ ok: false, error: 'Номер уже зарегистрирован' });
  }

  const hash = await bcrypt.hash(password, 10);
  currentUsers.push({ name, phone: cleanReqPhone, password: hash, role: 'user' });
  writeDB(USERS_FILE, currentUsers);

  res.json({ ok: true });
});

app.post('/api/auth/login', async (req, res) => {
  if (!isIpAllowed(req)) {
    return res.status(403).json({ ok: false, error: 'Вход доступен только с определенного компьютера' });
  }

  const { phone, password } = req.body;
  const cleanReqPhone = cleanPhone(phone);

  let currentUsers = readDB(USERS_FILE) || [];
  const user = currentUsers.find(u => cleanPhone(u.phone) === cleanReqPhone);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ ok: false, error: 'Неверный номер или пароль' });
  }

  const token = jwt.sign({ phone: user.phone, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ ok: true, token, role: user.role, name: user.name, phone: user.phone });
});

app.get('/api/prices', (req, res) => {
  res.json({ ok: true, prices: readDB(PRICES_FILE) });
});

app.post('/api/prices', authenticateToken, isAdmin, (req, res) => {
  const newPrices = req.body.prices;
  if (!newPrices) return res.status(400).json({ ok: false, error: 'Нет данных' });
  
  writeDB(PRICES_FILE, newPrices);
  res.json({ ok: true });
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { ok: false, error: 'Слишком много заказов. Попробуйте позже.' }
});

function getOrdersWord(n) {
  const lastDigit = n % 10, lastTwoDigits = n % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'заказов';
  if (lastDigit === 1) return 'заказ';
  if (lastDigit >= 2 && lastDigit <= 4) return 'заказа';
  return 'заказов';
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.post('/api/order', orderLimiter, async (req, res) => {
  try {
    const { order, total, name, phone, address, comment, payment, paidAmount, changeAmount, wantCard } = req.body;
    const dbPrices = readDB(PRICES_FILE);

    let calculatedTotal = 0;
    const orderLines = order.item.split('\n').filter(line => line.trim() !== '');
    const sortedDishes = Object.keys(dbPrices).sort((a, b) => b.length - a.length);

    for (const line of orderLines) {
      let matchedDish = sortedDishes.find(dish => line.includes(dish));
      if (!matchedDish) continue;
      
      const qtyMatch = line.match(/(\d+) шт\./);
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      let lineTotal = dbPrices[matchedDish];
      
      const brackets = line.match(/\((.*?)\)/g);
      if (brackets) {
        for (const bracket of brackets) {
          const addons = bracket.replace(/[()]/g, '').split(',');
          for (let addon of addons) {
            addon = addon.trim();
            const addonQtyMatch = addon.match(/(.+?) x(\d+)$/);
            let addonName = addon, addonQty = 1;
            if (addonQtyMatch) {
              addonName = addonQtyMatch[1].trim();
              addonQty = parseInt(addonQtyMatch[2]);
            }
            if (ADDON_PRICES[addonName]) lineTotal += ADDON_PRICES[addonName] * addonQty;
          }
        }
      }
      calculatedTotal += lineTotal * qty;
    }

    if (calculatedTotal > 0 && total < calculatedTotal) {
      return res.status(400).json({ ok: false, error: 'Цены были обновлены администратором. Пожалуйста, обновите страницу.' });
    }

    let paymentBlock = payment === 'Наличные'
      ? (changeAmount > 0
          ? `💵 <b>ОПЛАТА: НАЛИЧНЫЕ</b>\n⚠️ <b>КУРЬЕРУ ВЗЯТЬ СДАЧИ: ${changeAmount} ₽</b>\n<i>(Клиент даст ${paidAmount} ₽)</i>`
          : `💵 <b>ОПЛАТА: НАЛИЧНЫЕ</b>\n<i>(Без сдачи)</i>`)
      : `📱 <b>ОПЛАТА: ПЕРЕВОД КУРЬЕРУ (СБП)</b>`;

    let promoCount = null, promoBlock = '';
    const promoData = readDB(PROMO_FILE) || {};
    const cleanPhoneReq = cleanPhone(phone);
    if (cleanPhoneReq.length === 11) {
      let currentCount = promoData[cleanPhoneReq] || 0;
      if (total >= MIN_PROMO_AMOUNT) {
        currentCount += 1;
        promoData[cleanPhoneReq] = currentCount;
        writeDB(PROMO_FILE, promoData);
      }
      promoCount = currentCount;
      const left = 10 - (currentCount % 10);
      promoBlock = total >= MIN_PROMO_AMOUNT
        ? `🎁 <b>АКЦИЯ:</b> Выполнено ${currentCount % 10} из 10.\nОсталось до бесплатной: <b>${left} ${getOrdersWord(left)}</b>.`
        : `🎁 <b>АКЦИЯ:</b> Заказ меньше ${MIN_PROMO_AMOUNT}₽ (балл не начислен).`;
    }

    let commentBlock = comment ? `💬 <b>Комментарий:</b> ${escapeHTML(comment)}\n` : '';
    let cardBlock = wantCard ? `💳 <b>ЗАПРОС:</b> Привезти визитку для акции!\n` : '';

    const text = `🌯 <b>НОВЫЙ ЗАКАЗ — ГИРОС</b>\n━━━━━━━━━━━━━━\n<b>Состав:</b>\n${escapeHTML(order.item)}\n\n💰 <b>Сумма:</b> ${total} ₽\n\n${paymentBlock}\n\n━━━━━━━━━━━━━━\n👤 <b>Имя:</b> ${escapeHTML(name)}\n📞 <b>Телефон:</b> ${escapeHTML(phone)}\n📍 <b>Адрес:</b> ${escapeHTML(address || 'Самовывоз')}\n${commentBlock}${cardBlock}${promoBlock}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML' }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const tgData = await tgRes.json();
      
      if (!tgRes.ok || !tgData.ok) {
        console.error('❌ ОШИБКА TELEGRAM:', tgData);
        return res.status(500).json({ ok: false, error: 'Не удалось отправить заказ. Попробуйте позже.' });
      }
    } catch (tgError) {
      clearTimeout(timeoutId);
      console.error('❌ СЕТЕВАЯ ОШИБКА:', tgError);
      return res.status(500).json({ ok: false, error: 'Не удалось отправить заказ. Попробуйте позже.' });
    }

    res.json({ ok: true, promoCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Внутренняя ошибка сервера' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сайт работает: http://localhost:${PORT}`));