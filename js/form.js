'use strict';
(function () {
  var selectRoomElement = document.querySelector('#room_number');
  var selectGuestAllElement = document.querySelector('#capacity');
  var selectGuestElement = document.querySelectorAll('#capacity option');

  var selectTypeElement = document.querySelector('#type');
  var selectPriceElement = document.querySelector('#price');

  var selectTimeElement = document.querySelector('.ad-form__element--time').querySelectorAll('select');

  var typeOfTimeElement = {
    timein: document.querySelector('#timein'),
    timeout: document.querySelector('#timeout')
  };

  var formElement = document.querySelector('.ad-form');
  var mapElement = document.querySelector('.map');
  var filterElement = document.querySelector('.map__filters');
  var addFormButtonElement = document.querySelector('.ad-form__submit');
  var resetFormButtonElement = document.querySelector('.ad-form__reset');

  var DefaultCoordinate = {
    X: 570,
    Y: 375
  };

  var inputs = formElement.querySelectorAll('input');

  // выбор комнаты и блокировка неподходящих значений количества гостей
  function onSelectRoom(evt) {
    if (evt) {
      var count = evt.target.value;
    } else {
      count = (selectRoomElement.querySelector('option[selected]')).value;
    }

    selectGuestElement.forEach(function (option) {
      option.remove();
      if (option.value !== '0' && Number(option.value) <= Number(count)) {
        selectGuestAllElement.appendChild(option);
      }

      if (count === '100') {
        selectGuestElement.forEach(function (element) {
          element.remove();
        });
        selectGuestAllElement.appendChild(option);
      }
    });
  }

  function onSelectType(evt) {
    if (evt) {
      var type = evt.target.value;
    } else {
      type = (selectTypeElement.querySelector('option[selected]')).value;
    }

    for (var i = 0; i < window.card.apartmentList.length; i++) {
      if (window.card.apartmentList[i].type === type) {
        selectPriceElement.setAttribute('min', window.card.apartmentList[i].minPrice);
        selectPriceElement.setAttribute('placeholder', window.card.apartmentList[i].minPrice);
        break;
      }
    }
  }

  function onSelectTime(evt) {
    switch (evt.currentTarget.id) {
      case 'timein':
        typeOfTimeElement.timeout.value = evt.target.value;
        break;
      case 'timeout':
        typeOfTimeElement.timein.value = evt.target.value;
        break;
    }
  }

  function onBlockPage() {
    formElement.reset();
    filterElement.reset();
    window.photos.delete();
    onSelectType();
    onSelectRoom();
    filterElement.disabled = true;
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    window.pins.delete();
    window.card.remove();
    window.inactiveMode.disabledAllFildset();
    window.inactiveMode.mainPinElement.style.left = DefaultCoordinate.X + 'px';
    window.inactiveMode.mainPinElement.style.top = DefaultCoordinate.Y + 'px';
    window.activeMode.onDisable(document.querySelectorAll('.map__filter'), true);
    window.activeMode.onDisable(document.querySelectorAll('.map__checkbox'), true);
    window.activeMode.changeCursor(document.querySelectorAll('.map__filter'), 'default');
    window.activeMode.changeCursor(document.querySelectorAll('.map__feature'), 'default');
    addFormButtonElement.disabled = true;
    resetFormButtonElement.disabled = true;
    window.activeMode.isActivePage = false;

    inputs.forEach(function (input) {
      input.style.border = '';
    });
    window.mapElement.deleteActivePin();
  }

  onBlockPage();

  function onCheckValidityClick() {

    // Пройдёмся по всем полям
    for (var i = 0; i < inputs.length; i++) {

      var input = inputs[i];

      // Проверяю валидность поля
      if (input.checkValidity() === false) {
        input.style.border = '2px solid red';
      }
    }
    addFormButtonElement.removeEventListener('click', onCheckValidityClick);
  }

  function onSubmitDataToServer(evt) {
    evt.preventDefault();
    window.serverRequest.postData(new FormData(formElement), window.activeMode.showSuccessMessage, window.activeMode.showErrorMessage);
    onBlockPage();
  }

  selectRoomElement.addEventListener('change', onSelectRoom);
  selectTypeElement.addEventListener('change', onSelectType);
  selectTimeElement.forEach(function (time) {
    time.addEventListener('change', onSelectTime);
  });
  resetFormButtonElement.addEventListener('click', onBlockPage);
  addFormButtonElement.addEventListener('click', onCheckValidityClick);
  formElement.addEventListener('submit', onSubmitDataToServer);

  // Экспорт функций модуля
  window.formElement = {
    onSelectRoom: onSelectRoom,
    onSelectType: onSelectType,
    onBlockPage: onBlockPage
  };

})();
