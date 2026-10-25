// Friendly and simple JavaScript for E-Commerce Product Store
const PRODUCTS = [
  { id: "prod-1", name: "NeoPro 5G Smartphone", category: "Electronics", slug: "electronics", price: 18999, originalPrice: 24999, rating: 4.5, icon: "📱", desc: "6.7-inch AMOLED 120Hz display with 5000mAh battery." },
  { id: "prod-2", name: "AeroTune ANC Earbuds", category: "Electronics", slug: "electronics", price: 2499, originalPrice: 4999, rating: 4.3, icon: "🎧", desc: "Active noise cancellation with 40 hours total playtime." },
  { id: "prod-3", name: "Velocity Running Shoes", category: "Fashion", slug: "fashion", price: 1599, originalPrice: 3499, rating: 4.2, icon: "👟", desc: "Lightweight breathable sports sneakers for daily running." },
  { id: "prod-4", name: "Oxford Cotton Shirt", category: "Fashion", slug: "fashion", price: 899, originalPrice: 1999, rating: 4.1, icon: "👔", desc: "100% combed cotton comfortable regular fit shirt." },
  { id: "prod-5", name: "Stainless Steel Flask 1000ml", category: "Home", slug: "home", price: 649, originalPrice: 1299, rating: 4.4, icon: "🍶", desc: "Double wall vacuum insulated hot and cold water flask." },
  { id: "prod-6", name: "MasterGrind Mixer 750W", category: "Appliances", slug: "appliances", price: 2999, originalPrice: 5499, rating: 4.6, icon: "🍳", desc: "Heavy duty copper motor with 3 stainless steel jars." },
  { id: "prod-7", name: "Web Programming Handbook", category: "Books", slug: "books", price: 599, originalPrice: 999, rating: 4.8, icon: "📚", desc: "Complete guide for HTML, CSS, JavaScript, and Node.js." },
  { id: "prod-8", name: "UltraTab Pro 11 Tablet", category: "Electronics", slug: "electronics", price: 28999, originalPrice: 34999, rating: 4.7, icon: "💻", desc: "11-inch 2K high-resolution display with quad speakers." }
];
PRODUCTS.forEach(p => p.discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100));
// Shopping cart and user state saved in browser localStorage
let cart = JSON.parse(localStorage.getItem("store_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("store_user") || "null");
if (cart.length === 0) cart = [{ product: PRODUCTS[0], quantity: 1 }, { product: PRODUCTS[1], quantity: 2 }];
function saveCart() {
  localStorage.setItem("store_cart", JSON.stringify(cart));
  const badge = document.getElementById("cartBadge"); if (badge) badge.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}
function updateUserUI() {
  const box = document.getElementById("userAccountSection"); if (box) box.innerHTML = currentUser ? `<span>👤 ${currentUser.name}</span> <button class="btn-logout" onclick="handleLogout()">Logout</button>` : `<a href="login.html" class="btn-login-header">Login</a>`;
}
window.handleLogout = function() { currentUser = null; localStorage.removeItem("store_user"); updateUserUI(); showNotification("Logged out successfully"); };
// Create HTML for a single product card
function createProductCard(p) {
  return `<div class="product-card" onclick="goToProductDetails('${p.id}')">` +
    `<div class="card-image-box"><span class="card-icon">${p.icon}</span><span class="discount-tag">${p.discount}% OFF</span></div>` +
    `<div class="card-body"><span class="card-cat">${p.category}</span><h3 class="card-title">${p.name}</h3><div class="card-rating">★ ${p.rating}</div>` +
    `<div class="card-price"><span class="price-current">₹${p.price.toLocaleString("en-IN")}</span> <span class="price-old">₹${p.originalPrice.toLocaleString("en-IN")}</span></div>` +
    `<button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${p.id}', 1)">Add to Cart</button></div></div>`;
}
window.goToProductDetails = id => { localStorage.setItem("selected_product_id", id); window.location.href = `product-details.html?id=${id}`; };
window.addToCart = (id, qty = 1) => {
  const product = PRODUCTS.find(p => p.id === id); if (!product) return;
  const existing = cart.find(i => i.product.id === id);
  if (existing) existing.quantity += qty; else cart.push({ product, quantity: qty });
  saveCart(); showNotification(`Added ${product.name} to cart!`);
};
window.buyNow = id => { window.addToCart(id, 1); window.location.href = "cart.html"; };
// Home Page: render deals and electronics
function initHomePage() {
  const deals = document.getElementById("homeDealsGrid"), elec = document.getElementById("homeElectronicsGrid");
  if (deals) deals.innerHTML = PRODUCTS.slice(0, 4).map(createProductCard).join("");
  if (elec) elec.innerHTML = PRODUCTS.filter(p => p.slug === "electronics").map(createProductCard).join("");
}
// Catalogue Page: search, category filtering, and sorting
let currentCat = "all", searchWord = "", sortOption = "popular";
function initCataloguePage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("cat")) currentCat = params.get("cat"); if (params.get("search")) searchWord = params.get("search");
  renderCatalogueGrid();
}
function renderCatalogueGrid() {
  const grid = document.getElementById("catalogueGrid"); if (!grid) return;
  let list = PRODUCTS.filter(p => (!searchWord || p.name.toLowerCase().includes(searchWord.toLowerCase())) && (currentCat === "all" || p.slug === currentCat));
  if (sortOption === "low") list.sort((a, b) => a.price - b.price); if (sortOption === "high") list.sort((a, b) => b.price - a.price);
  const countEl = document.getElementById("catalogueCountText"); if (countEl) countEl.innerText = `Showing ${list.length} products`;
  grid.innerHTML = list.length ? list.map(createProductCard).join("") : "<p class=\"empty-msg\">No products found.</p>";
}
window.setCatalogueCategory = cat => { currentCat = cat; renderCatalogueGrid(); };
window.handleSortSelectChange = val => { sortOption = val; renderCatalogueGrid(); };
window.clearSearchFilter = window.resetAllFilters = () => { currentCat = "all"; searchWord = ""; renderCatalogueGrid(); };
window.handleSearchSubmit = e => {
  e.preventDefault(); const inp = document.getElementById("searchInput");
  if (inp && inp.value.trim()) window.location.href = `catalogue.html?search=${encodeURIComponent(inp.value.trim())}`;
};
// Product Details Page
function initProductDetailsPage() {
  const box = document.getElementById("productDetailContainer"); if (!box) return;
  const id = new URLSearchParams(window.location.search).get("id") || localStorage.getItem("selected_product_id") || "prod-1";
  const prod = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  box.innerHTML = `<div class="pdp-layout"><div class="pdp-left"><div class="pdp-icon-box">${prod.icon}</div><div class="pdp-actions"><button class="btn-pdp-cart" onclick="addToCart('${prod.id}', 1)">Add to Cart</button><button class="btn-pdp-buy" onclick="buyNow('${prod.id}')">Buy Now</button></div></div><div class="pdp-right"><span class="card-cat">${prod.category}</span><h2>${prod.name}</h2><p class="pdp-rating">Rating: ★ ${prod.rating}</p><div class="pdp-price">₹${prod.price.toLocaleString("en-IN")} <span class="price-old">₹${prod.originalPrice.toLocaleString("en-IN")}</span> <span class="discount-tag">${prod.discount}% OFF</span></div><p class="pdp-desc">${prod.desc}</p><div class="pdp-pincode"><input id="pincodeInput" placeholder="Enter PIN" maxlength="6" value="500001" /><button onclick="checkDeliveryPincode()">Check</button><p id="pincodeResultMsg">Delivery available to 500001!</p></div></div></div>`;
}
window.checkDeliveryPincode = () => {
  const pin = document.getElementById("pincodeInput")?.value || "", msg = document.getElementById("pincodeResultMsg");
  if (msg) msg.innerText = /^\d{6}$/.test(pin) ? `Delivery available to ${pin}!` : "Enter valid 6-digit PIN code.";
};
// Shopping Cart Page
function renderCart() {
  const list = document.getElementById("cartItemsList"), empty = document.getElementById("cartEmptyState"), layout = document.getElementById("cartMainLayout");
  if (!list) return;
  if (cart.length === 0) { if (empty) empty.style.display = "block"; if (layout) layout.style.display = "none"; return; }
  if (empty) empty.style.display = "none"; if (layout) layout.style.display = "grid";
  list.innerHTML = cart.map(item => `<div class="cart-item-row"><span class="cart-icon">${item.product.icon}</span><div class="cart-info"><h4>${item.product.name}</h4><p>₹${(item.product.price * item.quantity).toLocaleString("en-IN")}</p><div class="cart-stepper"><button onclick="updateCartQuantity('${item.product.id}', -1)">-</button><span>${item.quantity}</span><button onclick="updateCartQuantity('${item.product.id}', 1)">+</button><button class="btn-remove" onclick="removeFromCart('${item.product.id}')">Remove</button></div></div></div>`).join("");
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0), count = cart.reduce((s, i) => s + i.quantity, 0), mrp = cart.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
  const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };
  setTxt("cartSummaryCount", count); setTxt("cartSummaryMrp", `₹${mrp.toLocaleString("en-IN")}`);
  setTxt("cartSummaryDiscount", `-₹${(mrp - total).toLocaleString("en-IN")}`); setTxt("cartSummaryDelivery", "FREE"); setTxt("cartSummaryFinal", `₹${total.toLocaleString("en-IN")}`);
}
window.updateCartQuantity = (id, delta) => { const item = cart.find(i => i.product.id === id); if (!item) return; item.quantity += delta; if (item.quantity <= 0) cart = cart.filter(i => i.product.id !== id); saveCart(); renderCart(); };
window.removeFromCart = id => { cart = cart.filter(i => i.product.id !== id); saveCart(); renderCart(); showNotification("Item removed"); };
// Checkout & Orders
window.openCheckoutModal = () => {
  if (cart.length === 0) return showNotification("Cart is empty!");
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0), totalEl = document.getElementById("checkoutTotalVal"), modal = document.getElementById("checkoutModalOverlay");
  if (totalEl) totalEl.innerText = `₹${total.toLocaleString("en-IN")}`; if (modal) modal.style.display = "flex";
};
window.closeCheckoutModal = () => { const m = document.getElementById("checkoutModalOverlay"); if (m) m.style.display = "none"; };
window.submitCheckoutOrder = window.handleConfirmOrderSubmit = e => {
  e.preventDefault(); window.closeCheckoutModal();
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000), total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const elId = document.getElementById("successOrderId"); if (elId) elId.innerText = orderId;
  const elTot = document.getElementById("successOrderTotal"); if (elTot) elTot.innerText = `₹${total.toLocaleString("en-IN")}`;
  cart = []; saveCart(); renderCart();
  const successModal = document.getElementById("orderSuccessModalOverlay"); if (successModal) successModal.style.display = "flex";
};
window.closeOrderSuccessModal = () => { window.location.href = "index.html"; };
// User Login and Contact
window.handleLoginSubmit = e => {
  e.preventDefault(); const email = document.getElementById("loginEmailInput").value.trim();
  currentUser = { name: email.split("@")[0] || "Student", email }; localStorage.setItem("store_user", JSON.stringify(currentUser));
  showNotification("Logged in successfully!"); setTimeout(() => window.location.href = "index.html", 800);
};
window.handleRegisterSubmit = e => {
  e.preventDefault(); const name = document.getElementById("regNameInput").value.trim(), email = document.getElementById("regEmailInput").value.trim();
  currentUser = { name, email }; localStorage.setItem("store_user", JSON.stringify(currentUser));
  showNotification("Account created successfully!"); setTimeout(() => window.location.href = "index.html", 800);
};
window.autoFillDemoLogin = () => { const e = document.getElementById("loginEmailInput"), p = document.getElementById("loginPasswordInput"); if (e) e.value = "student@college.edu"; if (p) p.value = "Password123"; };
window.handleContactSubmit = e => { e.preventDefault(); const alert = document.getElementById("contactSuccessAlert"); if (alert) { alert.innerText = "Thank you! Message received."; alert.style.display = "block"; } };
window.showNotification = msg => { const toast = document.getElementById("toastNotification"); if (!toast) return; toast.innerText = msg; toast.style.display = "block"; setTimeout(() => { toast.style.display = "none"; }, 2200); };
// App initialization on DOM load
document.addEventListener("DOMContentLoaded", () => {
  saveCart(); updateUserUI();
  if (document.getElementById("homeDealsGrid")) initHomePage();
  if (document.getElementById("catalogueGrid")) initCataloguePage();
  if (document.getElementById("productDetailContainer")) initProductDetailsPage();
  if (document.getElementById("cartItemsList")) renderCart();
});
