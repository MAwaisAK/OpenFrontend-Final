// offcanvas.js

(function() {
  'use strict';

  // Utility to load an external script and call callback on load
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(script);
  }

  // The actual init logic that needs jQuery
  function init() {
    (function($) {
      $(function() {
        $('[data-toggle="offcanvas"]').on('click', function() {
          $('.sidebar-offcanvas').toggleClass('active');
        });
      });
    })(jQuery);
  }

  // 1) If jQuery is already present, just init
  if (typeof jQuery !== 'undefined') {
    init();

  // 2) Otherwise, load jQuery first (CDN shown; swap to local if you prefer)
  } else {
    loadScript('/assets/adminassets/js/jquery-3.6.0.min.js', init);
    // — or for a local file:
    // loadScript('js/jquery-3.6.0.min.js', init);
  }
})();
