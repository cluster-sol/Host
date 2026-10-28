/**
 * ==============================================================================
 * CLUSTER AI & TECH SOLUTIONS — INTERACTIVE PROJECT COST & ROI CALCULATOR
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const platformCards = document.querySelectorAll('.platform-card');
  const scaleSlider = document.getElementById('calc-scale-slider');
  const scaleVal = document.getElementById('calc-scale-val');
  const selectedPlatformName = document.getElementById('selected-platform-name');
  const addonCheckboxes = document.querySelectorAll('.calc-addon');
  const speedBtns = document.querySelectorAll('.calc-speed-btn');
  const currBtns = document.querySelectorAll('.curr-btn');

  const priceDisplay = document.getElementById('calc-price-display');
  const hoursSavedDisplay = document.getElementById('calc-hours-saved');
  const milestoneAdvance = document.getElementById('milestone-advance');
  const milestoneUat = document.getElementById('milestone-uat');
  const milestoneFinal = document.getElementById('milestone-final');
  const calcCtaBtn = document.getElementById('calc-cta-btn');

  if (!scaleSlider || !priceDisplay) return;

  let currentCurrency = 'INR';
  let basePriceINR = 80000;
  let basePriceUSD = 1200;
  let currentPlatformTitle = 'Custom Web & SaaS';
  let speedMultiplier = 1.0;

  // 1. Platform Selection
  platformCards.forEach(card => {
    card.addEventListener('click', () => {
      platformCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      basePriceINR = parseFloat(card.getAttribute('data-base-inr'));
      basePriceUSD = parseFloat(card.getAttribute('data-base-usd'));
      currentPlatformTitle = card.querySelector('.platform-card-title').textContent.trim();
      if (selectedPlatformName) selectedPlatformName.textContent = currentPlatformTitle;

      calculateTotals();
    });
  });

  // 2. Scale Slider
  scaleSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (scaleVal) {
      scaleVal.textContent = `${val} Core Workflows / Modules`;
    }
    calculateTotals();
  });

  // 3. Addon Checkboxes
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateTotals);
  });

  // 4. Speed Buttons
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      speedMultiplier = parseFloat(btn.getAttribute('data-mult'));
      calculateTotals();
    });
  });

  // 5. Currency Toggle (INR vs USD)
  currBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.getAttribute('data-curr');
      calculateTotals();
    });
  });

  function calculateTotals() {
    const scale = parseInt(scaleSlider.value);
    
    // Scale factor: each additional workflow beyond 1 adds ~12%
    const scaleFactor = 1 + (scale - 1) * 0.12;

    let addonTotalINR = 0;
    let addonTotalUSD = 0;

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonTotalINR += parseFloat(cb.getAttribute('data-cost-inr'));
        addonTotalUSD += parseFloat(cb.getAttribute('data-cost-usd'));
      }
    });

    const totalINR = Math.round(((basePriceINR * scaleFactor) + addonTotalINR) * speedMultiplier);
    const totalUSD = Math.round(((basePriceUSD * scaleFactor) + addonTotalUSD) * speedMultiplier);

    // Approximate hours saved: base 25 hrs + 8 hrs per module
    const estimatedHours = Math.round(25 + (scale * 8.5));

    if (currentCurrency === 'INR') {
      priceDisplay.textContent = '₹' + totalINR.toLocaleString('en-IN');
      if (milestoneAdvance) milestoneAdvance.textContent = '₹' + Math.round(totalINR * 0.4).toLocaleString('en-IN');
      if (milestoneUat) milestoneUat.textContent = '₹' + Math.round(totalINR * 0.3).toLocaleString('en-IN');
      if (milestoneFinal) milestoneFinal.textContent = '₹' + Math.round(totalINR * 0.3).toLocaleString('en-IN');
    } else {
      priceDisplay.textContent = '$' + totalUSD.toLocaleString('en-US');
      if (milestoneAdvance) milestoneAdvance.textContent = '$' + Math.round(totalUSD * 0.4).toLocaleString('en-US');
      if (milestoneUat) milestoneUat.textContent = '$' + Math.round(totalUSD * 0.3).toLocaleString('en-US');
      if (milestoneFinal) milestoneFinal.textContent = '$' + Math.round(totalUSD * 0.3).toLocaleString('en-US');
    }

    if (hoursSavedDisplay) {
      hoursSavedDisplay.textContent = `${estimatedHours}+ Hours / Month`;
    }

    if (calcCtaBtn) {
      const formattedPrice = currentCurrency === 'INR' ? `₹${totalINR.toLocaleString('en-IN')}` : `$${totalUSD.toLocaleString('en-US')}`;
      calcCtaBtn.href = `/contact/?platform=${encodeURIComponent(currentPlatformTitle)}&budget=${encodeURIComponent(formattedPrice)}&modules=${scale}`;
    }
  }

  // Initial Calculation
  calculateTotals();
});
