(() => {
  'use strict';

  const STORAGE_KEY = 'carscout-field-system-v1';
  const MAX_TICKETS = 15;
  const REFILL_MS = 15 * 60 * 1000;
  const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Exotic', 'Legendary'];
  const RARITY_POINTS = { Common: 100, Uncommon: 250, Rare: 500, Exotic: 1000, Legendary: 2000 };
  const RARITY_INDEX = Object.fromEntries(RARITY_ORDER.map((rarity, index) => [rarity, index]));
  const SCAN_SCRAPS = { Common: 50, Uncommon: 100, Rare: 200, Exotic: 350, Legendary: 600 };
  const DUPLICATE_SCRAPS = { Common: 11, Uncommon: 25, Rare: 50, Exotic: 90, Legendary: 150 };
  const SHOP_PRICES = { Uncommon: 1800, Rare: 6000, Exotic: 15000, Legendary: 32000 };
  const SHOP_RARITIES = ['Uncommon', 'Rare', 'Exotic', 'Legendary'];
  const CATALOG = [
    { make: 'Toyota', model: 'Corolla Hatchback', year: 2023, horsepower: 169, topSpeed: 112, rarityScore: 12, image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/2023_Toyota_Corolla_Hybrid_%28E210%29_hatchback_IMG_9877.jpg' },
    { make: 'Mazda', model: 'MX-5 Miata', year: 2024, horsepower: 181, topSpeed: 136, rarityScore: 22, image: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Mazda_MX-5_%28ND%29_1X7A7471.jpg' },
    { make: 'Volkswagen', model: 'Golf GTI', year: 2024, horsepower: 241, topSpeed: 155, rarityScore: 25, image: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Volkswagen_Golf_GTI_Mk8_Dolphin_Gray_Metallic_%2810%29.jpg' },
    { make: 'Mini', model: 'Cooper S', year: 2024, horsepower: 189, topSpeed: 146, rarityScore: 23, image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/MINI_F56_Hatch_Cooper_S_Chili_Red_%282%29.jpg' },
    { make: 'Hyundai', model: 'Elantra N', year: 2024, horsepower: 276, topSpeed: 155, rarityScore: 29, image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/2024_Hyundai_Elantra_N_2.0T_in_Performance_Blue%2C_front_left%2C_06-16-2024.jpg' },
    { make: 'Honda', model: 'Civic Si', year: 2024, horsepower: 200, topSpeed: 137, rarityScore: 26, image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/19_Honda_Civic_Si_Coupe.jpg' },
    { make: 'Honda', model: 'Civic Type R', year: 2024, horsepower: 315, topSpeed: 169, rarityScore: 40, image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/HONDA_CIVIC_TYPE_R_FL5_China.jpg' },
    { make: 'Subaru', model: 'WRX STI', year: 2019, horsepower: 310, topSpeed: 174, rarityScore: 47, image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Subaru_WRX_STI_%2833720373068%29.jpg' },
    { make: 'Ford', model: 'Mustang GT', year: 2024, horsepower: 486, topSpeed: 155, rarityScore: 27, image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Ford_Mustang_GT_%28S650%29_Washington_DC_Metro_Area%2C_USA.jpg' },
    { make: 'BMW', model: 'M3 E46', year: 2005, horsepower: 333, topSpeed: 155, rarityScore: 55, image: 'https://upload.wikimedia.org/wikipedia/commons/7/70/BMW_M3_coupe_E46.jpg' },
    { make: 'Toyota', model: 'Supra Turbo', year: 1998, horsepower: 320, topSpeed: 155, rarityScore: 79, image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Toyota_Supra_A80_N%C3%BCrburgring_training_car.jpg' },
    { make: 'Nissan', model: 'Skyline GT-R V-Spec II', year: 2002, horsepower: 276, topSpeed: 155, rarityScore: 89, image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Nissan_Skyline_GT-R_R34%2C_09-21-2025.jpg' },
    { make: 'Porsche', model: '911 Turbo S', year: 2024, horsepower: 640, topSpeed: 205, rarityScore: 81, image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Porsche_992_Turbo_S_1X7A0411.jpg' },
    { make: 'Ferrari', model: 'F40', year: 1992, horsepower: 478, topSpeed: 201, rarityScore: 95, image: 'assets/cars/ferrari-f40.jpg' },
    { make: 'Lamborghini', model: 'Countach 25th Anniversary', year: 1989, horsepower: 455, topSpeed: 183, rarityScore: 94, image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/1990_Lamborghini_Countach_25th_Anniversary_HCC23.jpg' },
    { make: 'Ferrari', model: 'SF90 Stradale', year: 2023, horsepower: 986, topSpeed: 211, rarityScore: 86, image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Ferrari_SF90%2C_BAS_24%2C_Brussels_%28P1170486-RR%29.jpg' }
  ];
  const LEVEL_NAMES = ['CURIOUS', 'SCOUT', 'SPOTTER', 'TRACKER', 'ROAD HUNTER', 'CONNOISSEUR', 'VANGUARD', 'LEGEND'];
  const DAILY_QUESTS = [
    { id: 'daily-scan', title: 'Clock in', description: 'Scan 3 cars today.', target: 3, reward: 90, symbol: '◎', metric: 'scans' },
    { id: 'daily-makes', title: 'Keep your eyes open', description: 'Find 2 different makes today.', target: 2, reward: 120, symbol: '⌖', metric: 'makes' },
    { id: 'daily-rare', title: 'One worth a second look', description: 'Find a Rare car or better today.', target: 1, reward: 160, symbol: '✳', metric: 'rare' }
  ];
  const WEEKLY_QUESTS = [
    { id: 'weekly-scan', title: 'Put in the miles', description: 'Scan 12 cars this week.', target: 12, reward: 250, symbol: '◷', metric: 'scans' },
    { id: 'weekly-makes', title: 'A wider circuit', description: 'Collect cars from 4 different makes.', target: 4, reward: 300, symbol: '↗', metric: 'makes' },
    { id: 'weekly-rare', title: 'The ones that got away', description: 'Find 3 Rare cars or better this week.', target: 3, reward: 450, symbol: '✳', metric: 'rare' }
  ];
  const DEMO_LEADERS = [
    { name: 'ApexArchive', id: 'DRV-8KF-21M', score: 24860, cars: 42 },
    { name: 'redline.jpg', id: 'DRV-3QA-90X', score: 19320, cars: 35 },
    { name: 'LowMileage', id: 'DRV-7ZP-4C2', score: 14680, cars: 27 },
    { name: 'nightowl', id: 'DRV-5BR-61N', score: 11240, cars: 21 },
    { name: 'SideStreet', id: 'DRV-2MX-88L', score: 8230, cars: 18 },
    { name: 'GRIT / 86', id: 'DRV-9TJ-3W4', score: 5740, cars: 13 },
    { name: 'SpareKey', id: 'DRV-4HA-72E', score: 2860, cars: 7 },
    { name: 'WeekendRun', id: 'DRV-6CD-5Y8', score: 980, cars: 3 }
  ];

  const now = Date.now();
  const stored = readState();
  const state = {
    tickets: stored?.tickets ?? MAX_TICKETS,
    lastTicketAt: stored?.lastTicketAt ?? now,
    xp: stored?.xp ?? 0,
    scraps: stored?.scraps ?? 0,
    dailyPackClaimDate: stored?.dailyPackClaimDate ?? '',
    userId: stored?.userId ?? makePlayerId(),
    cars: Array.isArray(stored?.cars) ? stored.cars : [],
    claims: stored?.claims && typeof stored.claims === 'object' ? stored.claims : {}
  };
  let currentView = 'scanner';
  let currentRarity = 'All';
  let cameraStream = null;
  let scanning = false;
  let toastTimeout = 0;

  const $ = (id) => document.getElementById(id);
  const cameraStage = $('cameraStage');
  const video = $('cameraVideo');
  const photoPreview = $('photoPreview');
  const scanButton = $('scanButton');

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      showToast('Browser storage is full. Your latest changes may not persist.');
    }
  }

  function makePlayerId() {
    const part = () => Math.random().toString(36).slice(2, 5).toUpperCase();
    return `DRV-${part()}-${part()}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function rarityFor(car) {
    const score = Math.min(100, car.rarityScore * 0.7 + car.horsepower / 25 + car.topSpeed / 15);
    if (score >= 84) return 'Legendary';
    if (score >= 67) return 'Exotic';
    if (score >= 48) return 'Rare';
    if (score >= 30) return 'Uncommon';
    return 'Common';
  }

  function scoreFor(car) {
    return Math.round(RARITY_POINTS[car.rarity] + car.horsepower + car.topSpeed * 2);
  }

  function carIdentity(car) {
    return `${car.make}|${car.model}|${car.year}`;
  }

  function shopCycleId(date = new Date()) {
    const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    return Math.floor(dayNumber / 2);
  }

  function nextShopRefresh() {
    const now = new Date();
    const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    const daysUntilRefresh = dayNumber % 2 === 0 ? 2 : 1;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilRefresh);
  }

  function shopInventory() {
    const cycle = shopCycleId();
    return SHOP_RARITIES.map((rarity) => {
      const options = CATALOG.filter((car) => rarityFor(car) === rarity);
      let seed = 2166136261;
      for (const character of `${cycle}:${rarity}`) {
        seed ^= character.charCodeAt(0);
        seed = Math.imul(seed, 16777619);
      }
      return { ...options[(seed >>> 0) % options.length], rarity, price: SHOP_PRICES[rarity] };
    });
  }

  function shopPhotoUrl(source) {
    const prefix = 'https://upload.wikimedia.org/wikipedia/commons/';
    if (!source.startsWith(prefix)) return source;
    const [firstHash, secondHash, filename] = source.slice(prefix.length).split('/');
    return `${prefix}thumb/${firstHash}/${secondHash}/${filename}/960px-${filename}`;
  }

  function packScrapReward() {
    const roll = Math.random();
    const rewardRanges = [
      { limit: 0.42, min: 100, max: 300 },
      { limit: 0.72, min: 301, max: 500 },
      { limit: 0.9, min: 501, max: 700 },
      { limit: 0.97, min: 701, max: 850 },
      { limit: 0.995, min: 851, max: 950 },
      { limit: 1, min: 951, max: 1000 }
    ];
    const range = rewardRanges.find((item) => roll < item.limit);
    return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
  }

  function syncTickets(timestamp = Date.now()) {
    if (state.tickets >= MAX_TICKETS) {
      const changed = state.tickets !== MAX_TICKETS;
      state.tickets = MAX_TICKETS;
      state.lastTicketAt = timestamp;
      if (changed) saveState();
      return;
    }
    const elapsedIntervals = Math.floor((timestamp - state.lastTicketAt) / REFILL_MS);
    if (elapsedIntervals < 1) return;
    state.tickets = Math.min(MAX_TICKETS, state.tickets + elapsedIntervals);
    state.lastTicketAt = state.tickets === MAX_TICKETS ? timestamp : state.lastTicketAt + elapsedIntervals * REFILL_MS;
    saveState();
  }

  function ticketsUntilRefill() {
    if (state.tickets >= MAX_TICKETS) return 'FULL';
    const remaining = Math.max(0, REFILL_MS - (Date.now() - state.lastTicketAt));
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function localDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function weekStart(date = new Date()) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    start.setDate(start.getDate() - start.getDay());
    return start;
  }

  function periodCars(period) {
    const start = period === 'daily' ? new Date() : weekStart();
    start.setHours(0, 0, 0, 0);
    return state.cars.filter((car) => new Date(car.collectedAt).getTime() >= start.getTime());
  }

  function questProgress(quest, period) {
    const cars = periodCars(period);
    if (quest.metric === 'scans') return Math.min(quest.target, cars.length);
    if (quest.metric === 'makes') return Math.min(quest.target, new Set(cars.map((car) => car.make)).size);
    return Math.min(quest.target, cars.filter((car) => RARITY_INDEX[car.rarity] >= RARITY_INDEX.Rare).length);
  }

  function claimKey(quest, period) {
    const periodKey = period === 'daily' ? localDateKey(new Date()) : localDateKey(weekStart());
    return `${quest.id}-${periodKey}`;
  }

  function levelInfo() {
    const level = Math.floor(state.xp / 500) + 1;
    return { level, current: state.xp % 500, percent: (state.xp % 500) / 5, name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)] };
  }

  function garageScore() {
    return state.cars.reduce((total, car) => total + car.garageScore, 0);
  }

  function sortedCars(cars = state.cars) {
    return [...cars].sort((a, b) => b.collectedAt - a.collectedAt);
  }

  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function showView(view) {
    if (!['scanner', 'garage', 'shop', 'leaderboard', 'quests'].includes(view)) return;
    currentView = view;
    document.querySelectorAll('.view-panel').forEach((panel) => panel.classList.toggle('active', panel.id === `view-${view}`));
    document.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
    const labels = { scanner: 'FIELD SCANNER', garage: 'MY GARAGE', shop: 'ITEM SHOP', leaderboard: 'COLLECTOR RANKS', quests: 'ACTIVE QUESTS' };
    $('topbarLabel').textContent = labels[view];
    if (view === 'garage') renderGarage();
    if (view === 'shop') renderItemShop();
    if (view === 'leaderboard') renderLeaderboard();
    if (view === 'quests') renderQuests();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateClockAndTickets() {
    const current = new Date();
    const timer = ticketsUntilRefill();
    const dateShort = current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' }).toUpperCase();
    $('todayLabel').textContent = dateShort;
    $('dateLong').textContent = current.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
    $('clockLabel').textContent = current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    $('ticketCount').textContent = state.tickets;
    $('ticketBig').textContent = state.tickets;
    $('ticketTimer').textContent = timer;
    $('refillCountdown').textContent = timer;
    $('ticketMeter').innerHTML = Array.from({ length: MAX_TICKETS }, (_, index) => `<i class="${index < state.tickets ? 'filled' : ''}"></i>`).join('');
    $('ticketMeter').setAttribute('aria-label', `${state.tickets} of ${MAX_TICKETS} scan tickets available`);
    scanButton.disabled = !cameraStream || state.tickets <= 0 || scanning;
    $('scrapsCount').textContent = state.scraps.toLocaleString();
    $('dailyReset').textContent = resetClock('daily');
    $('weeklyReset').textContent = resetClock('weekly');
    $('shopRefreshCountdown').textContent = shopTimer();
  }

  function resetClock(period) {
    const now = new Date();
    let target;
    if (period === 'daily') {
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const seconds = Math.max(0, Math.floor((target - now) / 1000));
      return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    const nextSunday = weekStart(now);
    nextSunday.setDate(nextSunday.getDate() + 7);
    const seconds = Math.max(0, Math.floor((nextSunday - now) / 1000));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}D ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  function renderFieldNotes() {
    const todaysCars = periodCars('daily');
    const count = todaysCars.length;
    $('todayScans').innerHTML = `${Math.min(count, 3)} <small>/ 3</small>`;
    $('todayProgress').style.width = `${Math.min(100, count / 3 * 100)}%`;
    $('garageScoreSmall').textContent = String(garageScore()).padStart(3, '0');
    const score = garageScore();
    const rank = score >= 24860 ? 'ACE' : score >= 14680 ? 'VETERAN' : score >= 8230 ? 'REGULAR' : score > 0 ? 'SCOUT' : 'ROOKIE';
    $('rankSmall').textContent = rank;
  }

  function renderRecent() {
    const recent = sortedCars().slice(0, 3);
    const list = $('recentList');
    if (!recent.length) {
      list.innerHTML = '<div class="recent-empty"><span>◎</span><div><strong>No sightings yet</strong><small>Your first scan will show up here.</small></div></div>';
      return;
    }
    list.innerHTML = recent.map((car) => `<article class="recent-item"><div class="recent-thumb" style="background-image:url('${car.photo}')"></div><div class="recent-copy"><strong>${escapeHtml(car.year)} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</strong><small><i class="rarity-dot ${escapeHtml(car.rarity)}"></i>${escapeHtml(car.rarity.toUpperCase())} · ${new Date(car.collectedAt).toLocaleDateString()}</small></div><span class="recent-score">+${car.garageScore}</span></article>`).join('');
  }

  function renderGarage() {
    const cars = sortedCars();
    $('garageTotal').textContent = String(cars.length).padStart(2, '0');
    $('garageCount').textContent = String(cars.length).padStart(2, '0');
    $('filterAllCount').textContent = cars.length;
    const filtered = currentRarity === 'All' ? cars : cars.filter((car) => car.rarity === currentRarity);
    const sort = $('garageSort').value;
    if (sort === 'score') filtered.sort((a, b) => b.garageScore - a.garageScore);
    if (sort === 'horsepower') filtered.sort((a, b) => b.horsepower - a.horsepower);
    if (!filtered.length) {
      const message = cars.length ? `No ${escapeHtml(currentRarity.toLowerCase())} cars in your collection yet.` : 'Your first find is out there. Open the scanner to capture a car.';
      $('garageGrid').innerHTML = `<div class="empty-garage"><div><div class="empty-garage-icon">◎</div><h3>${cars.length ? 'No matches.' : 'An empty lot.'}</h3><p>${message}</p><button class="button button-primary" data-view-link="scanner">Open scanner <span class="button-arrow">↗</span></button></div></div>`;
      return;
    }
    $('garageGrid').innerHTML = filtered.map((car) => `<article class="car-card" tabindex="0" role="button" data-car-id="${escapeHtml(car.id)}" aria-label="View details for ${escapeHtml(car.year)} ${escapeHtml(car.make)} ${escapeHtml(car.model)}"><div class="car-photo"><img src="${car.photo}" alt="${escapeHtml(car.year)} ${escapeHtml(car.make)} ${escapeHtml(car.model)}" loading="lazy" /><span class="car-rarity"><i class="rarity-dot ${escapeHtml(car.rarity)}"></i>${escapeHtml(car.rarity.toUpperCase())}</span><span class="car-photo-score">+${car.garageScore} PTS</span></div><div class="car-card-body"><div class="car-card-title"><h3>${escapeHtml(car.make)} ${escapeHtml(car.model)}</h3><span>${escapeHtml(car.year)}</span></div><div class="car-subtitle">${escapeHtml(car.rarity)} find · Rarity index ${escapeHtml(car.rarityScore)}/100</div><div class="car-specs"><div><span>POWER</span><strong>${escapeHtml(car.horsepower)} HP</strong></div><div><span>TOP SPEED</span><strong>${escapeHtml(car.topSpeed)} MPH</strong></div><div><span>RARITY</span><strong>${escapeHtml(car.rarityScore)}/100</strong></div></div><div class="car-card-foot"><span class="car-location">⌖ ${escapeHtml(car.location)}</span><span>${new Date(car.collectedAt).toLocaleDateString()}</span></div></div></article>`).join('');
  }

  function shopTimer() {
    const remaining = Math.max(0, nextShopRefresh().getTime() - Date.now());
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  function renderItemShop() {
    const today = localDateKey(new Date());
    const packClaimed = state.dailyPackClaimDate === today;
    $('shopBalanceLarge').textContent = state.scraps.toLocaleString();
    $('dailyPackState').textContent = packClaimed ? 'DAILY PACK OPENED' : 'ONE FREE PACK · READY NOW';
    $('claimPackButton').disabled = packClaimed;
    $('claimPackButton').textContent = packClaimed ? 'CLAIMED TODAY' : 'OPEN FREE PACK';
    $('shopStock').innerHTML = shopInventory().map((car) => {
      const owned = state.cars.some((item) => carIdentity(item) === carIdentity(car));
      return `<article class="shop-car"><div class="shop-photo"><img src="${escapeHtml(shopPhotoUrl(car.image))}" alt="${escapeHtml(car.year)} ${escapeHtml(car.make)} ${escapeHtml(car.model)}" loading="eager" /><span class="shop-rarity"><i class="rarity-dot ${escapeHtml(car.rarity)}"></i>${escapeHtml(car.rarity.toUpperCase())}</span></div><div class="shop-car-body"><div class="shop-car-year">${escapeHtml(car.year)} · ${escapeHtml(car.make.toUpperCase())}</div><h3>${escapeHtml(car.model)}</h3><div class="shop-car-specs"><span>${escapeHtml(car.horsepower)} HP</span><span>${escapeHtml(car.topSpeed)} MPH</span></div><div class="shop-buy-row"><strong>✦ ${car.price.toLocaleString()}</strong><button class="shop-buy-button" data-buy="${escapeHtml(carIdentity(car))}" ${owned ? 'disabled' : ''}>${owned ? 'OWNED' : 'BUY CAR'}</button></div></div></article>`;
    }).join('');
  }

  function renderLeaderboard() {
    const players = [...DEMO_LEADERS, { name: 'Nightshift', id: state.userId, score: garageScore(), cars: state.cars.length, current: true }].sort((a, b) => b.score - a.score);
    const rank = players.findIndex((player) => player.current) + 1;
    const next = players[rank - 2];
    $('yourRank').textContent = `#${String(rank).padStart(2, '0')}`;
    $('yourPlayerId').textContent = state.userId;
    $('pointsToNext').textContent = next ? `${Math.max(0, next.score - garageScore() + 1).toLocaleString()} PTS` : 'TOP OF THE BOARD';
    $('leaderboardRows').innerHTML = players.map((player, index) => `<div class="leader-row ${player.current ? 'current' : ''}"><div class="driver-cell"><span class="rank-number">${String(index + 1).padStart(2, '0')}</span><span class="leader-avatar">${player.current ? 'M' : escapeHtml(player.name[0]).toUpperCase()}</span><span class="driver-name"><strong>${escapeHtml(player.name)}${player.current ? ' · YOU' : ''}</strong><small>${escapeHtml(player.id)}</small></span></div><span class="leader-count">${String(player.cars).padStart(2, '0')} CARS</span><span class="leader-score">${player.score.toLocaleString()}</span></div>`).join('');
  }

  function renderQuestGroup(quests, period, targetId, totalId) {
    let completeCount = 0;
    $(targetId).innerHTML = quests.map((quest) => {
      const progress = questProgress(quest, period);
      const complete = progress >= quest.target;
      const claimed = Boolean(state.claims[claimKey(quest, period)]);
      if (complete) completeCount += 1;
      const progressPercent = Math.min(100, progress / quest.target * 100);
      const button = complete && !claimed ? `<button class="claim-button" data-claim="${quest.id}" data-period="${period}">CLAIM</button>` : claimed ? '<button class="claim-button" disabled>CLAIMED</button>' : '';
      return `<article class="quest-card ${complete ? 'completed' : ''} ${claimed ? 'claimed' : ''}"><div class="quest-symbol">${quest.symbol}</div><div class="quest-info"><h3>${escapeHtml(quest.title)}</h3><p>${escapeHtml(quest.description)}</p><div class="quest-meter"><i><b style="width:${progressPercent}%"></b></i><span>${progress} / ${quest.target}</span></div></div><div class="quest-reward">+${quest.reward} XP${button}</div></article>`;
    }).join('');
    $(totalId).textContent = `${completeCount} / ${quests.length} COMPLETE`;
  }

  function renderQuests() {
    renderQuestGroup(DAILY_QUESTS, 'daily', 'dailyQuestList', 'dailyQuestTotal');
    renderQuestGroup(WEEKLY_QUESTS, 'weekly', 'weeklyQuestList', 'weeklyQuestTotal');
    const info = levelInfo();
    $('levelBadge').textContent = String(info.level).padStart(2, '0');
    $('levelName').textContent = info.name;
    $('levelXpText').textContent = `${info.current} / 500 XP`;
    $('levelPercent').textContent = `${Math.floor(info.percent)}%`;
    $('levelXpFill').style.width = `${info.percent}%`;
    $('topLevel').textContent = `LVL ${String(info.level).padStart(2, '0')}`;
    $('profileLevel').textContent = `LEVEL ${String(info.level).padStart(2, '0')}`;
    $('topXpFill').style.width = `${info.percent}%`;
    $('questCount').textContent = String(DAILY_QUESTS.filter((quest) => questProgress(quest, 'daily') >= quest.target && !state.claims[claimKey(quest, 'daily')]).length).padStart(2, '0');
  }

  function renderAll() {
    syncTickets();
    updateClockAndTickets();
    renderFieldNotes();
    renderRecent();
    renderGarage();
    renderItemShop();
    renderLeaderboard();
    renderQuests();
  }

  async function startCamera() {
    if (cameraStream) {
      stopCamera();
      return;
    }
    const error = $('cameraError');
    error.hidden = true;
    if (!navigator.mediaDevices?.getUserMedia) {
      error.textContent = 'Camera access is unavailable in this browser. Upload a photo to scan instead.';
      error.hidden = false;
      showToast('Camera unavailable. You can upload a photo instead.');
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      video.srcObject = cameraStream;
      cameraStage.classList.add('has-video');
      cameraStage.classList.remove('has-photo');
      $('cameraStatus').textContent = 'CAMERA FEED ACTIVE';
      $('cameraButton').innerHTML = '<span class="button-icon">◉</span><span>Stop camera</span>';
      $('liveBadge').style.display = 'flex';
      document.querySelector('.camera-card').classList.add('camera-on');
      updateClockAndTickets();
    } catch (errorValue) {
      const denied = errorValue?.name === 'NotAllowedError' || errorValue?.name === 'PermissionDeniedError';
      error.textContent = denied ? 'Camera permission was blocked. Allow access in your browser settings, then retry.' : 'Could not start the camera. Check camera access and try again.';
      error.hidden = false;
      showToast('Camera unavailable. Check permission and retry.');
    }
  }

  function stopCamera() {
    if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    video.srcObject = null;
    cameraStage.classList.remove('has-video');
    document.querySelector('.camera-card').classList.remove('camera-on');
    $('cameraStatus').textContent = 'SCANNER STANDBY';
    $('cameraButton').innerHTML = '<span class="button-icon">◉</span><span>Enable camera</span>';
    $('liveBadge').style.display = 'none';
    updateClockAndTickets();
  }

  function captureCameraFrame() {
    if (!cameraStream || !video.videoWidth) return '';
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 850 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.68);
  }

  function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Location not shared');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lat = `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? 'N' : 'S'}`;
          const lon = `${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? 'E' : 'W'}`;
          $('cameraCoords').textContent = `${lat}  ${lon}`;
          $('locationText').textContent = `LOCATION · ${lat}, ${lon}`;
          resolve(`Near ${lat}, ${lon}`);
        },
        () => resolve('Location not shared'),
        { enableHighAccuracy: false, timeout: 2500, maximumAge: 300000 }
      );
    });
  }

  function sleep(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function normalizeBase64Image(base64Image) {
    if (!base64Image) return '';
    const trimmed = String(base64Image).trim();
    if (trimmed.startsWith('data:image')) {
      return trimmed.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
    }
    return trimmed.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        reject(new Error('A valid image file is required.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Unable to read the selected image file.'));
      reader.readAsDataURL(file);
    });
  }

  async function scanCarImage(base64Image) {
    const apiKey = window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      return { isCar: false, error: 'Missing Gemini API key. Set window.GEMINI_API_KEY or localStorage.GEMINI_API_KEY.' };
    }

    const rawBase64 = normalizeBase64Image(base64Image);
    if (!rawBase64) {
      return { isCar: false, error: 'No image data was provided for scanning.' };
    }

    console.log('Image payload size:', rawBase64.length);

    const response = await fetch('/api/scan-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: rawBase64,
        apiKey
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload?.error || `Gemini request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Vision API Response:', data);

    if (!data || data.isCar === false) {
      return {
        isCar: false,
        confidenceScore: Number(data?.confidenceScore || 0),
        reasoning: data?.reasoning || 'No vehicle identified in the image.'
      };
    }

    return {
      isCar: true,
      make: String(data.make || 'Unknown').trim(),
      model: String(data.model || 'Unknown').trim(),
      estimatedYear: String(data.estimatedYear || 'Unknown'),
      rarity: ['Common', 'Rare', 'Exotic'].includes(data.rarity) ? data.rarity : 'Common',
      confidenceScore: Number(data.confidenceScore || 0),
      reasoning: String(data.reasoning || 'Vehicle detected using visual cues.').trim()
    };
  }

  async function scanCar() {
    if (scanning || state.tickets < 1) {
      if (!state.tickets) showToast(`No scan tickets left. Next refill in ${ticketsUntilRefill()}.`);
      return;
    }
    const photo = captureCameraFrame();
    if (!photo) {
      showToast('Enable the camera and frame a car before scanning.');
      return;
    }
    scanning = true;
    syncTickets();
    if (state.tickets < 1) {
      scanning = false;
      updateClockAndTickets();
      return;
    }
    scanButton.disabled = true;
    $('scanLoading').classList.add('show');
    $('scanLoading').innerHTML = '<span class="loading-ring"></span><strong>Analyzing vehicle specs...</strong><small>Checking make, model, and color</small>';
    $('cameraStatus').textContent = 'ANALYZING IMAGE';
    const location = await getLocation();

    try {
      const detection = await scanCarImage(photo);
      const confidence = Number(detection?.confidenceScore || 0);
      const shouldFallback = !detection || detection.isCar === false || confidence < 30;

      if (shouldFallback) {
        $('scanLoading').classList.remove('show');
        $('cameraStatus').textContent = 'IDENTIFICATION UNCERTAIN';
        scanning = false;
        scanButton.disabled = !cameraStream || state.tickets <= 0 || scanning;
        showManualVehicleFallback(photo, detection?.reasoning || 'The image was unclear. Please confirm the vehicle details.');
        return;
      }

      const detectedCar = {
        make: detection.make || 'Unknown',
        model: detection.model || 'Unknown',
        year: Number(detection.estimatedYear || new Date().getFullYear()),
        rarity: detection.rarity || 'Common',
        confidenceScore: detection.confidenceScore || 50,
        color: detection.detectedColor || 'Unknown',
        horsepower: Math.max(80, Math.min(1000, Math.round((confidence / 100) * 500 + 120))),
        topSpeed: Math.max(90, Math.min(230, Math.round((confidence / 100) * 120 + 80))),
        rarityScore: detection.rarity === 'Exotic' ? 92 : detection.rarity === 'Rare' ? 68 : 38
      };

      const candidate = CATALOG.find((car) => car.make.toLowerCase() === detectedCar.make.toLowerCase() && car.model.toLowerCase() === detectedCar.model.toLowerCase()) || {
        ...detectedCar,
        image: photo,
        rarityScore: detectedCar.rarityScore,
        horsepower: detectedCar.horsepower,
        topSpeed: detectedCar.topSpeed
      };

      const collectedAt = Date.now();
      const car = {
        ...candidate,
        id: `${collectedAt.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        rarity: detectedCar.rarity,
        garageScore: scoreFor({ ...candidate, rarity: detectedCar.rarity }),
        photo,
        location,
        collectedAt,
        color: detectedCar.color,
        confidenceScore: detectedCar.confidenceScore
      };

      const existingCar = state.cars.find((item) => carIdentity(item) === carIdentity(car));
      const duplicateScraps = existingCar ? DUPLICATE_SCRAPS[car.rarity] || 0 : 0;
      const wasAtTicketCap = state.tickets === MAX_TICKETS;
      if (!existingCar) state.cars.push(car);
      state.tickets -= 1;
      if (wasAtTicketCap) state.lastTicketAt = collectedAt;
      state.scraps += SCAN_SCRAPS[car.rarity] + duplicateScraps;
      const earnedXp = 45 + RARITY_INDEX[car.rarity] * 22;
      state.xp += earnedXp;
      saveState();
      $('scanLoading').classList.remove('show');
      $('cameraStatus').textContent = 'SCAN COMPLETE · FILED';
      scanning = false;
      renderAll();
      const rewardText = `+${SCAN_SCRAPS[car.rarity]} scraps${duplicateScraps ? ` · +${duplicateScraps} duplicate salvage` : ''}`;
      showToast(existingCar ? `${car.make} ${car.model} duplicate · ${rewardText}` : `${car.year} ${car.make} ${car.model} logged · ${rewardText} · +${earnedXp} XP`);
      showCarDetails(existingCar || car);
    } catch (error) {
      console.error('Gemini scan failed:', error);
      $('scanLoading').classList.remove('show');
      $('cameraStatus').textContent = 'IDENTIFICATION UNCERTAIN';
      scanning = false;
      scanButton.disabled = !cameraStream || state.tickets <= 0 || scanning;
      showManualVehicleFallback(photo, 'The image could not be processed reliably. Please confirm the vehicle details manually.');
    }
  }

  function showManualVehicleFallback(photoData = '', reason = 'Vehicle identification was uncertain. Please confirm the details.') {
    $('dialogContent').innerHTML = `
      <div class="dialog-body">
        <div class="dialog-rarity">
          <span><i class="rarity-dot Common"></i>VEHICLE NOT DETECTED</span>
          <strong>TRY AGAIN</strong>
        </div>
        <p class="dialog-location">${escapeHtml(reason)}</p>
        <p class="dialog-location">The vehicle could not be detected. Please try another scan.</p>
      </div>
    `;
    $('carDialog').showModal();
  }

  function showCarDetails(car) {
    $('dialogContent').innerHTML = `<div class="dialog-photo" style="background-image:url('${car.photo}')"><div class="dialog-photo-title"><small>${escapeHtml(car.year)} · ${escapeHtml(car.make.toUpperCase())}</small><h2>${escapeHtml(car.model)}</h2></div></div><div class="dialog-body"><div class="dialog-rarity"><span><i class="rarity-dot ${escapeHtml(car.rarity)}"></i>${escapeHtml(car.rarity.toUpperCase())} · RARITY INDEX ${escapeHtml(car.rarityScore)}/100</span><strong>+${car.garageScore} PTS</strong></div><div class="dialog-stat-grid"><div><span>HORSEPOWER</span><strong>${escapeHtml(car.horsepower)} HP</strong></div><div><span>TOP SPEED</span><strong>${escapeHtml(car.topSpeed)} MPH</strong></div><div><span>SCOUTED</span><strong>${new Date(car.collectedAt).toLocaleDateString()}</strong></div></div><p class="dialog-location">⌖ ${escapeHtml(car.location)} · SIMULATED ID</p></div>`;
    $('carDialog').showModal();
  }

  function claimQuest(questId, period) {
    const quest = [...DAILY_QUESTS, ...WEEKLY_QUESTS].find((item) => item.id === questId);
    if (!quest || questProgress(quest, period) < quest.target) return;
    const key = claimKey(quest, period);
    if (state.claims[key]) return;
    state.claims[key] = true;
    state.xp += quest.reward;
    saveState();
    renderAll();
    showToast(`Quest claimed · +${quest.reward} XP`);
  }

  function claimDailyPack() {
    const today = localDateKey(new Date());
    if (state.dailyPackClaimDate === today) return;
    const reward = packScrapReward();
    state.dailyPackClaimDate = today;
    state.scraps += reward;
    saveState();
    renderAll();
    showToast(`Daily pack opened · +${reward.toLocaleString()} scraps`);
  }

  function buyShopCar(identity) {
    const item = shopInventory().find((car) => carIdentity(car) === identity);
    if (!item) return;
    if (state.cars.some((car) => carIdentity(car) === identity)) {
      showToast('That car is already in your garage.');
      return;
    }
    if (state.scraps < item.price) {
      showToast(`You need ${(item.price - state.scraps).toLocaleString()} more scraps for this car.`);
      return;
    }
    const car = {
      ...item,
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      garageScore: scoreFor(item),
      photo: shopPhotoUrl(item.image),
      location: 'Item shop',
      collectedAt: Date.now(),
      obtainedFrom: 'shop'
    };
    state.scraps -= item.price;
    state.cars.push(car);
    saveState();
    renderAll();
    showToast(`${car.make} ${car.model} added to your garage.`);
  }

  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  document.addEventListener('click', (event) => {
    const viewLink = event.target.closest('[data-view-link]');
    if (viewLink) showView(viewLink.dataset.viewLink);
    const claimButton = event.target.closest('[data-claim]');
    if (claimButton) claimQuest(claimButton.dataset.claim, claimButton.dataset.period);
    if (event.target.closest('#claimPackButton')) claimDailyPack();
    const buyButton = event.target.closest('[data-buy]');
    if (buyButton) buyShopCar(buyButton.dataset.buy);
    const card = event.target.closest('[data-car-id]');
    if (card) {
      const car = state.cars.find((item) => item.id === card.dataset.carId);
      if (car) showCarDetails(car);
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-car-id]')) {
      event.preventDefault();
      const car = state.cars.find((item) => item.id === event.target.dataset.carId);
      if (car) showCarDetails(car);
    }
  });
  $('cameraButton').addEventListener('click', startCamera);
  scanButton.addEventListener('click', scanCar);
  $('rarityFilters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-rarity]');
    if (!button) return;
    currentRarity = button.dataset.rarity;
    document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
    renderGarage();
  });
  $('garageSort').addEventListener('change', renderGarage);
  $('dialogClose').addEventListener('click', () => $('carDialog').close());
  $('carDialog').addEventListener('click', (event) => {
    if (event.target === $('carDialog')) $('carDialog').close();
  });
  $('profileButton').addEventListener('click', () => showToast(`Player ID · ${state.userId}`));
  window.addEventListener('pagehide', stopCamera);

  if (!stored) saveState();
  renderAll();
  updateClockAndTickets();
  let activeShopCycle = shopCycleId();
  let activeLocalDate = localDateKey(new Date());
  window.setInterval(() => {
    syncTickets();
    updateClockAndTickets();
    const nextLocalDate = localDateKey(new Date());
    if (nextLocalDate !== activeLocalDate) {
      activeLocalDate = nextLocalDate;
      if (currentView === 'shop') renderItemShop();
    }
    const nextCycle = shopCycleId();
    if (nextCycle !== activeShopCycle) {
      activeShopCycle = nextCycle;
      renderItemShop();
    }
    if (currentView === 'quests') renderQuests();
  }, 1000);
})();
