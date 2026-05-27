/* ===========================
   GET PRODUCT BY ID
=========================== */
function getProductById(id) {
  return products.find(p => p.id === parseInt(id)) || null;
}

/* ===========================
   GET URL PARAM
=========================== */
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ===========================
   RENDER PRODUCT PAGE
=========================== */
function renderProduct() {
  const container = document.getElementById('productDetail');
  if (!container) return;
  
  const id = getParam('id');
  const product = getProductById(id);
  
  if (!product) {
    container.innerHTML = `
      <div class="product-not-found">
        <div class="not-found-icon">😕</div>
        <h3>Product not found</h3>
        <p>The product you are looking for does not exist.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
    return;
  }
  
  // Update page title
  document.title = product.name + ' | ShopLite';
  
  const discount = product.oldPrice ?
    Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) :
    null;
  
  const sizesHTML = product.sizes.length > 0 ? `
    <div class="detail-option">
      <label>Size</label>
      <div class="option-btns" id="sizeOptions">
        ${product.sizes.map((s, i) => `
          <button class="option-btn ${i === 0 ? 'active' : ''}"
            onclick="selectOption(this, 'size')">${s}</button>
        `).join('')}
      </div>
    </div>
  ` : '';
  
  const colorsHTML = product.colors.length > 0 ? `
    <div class="detail-option">
      <label>Color</label>
      <div class="option-btns" id="colorOptions">
        ${product.colors.map((c, i) => `
          <button class="option-btn ${i === 0 ? 'active' : ''}"
            onclick="selectOption(this, 'color')">${c}</button>
        `).join('')}
      </div>
    </div>
  ` : '';
  
  container.innerHTML = `
    <div class="product-detail-grid">

      <!-- Image -->
      <div class="detail-img-wrap fade-up">
        <div class="detail-img-main">
          <div class="detail-img-placeholder">${product.emoji}</div>
          ${product.badge ? `<div class="product-badge ${product.badge === 'Sale' ? 'sale' : ''}">${product.badge}</div>` : ''}
          ${discount ? `<div class="discount-tag">-${discount}%</div>` : ''}
        </div>
        <div class="detail-img-thumbs">
          <div class="thumb active">${product.emoji}</div>
          <div class="thumb">${product.emoji}</div>
          <div class="thumb">${product.emoji}</div>
        </div>
      </div>

      <!-- Info -->
      <div class="detail-info fade-up delay-2">
        <p class="detail-category">${capitalise(product.category)}</p>
        <h1 class="detail-name">${product.name}</h1>

        <div class="detail-price-row">
          <span class="detail-price">₦${product.price.toLocaleString()}</span>
          ${product.oldPrice ? `
            <span class="detail-old-price">₦${product.oldPrice.toLocaleString()}</span>
            <span class="detail-discount">Save ${discount}%</span>
          ` : ''}
        </div>

        <p class="detail-desc">${product.description}</p>

        ${sizesHTML}
        ${colorsHTML}

        <div class="detail-qty">
          <label>Quantity</label>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeDetailQty(-1)">−</button>
            <span class="qty-value" id="detailQty">1</span>
            <button class="qty-btn" onclick="changeDetailQty(1)">+</button>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn btn-primary detail-cart-btn"
            onclick="addToCartFromDetail(${product.id}, '${product.name}', ${product.price})">
            Add to Cart
          </button>
          <button class="btn btn-ghost detail-wish-btn" onclick="toggleDetailWishlist(this)">
            ♡ Wishlist
          </button>
        </div>

        <div class="detail-meta">
          <div class="meta-item">
            <span>🚚</span>
            <span>${product.price >= 10000 ? 'Free delivery on this item' : 'Free delivery on orders over ₦10,000'}</span>
          </div>
          <div class="meta-item">
            <span>🔄</span>
            <span>Free returns within 7 days</span>
          </div>
          <div class="meta-item">
            <span>✅</span>
            <span>100% authentic product</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="related-section">
      <div class="section-label">You Might Also Like</div>
      <h2 class="section-title">Related Products</h2>
      <div class="products-grid" id="relatedGrid"></div>
    </div>
  `;
  
  renderRelated(product);
  
  // Trigger animations
  setTimeout(() => {
    container.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 50);
}

/* ===========================
   RENDER RELATED PRODUCTS
=========================== */
function renderRelated(product) {
  const grid = document.getElementById('relatedGrid');
  if (!grid) return;
  
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  if (related.length === 0) {
    grid.parentElement.style.display = 'none';
    return;
  }
  
  grid.innerHTML = related.map(p => `
    <div class="product-card">
      <div class="product-img">
        <div class="product-img-placeholder">${p.emoji}</div>
        ${p.badge ? `<div class="product-badge ${p.badge === 'Sale' ? 'sale' : ''}">${p.badge}</div>` : ''}
        <div class="product-actions">
          <button class="action-btn wishlist-btn" onclick="toggleWishlist(this)" title="Wishlist">♡</button>
          <a href="product.html?id=${p.id}" class="action-btn view-btn" title="View">👁</a>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${capitalise(p.category)}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price-row">
          <span class="product-price">₦${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="product-old-price">₦${p.oldPrice.toLocaleString()}</span>` : ''}
        </div>
        <button class="add-to-cart-btn"
          onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

/* ===========================
   SELECT SIZE OR COLOR
=========================== */
function selectOption(btn, type) {
  const parent = btn.closest('.option-btns');
  parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ===========================
   CHANGE QUANTITY
=========================== */
let detailQty = 1;

function changeDetailQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  const el = document.getElementById('detailQty');
  if (el) el.textContent = detailQty;
}

/* ===========================
   ADD TO CART FROM DETAIL
=========================== */
function addToCartFromDetail(id, name, price) {
  let cart = JSON.parse(localStorage.getItem('shoplite_cart')) || [];
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.quantity += detailQty;
  } else {
    cart.push({ id, name, price, quantity: detailQty });
  }
  
  localStorage.setItem('shoplite_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ ' + name + ' added to cart', 'added');
  
  const btn = document.querySelector('.detail-cart-btn');
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.style.background = 'var(--accent-green)';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.style.background = '';
    }, 2000);
  }
}

/* ===========================
   WISHLIST TOGGLE
=========================== */
function toggleDetailWishlist(btn) {
  const isWished = btn.textContent.includes('♥');
  btn.textContent = isWished ? '♡ Wishlist' : '♥ Wishlisted';
  btn.style.color = isWished ? '' : '#ff4747';
  btn.style.borderColor = isWished ? '' : '#ff4747';
  showToast(isWished ? 'Removed from wishlist' : '♥ Added to wishlist', 'success');
}

/* ===========================
   CAPITALISE HELPER
   (only if shop.js not loaded)
=========================== */
if (typeof capitalise === 'undefined') {
  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/* ===========================
   INIT
=========================== */
window.addEventListener('load', () => {
  renderProduct();
});