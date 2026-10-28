/**
 * ==============================================================================
 * CLUSTER AI & TECH SOLUTIONS — CORE JAVASCRIPT
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Shadow on Scroll
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Drawer Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = mobileDrawer.style.display === 'block';
      mobileDrawer.style.display = isVisible ? 'none' : 'block';
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isVisible ? 'fas fa-bars' : 'fas fa-times';
      }
    });
  }

  // 3. Interactive Architecture Visualizer Tabs
  const archTabBtns = document.querySelectorAll('.arch-tab-btn');
  const archPanels = document.querySelectorAll('.arch-tab-panel');

  if (archTabBtns.length > 0) {
    archTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        archTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        archPanels.forEach(panel => {
          if (panel.id === `tab-panel-${targetTab}`) {
            panel.style.display = 'block';
            panel.classList.add('active');
          } else {
            panel.style.display = 'none';
            panel.classList.remove('active');
          }
        });
      });
    });
  }
});

// 4. Global Toast Notification Helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1.15rem;"></i>
    <div style="flex: 1; line-height: 1.4;">${message}</div>
    <button type="button" style="background: none; border: none; color: #94A3B8; cursor: pointer; padding: 2px;" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
