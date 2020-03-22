'use strict';
(function () {
  var selectRoom = document.querySelector('#room_number');
  var selectGuestsAll = document.querySelector('#capacity');
  var selectGuests = document.querySelectorAll('#capacity option');

  var selectType = document.querySelector('#type');
  var selectPrice = document.querySelector('#price');

  var selectTime = document.querySelector('.ad-form__element--time').querySelectorAll('select');

  var typesOfTime = {
    timein: document.querySelector('#timein'),
    timeout: document.querySelector('#timeout')
  };

  var form = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var filter = document.querySelector('.map__filters');
  var addFormButton = document.querySelector('.ad-form__submit');
  var resetFormButton = document.querySelector('.ad-form__reset');

  var DefaultCoordinate = {
    X: 570,
    Y: 375
  };

  var inputs = form.querySelectorAll('input');

  // выбор комнаты и блокировка неподходящих значений количества гостей
  function onSelectRoom(evt) {
    if (evt) {
      var count = evt.target.value;
    } else {
      count = (selectRoom.querySelector('option[selected]')).value;
    }

    selectGuests.forEach(function (option) {
      option.remove();
      if (option.value !== '0' && Number(option.value) <= Number(count)) {
        selectGuestsAll.appendChild(option);
      }

      if (count === '100') {
        selectGuests.forEach(function (element) {
          element.remove();
        });
        selectGuestsAll.appendChild(option);
      }
    });
  }

  function onSelectType(evt) {
    if (evt) {
      var type = evt.target.value;
    } else {
      type = (selectType.querySelector('option[selected]')).value;
    }

    for (var i = 0; i < window.card.apartmentsList.length; i++) {
      if (window.card.apartmentsList[i].type === type) {
        selectPrice.setAttribute('min', window.card.apartmentsList[i].minPrice);
        selectPrice.setAttribute('placeholder', window.card.apartmentsList[i].minPrice);
        break;
      }
    }
  }

  function onSelectTime(evt) {
    switch (evt.currentTarget.id) {
      case 'timein':
        typesOfTime.timeout.value = evt.target.value;
        break;
      case 'timeout':
        typesOfTime.timein.value = evt.target.value;
        break;
    }
  }

  function onBlockPage() {
    form.reset();
    filter.reset();
    window.photos.delete();
    onSelectType();
    onSelectRoom();
    filter.disabled = true;
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    window.pins.delete();
    window.card.remove();
    window.inactiveMode.disabledAllFildset();
    window.inactiveMode.mainPin.style.left = DefaultCoordinate.X + 'px';
    window.inactiveMode.mainPin.style.top = DefaultCoordinate.Y + 'px';
    window.activeMode.onDisable(document.querySelectorAll('.map__filter'), true);
    window.activeMode.onDisable(document.querySelectorAll('.map__checkbox'), true);
    window.activeMode.changeCursor(document.querySelectorAll('.map__filter'), 'default');
    window.activeMode.changeCursor(document.querySelectorAll('.map__feature'), 'default');
    addFormButton.disabled = true;
    resetFormButton.disabled = true;
    window.activeMode.isActivePage = false;

    inputs.forEach(function (input) {
      input.style.border = '';
    });
    window.map.deleteActivePin();
  }

  onBlockPage();

  function onCheckValidity() {

    // Пройдёмся по всем полям
    for (var i = 0; i < inputs.length; i++) {

      var input = inputs[i];

      // Проверяю валидность поля
      if (input.checkValidity() === false) {
        input.style.border = '2px solid red';
      }
    }
    addFormButton.removeEventListener('click', onCheckValidity);
  }

  function submitDataToServer(evt) {
    evt.preventDefault();
    window.serverRequest.postData(new FormData(form), window.activeMode.showSuccessMessage, window.activeMode.showErrorMessage);
    onBlockPage();
  }

  selectRoom.addEventListener('change', onSelectRoom);
  selectType.addEventListener('change', onSelectType);
  selectTime.forEach(function (time) {
    time.addEventListener('change', onSelectTime);
  });
  resetFormButton.addEventListener('click', onBlockPage);
  addFormButton.addEventListener('click', onCheckValidity);
  form.addEventListener('submit', submitDataToServer);

  // Экспорт функций модуля
  window.form = {
    onSelectRoom: onSelectRoom,
    onSelectType: onSelectType,
    onBlockPage: onBlockPage
  };

})();
