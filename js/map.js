'use strict';

(function () {

  var mapCoordinates = {
    width: document.querySelector('.map').clientWidth,
    height: document.querySelector('.map').clientHeight
  };

  var MainPinCoordinates = {
    WIDTH: 62,
    HEIGHT: 62,
    // длина и высота кончика метки
    TIPWIDTH: 10,
    TIPHEIGHT: 22
  };

  var YCoordinate = {
    MIN: 45,
    MAX: 546
  };

  var XCoordinate = {
    MIN: -(window.activeMode.MAIN_PIN_WIDTH / 2),
    MAX: mapCoordinates.width - (window.activeMode.MAIN_PIN_WIDTH / 2)
  };

  var mainPin = window.inactiveMode.mainPin;

  function onClickPin(evt) {
    evt.preventDefault();
    var target = evt.currentTarget;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // перемещения еще нет
    var dragged = false;

    // функция перемещения
    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // перемещение сработало
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // переписываю изначальные кординаты при переемещени
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
      mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';

      if (parseInt(target.style.left, 10) < XCoordinate.MIN) {
        target.style.left = XCoordinate.MIN + 'px';
        mainPin.style.left = XCoordinate.MIN;
      } else if (parseInt(target.style.left, 10) > XCoordinate.MAX) {
        target.style.left = XCoordinate.MAX + 'px';
        mainPin.style.left = XCoordinate.MAX;
      }

      if (parseInt(target.style.top, 10) < YCoordinate.MIN) {
        target.style.top = YCoordinate.MIN + 'px';
        mainPin.style.top = YCoordinate.MIN;
      } else if (parseInt(target.style.top, 10) > YCoordinate.MAX) {
        target.style.top = YCoordinate.MAX + 'px';
        mainPin.style.top = YCoordinate.MAX;
      }

      window.activeMode.changeAddressValue(Math.round(parseInt(target.style.left, 10) + (MainPinCoordinates.WIDTH / 2)), parseInt(target.style.top, 10) + MainPinCoordinates.HEIGHT + MainPinCoordinates.TIPHEIGHT);
    }

    function onMouseUp(mouseUpEvt) {
      mouseUpEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (dragEvt) {
          dragEvt.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }

    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onActivePin() {
    mainPin.addEventListener('mousedown', onClickPin);
  }

  function deleteActivePin() {
    mainPin.removeEventListener('mousedown', onClickPin);
  }

  // Экспорт данных из модуля
  window.map = {
    onActivePin: onActivePin,
    MainPinCoordinates: MainPinCoordinates,
    deleteActivePin: deleteActivePin
  };
})();
