// Navigation preload and smooth page switching
document.addEventListener('DOMContentLoaded', () => {
    const floatingButtons = document.querySelectorAll('.floating-btn');
    const preloadedPages = new Map();

    floatingButtons.forEach(btn => {
        // Skip if it's the current page
        if (btn.classList.contains('active')) {
            return;
        }

        // Preload on hover
        btn.addEventListener('mouseenter', () => {
            const href = btn.getAttribute('href');
            
            // Only preload if we haven't already
            if (!preloadedPages.has(href)) {
                preloadPageContent(href);
            }
        });

        // Intercept clicks for smooth transition
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const href = btn.getAttribute('href');
            navigateToPage(href);
        });
    });

    async function preloadPageContent(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            preloadedPages.set(url, html);
            
            // Also use browser prefetch
            const linkPreload = document.createElement('link');
            linkPreload.rel = 'prefetch';
            linkPreload.href = url;
            linkPreload.as = 'document';
            document.head.appendChild(linkPreload);
        } catch (error) {
            console.error('Preload failed:', error);
        }
    }

    async function navigateToPage(url) {
        // Add fade out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';

        try {
            let html;
            
            // Use preloaded content if available
            if (preloadedPages.has(url)) {
                html = preloadedPages.get(url);
            } else {
                const response = await fetch(url);
                html = await response.text();
            }

            // Parse the HTML
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');

            // Update page title
            document.title = newDoc.title;

            // Replace main content
            const newContainer = newDoc.querySelector('.container');
            const currentContainer = document.querySelector('.container');
            if (newContainer && currentContainer) {
                currentContainer.innerHTML = newContainer.innerHTML;
            }

            // Update active button state
            document.querySelectorAll('.floating-btn').forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('href') === url) {
                    b.classList.add('active');
                }
            });

            // Load new scripts if needed
            const scripts = newDoc.querySelectorAll('script[src]');
            scripts.forEach(script => {
                const src = script.getAttribute('src');
                // Skip nav-preload.js as it's already loaded
                if (src && !src.includes('nav-preload.js')) {
                    loadScript(src);
                }
            });

            // Load new stylesheets if needed
            const styles = newDoc.querySelectorAll('link[rel="stylesheet"]');
            styles.forEach(style => {
                const href = style.getAttribute('href');
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const newStyle = document.createElement('link');
                    newStyle.rel = 'stylesheet';
                    newStyle.href = href;
                    document.head.appendChild(newStyle);
                }
            });

            // Update URL without reload
            history.pushState({}, '', url);

            // Fade back in
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);

        } catch (error) {
            console.error('Navigation failed:', error);
            // Fallback to normal navigation
            window.location.href = url;
        }
    }

    function loadScript(src) {
        // Remove existing script if present
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            existing.remove();
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            // Reinitialize page-specific functionality
            if (typeof initializeCompetencies === 'function') {
                initializeCompetencies();
            }
            if (typeof loadProjectData === 'function') {
                loadProjectData();
                if (typeof initializeEventListeners === 'function') {
                    initializeEventListeners();
                }
            }
        };
        document.body.appendChild(script);
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        location.reload();
    });
});
