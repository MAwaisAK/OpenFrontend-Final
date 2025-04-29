// todo.js

(function() {
  'use strict';

  // Helper: load an external script, then call callback
  function loadScript(src, callback) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = callback;
    s.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(s);
  }

  // Your to-do init logic, wrapped to wait for jQuery
  function init() {
    (function($) {
      'use strict';
      $(function() {
        var todoListItem  = $('.todo-list');
        var todoListInput = $('.todo-list-input');

        // Add new item
        $('.todo-list-add-btn').on('click', function(event) {
          event.preventDefault();
          var itemText = $(this).prevAll('.todo-list-input').val().trim();

          if (itemText) {
            todoListItem.append(
              "<li>" +
                "<div class='form-check'>" +
                  "<label class='form-check-label'>" +
                    "<input class='checkbox' type='checkbox'/> " +
                    itemText +
                    "<i class='input-helper'></i>" +
                  "</label>" +
                "</div>" +
                "<i class='remove ti-close'></i>" +
              "</li>"
            );
            todoListInput.val('');
          }
        });

        // Toggle completed
        todoListItem.on('change', '.checkbox', function() {
          var $chk = $(this);
          if ($chk.attr('checked')) {
            $chk.removeAttr('checked');
          } else {
            $chk.attr('checked', 'checked');
          }
          $chk.closest('li').toggleClass('completed');
        });

        // Remove item
        todoListItem.on('click', '.remove', function() {
          $(this).parent().remove();
        });
      });
    })(jQuery);
  }

  // If jQuery already loaded, just init; else load from CDN then init
  if (typeof jQuery !== 'undefined') {
    init();
  } else {

    // Or use your local file:
    loadScript('/assets/adminassets/js/jquery-3.6.0.min.js', init);
  }
})();
