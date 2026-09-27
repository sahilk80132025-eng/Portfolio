    function openLightbox(src) {
      const modal = document.getElementById('lightbox-modal');
      const img = document.getElementById('lightbox-img');
      img.src = src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox(event) {
      if (event.target.id === 'lightbox-modal' || event.target.classList.contains('lightbox-close')) {
        const modal = document.getElementById('lightbox-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('lightbox-modal');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      }
    });

    // ==========================================
    // WORK PAGE TAB & DYNAMIC GALLERY LOGIC
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Tab Switching Logic
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabContents = document.querySelectorAll('.tab-content');

      if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            // Remove active from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            
            // Add active to clicked button and show target content
            btn.classList.add('active');
            const targetId = `tab-${btn.getAttribute('data-tab')}`;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
              targetSection.style.display = 'block';
            }
          });
        });
      }

      // 2. Load JSON Manifest from global variable and Render Galleries
      const currentPath = window.location.pathname;
      if (currentPath.includes('vexma.html') || currentPath.endsWith('/') || currentPath.endsWith('\\')) {
        // We use the global VEXMA_ASSETS variable loaded from vexma_assets.js
        if (typeof VEXMA_ASSETS !== 'undefined') {
          const data = VEXMA_ASSETS;
          if (data.brochures) renderBrochureGallery(data.brochures, 'brochures-grid');
          if (data.newsletters) renderNewsletterGallery(data.newsletters, 'newsletters-grid');
          if (data.carousels) renderGridGallery(data.carousels, 'carousels-grid');
          if (data.socialPosts) renderMasonryGallery(data.socialPosts, 'social-grid');
          if (data.displayAds) renderGridGallery(data.displayAds, 'displayads-grid');
        } else {
          console.error("VEXMA_ASSETS is not defined. Ensure vexma_assets.js is loaded.");
        }
      }

      // 3. Handle deep linking to specific projects within tabs
      if (window.location.hash) {
        const hash = window.location.hash;
        // Check if the hash matches our project sections or if we generally want to open the projects tab
        if (hash === '#hero-section-update' || hash === '#vexma-healthcare' || hash === '#project-3') {
          const projectBtn = document.querySelector('.tab-btn[data-tab="projects"]');
          if (projectBtn) {
            projectBtn.click(); // Activates the tab
            
            // Wait slightly for the display:block to render, then scroll
            setTimeout(() => {
              const targetElement = document.querySelector(hash);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 150);
          }
        }
      }
    });

    // Helper: Newsletter Gallery (With Filtering for Mailchimp/Mailbluster vs LinkedIn)
    function renderNewsletterGallery(files, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const fileArray = Array.isArray(files) ? files : [files];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const images = fileArray.filter(f => validExtensions.some(ext => f.toLowerCase().endsWith(ext)));
      
      const emailNewsletters = images.filter(img => img.toLowerCase().includes('mailbluster') || img.toLowerCase().includes('mailchimp'));
      const linkedinNewsletters = images.filter(img => img.toLowerCase().includes('linkedin') || img.toLowerCase().includes('linkldln'));

      const filterBtns = document.querySelectorAll('.newsletter-filters .filter-btn');
      
      function renderSubset(subset) {
        let html = '';
        subset.forEach(img => {
          const fileName = img.split('/').pop().split('.')[0];
          html += `
            <div class="asset-card" onclick="openLightbox('${img}')">
              <div class="asset-img-wrap">
                <img src="${img}" alt="${fileName}" loading="lazy" />
              </div>
            </div>
          `;
        });
        container.innerHTML = html || '<p style="color: #94a3b8; width: 100%; text-align: center;">No newsletters found.</p>';
      }

      // Initial render (Email)
      renderSubset(emailNewsletters);

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (btn.getAttribute('data-filter') === 'linkedin') {
            renderSubset(linkedinNewsletters);
          } else {
            renderSubset(emailNewsletters);
          }
        });
      });
    }

    // Helper: Standard Grid Gallery
    function renderGridGallery(files, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const fileArray = Array.isArray(files) ? files : [files];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const images = fileArray.filter(f => validExtensions.some(ext => f.toLowerCase().endsWith(ext)));
      
      let html = '';
      images.forEach(img => {
        const fileName = img.split('/').pop().split('.')[0];
        html += `
          <div class="asset-card" onclick="openLightbox('${img}')">
            <div class="asset-img-wrap">
              <img src="${img}" alt="${fileName}" loading="lazy" />
            </div>
          </div>
        `;
      });
      container.innerHTML = html || '<p style="color: #94a3b8; width: 100%; text-align: center;">No assets found.</p>';
    }

    // Helper: Brochure Gallery (Grouped by folder, styled as mockups)
    function renderBrochureGallery(files, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const fileArray = Array.isArray(files) ? files : [files];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const images = fileArray.filter(f => validExtensions.some(ext => f.toLowerCase().endsWith(ext)));

      // Group by parent folder
      const groups = {};
      images.forEach(img => {
        const parts = img.split('/');
        const folderName = parts[parts.length - 2];
        if (!groups[folderName]) groups[folderName] = [];
        groups[folderName].push(img);
      });

      let html = '';
      for (const [folder, imgs] of Object.entries(groups)) {
        const displayName = folder.charAt(0).toUpperCase() + folder.slice(1);
        
        // Build the stacked mockup HTML
        let mockupHtml = '';
        if (imgs.length > 1) {
          // Multiple images: stacked layout
          mockupHtml = `
            <div class="brochure-mockup-stack">
              <img src="${imgs[0]}" alt="${displayName} Page 1" class="mockup-page page-1" loading="lazy" />
              <img src="${imgs[1]}" alt="${displayName} Page 2" class="mockup-page page-2" loading="lazy" />
            </div>
          `;
        } else {
          // Single image: flat
          mockupHtml = `
            <div class="brochure-mockup-single">
              <img src="${imgs[0]}" alt="${displayName}" class="mockup-page" loading="lazy" />
            </div>
          `;
        }

        // We will pass the array of images to the lightbox logic via data attributes or click
        // For simplicity, click opens first image. Ideally, lightbox should support galleries.
        // We'll stringify the array so onclick can grab it, but inline strings can break.
        // Let's just open the first one for now, or build a simple gallery switch.
        html += `
          <div class="brochure-card" onclick="openLightbox('${imgs[0]}')">
            <div class="brochure-preview-area">
              ${mockupHtml}
            </div>
            <div class="brochure-title">${displayName} Brochure</div>
          </div>
        `;
      }
      container.innerHTML = html || '<p style="color: #94a3b8; width: 100%; text-align: center;">No brochures found.</p>';
    }

    // Helper: Masonry Gallery (Social Posts - original aspect ratio)
    function renderMasonryGallery(files, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const fileArray = Array.isArray(files) ? files : [files];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const images = fileArray.filter(f => validExtensions.some(ext => f.toLowerCase().endsWith(ext)));
      
      let html = '';
      images.forEach(img => {
        const fileName = img.split('/').pop().split('.')[0];
        html += `
          <div class="masonry-item" onclick="openLightbox('${img}')">
            <img src="${img}" alt="${fileName}" loading="lazy" />
          </div>
        `;
      });
      container.innerHTML = html || '<p style="color: #94a3b8; width: 100%; text-align: center;">No assets found.</p>';
    }

