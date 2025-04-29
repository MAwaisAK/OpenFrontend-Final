// settings.js

(function() {
  'use strict';

  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(script);
  }

  function init() {
    (function($) {
      'use strict';

      $(function() {
        $(".nav-settings").on("click", function() {
          $("#right-sidebar").toggleClass("open");
        });

        $(".settings-close").on("click", function() {
          $("#right-sidebar, #theme-settings").removeClass("open");
        });

        $("#settings-trigger").on("click", function() {
          $("#theme-settings").toggleClass("open");
        });

        // background constants
        var navbar_classes = "navbar-danger navbar-success navbar-warning navbar-dark navbar-light navbar-primary navbar-info navbar-pink";
        var sidebar_classes = "sidebar-light sidebar-dark";
        var $body = $("body");

        // sidebar background switching
        $("#sidebar-light-theme").on("click", function() {
          $body.removeClass(sidebar_classes);
          $body.addClass("sidebar-light");
          $(".sidebar-bg-options").removeClass("selected");
          $(this).addClass("selected");
        });

        $("#sidebar-dark-theme").on("click", function() {
          $body.removeClass(sidebar_classes);
          $body.addClass("sidebar-dark");
          $(".sidebar-bg-options").removeClass("selected");
          $(this).addClass("selected");
        });

        // navbar background switching
        $(".tiles.primary").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-primary");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.success").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-success");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.warning").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-warning");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.danger").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-danger");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.light").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-light");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.info").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-info");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.dark").on("click", function() {
          $(".navbar").removeClass(navbar_classes).addClass("navbar-dark");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });

        $(".tiles.default").on("click", function() {
          $(".navbar").removeClass(navbar_classes);
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
      });

    })(jQuery);
  }

  if (typeof jQuery !== 'undefined') {
    init();
  } else {
    loadScript('/assets/adminassets/js/jquery-3.6.0.min.js', init);
    // Or your local copy
    // loadScript('js/jquery-3.6.0.min.js', init);
  }
})();
