/**
 * EasyShop - Main JavaScript (Vanilla JS)
 * Zero frameworks, zero dependencies, 100% GitHub Pages Compatible
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initVideoPlayers();
  initFaqAccordion();
  initVariantSelectors();
  initCart();
  initCheckoutForm();
});

/* ==========================================================================
   1. REUSABLE CLICK-TO-LOAD VIDEO COMPONENT
   Critical Performance Requirement: Zero MP4 preloading or downloading before click
   ========================================================================== */
function initVideoPlayers() {
  const containers = document.querySelectorAll('.video-container');

  containers.forEach(container => {
    container.addEventListener('click', function handleVideoPlay(e) {
      const videoSrc = this.getAttribute('data-video-src');
      if (!videoSrc) return;

      // Prevent duplicate video creation
      if (this.querySelector('video')) return;

      // Remove thumbnail & play overlay
      this.innerHTML = '';

      // Create video element with required attributes
      const video = document.createElement('video');
      video.setAttribute('controls', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('preload', 'none');
      video.className = 'video-player';

      const source = document.createElement('source');
      source.src = videoSrc;
      source.type = 'video/mp4';

      video.appendChild(source);
      this.appendChild(video);

      // Start playback
      video.play().catch(err => {
        console.log('Autoplay blocked or playback error:', err);
      });

      // Track interaction if Meta Pixel is loaded
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'WatchProductVideo', { video_src: videoSrc });
      }
    });
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // Close when clicking a nav link
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   4. PRODUCT VARIANTS & CONFIGURATION
   ========================================================================== */
const PRODUCTS = {
  'standard': {
    id: 'jump-starter-standard',
    name: 'Car Jump Starter (Standard)',
    variant: 'Standard',
    price: 59900,
    priceFormatted: '₦59,900',
    originalPrice: 69900,
    originalPriceFormatted: '₦69,900',
    image: 'https://res.cloudinary.com/dmy2yiax9/image/upload/f_auto,q_auto,w_800/v1787000239/5771575669845332195_duiuzr.jpg'
  },
  'premium': {
    id: 'jump-starter-premium',
    name: 'Car Jump Starter (Premium)',
    variant: 'Premium',
    price: 69900,
    priceFormatted: '₦69,900',
    originalPrice: 85000,
    originalPriceFormatted: '₦85,000',
    image: 'https://res.cloudinary.com/dmy2yiax9/image/upload/f_auto,q_auto,w_800/v1787000239/5771575669845332193_u8om14.jpg'
  }
};

let currentVariantKey = 'standard';
let currentQuantity = 1;

function initVariantSelectors() {
  const variantCards = document.querySelectorAll('.variant-card');
  const mainGalleryImg = document.getElementById('mainGalleryImg');
  const priceDisplay = document.getElementById('productPriceDisplay');
  const origPriceDisplay = document.getElementById('productOrigPriceDisplay');
  const thumbButtons = document.querySelectorAll('.thumb-btn');

  variantCards.forEach(card => {
    card.addEventListener('click', function () {
      const selectedVariant = this.getAttribute('data-variant');
      if (!PRODUCTS[selectedVariant]) return;

      currentVariantKey = selectedVariant;

      // Update UI active state
      variantCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');

      const product = PRODUCTS[selectedVariant];

      // Update price text if present
      if (priceDisplay) priceDisplay.textContent = product.priceFormatted;
      if (origPriceDisplay) origPriceDisplay.textContent = product.originalPriceFormatted;

      // Update main gallery image
      if (mainGalleryImg) {
        mainGalleryImg.src = product.image;
      }

      // Sync form if on page
      updateCheckoutSummary();
    });
  });

  // Gallery Thumbnail Clicks
  thumbButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const imgSrc = this.getAttribute('data-img-src');
      if (mainGalleryImg && imgSrc) {
        mainGalleryImg.src = imgSrc;
        thumbButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Quantity adjustments
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');

  if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyValue.textContent = currentQuantity;
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (currentQuantity < 10) {
        currentQuantity++;
        qtyValue.textContent = currentQuantity;
      }
    });
  }
}

/* ==========================================================================
   5. LIGHTWEIGHT LOCALSTORAGE CART
   ========================================================================== */
const CART_STORAGE_KEY = 'easyshop_cart_items';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
  updateCartUI();
  updateCheckoutSummary();
}

function addToCart(variantKey, quantity = 1) {
  const product = PRODUCTS[variantKey] || PRODUCTS['standard'];
  const cart = getCart();

  const existingIndex = cart.findIndex(item => item.variant === product.variant);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      variant: product.variant,
      price: product.price,
      priceFormatted: product.priceFormatted,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Added ${product.variant} Car Jump Starter to cart!`);

  // Meta Pixel AddToCart event
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: product.name,
      content_category: 'Automotive Accessories',
      value: product.price * quantity,
      currency: 'NGN'
    });
  }

  openCartDrawer();
}

function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
  }
}

function updateCartUI() {
  const cart = getCart();
  const cartCountElements = document.querySelectorAll('.cart-count');
  const cartBody = document.getElementById('cartBody');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach(el => el.textContent = totalItems);

  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-message">
        <p>Your cart is empty.</p>
        <a href="jump-starter.html" class="btn btn-outline btn-sm" style="margin-top: 1rem;">View Product</a>
      </div>
    `;
    if (cartSubtotal) cartSubtotal.textContent = '₦0';
    if (cartTotal) cartTotal.textContent = '₦0';
    return;
  }

  let totalAmount = 0;
  let html = '';

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    html += `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-variant">Edition: ${item.variant} &bull; Qty: ${item.quantity}</span>
          </div>
          <div class="cart-item-row">
            <span class="cart-item-price">₦${(itemTotal).toLocaleString()}</span>
            <button class="cart-item-remove" onclick="window.EasyShop.removeFromCart(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartBody.innerHTML = html;
  const formattedTotal = '₦' + totalAmount.toLocaleString();
  if (cartSubtotal) cartSubtotal.textContent = formattedTotal;
  if (cartTotal) cartTotal.textContent = formattedTotal;
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function initCart() {
  // Cart Drawer open/close buttons
  const openCartBtns = document.querySelectorAll('.cart-button, .btn-open-cart');
  const closeCartBtn = document.getElementById('cartCloseBtn');
  const overlay = document.getElementById('cartOverlay');

  openCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  // Add to cart buttons
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      addToCart(currentVariantKey, currentQuantity);
    });
  }

  // Instant Buy Now
  const buyNowBtn = document.getElementById('buyNowBtn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      addToCart(currentVariantKey, currentQuantity);
      const checkoutSec = document.getElementById('checkoutSection');
      if (checkoutSec) {
        closeCartDrawer();
        checkoutSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'jump-starter.html#checkoutSection';
      }
    });
  }

  updateCartUI();
}

/* ==========================================================================
   6. CHECKOUT FORM & NIGERIAN ORDER PROCESSING
   Includes explicit extension points for Paystack, Flutterwave & WhatsApp
   ========================================================================== */
function updateCheckoutSummary() {
  const summaryVariant = document.getElementById('summaryVariant');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryTotal = document.getElementById('summaryTotal');

  const cart = getCart();
  if (cart.length > 0) {
    // If items in cart, summarize entire cart
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemNames = cart.map(i => `${i.variant} (x${i.quantity})`).join(', ');

    if (summaryVariant) summaryVariant.textContent = itemNames;
    if (summaryPrice) summaryPrice.textContent = '₦' + totalAmount.toLocaleString();
    if (summaryTotal) summaryTotal.textContent = '₦' + totalAmount.toLocaleString();
  } else {
    // Default to active selected variant
    const product = PRODUCTS[currentVariantKey] || PRODUCTS['standard'];
    if (summaryVariant) summaryVariant.textContent = product.variant;
    if (summaryPrice) summaryPrice.textContent = product.priceFormatted;
    if (summaryTotal) summaryTotal.textContent = product.priceFormatted;
  }
}

function initCheckoutForm() {
  const orderForm = document.getElementById('orderForm');
  if (!orderForm) return;

  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const state = document.getElementById('state')?.value;
    const city = document.getElementById('city')?.value.trim();
    const address = document.getElementById('address')?.value.trim();

    if (!fullName || !phone || !state || !address) {
      alert('Please fill in all required fields (Full Name, Phone Number, State, and Address).');
      return;
    }

    const cart = getCart();
    const activeProduct = PRODUCTS[currentVariantKey] || PRODUCTS['standard'];
    const orderItems = cart.length > 0 ? cart : [{
      name: activeProduct.name,
      variant: activeProduct.variant,
      price: activeProduct.price,
      quantity: 1
    }];

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
      customer: { fullName, phone, email, state, city, address },
      items: orderItems,
      total: totalAmount,
      currency: 'NGN',
      paymentMethod: 'Cash on Delivery / Transfer on Delivery',
      createdAt: new Date().toISOString()
    };

    console.log('Order submitted successfully:', orderData);

    // Track Meta Pixel Lead & Purchase
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'Car Jump Starter Order' });
      window.fbq('track', 'Purchase', {
        value: totalAmount,
        currency: 'NGN',
        content_type: 'product'
      });
    }

    /* --------------------------------------------------------------------------
       FUTURE INTEGRATION HOOKS:
       
       1. PAYSTACK INTEGRATION:
          const handler = PaystackPop.setup({
            key: 'pk_live_YOUR_PAYSTACK_PUBLIC_KEY',
            email: email || 'customer@easyshop.ng',
            amount: totalAmount * 100, // in kobo
            currency: 'NGN',
            callback: function(response) {
              // Handle Paystack verified reference: response.reference
            }
          });
          handler.openIframe();
       
       2. FLUTTERWAVE INTEGRATION:
          FlutterwaveCheckout({
            public_key: 'FLWPUBK_YOUR_KEY',
            tx_ref: 'ES_' + Date.now(),
            amount: totalAmount,
            currency: 'NGN',
            customer: { email, phone_number: phone, name: fullName }
          });
       
       3. DIRECT WHATSAPP ORDER DISPATCH (Default fallback for Nigerian customers):
       -------------------------------------------------------------------------- */
    const whatsappText = encodeURIComponent(
      `Hello EasyShop, I want to place an order for the Car Jump Starter.\n\n` +
      `📦 Item: ${orderItems.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ')}\n` +
      `💰 Total: ₦${totalAmount.toLocaleString()}\n` +
      `👤 Name: ${fullName}\n` +
      `📞 Phone: ${phone}\n` +
      `📍 Delivery Address: ${address}, ${city || ''} ${state}\n` +
      `💳 Payment: Payment on Delivery`
    );

    // Show instant success UI
    orderForm.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <div style="width: 60px; height: 60px; background-color: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h3 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Order Received!</h3>
        <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
          Thank you, <strong>${fullName}</strong>. Our customer representative will call or WhatsApp you on <strong>${phone}</strong> shortly to confirm your delivery to <strong>${state}</strong>.
        </p>
        <a href="https://wa.me/2348000000000?text=${whatsappText}" target="_blank" rel="noopener" class="btn btn-primary btn-lg" style="margin-bottom: 1rem;">
          Confirm Instantly on WhatsApp
        </a>
        <div>
          <a href="index.html" class="btn btn-outline btn-sm">Back to Home</a>
        </div>
      </div>
    `;

    // Clear cart after order
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartUI();
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Global namespace for inline HTML event hooks
window.EasyShop = {
  addToCart,
  removeFromCart,
  openCartDrawer,
  closeCartDrawer
};
