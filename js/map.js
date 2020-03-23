'use strict';

(function () {

  var MapCoordinate = {
    WIDTH: document.querySelector('.map').clientWidth,
    HEIGHT: document.querySelector('.map').clientHeight
  };

  var MainPinCoordinate = {
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
    MAX: MapCoordinate.WIDTH - (window.activeMode.MAIN_PIN_WIDTH / 2)
  };

  var mainPinElement = window.inactiveMode.mainPinElement;

  function onClickPin(evt) {
    evt.preventDefault();
    var target = evt.currentTarget;

    var StartCoords = {
      X: evt.clientX,
      Y: evt.clientY
    };
    // перемещения еще нет
    var dragged = false;

    // функция перемещения
    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // перемещение сработало
      dragged = true;

      var Shift = {
        X: StartCoords.X - moveEvt.clientX,
        Y: StartCoords.Y - moveEvt.clientY
      };

      // переписываю изначальные кординаты при переемещени
      StartCoords = {
        X: moveEvt.clientX,
        Y: moveEvt.clientY
      };

      mainPinElement.style.top = mainPinElement.offsetTop - Shift.Y + 'px';
      mainPinElement.style.left = mainPinElement.offsetLeft - Shift.X + 'px';

      if (parseInt(target.style.left, 10) < XCoordinate.MIN) {
        target.style.left = XCoordinate.MIN + 'px';
        mainPinElement.style.left = XCoordinate.MIN;
      } else if (parseInt(target.style.left, 10) > XCoordinate.MAX) {
        target.style.left = XCoordinate.MAX + 'px';
        mainPinElement.style.left = XCoordinate.MAX;
      }

      if (parseInt(target.style.top, 10) < YCoordinate.MIN) {
        target.style.top = YCoordinate.MIN + 'px';
        mainPinElement.style.top = YCoordinate.MIN;
      } else if (parseInt(target.style.top, 10) > YCoordinate.MAX) {
        target.style.top = YCoordinate.MAX + 'px';
        mainPinElement.style.top = YCoordinate.MAX;
      }

      window.activeMode.changeAddressValue(Math.round(parseInt(target.style.left, 10) + (MainPinCoordinate.WIDTH / 2)), parseInt(target.style.top, 10) + MainPinCoordinate.HEIGHT + MainPinCoordinate.TIPHEIGHT);
    }

    function onMouseUp(mouseUpEvt) {
      mouseUpEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (dragEvt) {
          dragEvt.preventDefault();
          mainPinElement.removeEventListener('click', onClickPreventDefault);
        };
        mainPinElement.addEventListener('click', onClickPreventDefault);
      }

    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onActivePin() {
    mainPinElement.addEventListener('mousedown', onClickPin);
  }

  function deleteActivePin() {
    mainPinElement.removeEventListener('mousedown', onClickPin);
  }

  // Экспорт данных из модуля
  window.mapElement = {
    onActivePin: onActivePin,
    MainPinCoordinate: MainPinCoordinate,
    deleteActivePin: deleteActivePin
  };
})();
