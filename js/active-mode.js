'use strict';

(function () {

  var MAIN_PIN_POINTER_HEIGHT = 10;
  var MAIN_PIN_POINTER_WIDTH = 22;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var addFormButton = document.querySelector('.ad-form__submit');
  var resetFormButton = document.querySelector('.ad-form__reset');
  // var ENTER_KEY = 'Enter';
  var ESCAPE_KAY = 'Escape';

  // Импорт данных из других модулей
  var addressInput = window.inactiveMode.addressInput;
  var mainPin = window.inactiveMode.mainPin;
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var main = document.querySelector('main');

  var mainPinLeft = parseInt(mainPin.style.left, 10);
  var mainPinTop = parseInt(mainPin.style.top, 10);

  var isActivePage = false;

  //  меняю адрес исходя из полуенных цифр
  var changeAddressValue = function (left, top) {
    addressInput.value = left + ', ' + top;
  };

  function closeMessage(msg) {
    document.addEventListener('click', function (evt) {

      if (evt.target !== document.querySelector(msg + '__message')) {
        document.querySelector(msg).remove();
      }
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.key === ESCAPE_KAY) {
        document.querySelector(msg).remove();
      }
    });
  }

  // появление окна с ошибкой
  function showErrorMessage(msg) {
    var errorClone = errorTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    errorClone.querySelector('.error__message').innerHTML = msg;
    fragment.appendChild(errorClone);
    main.appendChild(fragment);


    setTimeout(document.addEventListener('click', closeMessage('.error')), 2000);
  }

  // появление "успешного окна"
  function showSuccessMessage() {
    var successClone = successTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(successClone);
    main.appendChild(fragment);
    // Закрытие окна
    document.querySelector('.success').addEventListener('click', closeMessage('.success'));
    // window.addEventListener('click', closeMessage('.success'));
    document.addEventListener('keydown', function (evt) {
      if (evt.key === ESCAPE_KAY) {
        closeMessage('.success');
      }
    });
  }

  function onDisable(list, value) {
    list.forEach(function (item) {
      item.disabled = value;
    });
  }

  function changeCursor(list, cursor) {
    list.forEach(function (item) {
      item.style.cursor = cursor;
    });
  }

  // вкл Активное состояние
  function changeOnActiveMode() {
    // если страницы не активна
    if (!window.activeMode.isActivePage) {
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');
      window.inactiveMode.notDisabledAllFildset();
      onDisable(document.querySelectorAll('.map__filter'), false);
      onDisable(document.querySelectorAll('.map__checkbox'), false);
      changeCursor(document.querySelectorAll('.map__filter'), 'pointer');
      changeCursor(document.querySelectorAll('.map__feature'), 'pointer');
      addFormButton.disabled = false;
      resetFormButton.disabled = false;
      mainPinLeft = Math.round(parseInt(mainPin.style.left, 10) + (MAIN_PIN_WIDTH / 2));
      mainPinTop = Math.round(parseInt(mainPin.style.top, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT);

      changeAddressValue(mainPinLeft, mainPinTop);

      window.serverRequest.loadData(window.filter.filterByData, showErrorMessage);
      window.map.onActivePin();
      window.activeMode.isActivePage = true;
      window.form.onSelectRoom();
      // window.serverRequest.onSuccesLoad('https://js.dump.academy/keksobooking', showSuccessMessage, showErrorMessage);
      return;
    }
  }

  mainPin.addEventListener('mousedown', changeOnActiveMode);
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.which === 1) {
      window.activeMode.changeOnActiveMode();
    }
  });


  // Экспорт функций модуля
  window.activeMode = {
    changeOnActiveMode: changeOnActiveMode,
    mainPin: mainPin,
    MAIN_PIN_WIDTH: MAIN_PIN_WIDTH,
    MAIN_PIN_HEIGHT: MAIN_PIN_HEIGHT,
    MAIN_PIN_POINTER_WIDTH: MAIN_PIN_POINTER_WIDTH,
    MAIN_PIN_POINTER_HEIGHT: MAIN_PIN_POINTER_HEIGHT,
    addressInput: addressInput,
    changeAddressValue: changeAddressValue,
    isActivePage: isActivePage,
    onDisable: onDisable,
    changeCursor: changeCursor,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };
})();
