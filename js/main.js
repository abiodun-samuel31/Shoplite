/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ===========================
   HAMBURGER MENU
=========================== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===========================
   SMOOTH SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   ACTIVE NAV ON SCROLL
=========================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navAnchors.forEach(anchor => {
    anchor.classList.remove('active');
    const href = anchor.getAttribute('href');
    if (href && href.includes(current) && current !== '') {
      anchor.classList.add('active');
    }
  });
}, { passive: true });

/* ===========================
   TOAST NOTIFICATION
=========================== */
function showToast(message, type = 'added') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast ' + type;
  
  void toast.offsetWidth;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ===========================
   CART COUNT UPDATE
=========================== */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('shoplite_cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  
  countEl.textContent = total;
  
  countEl.classList.remove('pop');
  void countEl.offsetWidth;
  countEl.classList.add('pop');
  
  setTimeout(() => countEl.classList.remove('pop'), 400);
}

/* ===========================
   ADD TO CART
=========================== */
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem('shoplite_cart')) || [];
  
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  
  localStorage.setItem('shoplite_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ ' + name + ' added to cart', 'added');
}

/* ===========================
   NEWSLETTER SUBSCRIBE
=========================== */
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const msg = document.getElementById('newsletterMsg');
  if (!input || !msg) return;
  
  const email = input.value.trim();
  
  if (!email || !email.includes('@')) {
    msg.style.color = '#ff4747';
    msg.textContent = 'Please enter a valid email address.';
    return;
  }
  
  msg.style.color = 'var(--accent-green)';
  msg.textContent = '🎉 You\'re subscribed! Check your inbox for deals.';
  input.value = '';
  
  setTimeout(() => {
    msg.textContent = '';
  }, 5000);
}

/* ===========================
   NEWSLETTER ENTER KEY
=========================== */
const newsletterInput = document.getElementById('newsletterEmail');
if (newsletterInput) {
  newsletterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') subscribeNewsletter();
  });
}

/* ===========================
   WISHLIST BUTTON TOGGLE
=========================== */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isWished = btn.textContent === '♥';
    btn.textContent = isWished ? '♡' : '♥';
    btn.style.color = isWished ? '' : '#ff4747';
    showToast(isWished ? 'Removed from wishlist' : '♥ Added to wishlist', 'success');
  });
});

/* ===========================
   FOOTER YEAR
=========================== */
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
  const year = new Date().getFullYear();
  footerYear.textContent = footerYear.textContent.replace('2025', year);
}

/* ===========================
   INIT ON PAGE LOAD
=========================== */
window.addEventListener('load', () => {
  updateCartCount();
});