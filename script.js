/**
 * AUPP TRADING CLUB - RISK MANAGEMENT SLIDE DECK ENGINE
 * Full Keyboard Navigation, Auto-Scaling, Dynamic Calculator & Class Audits
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  const stage = document.getElementById('presentationStage');
  const viewport = document.getElementById('presentationViewport');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('slideCounter');
  const progressBar = document.getElementById('progressBar');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const gridBtn = document.getElementById('gridBtn');
  const printBtn = document.getElementById('printBtn');
  const modalOverlay = document.getElementById('overviewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalThumbnails');

  // Auto scale stage to fit window while keeping 16:9 aspect ratio
  function resizeStage() {
    if (!stage || !viewport) return;
    const baseWidth = 1440;
    const baseHeight = 810;
    const windowWidth = viewport.clientWidth;
    const windowHeight = viewport.clientHeight;

    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY) * 0.96; // 96% fit for elegant border margin

    stage.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', resizeStage);
  resizeStage();

  // Populate Slide Grid Overview
  function buildOverviewGrid() {
    if (!modalBody) return;
    modalBody.innerHTML = '';

    slides.forEach((slide, idx) => {
      const titleElem = slide.querySelector('.slide-title') || slide.querySelector('.cover-title') || slide.querySelector('.qa-title');
      const title = titleElem ? titleElem.innerText.replace('\n', ' ') : `Slide ${idx + 1}`;
      
      const thumb = document.createElement('div');
      thumb.className = `slide-thumbnail ${idx === currentSlideIndex ? 'current' : ''}`;
      thumb.innerHTML = `
        <div class="thumbnail-num">Slide ${String(idx + 1).padStart(2, '0')}</div>
        <div class="thumbnail-title">${title}</div>
      `;
      thumb.addEventListener('click', () => {
        goToSlide(idx);
        closeOverviewModal();
      });
      modalBody.appendChild(thumb);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    slides.forEach((s, idx) => {
      if (idx === index) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    currentSlideIndex = index;
    updateUI();

    // Sync hash
    window.location.hash = `slide-${index + 1}`;
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  function updateUI() {
    if (counter) {
      counter.innerText = `${String(currentSlideIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }
    if (progressBar) {
      const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
    if (prevBtn) {
      prevBtn.disabled = currentSlideIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentSlideIndex === totalSlides - 1;
    }

    // Highlight current thumbnail in overview if open
    const thumbs = modalBody?.querySelectorAll('.slide-thumbnail');
    thumbs?.forEach((t, i) => {
      if (i === currentSlideIndex) {
        t.classList.add('current');
      } else {
        t.classList.remove('current');
      }
    });
  }

  // Modal handlers
  function openOverviewModal() {
    buildOverviewGrid();
    modalOverlay.classList.add('active');
  }

  function closeOverviewModal() {
    modalOverlay.classList.remove('active');
  }

  // Fullscreen toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (gridBtn) gridBtn.addEventListener('click', openOverviewModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeOverviewModal);
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeOverviewModal();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // If user is typing in calculator input, don't hijack arrow keys or space
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }

    // If modal is open, ESC closes it
    if (modalOverlay.classList.contains('active')) {
      if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') {
        closeOverviewModal();
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
      case 'j':
      case 'J':
      case 'l':
      case 'L':
        nextSlide();
        e.preventDefault();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'k':
      case 'K':
      case 'h':
      case 'H':
      case 'Backspace':
        prevSlide();
        e.preventDefault();
        break;

      case 'Home':
        goToSlide(0);
        e.preventDefault();
        break;

      case 'End':
        goToSlide(totalSlides - 1);
        e.preventDefault();
        break;

      case 'f':
      case 'F':
        toggleFullscreen();
        e.preventDefault();
        break;

      case 'g':
      case 'G':
        openOverviewModal();
        e.preventDefault();
        break;

      case 'p':
      case 'P':
        if (e.ctrlKey || e.metaKey) {
          // default print trigger
        } else {
          window.print();
          e.preventDefault();
        }
        break;

      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
    }
  });

  // Check URL Hash for initial slide
  if (window.location.hash) {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (match && match[1]) {
      const slideNum = parseInt(match[1], 10) - 1;
      goToSlide(slideNum);
    } else {
      goToSlide(0);
    }
  } else {
    goToSlide(0);
  }

  // Interactive chart display mode: Both (Candles + Line), Candles only, Line only
  window.setChartMode = function(svgId, mode, btnElement) {
    const svg = document.getElementById(svgId);
    if (!svg) return;

    const candles = svg.querySelectorAll('.layer-candlesticks');
    const line = svg.querySelectorAll('.layer-linegraph');

    if (mode === 'both') {
      candles.forEach(el => el.style.display = 'block');
      line.forEach(el => el.style.display = 'block');
    } else if (mode === 'candles') {
      candles.forEach(el => el.style.display = 'block');
      line.forEach(el => el.style.display = 'none');
    } else if (mode === 'line') {
      candles.forEach(el => el.style.display = 'none');
      line.forEach(el => el.style.display = 'block');
    }

    // Update active tab button style
    const container = btnElement?.closest('.chart-container');
    if (container) {
      container.querySelectorAll('.chart-tab').forEach(btn => btn.classList.remove('active'));
      if (btnElement) btnElement.classList.add('active');
    }
  };

  // ==========================================
  // LIVE POSITION SIZE & RISK CALCULATOR ENGINE
  // ==========================================
  const calcBalanceInput = document.getElementById('calcBalance');
  const calcRiskInput = document.getElementById('calcRisk');
  const calcSlInput = document.getElementById('calcSl');
  const calcAssetSelect = document.getElementById('calcAsset');

  const outRiskAmount = document.getElementById('outRiskAmount');
  const outLotSize = document.getElementById('outLotSize');
  const outReward12 = document.getElementById('outReward12');
  const outReward13 = document.getElementById('outReward13');
  const outSafetyBadge = document.getElementById('outSafetyBadge');

  function calculateRisk() {
    if (!calcBalanceInput || !calcRiskInput || !calcSlInput) return;

    const balance = parseFloat(calcBalanceInput.value) || 0;
    const riskPercent = parseFloat(calcRiskInput.value) || 0;
    const slPips = parseFloat(calcSlInput.value) || 1;
    const pipValuePerLot = parseFloat(calcAssetSelect?.value) || 10; // Default Standard FX $10/pip

    // 1. Dollar risk
    const riskDollar = balance * (riskPercent / 100);

    // 2. Position size in lots = Risk Dollar / (SL pips * pip value per lot)
    let lots = 0;
    if (slPips > 0 && pipValuePerLot > 0) {
      lots = riskDollar / (slPips * pipValuePerLot);
    }

    // 3. Rewards at 1:2 and 1:3
    const reward12 = riskDollar * 2;
    const reward13 = riskDollar * 3;

    // Render output
    if (outRiskAmount) outRiskAmount.innerText = `$${riskDollar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outLotSize) outLotSize.innerText = `${lots.toFixed(2)} Lots`;
    if (outReward12) outReward12.innerText = `+$${reward12.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outReward13) outReward13.innerText = `+$${reward13.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Safety badge
    if (outSafetyBadge) {
      if (riskPercent <= 1.5) {
        outSafetyBadge.className = 'badge green';
        outSafetyBadge.innerText = 'Safe (Institutional 1%)';
      } else if (riskPercent <= 2.5) {
        outSafetyBadge.className = 'badge gold';
        outSafetyBadge.innerText = 'Moderate (2% Cap)';
      } else {
        outSafetyBadge.className = 'badge red';
        outSafetyBadge.innerText = 'High Risk (Overleveraged)';
      }
    }
  }

  // Calculator preset helper
  window.setCalcPreset = function(balance, risk, sl) {
    if (calcBalanceInput) calcBalanceInput.value = balance;
    if (calcRiskInput) calcRiskInput.value = risk;
    if (calcSlInput) calcSlInput.value = sl;
    calculateRisk();
  };

  if (calcBalanceInput) calcBalanceInput.addEventListener('input', calculateRisk);
  if (calcRiskInput) calcRiskInput.addEventListener('input', calculateRisk);
  if (calcSlInput) calcSlInput.addEventListener('input', calculateRisk);
  if (calcAssetSelect) calcAssetSelect.addEventListener('change', calculateRisk);

  // Initialize calculator with default values
  calculateRisk();
});
