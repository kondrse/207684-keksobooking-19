'use strict';
(function () {
  var selectRoom = document.querySelector('#room_number');
  var selectGuestsAll = document.querySelector('#capacity');
  var selectGuests = document.querySelectorAll('#capacity option');

  var selectType = document.querySelector('#type');
  var selectPrice = document.querySelector('#price');

  var selectTime = document.querySelector('.ad-form__element--time').querySelectorAll('select');
  var form = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var filter = document.querySelector('.map__filters');
  var addFormButton = document.querySelector('.ad-form__submit');
  var resetFormButton = document.querySelector('.ad-form__reset');

  var DefaultCoords = {
    X: 570,
    Y: 375
  };


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
    window.card.apartmentsList.forEach(function (apartment) {
      if (apartment.type === evt.target.value) {
        selectPrice.setAttribute('min', apartment.minPrice);
        selectPrice.setAttribute('placeholder', apartment.minPrice);
      }
    });
  }

  function onSelectTime(evt) {
    switch (evt.currentTarget.id) {
      case 'timein':
        selectTime[1].value = evt.target.value;
        break;
      case 'timeout':
        selectTime[0].value = evt.target.value;
        break;
    }
  }

  function onBlockPage() {
    form.reset();
    filter.reset();
    filter.disabled = true;
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    window.pins.deletePins();
    window.card.removeCard();
    window.inactiveMode.disabledAllFildset();
    window.map.mainPin.style.left = DefaultCoords.X + 'px';
    window.map.mainPin.style.top = DefaultCoords.Y + 'px';
    window.activeMode.onDisable(document.querySelectorAll('.map__filter'), true);
    window.activeMode.onDisable(document.querySelectorAll('.map__checkbox'), true);
    window.activeMode.changeCursor(document.querySelectorAll('.map__filter'), 'default');
    window.activeMode.changeCursor(document.querySelectorAll('.map__feature'), 'default');
    addFormButton.disabled = true;
    resetFormButton.disabled = true;
    window.activeMode.isActivePage = false;
  }

  onBlockPage();

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
  form.addEventListener('submit', submitDataToServer);

  // Экспорт функций модуля
  window.form = {
    onSelectRoom: onSelectRoom
  };

})();
