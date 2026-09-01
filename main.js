// Sophie Bizley — Portfolio (Editorial Mix)
// Shared behavior: mobile nav, scroll reveal, count-up stats, reduced-motion handling.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  var burger = document.querySelector('.burger');
  var navlinks = document.querySelector('.navlinks');
  if (burger && navlinks) {
    burger.addEventListener('click', function () {
      var open = navlinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navlinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navlinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reduced-motion: swap animated GIFs for their static poster frame
  document.querySelectorAll('img[data-gif]').forEach(function (im) {
    if (reduceMotion) im.src = im.getAttribute('data-gif');
  });

  // Numbers are already correct in the markup (see index.html etc.) so that
  // anyone/anything not running this script — crawlers, link-preview bots,
  // screen readers before hydration, JS-disabled browsers — sees the real
  // figures. This script only adds a decorative fade/slide reveal; it never
  // overwrites the stat text, so there is no zero-flash and no dependency on
  // JS for correctness.

  if (reduceMotion) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Scroll reveal
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  items.forEach(function (el) {
    var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
    if (delay) el.style.transitionDelay = delay + 'ms';
  });
  var reveal = function (el) {
    if (el._revealed) return;
    el._revealed = true;
    el.classList.add('is-visible');
  };

  var checkVisible = function () {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(function (el) {
      if (el._revealed) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) reveal(el);
    });
  };

  requestAnimationFrame(function () { requestAnimationFrame(checkVisible); });
  window.addEventListener('scroll', checkVisible, { passive: true });
  window.addEventListener('resize', checkVisible);

  // Guaranteed fallback in case something never crosses the visibility threshold
  setTimeout(function () { items.forEach(reveal); }, 2500);
})();
