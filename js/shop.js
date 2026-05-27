/* ===========================
   PRODUCT DATA
=========================== */
const products = [
  {
    id: 1,
    name: 'Classic Oversized Hoodie',
    category: 'clothing',
    price: 8000,
    oldPrice: 12000,
    badge: 'New',
    emoji: '👕',
    description: 'A comfortable oversized hoodie perfect for casual wear. Made from premium cotton blend fabric.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Grey'],
    inStock: true
  },
  {
    id: 2,
    name: 'Wireless Earbuds Pro',
    category: 'gadgets',
    price: 15000,
    oldPrice: 22000,
    badge: 'Sale',
    emoji: '🎧',
    description: 'Premium wireless earbuds with active noise cancellation and 24hr battery life.',
    sizes: [],
    colors: ['Black', 'White'],
    inStock: true
  },
  {
    id: 3,
    name: 'Urban Sneakers',
    category: 'footwear',
    price: 12500,
    oldPrice: null,
    badge: null,
    emoji: '👟',
    description: 'Stylish urban sneakers built for all-day comfort and street style.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['White', 'Black', 'Grey'],
    inStock: true
  },
  {
    id: 4,
    name: 'Leather Crossbody Bag',
    category: 'accessories',
    price: 9500,
    oldPrice: 14000,
    badge: 'Hot',
    emoji: '👜',
    description: 'A sleek leather crossbody bag with multiple compartments. Perfect for everyday use.',
    sizes: [],
    colors: ['Brown', 'Black', 'Tan'],
    inStock: true
  },
  {
    id: 5,
    name: 'Slim Fit Joggers',
    category: 'clothing',
    price: 6500,
    oldPrice: null,
    badge: null,
    emoji: '👖',
    description: 'Modern slim fit joggers with stretch fabric for maximum comfort and style.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Olive'],
    inStock: true
  },
  {
    id: 6,
    name: 'Smart Watch Lite',
    category: 'gadgets',
    price: 25000,
    oldPrice: 35000,
    badge: 'Sale',
    emoji: '⌚',
    description: 'Track your fitness, receive notifications and monitor your health with this sleek smartwatch.',
    sizes: [],
    colors: ['Black', 'Silver', 'Rose Gold'],
    inStock: true
  },
  {
    id: 7,
    name: 'Canvas Tote Bag',
    category: 'accessories',
    price: 4500,
    oldPrice: null,
    badge: null,
    emoji: '🛍️',
    description: 'Durable canvas tote bag great for shopping, beach trips or everyday errands.',
    sizes: [],
    colors: ['Natural', 'Black', 'Navy'],
    inStock: true
  },
  {
    id: 8,
    name: 'Leather Sandals',
    category: 'footwear',
    price: 7800,
    oldPrice: 11000,
    badge: 'Hot',
    emoji: '👡',
    description: 'Handcrafted leather sandals with cushioned sole for all-day comfort.',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Brown', 'Black'],
    inStock: true
  },
  {
    id: 9,
    name: 'Graphic Print Tee',
    category: 'clothing',
    price: 4000,
    oldPrice: null,
    badge: 'New',
    emoji: '👔',
    description: 'Bold graphic print t-shirt made from 100% breathable cotton.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Grey'],
    inStock: true
  },
  {
    id: 10,
    name: 'Portable Power Bank',
    category: 'gadgets',
    price: 11000,
    oldPrice: 16000,
    badge: null,
    emoji: '🔋',
    description: '20,000mAh portable power bank with fast charging support for all devices.',
    sizes: [],
    colors: ['Black', 'White'],
    inStock: true
  },
  {
    id: 11,
    name: 'Bucket Hat',
    category: 'accessories',
    price: 3500,
    oldPrice: null,
    badge: null,
    emoji: '🪣',
    description: 'Trendy bucket hat available in multiple colors. Perfect for outdoor outings.',
    sizes: ['S/M', 'L/XL'],
    colors: ['Black', 'Beige', 'Olive', 'Navy'],
    inStock: true
  },
  {
    id: 12,
    name: 'High Top Boots',
    category: 'footwear',
    price: 18000,
    oldPrice: 24000,
    badge: 'Sale',
    emoji: '🥾',
    description: 'Rugged high top boots built for style and durability in all weather conditions.',
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Brown', 'Black'],
    inStock: true
  }
];

/* ===========================
   STATE
=========================== */
let filteredProducts = [...products];
let activeCategory = 'all';
let activeSortBy = 'default';
let searchQuery = '';

/* ===========================
   RENDER PRODUCTS
=========================== */
function renderProducts(list) {
  const grid = document.getElementById('shopGrid');
  const countEl = document.getElementById('productCount');
  if (!grid) return;

  if (countEl) {
    countEl.textContent = list.length + ' product' + (list.length !== 1 ? 's' : '');
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try a different search or category.</p>
        <button class="btn btn-ghost" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => `
    <div class="product-card fade-up" data-id="${product.id}">
      <div class="product-img">
        <div class="product-img-placeholder">${product.emoji}</div>
        ${product.badge ? `<div class="product-badge ${product.badge === 'Sale' ? 'sale' : ''}">${product.badge}</div>` : ''}
        <div class="product-actions">
          <button class="action-btn wishlist-btn" onclick="toggleWishlist(this)" title="Wishlist">♡</button>
          <a href="product.html?id=${product.id}" class="action-btn view-btn" title="Quick View">👁</a>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${capitalise(product.category)}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price-row">
          <span class="product-price">₦${product.price.toLocaleString()}</span>
          ${product.oldPrice ? `<span class="product-old-price">₦${product.oldPrice.toLocaleString()}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Trigger animations
  setTimeout(() => {
    grid.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 50);
}

/* ===========================
   FILTER BY CATEGORY
=========================== */
function filterByCategory(category) {
  activeCategory = category;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });

  applyFilters();
}

/* ===========================
   SEARCH PRODUCTS
=========================== */
function searchProducts(query) {
  searchQuery = query.toLowerCase().trim();
  applyFilters();
}

/* ===========================
   SORT PRODUCTS
=========================== */
function sortProducts(sortBy) {
  activeSortBy = sortBy;
  applyFilters();
}

/* ===========================
   APPLY ALL FILTERS
=========================== */
function applyFilters() {
  let result = [...products];

  // Filter by category
  if (activeCategory !== 'all') {
    result = result.filter(p => p.category === activeCategory);
  }

  // Filter by search
  if (searchQuery) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  if (activeSortBy === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (activeSortBy === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (activeSortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  filteredProducts = result;
  renderProducts(filteredProducts);
}

/* ===========================
   RESET ALL FILTERS
=========================== */
function resetFilters() {
  activeCategory = 'all';
  activeSortBy = 'default';
  searchQuery = '';

  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'default';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === 'all') btn.classList.add('active');
  });

  renderProducts(products);
}

/* ===========================
   WISHLIST TOGGLE
=========================== */
function toggleWishlist(btn) {
  const isWished = btn.textContent === '♥';
  btn.textContent = isWished ? '♡' : '♥';
  btn.style.color = isWished ? '' : '#ff4747';
  showToast(isWished ? 'Removed from wishlist' : '♥ Added to wishlist', 'success');
}

/* ===========================
   HELPER
=========================== */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ===========================
   READ URL PARAMS
   Auto filter from homepage
   category card clicks
=========================== */
function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  if (category) {
    filterByCategory(category);
  }
}

/* ===========================
   INIT SHOP PAGE
=========================== */
window.addEventListener('load', () => {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchProducts(e.target.value);
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortProducts(e.target.value);
    });
  }

  readURLParams();
  renderProducts(products);
});