// Pagefind search initialization
(function() {
  'use strict';

  function init() {
    new PagefindUI({
      element: "#search",
      showSubResults: true,
      showImages: false
    });

    // Hide the original osmosfeed article content since Pagefind handles search display
    var content = document.getElementById('content');
    if (content) {
      content.style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
