'use strict';

(function () {

  var MAIN_PIN_POINTER_HEIGHT = 10;
  var MAIN_PIN_POINTER_WIDTH = 22;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var addFormButton = document.querySelector('.ad-form__submit');
  var resetFormButton = document.querySelector('.ad-form__reset');
  var errorButton = document.querySelector('.error__button');
  var ESCAPE_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var TIME_OUT = 2000;

  // Импорт данных из других модулей
  var addressInput = window.inactiveMode.addressInput;
  var mainPin = window.inactiveMode.mainPin;
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var main = document.querySelector('main');

  var mainPinLeft = parseInt(mainPin.style.left, 10);
  var mainPinTop = parseInt(mainPin.style.top, 10);

  var isActivePage = false;

  //  меняю адрес, исходя из полуенных цифр
  function changeAddressValue(left, top) {
    addressInput.value = left + ', ' + top;
  }

  function closeMessage(type) {
    document.querySelector(type).removeEventListener('click', closeMessageOnClick);
    window.removeEventListener('keydown', closeMessageOnKeyDown);
    document.querySelector(type).remove();
    window.form.onBlockPage();
  }

  function closeMessageOnClick(evt) {
    var error = document.querySelector('.error');
    var success = document.querySelector('.success');

    if (document.querySelector('main').lastChild === error) {
      if (evt.currentTarget === errorButton || evt.target !== document.querySelector('.error__message')) {
        closeMessage('.error');
      }
    }

    if (document.querySelector('main').lastChild === success) {
      if (evt.target !== document.querySelector('.success__message')) {
        closeMessage('.success');
      }
    }
  }

  function closeMessageOnKeyDown(evt) {
    var error = document.querySelector('.error');
    var success = document.querySelector('.success');

    if (evt.key === ESCAPE_KEY) {
      if (document.querySelector('main').lastChild === error) {
        closeMessage('.error');
      }

      if (document.querySelector('main').lastChild === success) {
        closeMessage('.success');
      }
    }
  }

  // появление окна с ошибкой
  function showErrorMessage(msg) {
    var errorClone = errorTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    errorClone.querySelector('.error__message').textContent = msg;
    fragment.appendChild(errorClone);
    main.appendChild(fragment);

    setTimeout(document.querySelector('.error').addEventListener('click', closeMessageOnClick), TIME_OUT);
    setTimeout(window.addEventListener('keydown', closeMessageOnKeyDown), TIME_OUT);
  }

  // появление "успешного окна"
  function showSuccessMessage() {
    var successClone = successTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(successClone);
    main.appendChild(fragment);
    // Закрытие окна
    document.querySelector('.success').addEventListener('click', closeMessageOnClick);
    window.addEventListener('keydown', closeMessageOnKeyDown);
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

      window.serverRequest.loadData(window.filter.update, showErrorMessage);
      window.map.onActivePin();
      window.activeMode.isActivePage = true;
      window.form.onSelectRoom();
      window.form.onSelectType();
      return;
    }
  }

  function onActivate(evt) {
    if (evt.key === ENTER_KEY || evt.which === 1) {
      mainPin.removeEventListener('keydown', onActivate);
      changeOnActiveMode();
    }
  }

  mainPin.addEventListener('keydown', onActivate);

  mainPin.addEventListener('mousedown', onActivate);


  // Экспорт функций модуля
  window.activeMode = {
    MAIN_PIN_WIDTH: MAIN_PIN_WIDTH,
    MAIN_PIN_HEIGHT: MAIN_PIN_HEIGHT,
    MAIN_PIN_POINTER_WIDTH: MAIN_PIN_POINTER_WIDTH,
    MAIN_PIN_POINTER_HEIGHT: MAIN_PIN_POINTER_HEIGHT,
    changeAddressValue: changeAddressValue,
    isActivePage: isActivePage,
    onDisable: onDisable,
    changeCursor: changeCursor,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };
})();
