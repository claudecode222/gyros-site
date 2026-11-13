// ==========================================================================
// БЛОК 1: ЗАЩИТА ОТ DEVTOOLS И КОНСОЛИ (ТОЛЬКО НА ПК)
// ==========================================================================
const isMobileDevice = window.innerWidth <= 768;

if (!isMobileDevice) {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener('selectstart', function(e) {
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    if (!isInput) {
      e.preventDefault();
      return false;
    }
  });

  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });

  function blockKeys(e) {
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    
    if (e.key === 'F12' || e.keyCode === 123 || e.code === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    if (e.ctrlKey && e.shiftKey && ['KeyI', 'KeyJ', 'KeyC', 'KeyK', 'KeyM'].includes(e.code)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (e.ctrlKey && (e.code === 'KeyU' || e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (e.ctrlKey && (e.code === 'KeyS' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (e.ctrlKey && (e.code === 'KeyP' || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (e.ctrlKey && ['KeyA', 'KeyC', 'KeyX', 'KeyV'].includes(e.code)) {
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }

  document.addEventListener('keydown', blockKeys, true);
  document.addEventListener('keyup', blockKeys, true);
  document.addEventListener('keypress', blockKeys, true);

  setInterval(function() {
    const before = new Date().getTime();
    debugger;
    const after = new Date().getTime();
    if (after - before > 100) {
      console.clear();
      console.log("%cСТОП! Это консоль разработчика.", "color: red; font-size: 30px; font-weight: bold;");
      console.log("%cЕсли вас попросили сюда что-то вставить, это МОШЕННИЧЕСТВО.", "font-size: 18px;");
    }
  }, 1000);
}

// ==========================================================================
// БЛОК 2: АНИМАЦИИ (СНЕЖИНКИ И ОВОЩИ) - ТОЛЬКО НА ПК
// ==========================================================================
const snowBg = document.getElementById('snowBg');

if (snowBg && !isMobileDevice) {
  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';
    
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = (Math.random() * 3 + 3) + 's';
    snowflake.style.opacity = Math.random() * 0.5 + 0.3;
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    
    snowBg.appendChild(snowflake);
    
    setTimeout(function() {
      snowflake.remove();
    }, 7000);
  }
  
  setInterval(createSnowflake, 150);
}

const spitSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em; display: block;"><path d="M12 2v4"/><path d="M10 6h4"/><path d="M8 8h8"/><path d="M7 10h10"/><path d="M7 12h10"/><path d="M8 14h8"/><path d="M8 16h8"/><path d="M9 18h6"/><path d="M10 20h4"/></svg>`;
const items = ['🍅', '🥒', '🧅', '🥬', '🥕', '🌶️', '🧄', '🍋', spitSvg];
const bg = document.getElementById('veggiesBg');

if (bg) {
  const itemCount = isMobileDevice ? 3 : 20; // На телефоне 3 овоща вместо 20
  for (let i = 0; i < itemCount; i++) {
    const el = document.createElement('div');
    el.className = 'veggie';
    
    const randomIndex = Math.floor(Math.random() * items.length);
    el.innerHTML = items[randomIndex];
    
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (15 + Math.random() * 20) + 's';
    el.style.animationDelay = (-Math.random() * 30) + 's';
    el.style.fontSize = (30 + Math.random() * 40) + 'px';
    
    bg.appendChild(el);
  }
}

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach(function(el) {
  observer.observe(el);
});

// ==========================================================================
// БЛОК 3: МОБИЛЬНОЕ МЕНЮ
// ==========================================================================
const burgerMenu = document.getElementById('burgerMenu');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
  if (burgerMenu) burgerMenu.classList.toggle('active');
  if (mobileNav) mobileNav.classList.toggle('active');
  if (mobileNavOverlay) mobileNavOverlay.classList.toggle('active');
}

if (burgerMenu) {
  burgerMenu.addEventListener('click', toggleMenu);
}

if (mobileNavOverlay) {
  mobileNavOverlay.addEventListener('click', toggleMenu);
}

if (mobileLinks.length > 0) {
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', toggleMenu);
  });
}

// ==========================================================================
// БЛОК 4: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ МОДАЛОК
// ==========================================================================
function openModal(modal) {
  if (modal) {
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// ==========================================================================
// БЛОК 5: СЕКЦИЯ НАПИТКОВ (ПОКАЗАТЬ/СКРЫТЬ)
// ==========================================================================
const toggleDrinksBtn = document.getElementById('toggleDrinksBtn');
const drinksGrid = document.getElementById('drinksGrid');

if (toggleDrinksBtn && drinksGrid) {
  toggleDrinksBtn.addEventListener('click', function() {
    drinksGrid.classList.toggle('expanded');
    
    if (drinksGrid.classList.contains('expanded')) {
      toggleDrinksBtn.textContent = 'Скрыть напитки';
    } else {
      toggleDrinksBtn.textContent = 'Показать все напитки';
      const drinksSection = document.getElementById('drinks');
      if (drinksSection) {
        drinksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// ==========================================================================
// БЛОК 6: МАСКА ТЕЛЕФОНА
// ==========================================================================
function applyPhoneMask(input) {
  let digits = input.value.replace(/\D/g, '');
  
  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }
  
  if (digits.length > 0 && !digits.startsWith('7')) {
    digits = '7' + digits;
  }
  
  let res = '';
  if (digits.length > 0) {
    res = '+7';
  }
  if (digits.length > 1) {
    res += ' (' + digits.slice(1, 4);
  }
  if (digits.length >= 4) {
    res += ') ' + digits.slice(4, 7);
  }
  if (digits.length >= 7) {
    res += '-' + digits.slice(7, 9);
  }
  if (digits.length >= 9) {
    res += '-' + digits.slice(9, 11);
  }
  
  input.value = res;
}

function cleanPhone(phone) {
  if (!phone) {
    return '';
  }
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11);
  }
  return cleaned;
}

const orderPhoneInput = document.getElementById('orderPhoneInput');
const feedbackPhoneInput = document.getElementById('feedbackPhoneInput');
const loginPhoneInput = document.getElementById('loginPhone');
const registerPhoneInput = document.getElementById('registerPhone');

if (orderPhoneInput) {
  orderPhoneInput.addEventListener('input', function(e) {
    if (e.inputType === 'deleteContentBackward') return;
    applyPhoneMask(orderPhoneInput);
  });
}

if (feedbackPhoneInput) {
  feedbackPhoneInput.addEventListener('input', function(e) {
    if (e.inputType === 'deleteContentBackward') return;
    applyPhoneMask(feedbackPhoneInput);
  });
}

if (loginPhoneInput) {
  loginPhoneInput.addEventListener('input', function(e) {
    if (e.inputType === 'deleteContentBackward') return;
    applyPhoneMask(loginPhoneInput);
  });
}

if (registerPhoneInput) {
  registerPhoneInput.addEventListener('input', function(e) {
    if (e.inputType === 'deleteContentBackward') return;
    applyPhoneMask(registerPhoneInput);
  });
}

// ==========================================================================
// БЛОК 7: ПРОГРЕСС АКЦИИ
// ==========================================================================
const MIN_PROMO_AMOUNT = 1000;

if (orderPhoneInput) {
  orderPhoneInput.addEventListener('input', async function() {
    const cleaned = cleanPhone(orderPhoneInput.value);
    const promoInfo = document.getElementById('checkoutPromoInfo');
    const promoFill = document.getElementById('checkoutPromoFill');
    const promoLabel = document.getElementById('checkoutPromoLabel');

    if (cleaned.length === 11 && promoInfo) {
      try {
        const res = await fetch('/api/promo?phone=' + cleaned);
        const data = await res.json();
        
        if (data.ok) {
          const count = data.count;
          const remainder = count % 10;
          const left = 10 - remainder;
          const percent = (remainder / 10) * 100;
          
          if (promoFill) promoFill.style.width = percent + '%';
          if (promoLabel) promoLabel.textContent = `Сделано заказов: ${count}. До бесплатной: ${left}`;
          
          promoInfo.style.display = 'block';
        } else {
          promoInfo.style.display = 'none';
        }
      } catch (e) {
        promoInfo.style.display = 'none';
      }
    } else if (promoInfo) {
      promoInfo.style.display = 'none';
    }
  });
}

// ==========================================================================
// БЛОК 8: АВТОРИЗАЦИЯ И ПРОВЕРКА IP
// ==========================================================================
const authContainer = document.getElementById('authContainer');
const profileContainer = document.getElementById('profileContainer');
const displayUserName = document.getElementById('displayUserName');
const btnAdminPanel = document.getElementById('btnAdminPanel');
const btnLogout = document.getElementById('btnLogout');

let ipAllowed = false;

async function checkAdminAccess() {
  try {
    const res = await fetch('/api/check-ip');
    const data = await res.json();
    
    ipAllowed = data.allowed;
    console.log("Сервер разрешил IP?", ipAllowed);
    
    if (authContainer) authContainer.classList.remove('active');
    if (profileContainer) profileContainer.classList.remove('active');
    
    checkAuth();
  } catch (e) {
    console.error('Ошибка проверки IP:', e);
    ipAllowed = false;
    if (authContainer) authContainer.classList.remove('active');
    if (profileContainer) profileContainer.classList.remove('active');
  }
}

function checkAuth() {
  const token = localStorage.getItem('gyros_token');
  const userStr = localStorage.getItem('gyros_user');
  let user = null;
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {}
  }

  if (token && user && ipAllowed === true) {
    if (authContainer) authContainer.classList.remove('active'); 
    if (profileContainer) profileContainer.classList.add('active'); 
    if (displayUserName) displayUserName.textContent = user.name || 'Гость';
    
    if (user.role === 'admin') {
      if (btnAdminPanel) btnAdminPanel.style.display = 'block';
    } else {
      if (btnAdminPanel) btnAdminPanel.style.display = 'none';
    }
  } else {
    if (profileContainer) profileContainer.classList.remove('active');
    
    if (ipAllowed === true) {
      if (authContainer) authContainer.classList.add('active');
    } else {
      if (authContainer) authContainer.classList.remove('active');
    }
  }
}

checkAdminAccess();

if (btnLogout) {
  btnLogout.addEventListener('click', function() {
    localStorage.removeItem('gyros_token');
    localStorage.removeItem('gyros_user');
    
    checkAuth();
    loadPrices();
  });
}

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const adminModal = document.getElementById('adminModal');

const btnOpenLogin = document.getElementById('btnOpenLogin');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const btnOpenRegister = document.getElementById('btnOpenRegister');
const closeRegisterBtn = document.getElementById('closeRegisterBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');

if (btnOpenLogin && loginModal) {
  btnOpenLogin.addEventListener('click', function() {
    loginModal.classList.add('show');
  });
}

if (closeLoginBtn && loginModal) {
  closeLoginBtn.addEventListener('click', function() {
    loginModal.classList.remove('show');
  });
}

if (btnOpenRegister && registerModal) {
  btnOpenRegister.addEventListener('click', function() {
    registerModal.classList.add('show');
  });
}

if (closeRegisterBtn && registerModal) {
  closeRegisterBtn.addEventListener('click', function() {
    registerModal.classList.remove('show');
  });
}

if (closeAdminBtn && adminModal) {
  closeAdminBtn.addEventListener('click', function() {
    adminModal.classList.remove('show');
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('loginStatus');
    
    if (status) {
      status.textContent = 'Загрузка...';
      status.style.color = '#FFD700';
    }
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: e.target.phone.value, 
          password: e.target.password.value 
        })
      });
      const data = await res.json();
      
      if (data.ok) {
        localStorage.setItem('gyros_token', data.token);
        localStorage.setItem('gyros_user', JSON.stringify({ name: data.name, phone: data.phone, role: data.role }));
        
        if (status) {
          status.textContent = '✅ Успешный вход!';
          status.style.color = '#4ade80';
        }
        
        setTimeout(function() {
          if (loginModal) loginModal.classList.remove('show');
          checkAuth();
        }, 1000);
      } else {
        if (status) {
          status.textContent = `❌ ${data.error}`;
          status.style.color = '#ef4444';
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = '❌ Ошибка сервера';
        status.style.color = '#ef4444';
      }
    }
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('registerStatus');
    
    if (status) {
      status.textContent = 'Загрузка...';
      status.style.color = '#FFD700';
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: e.target.name.value, 
          phone: e.target.phone.value, 
          password: e.target.password.value 
        })
      });
      const data = await res.json();
      
      if (data.ok) {
        if (status) {
          status.textContent = '✅ Успешно! Войдите.';
          status.style.color = '#4ade80';
        }
        setTimeout(function() {
          if (registerModal) registerModal.classList.remove('show');
          if (loginModal) loginModal.classList.add('show');
        }, 1500);
      } else {
        if (status) {
          status.textContent = `❌ ${data.error}`;
          status.style.color = '#ef4444';
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = '❌ Ошибка сервера';
        status.style.color = '#ef4444';
      }
    }
  });
}

// ==========================================================================
// БЛОК 9: УПРАВЛЕНИЕ ЦЕНАМИ
// ==========================================================================
let globalPrices = {};

async function loadPrices() {
  try {
    const res = await fetch('/api/prices');
    const data = await res.json();
    
    if (data.ok && data.prices) {
      globalPrices = data.prices;
      
      const priceTags = document.querySelectorAll('.price-tag');
      priceTags.forEach(function(el) {
        const name = el.getAttribute('data-price-name');
        if (globalPrices[name]) {
          const suffix = el.textContent.includes('от') ? 'от ' : '';
          el.textContent = `${suffix}${globalPrices[name]} ₽`;
        }
      });

      const cards = document.querySelectorAll('.card');
      cards.forEach(function(card) {
        const name = card.getAttribute('data-name');
        if (name && globalPrices[name]) {
          card.setAttribute('data-price', globalPrices[name]);
        }
      });
    }
  } catch (e) {
    console.error('Ошибка загрузки цен:', e);
  }
}

loadPrices();

if (btnAdminPanel) {
  btnAdminPanel.addEventListener('click', async function() {
    const list = document.getElementById('adminPricesList');
    if (list) list.innerHTML = 'Загрузка...';
    if (adminModal) adminModal.classList.add('show');
    
    try {
      const res = await fetch('/api/prices');
      const data = await res.json();
      
      if (data.ok && data.prices) {
        if (list) {
          list.innerHTML = '';
          for (const [name, price] of Object.entries(data.prices)) {
            list.innerHTML += `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 10px; border-radius: 8px; margin-bottom: 5px;">
                <span style="font-size: 14px; width: 60%; color: #eee;">${name}</span>
                <input type="number" name="price_${name}" value="${price}" style="width: 80px; padding: 5px; text-align: center; border-radius: 5px; border: 1px solid #444; color:#fff; background:#111;" required>
              </div>
            `;
          }
        }
      }
    } catch (e) {
      if (list) list.innerHTML = 'Ошибка загрузки цен';
    }
  });
}

const adminForm = document.getElementById('adminForm');
if (adminForm) {
  adminForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('adminStatus');
    if (status) status.textContent = 'Сохранение...';
    
    const newPrices = {};
    const inputs = document.querySelectorAll('#adminPricesList input');
    
    inputs.forEach(function(input) {
      newPrices[input.name.replace('price_', '')] = parseInt(input.value);
    });

    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('gyros_token')}`
        },
        body: JSON.stringify({ prices: newPrices })
      });
      const data = await res.json();
      
      if (data.ok) {
        if (status) {
          status.textContent = '✅ Цены обновлены!';
          status.style.color = '#4ade80';
        }
        await loadPrices();
        setTimeout(function() {
          if (adminModal) adminModal.classList.remove('show');
          if (status) status.textContent = '';
        }, 1500);
      } else {
        if (status) {
          status.textContent = `❌ ${data.error}`;
          status.style.color = '#ef4444';
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = '❌ Ошибка сервера';
        status.style.color = '#ef4444';
      }
    }
  });
}

// ==========================================================================
// БЛОК 10: ОБРАТНАЯ СВЯЗЬ (WHATSAPP)
// ==========================================================================
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const status = document.getElementById('feedbackStatus');
    const btn = feedbackForm.querySelector('button[type="submit"]');
    const formData = new FormData(feedbackForm);
    
    const name = formData.get('name');
    const phone = formData.get('phone') || 'Не указан';
    const message = formData.get('message');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Переход в WhatsApp...';
    }

    const text = `*Новое сообщение с сайта ГИРОС*%0A%0A*Имя:* ${name}%0A*Телефон:* ${phone}%0A*Сообщение:* ${message}`;
    const waNumber = '79200165232'; 
    const waUrl = `https://wa.me/${waNumber}?text=${text}`;

    if (status) {
      status.textContent = '✅ Открываем WhatsApp... Нажмите "Отправить" в чате!';
      status.style.color = '#4ade80';
    }

    window.open(waUrl, '_blank');

    setTimeout(function() {
      feedbackForm.reset();
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'ОТПРАВИТЬ В WHATSAPP';
      }
      if (status) {
        status.textContent = '';
      }
    }, 5000);
  });
}

// ==========================================================================
// БЛОК 11: КОРЗИНА
// ==========================================================================
let cart = [];
let currentItem = null;
let currentBasePrice = 0;
let currentTotal = 0;
let currentSize = 'standard';
let currentType = 'food';

const orderModal = document.getElementById('orderModal');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const drinkOfferModal = document.getElementById('drinkOfferModal');
const floatingCart = document.getElementById('floatingCart');
const modalTitle = document.getElementById('modalTitle');
const customTotalEl = document.getElementById('customTotal');

const openModalBtns = document.querySelectorAll('.btn-open-modal');
openModalBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    const card = btn.closest('.card');
    
    if (card) {
      currentItem = card.dataset.name;
      currentBasePrice = +card.dataset.price;
      currentType = card.dataset.type || 'food';
    } else {
      currentItem = btn.dataset.name;
      currentBasePrice = +btn.dataset.price;
      currentType = btn.dataset.type || 'food';
    }
    
    if (globalPrices[currentItem]) {
      currentBasePrice = globalPrices[currentItem];
    }
    
    currentSize = 'standard';
    const sizeSwitcher = document.getElementById('sizeSwitcher');
    
    if (currentType === 'food' && (currentItem === 'Шаурма Классическая' || currentItem === 'Шаурма Сырная')) {
      if (sizeSwitcher) sizeSwitcher.style.display = 'flex';
      
      const sizeBtns = document.querySelectorAll('.size-btn');
      sizeBtns.forEach(function(b) { b.classList.remove('active'); });
      
      if (sizeSwitcher) {
        const standardBtn = sizeSwitcher.querySelector('[data-size="standard"]');
        if (standardBtn) standardBtn.classList.add('active');
      }
      
      if (globalPrices[currentItem]) {
        currentBasePrice = globalPrices[currentItem];
      } else {
        if (currentItem === 'Шаурма Классическая') {
          currentBasePrice = 260;
        } else {
          currentBasePrice = 280;
        }
      }
    } else {
      if (sizeSwitcher) sizeSwitcher.style.display = 'none';
    }

    currentTotal = currentBasePrice;
    if (modalTitle) modalTitle.textContent = currentItem;
    
    const ingQtyElements = document.querySelectorAll('.ing-qty');
    ingQtyElements.forEach(function(el) {
      el.textContent = '0';
    });
    
    updateCustomTotal();
    openModal(orderModal);
  });
});

const sizeSwitcherContainer = document.getElementById('sizeSwitcher');
if (sizeSwitcherContainer) {
  sizeSwitcherContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
      const size = e.target.dataset.size;
      
      const sizeBtns = document.querySelectorAll('.size-btn');
      sizeBtns.forEach(function(b) { b.classList.remove('active'); });
      
      e.target.classList.add('active');
      currentSize = size;
      
      if (size === 'xl') {
        if (globalPrices[currentItem + ' XL']) {
          currentBasePrice = globalPrices[currentItem + ' XL'];
        } else {
          if (currentItem === 'Шаурма Классическая') {
            currentBasePrice = 280;
          } else {
            currentBasePrice = 300;
          }
        }
        if (modalTitle) modalTitle.textContent = currentItem + ' XL';
      } else {
        if (globalPrices[currentItem]) {
          currentBasePrice = globalPrices[currentItem];
        } else {
          if (currentItem === 'Шаурма Классическая') {
            currentBasePrice = 260;
          } else {
            currentBasePrice = 280;
          }
        }
        if (modalTitle) modalTitle.textContent = currentItem;
      }
      
      updateCustomTotal();
    }
  });
}

const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', function() {
    closeModal(orderModal);
  });
}

const btnIncElements = document.querySelectorAll('.btn-inc');
btnIncElements.forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    const qtyEl = e.target.previousElementSibling;
    let qty = parseInt(qtyEl.textContent);
    qty = qty + 1;
    qtyEl.textContent = qty;
    updateCustomTotal();
  });
});

const btnDecElements = document.querySelectorAll('.btn-dec');
btnDecElements.forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    const qtyEl = e.target.nextElementSibling;
    let qty = parseInt(qtyEl.textContent);
    if (qty > 0) {
      qty = qty - 1;
      qtyEl.textContent = qty;
      updateCustomTotal();
    }
  });
});

function updateCustomTotal() {
  let total = currentBasePrice;
  let addedItems = [];
  
  const ingRows = document.querySelectorAll('.ing-row');
  ingRows.forEach(function(row) {
    const qtyEl = row.querySelector('.ing-qty');
    const qty = parseInt(qtyEl.textContent);
    const price = parseInt(row.dataset.price);
    const name = row.dataset.name;
    
    if (qty > 0) {
      total += qty * price;
      if (qty > 1) {
        addedItems.push(name + ' x' + qty);
      } else {
        addedItems.push(name);
      }
    }
  });

  if (customTotalEl) {
    customTotalEl.textContent = total;
  }
  currentTotal = total;
  
  return addedItems;
}

const btnAddToCart = document.getElementById('btnAddToCart');
if (btnAddToCart) {
  btnAddToCart.addEventListener('click', function() {
    const addedItems = updateCustomTotal();
    let summary = currentItem;
    
    if (currentType === 'food' && currentSize === 'xl') {
      summary += ' XL';
    }
    
    if (addedItems.length > 0) {
      summary += ` (${addedItems.join(', ')})`;
    }
    
    addToCart(summary, currentTotal);
  });
}

function addToCart(desc, price) {
  const existingItemIndex = cart.findIndex(function(item) {
    return item.desc === desc && item.price === price;
  });
  
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].qty += 1;
  } else {
    cart.push({
      name: currentItem,
      desc: desc,
      price: price,
      qty: 1,
      type: currentType
    });
  }
  
  closeModal(orderModal);
  updateCartUI(true);
}

// ==========================================================================
// БЛОК 12: ОТРИСОВКА КОРЗИНЫ
// ==========================================================================
function updateCartUI(animate) {
  if (animate === undefined) animate = false;
  
  let totalSum = 0;
  let totalCount = 0;
  
  cart.forEach(function(item) {
    totalSum += item.price * item.qty;
    totalCount += item.qty;
  });
  
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalBtnEl = document.getElementById('cartTotalBtn');
  const cartTotalPriceEl = document.getElementById('cartTotalPrice');
  const list = document.getElementById('cartItemsList');
  
  if (cartCountEl) cartCountEl.textContent = totalCount;
  if (cartTotalBtnEl) cartTotalBtnEl.textContent = totalSum;
  if (cartTotalPriceEl) cartTotalPriceEl.textContent = totalSum;
  
  if (list) {
    if (cart.length === 0) {
      list.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">Корзина пуста</p>';
    } else {
      let html = '';
      
      cart.forEach(function(item, index) {
        html += `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-desc">${item.desc}</div>
            </div>
            <div class="cart-item-controls">
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span class="qty-number">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
              </div>
              <div class="cart-item-price">${item.price * item.qty} ₽</div>
              <button class="btn-remove" onclick="removeFromCart(${index})">&times;</button>
            </div>
          </div>
        `;
      });
      
      list.innerHTML = html;
    }
  }

  if (animate === true && floatingCart && !isMobileDevice) {
    floatingCart.classList.remove('bump');
    void floatingCart.offsetWidth;
    floatingCart.classList.add('bump');
  }
}

window.changeQty = function(index, delta) {
  cart[index].qty += delta;
  
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  
  updateCartUI();
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

if (floatingCart) {
  floatingCart.addEventListener('click', function() {
    openModal(cartModal);
  });
}

const closeCartBtn = document.getElementById('closeCartBtn');
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', function() {
    closeModal(cartModal);
  });
}

// ==========================================================================
// БЛОК 13: ОФОРМЛЕНИЕ ЗАКАЗА
// ==========================================================================
const btnCheckoutCart = document.getElementById('btnCheckoutCart');

function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Корзина пуста!');
    return;
  }
  
  let totalSum = 0;
  let itemsHtmlString = "";
  
  cart.forEach(function(item, index) {
    totalSum += item.price * item.qty;
    itemsHtmlString += `<div>${index + 1}. ${item.desc} <b style="color:#FFD700;">${item.qty} шт.</b> — ${item.price * item.qty} ₽</div>`;
  });
  
  const orderSummary = document.getElementById('orderSummary');
  if (orderSummary) {
    orderSummary.innerHTML = `
      <strong>Ваш заказ:</strong><br>
      ${itemsHtmlString}<br><br>
      <strong>Сумма:</strong> ${totalSum} ₽
    `;
  }
  
  const orderNameInput = document.getElementById('orderNameInput');
  const orderStreetInput = document.getElementById('orderStreetInput');
  const orderEntranceInput = document.getElementById('orderEntranceInput');
  const orderFloorInput = document.getElementById('orderFloorInput');
  const orderApartmentInput = document.getElementById('orderApartmentInput');
  
  if (orderNameInput) orderNameInput.value = localStorage.getItem('gyrosName') || '';
  if (orderStreetInput) orderStreetInput.value = localStorage.getItem('gyrosStreet') || '';
  if (orderEntranceInput) orderEntranceInput.value = localStorage.getItem('gyrosEntrance') || '';
  if (orderFloorInput) orderFloorInput.value = localStorage.getItem('gyrosFloor') || '';
  if (orderApartmentInput) orderApartmentInput.value = localStorage.getItem('gyrosApartment') || '';
  
  if (orderPhoneInput) orderPhoneInput.value = '';
  
  const orderCommentInput = document.getElementById('orderCommentInput');
  if (orderCommentInput) orderCommentInput.value = '';
  
  const wantCardInput = document.getElementById('wantCardInput');
  if (wantCardInput) wantCardInput.checked = false;
  
  const checkoutPromoInfo = document.getElementById('checkoutPromoInfo');
  if (checkoutPromoInfo) checkoutPromoInfo.style.display = 'none';
  
  closeModal(drinkOfferModal);
  closeModal(cartModal);
  openModal(checkoutModal);
}

if (btnCheckoutCart) {
  btnCheckoutCart.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    const hasDrinks = cart.some(function(item) {
      return item.type === 'drink';
    });

    if (hasDrinks === false) {
      closeModal(cartModal);
      openModal(drinkOfferModal);
    } else {
      proceedToCheckout();
    }
  });
}

const closeDrinkOfferBtn = document.getElementById('closeDrinkOfferBtn');
const btnGoToDrinks = document.getElementById('btnGoToDrinks');
const btnNoDrinks = document.getElementById('btnNoDrinks');

if (closeDrinkOfferBtn) {
  closeDrinkOfferBtn.addEventListener('click', function() {
    closeModal(drinkOfferModal);
  });
}

if (btnGoToDrinks) {
  btnGoToDrinks.addEventListener('click', function() {
    closeModal(drinkOfferModal);
    
    if (drinksGrid) drinksGrid.classList.add('expanded');
    if (toggleDrinksBtn) toggleDrinksBtn.textContent = 'Скрыть напитки';
    
    const drinksSection = document.getElementById('drinks');
    if (drinksSection) {
      drinksSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

if (btnNoDrinks) {
  btnNoDrinks.addEventListener('click', function() {
    proceedToCheckout();
  });
}

const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
if (closeCheckoutBtn) {
  closeCheckoutBtn.addEventListener('click', function() {
    closeModal(checkoutModal);
  });
}

const btnBackToCart = document.getElementById('btnBackToCart');
if (btnBackToCart) {
  btnBackToCart.addEventListener('click', function() {
    closeModal(checkoutModal);
    openModal(cartModal);
  });
}

// ==========================================================================
// БЛОК 14: ОПЛАТА И ОТПРАВКА НА СЕРВЕР (TELEGRAM)
// ==========================================================================
const paymentSelect = document.getElementById('paymentSelect');
const changeInputContainer = document.getElementById('changeInputContainer');
const changeAmountInput = document.getElementById('changeAmount');

if (paymentSelect) {
  paymentSelect.addEventListener('change', function() {
    if (paymentSelect.value === 'Наличные') {
      if (changeInputContainer) changeInputContainer.style.display = 'block';
    } else {
      if (changeInputContainer) changeInputContainer.style.display = 'none';
      if (changeAmountInput) changeAmountInput.value = '';
    }
  });
}

const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const statusEl = document.getElementById('status');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const form = new FormData(e.target);
    const payment = form.get('payment');
    
    const orderPhoneRaw = form.get('phone');
    const orderPhoneClean = cleanPhone(orderPhoneRaw);
    const comment = form.get('comment').trim();
    const wantCard = form.get('wantCard') === 'on';
    
    if (orderPhoneClean.length !== 11) {
      if (statusEl) {
        statusEl.textContent = '❌ Введите полный номер телефона (+7...)';
        statusEl.style.color = '#ef4444';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
    }
    
    if (statusEl) {
      statusEl.textContent = 'Соединяемся с сервером...';
      statusEl.style.color = '#FFD700';
    }

    let totalSum = 0;
    let itemsString = "";
    
    cart.forEach(function(item, index) {
      totalSum += item.price * item.qty;
      itemsString += `${index + 1}. ${item.desc} — ${item.qty} шт. = ${item.price * item.qty} ₽\n`;
    });

    let paidAmount = totalSum;
    let changeAmount = 0;
    
    if (payment === 'Наличные') {
      const inputVal = form.get('changeAmount');
      if (inputVal && parseFloat(inputVal) > 0) {
        paidAmount = parseFloat(inputVal);
        
        if (paidAmount < totalSum) {
          if (statusEl) {
            statusEl.textContent = '❌ Сумма наличных меньше стоимости заказа!';
            statusEl.style.color = '#ef4444';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заказ';
          }
          return;
        }
        
        changeAmount = paidAmount - totalSum;
      }
    }

    const street = form.get('street').trim();
    const entrance = form.get('entrance').trim();
    const floor = form.get('floor').trim();
    const apartment = form.get('apartment').trim();
    
    let fullAddress = 'Самовывоз';
    if (street) {
      fullAddress = street;
      if (entrance) fullAddress += `, подъезд ${entrance}`;
      if (floor) fullAddress += `, этаж ${floor}`;
      if (apartment) fullAddress += `, кв/офис ${apartment}`;
    }

    const userName = form.get('name');
    
    localStorage.setItem('gyrosName', userName);
    localStorage.setItem('gyrosStreet', street);
    localStorage.setItem('gyrosEntrance', entrance);
    localStorage.setItem('gyrosFloor', floor);
    localStorage.setItem('gyrosApartment', apartment);

    const payload = {
      order: {
        item: itemsString.trim(),
        price: totalSum
      },
      total: totalSum,
      name: userName,
      phone: orderPhoneRaw,
      address: fullAddress,
      comment: comment,
      payment: payment,
      paidAmount: paidAmount,
      changeAmount: changeAmount,
      wantCard: wantCard
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(function() {
      controller.abort();
    }, 20000);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 502 || res.status === 504) {
          throw new Error('Сервер перезагружается. Попробуйте нажать "Отправить" еще раз через 5 секунд.');
        }
        
        const textResponse = await res.text();
        let errorMsg = 'Ошибка сервера';
        
        try {
          const errorData = JSON.parse(textResponse);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = 'Ошибка соединения';
        }
        
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      
      if (data.ok) {
        if (totalSum < MIN_PROMO_AMOUNT) {
          if (statusEl) {
            statusEl.textContent = `✅ Заказ принят! (Для акции нужен заказ от ${MIN_PROMO_AMOUNT} ₽)`;
          }
        } else if (data.promoCount !== null) {
          if (data.promoCount % 10 === 0 && data.promoCount > 0) {
            if (statusEl) {
              statusEl.textContent = '🎉 ПОЗДРАВЛЯЕМ! Вы сделали 10-й заказ. Следующая шаурма БЕСПЛАТНО!';
            }
          } else {
            if (statusEl) {
              statusEl.textContent = '✅ Заказ принят! Мы скоро свяжемся.';
            }
          }
        } else {
          if (statusEl) {
            statusEl.textContent = '✅ Заказ принят! Мы скоро свяжемся.';
          }
        }
        
        if (statusEl) statusEl.style.color = '#4ade80';
        
        setTimeout(function() {
          closeModal(checkoutModal);
          cart = [];
          updateCartUI();
          
          if (statusEl) statusEl.textContent = '';
          if (changeInputContainer) changeInputContainer.style.display = 'block';
          
          const checkoutPromoInfo = document.getElementById('checkoutPromoInfo');
          if (checkoutPromoInfo) checkoutPromoInfo.style.display = 'none';
          
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заказ';
          }
        }, 5000);
        
      } else {
        throw new Error('Ошибка отправки');
      }
      
    } catch (err) {
      clearTimeout(timeoutId);
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заказ';
      }
      
      if (statusEl) {
        if (err.name === 'AbortError') {
          statusEl.textContent = '❌ Ошибка: Сервер не отвечает. Проверьте интернет и попробуйте снова.';
        } else if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
          statusEl.textContent = '❌ Нет связи с сервером. Проверьте интернет.';
        } else {
          statusEl.textContent = `❌ ${err.message}`;
        }
        
        statusEl.style.color = '#ef4444';
      }
    }
  });
}