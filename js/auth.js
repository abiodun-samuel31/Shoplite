/* ===========================
   CHECK IF USER IS LOGGED IN
=========================== */
function isLoggedIn() {
  return localStorage.getItem('shoplite_user') !== null;
}

/* ===========================
   GET CURRENT USER
=========================== */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('shoplite_user')) || null;
}

/* ===========================
   SAVE USER TO STORAGE
=========================== */
function saveUser(user) {
  localStorage.setItem('shoplite_user', JSON.stringify(user));
}

/* ===========================
   LOGOUT
=========================== */
function logout() {
  localStorage.removeItem('shoplite_user');
  showToast('You have been logged out.', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

/* ===========================
   SWITCH BETWEEN
   LOGIN AND SIGNUP TABS
=========================== */
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  
  if (!loginForm || !signupForm) return;
  
  if (tab === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
  }
  
  clearAuthErrors();
}

/* ===========================
   CLEAR ALL AUTH ERRORS
=========================== */
function clearAuthErrors() {
  document.querySelectorAll('.auth-error').forEach(el => {
    el.textContent = '';
  });
  document.querySelectorAll('.auth-input').forEach(el => {
    el.classList.remove('input-error');
  });
}

/* ===========================
   SHOW AUTH ERROR
=========================== */
function showAuthError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
  
  const inputId = id.replace('Error', '');
  const input = document.getElementById(inputId);
  if (input) input.classList.add('input-error');
}

/* ===========================
   LOGIN
=========================== */
function loginUser() {
  clearAuthErrors();
  
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value.trim();
  let valid = true;
  
  if (!email || !email.includes('@')) {
    showAuthError('loginEmailError', 'Please enter a valid email address.');
    valid = false;
  }
  
  if (!password || password.length < 6) {
    showAuthError('loginPasswordError', 'Password must be at least 6 characters.');
    valid = false;
  }
  
  if (!valid) return;
  
  // Check against registered users
  const users = JSON.parse(localStorage.getItem('shoplite_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showAuthError('loginEmailError', 'Incorrect email or password.');
    return;
  }
  
  // Save session
  saveUser({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });
  
  showToast('Welcome back, ' + user.firstName + '! 👋', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

/* ===========================
   SIGNUP
=========================== */
function signupUser() {
  clearAuthErrors();
  
  const firstName = document.getElementById('signupFirstName')?.value.trim();
  const lastName = document.getElementById('signupLastName')?.value.trim();
  const email = document.getElementById('signupEmail')?.value.trim();
  const password = document.getElementById('signupPassword')?.value.trim();
  const confirm = document.getElementById('signupConfirm')?.value.trim();
  let valid = true;
  
  if (!firstName) {
    showAuthError('signupFirstNameError', 'First name is required.');
    valid = false;
  }
  
  if (!lastName) {
    showAuthError('signupLastNameError', 'Last name is required.');
    valid = false;
  }
  
  if (!email || !email.includes('@')) {
    showAuthError('signupEmailError', 'Please enter a valid email address.');
    valid = false;
  }
  
  if (!password || password.length < 6) {
    showAuthError('signupPasswordError', 'Password must be at least 6 characters.');
    valid = false;
  }
  
  if (password !== confirm) {
    showAuthError('signupConfirmError', 'Passwords do not match.');
    valid = false;
  }
  
  if (!valid) return;
  
  // Check if email already exists
  const users = JSON.parse(localStorage.getItem('shoplite_users')) || [];
  const exists = users.find(u => u.email === email);
  
  if (exists) {
    showAuthError('signupEmailError', 'An account with this email already exists.');
    return;
  }
  
  // Save new user
  const newUser = {
    id: 'USR' + Date.now(),
    firstName,
    lastName,
    email,
    password,
    createdAt: new Date().toLocaleDateString()
  };
  
  users.push(newUser);
  localStorage.setItem('shoplite_users', JSON.stringify(users));
  
  // Auto login after signup
  saveUser({
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email
  });
  
  showToast('Account created! Welcome, ' + firstName + '! 🎉', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

/* ===========================
   UPDATE NAVBAR FOR
   LOGGED IN USER
=========================== */
function updateNavForUser() {
  const accountLink = document.querySelector('a[href="login.html"]');
  if (!accountLink) return;
  
  const user = getCurrentUser();
  
  if (user) {
    accountLink.textContent = user.firstName;
    accountLink.href = 'orders.html';
  }
}

/* ===========================
   PROTECT ORDERS PAGE
   Redirect if not logged in
=========================== */
function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html?redirect=orders';
  }
}

/* ===========================
   READ URL PARAMS
   Auto switch to signup tab
=========================== */
function readAuthParams() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'signup') {
    switchTab('signup');
  }
}

/* ===========================
   ENTER KEY SUPPORT
=========================== */
function attachEnterKey() {
  const loginPassword = document.getElementById('loginPassword');
  if (loginPassword) {
    loginPassword.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loginUser();
    });
  }
  
  const signupConfirm = document.getElementById('signupConfirm');
  if (signupConfirm) {
    signupConfirm.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') signupUser();
    });
  }
}

/* ===========================
   INIT
=========================== */
window.addEventListener('load', () => {
  updateNavForUser();
  readAuthParams();
  attachEnterKey();
});