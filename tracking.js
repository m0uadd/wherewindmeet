// Google Analytics (GA4) Global Site Tag injection
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-9QE0P3ZZYX'; // Replace with actual measurement ID
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-9QE0P3ZZYX'); // Replace with actual measurement ID

// Facebook Pixel Code injection
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'XXXXXXXXXXXXXXXXX'); // Replace with actual Pixel ID

// 1. PageView - On page open
fbq('track', 'PageView');
// GA automatically tracks 'page_view' on config via default settings

// Helper function to send events to both tracking platforms
function trackEvent(eventName, params = {}) {
    // Send to Facebook Pixel
    if (typeof fbq === 'function') {
        fbq('trackCustom', eventName, params);
    }
    // Send to Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
    console.log(`[Tracking] Event: ${eventName}`, params);
}

// Global click tracker
document.addEventListener('click', function (e) {
    // 2. Lead - Hero or Final CTA button clicked
    const ctaItem = e.target.closest('.nav-cta, .btn-primary');
    if (ctaItem) {
        trackEvent('Lead', { location: ctaItem.className || 'cta-btn' });
    }

    // 3. ViewContent - Clicking on any event or class 
    // Translated to clicking any major interactive card like weapons, FAQ, modes, gallery items
    const contentItem = e.target.closest('.g-item, .weapon-slide, .mode-card, .faq-q, .why-card');
    if (contentItem) {
        let contentName = 'Unknown Content';
        if (contentItem.classList.contains('g-item')) contentName = 'Gallery Item';
        else if (contentItem.classList.contains('weapon-slide')) contentName = 'Weapon Class';
        else if (contentItem.classList.contains('mode-card')) contentName = 'Social Mode';
        else if (contentItem.classList.contains('faq-q')) contentName = 'FAQ Item';
        else if (contentItem.classList.contains('why-card')) contentName = 'Feature Card';

        trackEvent('ViewContent', { content_type: contentName });
    }

    // 6. EventTabSwitch - Tab/Weapon change in carousel
    const tabItem = e.target.closest('.carousel-btn, .dot');
    if (tabItem) {
        trackEvent('EventTabSwitch', { control: tabItem.className });
    }

    // 7. LanguageSwitch - Changing the language
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
        trackEvent('LanguageSwitch', { language: langBtn.getAttribute('data-lang') });
    }
});

// Observing sections for visibility triggers
let eventsVisibleFired = false;
let ctaFinalVisibleFired = false;

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // 50% element visible triggers the event
};

const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 4. EventsSectionVisible - Reaching the events/classes section (Combat/Weapons)
            if (entry.target.id === 'combat' && !eventsVisibleFired) {
                trackEvent('EventsSectionVisible');
                eventsVisibleFired = true;
            }
            // 5. CTAFinalVisible - Seeing the final CTA section
            if (entry.target.id === 'cta-final' && !ctaFinalVisibleFired) {
                trackEvent('CTAFinalVisible');
                ctaFinalVisibleFired = true;
            }
        }
    });
}, observerOptions);

const combatSection = document.getElementById('combat');
const ctaSection = document.getElementById('cta-final');

if (combatSection) visibilityObserver.observe(combatSection);
if (ctaSection) visibilityObserver.observe(ctaSection);

// 8. ScrollDepth50 - Exceeding 50% scroll of the page
let scroll50Fired = false;
window.addEventListener('scroll', () => {
    if (scroll50Fired) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Calculate scroll percentage and avoid division by zero
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

    if (scrollPercent >= 0.5) {
        trackEvent('ScrollDepth50');
        scroll50Fired = true;
    }
});

// 9. TimeOnPage30s / 60s
setTimeout(() => {
    trackEvent('TimeOnPage30s');
}, 30000);

setTimeout(() => {
    trackEvent('TimeOnPage60s');
}, 60000);
