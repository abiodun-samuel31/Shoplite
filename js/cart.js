/* ===========================
   GET CART FROM STORAGE
=========================== */
function getCart() {
  return JSON.parse(localStorage.getItem('shoplite_cart')) || [];
}

/* ===========================
   SAVE CART TO STORAGE
=========================== */
function saveCart(cart) {
  localStorage.setItem('shoplite_cart', JSON.stringify(cart));
  updateCartCount();
}

/* ===========================
   RENDER CART PAGE
   Only runs on cart.html
=========================== */
function renderCart() {
  const cartContainer = document.getElementById('cartItems');
  const summaryContainer = document.getElementById('cartSummary');
  if (!cartContainer) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    if (summaryContainer) summaryContainer.style.display = 'none';
    return;
  }
  
  let subtotal = 0;
  
  const itemsHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <div class="cart-item-placeholder">🛍️</div>
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <div class="cart-item-total">
          ₦${lineTotal.toLocaleString()}
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
      </div>
    `;
  }).join('');
  
  cartContainer.innerHTML = itemsHTML;
  
  const shipping = subtotal >= 10000 ? 0 : 1500;
  const total = subtotal + shipping;
  
  if (summaryContainer) {
    summaryContainer.style.display = 'block';
    summaryContainer.innerHTML = `
      <div class="summary-box">
        <h3>Order Summary</h3>
        <div class="summary-line">
          <span>Subtotal</span>
          <span>₦${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-line">
          <span>Shipping</span>
          <span>${shipping === 0 ? '<span class="free-ship">FREE</span>' : '₦' + shipping.toLocaleString()}</span>
        </div>
        ${shipping > 0 ? `<p class="shipping-note">Add ₦${(10000 - subtotal).toLocaleString()} more for free shipping</p>` : '<p class="shipping-note free">🎉 You qualify for free shipping!</p>'}
        <div class="summary-divider"></div>
        <div class="summary-line total-line">
          <span>Total</span>
          <span>₦${total.toLocaleString()}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary full-width">
          Proceed to Checkout
        </a>
        <a href="shop.html" class="btn btn-ghost full-width" style="margin-top:10px;">
          Continue Shopping
        </a>
        <div class="summary-trust">
          <span>🔒 Secure Checkout</span>
          <span>🔄 Easy Returns</span>
        </div>
      </div>
    `;
  }
}

/* ===========================
   CHANGE QUANTITY
=========================== */
function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
    showToast('Item removed from cart', 'success');
  }
  
  saveCart(cart);
  renderCart();
}

/* ===========================
   REMOVE FROM CART
=========================== */
function removeFromCart(id) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) showToast(item.name + ' removed', 'success');
  
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

/* ===========================
   CLEAR ENTIRE CART
=========================== */
function clearCart() {
  localStorage.removeItem('shoplite_cart');
  updateCartCount();
  renderCart();
}

/* ===========================
   GET CART TOTAL
=========================== */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/* ===========================
   INIT CART PAGE
=========================== */
window.addEventListener('load', () => {
  renderCart();
});