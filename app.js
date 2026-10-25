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
PRODUCTS.forEach(p => p.discount = Math.round((p.originalPrice - p.price) / p.originalPrice * 100));
// Application State
let cart = JSON.parse(localStorage.getItem("store_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("store_user") || "null");
let currentCat = "all", searchWord = "", sortOption = "popular";
if (!cart.length) cart = [{ product: PRODUCTS[0], quantity: 1 }, { product: PRODUCTS[1], quantity: 2 }];
// Shared Helpers
const byId = id => document.getElementById(id);
const money = value => `₹${value.toLocaleString("en-IN")}`;
const setText = (id, value) => { if (byId(id)) byId(id).innerText = value; };
function saveCart() {
  localStorage.setItem("store_cart", JSON.stringify(cart));
  setText("cartBadge", cart.reduce((sum, item) => sum + item.quantity, 0));
}
function showNotification(message) {
  const toast = byId("toastNotification");
  if (!toast) return;
  toast.innerText = message; toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}
function updateUserUI() {
  const section = byId("userAccountSection");
  if (section) section.innerHTML = currentUser ? `<span>👤 ${currentUser.name}</span> <button class="btn-logout" onclick="handleLogout()">Logout</button>` : `<a href="login.html" class="btn-login-header">Login</a>`;
}
window.handleLogout = () => { currentUser = null; localStorage.removeItem("store_user"); updateUserUI(); showNotification("Logged out successfully"); };
// Product Display and Navigation
function createProductCard(p) {
  return `<div class="product-card" onclick="goToProductDetails('${p.id}')"><div class="card-image-box"><span class="card-icon">${p.icon}</span><span class="discount-tag">${p.discount}% OFF</span></div><div class="card-body"><span class="card-cat">${p.category}</span><h3 class="card-title">${p.name}</h3><div class="card-rating">★ ${p.rating}</div><div class="card-price"><span class="price-current">${money(p.price)}</span> <span class="price-old">${money(p.originalPrice)}</span></div><button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${p.id}', 1)">Add to Cart</button></div></div>`;
}
window.goToProductDetails = id => { localStorage.setItem("selected_product_id", id); location.href = `product-details.html?id=${id}`; };
window.buyNow = id => { window.addToCart(id); location.href = "cart.html"; };
window.addToCart = (id, qty = 1) => {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const item = cart.find(i => i.product.id === id);
  if (item) item.quantity += qty; else cart.push({ product, quantity: qty });
  saveCart(); showNotification(`Added ${product.name} to cart!`);
};
// Catalogue Search, Filtering, and Sorting
function renderCatalogueGrid() {
  const grid = byId("catalogueGrid");
  if (!grid) return;
  let list = PRODUCTS.filter(p => (!searchWord || p.name.toLowerCase().includes(searchWord.toLowerCase())) && (currentCat === "all" || p.slug === currentCat));
  if (sortOption === "low") list.sort((a, b) => a.price - b.price);
  if (sortOption === "high") list.sort((a, b) => b.price - a.price);
  setText("catalogueCountText", `Showing ${list.length} products`);
  grid.innerHTML = list.length ? list.map(createProductCard).join("") : '<p class="empty-msg">No products found.</p>';
}
window.setCatalogueCategory = cat => { currentCat = cat; renderCatalogueGrid(); };
window.handleSortSelectChange = value => { sortOption = value; renderCatalogueGrid(); };
window.clearSearchFilter = window.resetAllFilters = () => { currentCat = "all"; searchWord = ""; renderCatalogueGrid(); };
window.handleSearchSubmit = e => { e.preventDefault(); const value = byId("searchInput")?.value.trim(); if (value) location.href = `catalogue.html?search=${encodeURIComponent(value)}`; };
window.checkDeliveryPincode = () => { const pin = byId("pincodeInput")?.value || ""; setText("pincodeResultMsg", /^\d{6}$/.test(pin) ? `Delivery available to ${pin}!` : "Enter valid 6-digit PIN code."); };
// Shopping Cart and Checkout
function renderCart() {
  const list = byId("cartItemsList"), empty = byId("cartEmptyState"), layout = byId("cartMainLayout");
  if (!list) return;
  if (!cart.length) { if (empty) empty.style.display = "block"; if (layout) layout.style.display = "none"; return; }
  if (empty) empty.style.display = "none"; if (layout) layout.style.display = "grid";
  list.innerHTML = cart.map(i => `<div class="cart-item-row"><span class="cart-icon">${i.product.icon}</span><div class="cart-info"><h4>${i.product.name}</h4><p>${money(i.product.price * i.quantity)}</p><div class="cart-stepper"><button onclick="updateCartQuantity('${i.product.id}', -1)">-</button><span>${i.quantity}</span><button onclick="updateCartQuantity('${i.product.id}', 1)">+</button><button class="btn-remove" onclick="removeFromCart('${i.product.id}')">Remove</button></div></div></div>`).join("");
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0), mrp = cart.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
  setText("cartSummaryCount", cart.reduce((s, i) => s + i.quantity, 0)); setText("cartSummaryMrp", money(mrp)); setText("cartSummaryDiscount", `-${money(mrp - total)}`); setText("cartSummaryDelivery", "FREE"); setText("cartSummaryFinal", money(total));
}
window.updateCartQuantity = (id, change) => { const item = cart.find(i => i.product.id === id); if (!item) return; item.quantity += change; if (item.quantity <= 0) cart = cart.filter(i => i.product.id !== id); saveCart(); renderCart(); };
window.removeFromCart = id => { cart = cart.filter(i => i.product.id !== id); saveCart(); renderCart(); showNotification("Item removed"); };
window.openCheckoutModal = () => { if (!cart.length) return showNotification("Cart is empty!"); setText("checkoutTotalVal", money(cart.reduce((s, i) => s + i.product.price * i.quantity, 0))); if (byId("checkoutModalOverlay")) byId("checkoutModalOverlay").style.display = "flex"; };
window.closeCheckoutModal = () => { if (byId("checkoutModalOverlay")) byId("checkoutModalOverlay").style.display = "none"; };
window.submitCheckoutOrder = window.handleConfirmOrderSubmit = e => { e.preventDefault(); window.closeCheckoutModal(); const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0); setText("successOrderId", "ORD-" + Math.floor(100000 + Math.random() * 900000)); setText("successOrderTotal", money(total)); cart = []; saveCart(); renderCart(); if (byId("orderSuccessModalOverlay")) byId("orderSuccessModalOverlay").style.display = "flex"; };
window.closeOrderSuccessModal = () => { location.href = "index.html"; };
// Account, Registration, and Contact Forms
window.handleLoginSubmit = e => { e.preventDefault(); const email = byId("loginEmailInput")?.value.trim() || "student@store.in"; currentUser = { name: email.split("@")[0], email }; localStorage.setItem("store_user", JSON.stringify(currentUser)); showNotification("Logged in successfully!"); setTimeout(() => location.href = "index.html", 600); };
window.handleRegisterSubmit = e => { e.preventDefault(); const name = byId("regNameInput")?.value.trim() || "User", email = byId("regEmailInput")?.value.trim() || "user@store.in"; currentUser = { name, email }; localStorage.setItem("store_user", JSON.stringify(currentUser)); showNotification("Account created!"); setTimeout(() => location.href = "index.html", 600); };
window.autoFillDemoLogin = () => { if (byId("loginEmailInput")) byId("loginEmailInput").value = "student@college.edu"; if (byId("loginPasswordInput")) byId("loginPasswordInput").value = "Password123"; };
window.handleContactSubmit = e => { e.preventDefault(); const alert = byId("contactSuccessAlert"); if (alert) { alert.innerText = "Thank you! Message received."; alert.style.display = "block"; } };
// Initialize Page Features
document.addEventListener("DOMContentLoaded", () => {
  saveCart(); updateUserUI();
  if (byId("homeDealsGrid")) byId("homeDealsGrid").innerHTML = PRODUCTS.slice(0, 4).map(createProductCard).join("");
  if (byId("homeElectronicsGrid")) byId("homeElectronicsGrid").innerHTML = PRODUCTS.filter(p => p.slug === "electronics").map(createProductCard).join("");
  if (byId("catalogueGrid")) { const params = new URLSearchParams(location.search); currentCat = params.get("cat") || currentCat; searchWord = params.get("search") || ""; renderCatalogueGrid(); }
  if (byId("productDetailContainer")) {
    const params = new URLSearchParams(location.search), id = params.get("id") || localStorage.getItem("selected_product_id") || "prod-1", p = PRODUCTS.find(item => item.id === id) || PRODUCTS[0];
    byId("productDetailContainer").innerHTML = `<div class="pdp-layout"><div class="pdp-left"><div class="pdp-icon-box">${p.icon}</div><div class="pdp-actions"><button class="btn-pdp-cart" onclick="addToCart('${p.id}', 1)">Add to Cart</button><button class="btn-pdp-buy" onclick="buyNow('${p.id}')">Buy Now</button></div></div><div class="pdp-right"><span class="card-cat">${p.category}</span><h2>${p.name}</h2><p class="pdp-rating">Rating: ★ ${p.rating}</p><div class="pdp-price">${money(p.price)} <span class="price-old">${money(p.originalPrice)}</span> <span class="discount-tag">${p.discount}% OFF</span></div><p class="pdp-desc">${p.desc}</p><div class="pdp-pincode"><input id="pincodeInput" placeholder="Enter PIN" maxlength="6" value="500001" /><button onclick="checkDeliveryPincode()">Check</button><p id="pincodeResultMsg">Delivery available to 500001!</p></div></div></div>`;
  }
  if (byId("cartItemsList")) renderCart();
});