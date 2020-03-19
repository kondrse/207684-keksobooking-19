'use strict';

(function () {
  // пол секунды
  var DEBOUNCE_INTERVAL = 500;

  function onDebaunce(cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }

  window.optimization = {
    debaunce: onDebaunce
  };
})();
