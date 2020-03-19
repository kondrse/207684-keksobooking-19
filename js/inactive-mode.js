'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;

  // 1.1.3 ТЗ
  var selectElements = document.querySelectorAll('.ad-form fieldset');

  function disabledAllFildset() {
    for (var i = 0; i < selectElements.length - 1; i++) {
      selectElements[i].setAttribute('disabled', 'disabled');
    }
  }

  disabledAllFildset();

  function notDisabledAllFildset() {
    for (var i = 0; i < selectElements.length - 1; i++) {
      selectElements[i].removeAttribute('disabled');
    }
  }

  var mainPin = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');

  // получение координат и приведение их к числовому формату для последующих изменений
  var leftCoordinate = Number((mainPin.style.left).match(/\d*/));
  var topCoordinate = Number((mainPin.style.top).match(/\d*/));

  // задание базового положения при неактивном состоянии
  addressInput.setAttribute('value', String((leftCoordinate + Math.round(MAIN_PIN_WIDTH / 2))) + ', ' + String((topCoordinate + Math.round(MAIN_PIN_HEIGHT / 2))));

  // Экспорт данных модуля
  window.inactiveMode = {
    notDisabledAllFildset: notDisabledAllFildset,
    disabledAllFildset: disabledAllFildset,
    mainPin: mainPin,
    addressInput: addressInput,
    leftCoordinate: leftCoordinate,
    topCoordinate: topCoordinate
  };
})();
