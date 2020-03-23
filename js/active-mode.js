'use strict';

(function () {

  var MAIN_PIN_POINTER_HEIGHT = 10;
  var MAIN_PIN_POINTER_WIDTH = 22;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var TIME_OUT = 2000;
  var addFormButtonElement = document.querySelector('.ad-form__submit');
  var resetFormButtonElement = document.querySelector('.ad-form__reset');
  var errorButtonElement = document.querySelector('.error__button');
  var ESCAPE_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  // Импорт данных из других модулей
  var addressInputElement = window.inactiveMode.addressInputElement;
  var mainPinElement = window.inactiveMode.mainPinElement;
  var errorTemplateElement = document.querySelector('#error').content.querySelector('.error');
  var successTemplateElement = document.querySelector('#success').content.querySelector('.success');
  var mainElement = document.querySelector('main');

  var mainPinLeft = parseInt(mainPinElement.style.left, 10);
  var mainPinTop = parseInt(mainPinElement.style.top, 10);

  var isActivePage = false;

  //  меняю адрес, исходя из полуенных цифр
  function changeAddressValue(left, top) {
    addressInputElement.value = left + ', ' + top;
  }

  function closeMessage(type) {
    document.querySelector(type).removeEventListener('click', onCloseMassageClick);
    window.removeEventListener('keydown', onCloseMassageKeyDown);
    document.querySelector(type).remove();
    window.formElement.onBlockPage();
  }

  function onCloseMassageClick(evt) {
    var error = document.querySelector('.error');
    var success = document.querySelector('.success');

    if (document.querySelector('main').lastChild === error) {
      if (evt.currentTarget === errorButtonElement || evt.target !== document.querySelector('.error__message')) {
        closeMessage('.error');
      }
    }

    if (document.querySelector('main').lastChild === success) {
      if (evt.target !== document.querySelector('.success__message')) {
        closeMessage('.success');
      }
    }
  }

  function onCloseMassageKeyDown(evt) {
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
    var errorClone = errorTemplateElement.cloneNode(true);
    var fragment = document.createDocumentFragment();

    errorClone.querySelector('.error__message').textContent = msg;
    fragment.appendChild(errorClone);
    mainElement.appendChild(fragment);

    setTimeout(document.querySelector('.error').addEventListener('click', onCloseMassageClick), TIME_OUT);
    setTimeout(window.addEventListener('keydown', onCloseMassageKeyDown), TIME_OUT);
  }

  // появление "успешного окна"
  function showSuccessMessage() {
    var successClone = successTemplateElement.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(successClone);
    mainElement.appendChild(fragment);
    // Закрытие окна
    document.querySelector('.success').addEventListener('click', onCloseMassageClick);
    window.addEventListener('keydown', onCloseMassageKeyDown);
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
      addFormButtonElement.disabled = false;
      resetFormButtonElement.disabled = false;
      mainPinLeft = Math.round(parseInt(mainPinElement.style.left, 10) + (MAIN_PIN_WIDTH / 2));
      mainPinTop = Math.round(parseInt(mainPinElement.style.top, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT);

      changeAddressValue(mainPinLeft, mainPinTop);

      window.serverRequest.loadData(window.filter.update, showErrorMessage);
      window.mapElement.onActivePin();
      window.activeMode.isActivePage = true;
      window.formElement.onSelectRoom();
      window.formElement.onSelectType();
      return;
    }
  }

  function onActivate(evt) {
    if (evt.key === ENTER_KEY || evt.which === 1) {
      mainPinElement.removeEventListener('keydown', onActivate);
      changeOnActiveMode();
    }
  }

  mainPinElement.addEventListener('keydown', onActivate);

  mainPinElement.addEventListener('mousedown', onActivate);


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
