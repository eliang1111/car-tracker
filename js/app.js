/**
 * CAR TRACKER - SHARED APP UTILITIES & LINE LIFF CONFIG
 */

// 1. CAR CONFIGURATION
const CARS = [
  { id: 1, name: 'Nissan Almera', year: 2020, color: 'ส้ม', plate: '9กข 70' },
  { id: 2, name: 'Honda Jazz', year: 2014, color: 'เหลือง', plate: '3กส 7666' }
];

// 2. LIFF APP IDs (Replace these with your actual LIFF IDs once created in LINE Developer Console)
const LIFF_IDS = {
  fuel: 'YOUR_LIFF_ID_FOR_FUEL',             // e.g. 2001234567-aBcDeFgH
  maintenance: 'YOUR_LIFF_ID_FOR_MAINTENANCE', 
  history: 'YOUR_LIFF_ID_FOR_HISTORY'
};

// 3. GLOBAL STATE
let activeCar = null;
let currentUser = {
  displayName: 'ผู้ใช้งาน',
  pictureUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
};

/**
 * Initialize App Core
 * @param {string} pageType - 'fuel', 'maintenance', or 'history'
 * @param {function} onReadyCallback - Called when LIFF and car toggle are ready
 */
async function initApp(pageType, onReadyCallback) {
  // Set up theme class on body
  document.body.classList.add(`theme-${pageType}`);
  
  // Set up Loading State handlers
  setupLoadingElements();
  
  // Initialize Active Car
  initActiveCar();
  
  // Render Car Toggle Switch in Header
  renderCarToggle(onReadyCallback);
  
  // Initialize LINE LIFF
  try {
    const liffId = LIFF_IDS[pageType] || '';
    if (liffId && liffId !== 'YOUR_LIFF_ID_FOR_FUEL' && liffId !== 'YOUR_LIFF_ID_FOR_MAINTENANCE' && liffId !== 'YOUR_LIFF_ID_FOR_HISTORY') {
      await liff.init({ liffId: liffId });
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        currentUser = {
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl || currentUser.pictureUrl
        };
      } else {
        // In local development or outside LINE, LIFF may not login automatically
        console.log('LIFF initialized but user is not logged in.');
      }
    } else {
      console.warn('Running in Mock/Development mode: LIFF ID not configured.');
    }
  } catch (error) {
    console.error('LIFF Initialization failed:', error);
  }
  
  // Render User Profile Badge in header if element exists
  renderUserBadge();
  
  // Call page specific initialization
  if (typeof onReadyCallback === 'function') {
    onReadyCallback();
  }
}

/**
 * Handle Active Car State (load from localStorage)
 */
function initActiveCar() {
  const savedCarId = localStorage.getItem('car_tracker_active_car');
  if (savedCarId) {
    activeCar = CARS.find(car => car.id === Number(savedCarId)) || CARS[0];
  } else {
    activeCar = CARS[0];
    localStorage.setItem('car_tracker_active_car', activeCar.id);
  }
}

/**
 * Render Car Toggle Switch in Header
 */
function renderCarToggle(onReadyCallback) {
  const container = document.querySelector('.car-toggle-container');
  if (!container) return;
  
  container.innerHTML = CARS.map(car => `
    <button type="button" class="car-toggle-btn car-id-${car.id} ${activeCar.id === car.id ? 'active' : ''}" data-car-id="${car.id}">
      <span class="name">${car.name}</span>
      <span class="plate">${car.plate}</span>
    </button>
  `).join('');
  
  // Add Event Listeners
  container.querySelectorAll('.car-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const carId = Number(this.getAttribute('data-car-id'));
      if (activeCar.id === carId) return;
      
      // Update UI active state
      container.querySelectorAll('.car-toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update State & LocalStorage
      activeCar = CARS.find(car => car.id === carId);
      localStorage.setItem('car_tracker_active_car', activeCar.id);
      
      // Trigger callback if defined (e.g. reload charts/lists on active car change)
      if (typeof onReadyCallback === 'function') {
        onReadyCallback();
      }
    });
  });
}

/**
 * Render User Profile Badge
 */
function renderUserBadge() {
  const container = document.querySelector('.user-badge');
  if (!container) return;
  
  container.innerHTML = `
    <img src="${currentUser.pictureUrl}" alt="${currentUser.displayName}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
    <span>${currentUser.displayName}</span>
  `;
}

// ==========================================
// LOADING STATE HANDLERS
// ==========================================
function setupLoadingElements() {
  if (document.querySelector('.loading-overlay')) return;
  
  const loader = document.createElement('div');
  loader.className = 'loading-overlay';
  loader.innerHTML = `
    <div class="spinner"></div>
    <div class="loading-text">กำลังโหลดข้อมูล...</div>
  `;
  document.body.appendChild(loader);
}

function showLoading(text) {
  const loader = document.querySelector('.loading-overlay');
  if (loader) {
    if (text) {
      loader.querySelector('.loading-text').textContent = text;
    } else {
      loader.querySelector('.loading-text').textContent = 'กำลังโหลดข้อมูล...';
    }
    loader.classList.add('active');
  }
}

function hideLoading() {
  const loader = document.querySelector('.loading-overlay');
  if (loader) {
    loader.classList.remove('active');
  }
}

// ==========================================
// HELPER UTILITIES
// ==========================================

/**
 * Format number to currency style (e.g., 1000.5 -> ฿1,000.50)
 */
function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) return '฿0.00';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(value);
}

/**
 * Format date string to display style (dd/mm/yyyy)
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear() + 543; // convert to Thai Buddhist era
  return `${d}/${m}/${y}`;
}

/**
 * Format date-time for display
 */
function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '-';
  let formatted = formatDate(dateStr);
  if (timeStr) {
    formatted += ` ${timeStr}`;
  }
  return formatted;
}

/**
 * Get current local date in YYYY-MM-DD format (for input[type=date])
 */
function getTodayDateString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get current local time in HH:MM format
 */
function getCurrentTimeString() {
  const today = new Date();
  const h = String(today.getHours()).padStart(2, '0');
  const m = String(today.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Retrieve Query parameters from URL
 */
function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
