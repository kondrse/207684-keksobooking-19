'use strict';

(function () {
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var allPins;

  // генерируем клон из шаблона
  function renderPin(pin) {
    var pinClone = pinTemplate.cloneNode(true);

    pinClone.style = 'left: ' + (pin.location.x - (WIDTH_PIN / 2)) + 'px; top: ' + (pin.location.y - HEIGHT_PIN) + 'px;';
    pinClone.querySelector('img').src = pin.author.avatar;
    pinClone.querySelector('img').alt = pin.offer.title;
    return pinClone;
  }

  var mapPinsWrapper = document.querySelector('.map__pins');
  // все метки на карте
  var fragment = document.createDocumentFragment();

  // добавляем объявление в разметку
  function addPinsToDom(posters) {
    for (var i = 0; i < posters.length && i < 5; i++) {
      fragment.appendChild(renderPin(posters[i]));
    }
    mapPinsWrapper.appendChild(fragment);
  }

  // удаление всех меток на карте
  function deletePins() {
    allPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    allPins.forEach(function (pin) {
      pin.remove();
    });
  }

  // function updatePins() {
  //   console.log('Обновила объявления + удалила предыдущие + удалила карточку');
  //   deletePins();
  //   window.card.removeCard();
  //   window.filter.filterByData(window.serverRequest.posters);
  // }

  // Экспорт функций модуля
  window.pins = {
    addPinsToDom: addPinsToDom,
    deletePins: deletePins
    // updatePins: updatePins
  };
})();
