'use strict';

(function () {
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var allPin;

  // генерируем клон из шаблона
  function renderPin(pin) {
    var pinClone = pinTemplateElement.cloneNode(true);
    pinClone.style = 'left: ' + (pin.location.x - (WIDTH_PIN / 2)) + 'px; top: ' + (pin.location.y - HEIGHT_PIN) + 'px;';
    pinClone.querySelector('img').src = pin.author.avatar;
    pinClone.querySelector('img').alt = pin.offer.title;
    return pinClone;
  }

  var mapPinWrapperElement = document.querySelector('.map__pins');
  // все метки на карте
  var fragment = document.createDocumentFragment();

  // добавляем объявление в разметку
  function addPinsToDom(posters) {
    for (var i = 0; i < posters.length; i++) {
      fragment.appendChild(renderPin(posters[i]));
    }
    mapPinWrapperElement.appendChild(fragment);
  }

  // удаление всех меток на карте
  function deletePins() {
    allPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    allPin.forEach(function (pin) {
      pin.remove();
    });
  }

  // Экспорт функций модуля
  window.pins = {
    addToDom: addPinsToDom,
    delete: deletePins
  };
})();
