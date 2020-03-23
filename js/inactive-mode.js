'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;

  // 1.1.3 ТЗ
  var selectFieldsetElement = document.querySelectorAll('.ad-form fieldset');

  var mainPinElement = document.querySelector('.map__pin--main');
  var addressInputElement = document.querySelector('#address');

  // получение координат и приведение их к числовому формату для последующих изменений
  var leftCoordinate = Number((mainPinElement.style.left).match(/\d*/));
  var topCoordinate = Number((mainPinElement.style.top).match(/\d*/));

  function disabledAllFildset() {
    for (var i = 0; i < selectFieldsetElement.length - 1; i++) {
      selectFieldsetElement[i].setAttribute('disabled', 'disabled');
    }
  }

  disabledAllFildset();

  function notDisabledAllFildset() {
    for (var i = 0; i < selectFieldsetElement.length - 1; i++) {
      selectFieldsetElement[i].removeAttribute('disabled');
    }
  }

  // задание базового положения при неактивном состоянии
  addressInputElement.setAttribute('value', String((leftCoordinate + Math.round(MAIN_PIN_WIDTH / 2))) + ', ' + String((topCoordinate + Math.round(MAIN_PIN_HEIGHT / 2))));

  // Экспорт данных модуля
  window.inactiveMode = {
    notDisabledAllFildset: notDisabledAllFildset,
    disabledAllFildset: disabledAllFildset,
    mainPinElement: mainPinElement,
    addressInputElement: addressInputElement
  };
})();
