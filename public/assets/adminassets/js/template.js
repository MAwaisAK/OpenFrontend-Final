// main.js

(function() {
  'use strict';

  // helper to inject a <script> tag, then fire callback on load
  function loadScript(src, callback) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = callback;
    s.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(s);
  }

  // wrap all your existing jQuery/Bootstrap init logic here:
  function init() {
    (function($) {
      'use strict';
      // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
      // your original code:
      $(function() {
        var body = $('body');
        var contentWrapper = $('.content-wrapper');
        var scroller = $('.container-scroller');
        var footer = $('.footer');
        var sidebar = $('.sidebar');

        // Add active class to nav-link based on url dynamically
        function addActiveClass(element) {
          var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
          if (current === "") {
            if (element.attr('href').indexOf("index.html") !== -1) {
              element.parents('.nav-item').last().addClass('active');
              if (element.parents('.sub-menu').length) {
                element.closest('.collapse').addClass('show');
                element.addClass('active');
              }
            }
          } else {
            if (element.attr('href').indexOf(current) !== -1) {
              element.parents('.nav-item').last().addClass('active');
              if (element.parents('.sub-menu').length) {
                element.closest('.collapse').addClass('show');
                element.addClass('active');
              }
              if (element.parents('.submenu-item').length) {
                element.addClass('active');
              }
            }
          }
        }

        $('.nav li a', sidebar).each(function() {
          addActiveClass($(this));
        });
        $('.horizontal-menu .nav li a').each(function() {
          addActiveClass($(this));
        });

        // Close other submenu in sidebar on opening any
        sidebar.on('show.bs.collapse', '.collapse', function() {
          sidebar.find('.collapse.show').collapse('hide');
        });

        // Change sidebar and content-wrapper height
        applyStyles();
        function applyStyles() {
          if (!body.hasClass("rtl")) {
            if ($('.settings-panel .tab-content .tab-pane.scroll-wrapper').length) {
              new PerfectScrollbar('.settings-panel .tab-content .tab-pane.scroll-wrapper');
            }
            if ($('.chats').length) {
              new PerfectScrollbar('.chats');
            }
            if (body.hasClass("sidebar-fixed") && $('#sidebar').length) {
              new PerfectScrollbar('#sidebar .nav');
            }
          }
        }

        // minimize sidebar toggle
        $('[data-toggle="minimize"]').on("click", function() {
          if (body.hasClass('sidebar-toggle-display') || body.hasClass('sidebar-absolute')) {
            body.toggleClass('sidebar-hidden');
          } else {
            body.toggleClass('sidebar-icon-only');
          }
        });

        // checkbox/radio helper icon
        $(".form-check label, .form-radio label")
          .append('<i class="input-helper"></i>');

        // horizontal menu toggle on mobile
        $('[data-toggle="horizontal-menu-toggle"]').on("click", function() {
          $(".horizontal-menu .bottom-navbar").toggleClass("header-toggled");
        });

        // horizontal submenu behavior on mobile
        var navItemClicked = $('.horizontal-menu .page-navigation > .nav-item');
        navItemClicked.on("click", function() {
          if (window.matchMedia('(max-width: 991px)').matches) {
            if (!$(this).hasClass('show-submenu')) {
              navItemClicked.removeClass('show-submenu');
            }
            $(this).toggleClass('show-submenu');
          }
        });

        // fixed header on scroll for desktop
        $(window).scroll(function() {
          if (window.matchMedia('(min-width: 992px)').matches) {
            var header = $('.horizontal-menu');
            if ($(window).scrollTop() >= 70) {
              header.addClass('fixed-on-scroll');
            } else {
              header.removeClass('fixed-on-scroll');
            }
          }
        });
      });

      // focus input when clicking on search icon
      $('#navbar-search-icon').on('click', function() {
        $("#navbar-search-input").focus();
      });

      // bootstrap popovers & tooltips
      var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
      );
      popoverTriggerList.forEach(function(el) {
        new bootstrap.Popover(el);
      });

      var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach(function(el) {
        new bootstrap.Tooltip(el);
      });
      // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    })(jQuery);
  }

  // If jQuery is already here, just init; otherwise, load it then init
  if (typeof jQuery !== 'undefined') {
    init();
  } else {
    // CDN:
    loadScript('/assets/adminassets/js/jquery-3.6.0.min.js', init);
    // Or swap for your local file:
    // loadScript('js/jquery-3.6.0.min.js', init);
  }
})();
