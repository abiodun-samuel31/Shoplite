/* ===========================
   RENDER ORDER SUMMARY
   on checkout page
=========================== */
function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl) return;
  
  const cart = JSON.parse(localStorage.getItem('shoplite_cart')) || [];
  
  if (cart.length === 0) {
    window.location.href = 'shop.html';
    return;
  }
  
  let subtotal = 0;
  
  const itemsHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    return `
      <div class="checkout-item">
        <div class="checkout-item-emoji">🛍️</div>
        <div class="checkout-item-info">
          <p class="checkout-item-name">${item.name}</p>
          <p class="checkout-item-qty">Qty: ${item.quantity}</p>
        </div>
        <span class="checkout-item-price">₦${lineTotal.toLocaleString()}</span>
      </div>
    `;
  }).join('');
  
  const shipping = subtotal >= 10000 ? 0 : 1500;
  const total = subtotal + shipping;
  
  summaryEl.innerHTML = `
    <div class="checkout-summary-box">
      <h3>Order Summary</h3>
      <div class="checkout-items-list">
        ${itemsHTML}
      </div>
      <div class="checkout-summary-divider"></div>
      <div class="checkout-summary-line">
        <span>Subtotal</span>
        <span>₦${subtotal.toLocaleString()}</span>
      </div>
      <div class="checkout-summary-line">
        <span>Shipping</span>
        <span>${shipping === 0 ? '<span class="free-ship">FREE</span>' : '₦' + shipping.toLocaleString()}</span>
      </div>
      <div class="checkout-summary-divider"></div>
      <div class="checkout-summary-line total-line">
        <span>Total</span>
        <span>₦${total.toLocaleString()}</span>
      </div>
      <div class="checkout-trust">
        <span>🔒 Secure Checkout</span>
        <span>🔄 Easy Returns</span>
        <span>✅ Authentic Products</span>
      </div>
    </div>
  `;
}

/* ===========================
   VALIDATE FORM FIELD
=========================== */
function validateField(id, message) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(id + 'Error');
  if (!field) return true;
  
  const value = field.value.trim();
  const isEmpty = value === '';
  
  if (errorEl) {
    errorEl.textContent = isEmpty ? message : '';
  }
  
  if (isEmpty) {
    field.classList.add('input-error');
  } else {
    field.classList.remove('input-error');
  }
  
  return !isEmpty;
}

/* ===========================
   VALIDATE EMAIL FORMAT
=========================== */
function validateEmail(id) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(id + 'Error');
  if (!field) return true;
  
  const value = field.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  
  if (errorEl) {
    errorEl.textContent = !valid ? 'Please enter a valid email address.' : '';
  }
  
  if (!valid) {
    field.classList.add('input-error');
  } else {
    field.classList.remove('input-error');
  }
  
  return valid;
}

/* ===========================
   VALIDATE PHONE
=========================== */
function validatePhone(id) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(id + 'Error');
  if (!field) return true;
  
  const value = field.value.trim().replace(/\s/g, '');
  const valid = /^[0-9]{10,14}$/.test(value);
  
  if (errorEl) {
    errorEl.textContent = !valid ? 'Please enter a valid phone number.' : '';
  }
  
  if (!valid) {
    field.classList.add('input-error');
  } else {
    field.classList.remove('input-error');
  }
  
  return valid;
}

/* ===========================
   PLACE ORDER
=========================== */
function placeOrder() {
  // Validate all fields
  const firstNameOk = validateField('firstName', 'First name is required.');
  const lastNameOk = validateField('lastName', 'Last name is required.');
  const emailOk = validateEmail('email');
  const phoneOk = validatePhone('phone');
  const addressOk = validateField('address', 'Delivery address is required.');
  const cityOk = validateField('city', 'City is required.');
  const stateOk = validateField('state', 'State is required.');
  
  if (!firstNameOk || !lastNameOk || !emailOk || !phoneOk || !addressOk || !cityOk || !stateOk) {
    showToast('Please fill in all required fields.', 'success');
    return;
  }
  
  // Collect order data
  const cart = JSON.parse(localStorage.getItem('shoplite_cart')) || [];
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 10000 ? 0 : 1500;
  const total = subtotal + shipping;
  
  const order = {
    id: 'SL' + Date.now(),
    date: new Date().toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    status: 'Processing',
    items: cart,
    subtotal,
    shipping,
    total,
    customer: {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim(),
    }
  };
  
  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('shoplite_orders')) || [];
  orders.unshift(order);
  localStorage.setItem('shoplite_orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.removeItem('shoplite_cart');
  updateCartCount();
  
  // Show success screen
  showOrderSuccess(order);
}

/* ===========================
   SHOW ORDER SUCCESS
=========================== */
function showOrderSuccess(order) {
  const page = document.getElementById('checkoutPage');
  if (!page) return;
  
  page.innerHTML = `
    <div class="order-success">
      <div class="success-icon">🎉</div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you, ${order.customer.firstName}! Your order has been received and is being processed.</p>
      <div class="success-order-id">
        Order ID: <strong>${order.id}</strong>
      </div>
      <div class="success-summary">
        <div class="success-line">
          <span>Items</span>
          <span>${order.items.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
        <div class="success-line">
          <span>Total Paid</span>
          <span>₦${order.total.toLocaleString()}</span>
        </div>
        <div class="success-line">
          <span>Delivery To</span>
          <span>${order.customer.city}, ${order.customer.state}</span>
        </div>
        <div class="success-line">
          <span>Status</span>
          <span class="status-badge">Processing</span>
        </div>
      </div>
      <div class="success-actions">
        <a href="orders.html" class="btn btn-primary">View My Orders</a>
        <a href="shop.html" class="btn btn-ghost">Continue Shopping</a>
      </div>
    </div>
  `;
}

/* ===========================
   LIVE FIELD VALIDATION
   Clears errors as user types
=========================== */
function attachLiveValidation() {
  const fields = ['firstName', 'lastName', 'address', 'city', 'state'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (el.value.trim() !== '') {
          el.classList.remove('input-error');
          const err = document.getElementById(id + 'Error');
          if (err) err.textContent = '';
        }
      });
    }
  });
  
  const emailEl = document.getElementById('email');
  if (emailEl) {
    emailEl.addEventListener('blur', () => validateEmail('email'));
  }
  
  const phoneEl = document.getElementById('phone');
  if (phoneEl) {
    phoneEl.addEventListener('blur', () => validatePhone('phone'));
  }
}

/* ===========================
   PAYMENT METHOD TOGGLE
=========================== */
function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.classList.remove('active');
  });
  
  const selected = document.getElementById('payment_' + method);
  if (selected) selected.classList.add('active');
  
  const placeBtn = document.getElementById('placeOrderBtn');
  if (placeBtn) {
    placeBtn.textContent = method === 'transfer' ?
      'Confirm Order (Pay on Delivery)' :
      'Place Order';
  }
}

/* ===========================
   INIT
=========================== */
window.addEventListener('load', () => {
  renderCheckoutSummary();
  attachLiveValidation();
});