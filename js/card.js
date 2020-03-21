'use strict';

(function () {

  var ESC_KEY = 'Escape';
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');

  var apartmentsList = [
    {
      type: 'flat',
      translate: 'Квартира',
      minPrice: 1000
    },
    {
      type: 'bungalo',
      translate: 'Бунгало',
      minPrice: 0
    },
    {
      type: 'house',
      translate: 'Дом',
      minPrice: 5000
    },
    {
      type: 'palace',
      translate: 'Дворец',
      minPrice: 10000
    }
  ];

  var photoParameters = {
    width: 45,
    height: 40
  };

  // поиск нужного типа аппартаментов
  function findTypeOfHouse(type) {
    var translate;

    for (var i = 0; i < apartmentsList.length; i++) {
      if (apartmentsList[i].type === type) {
        translate = apartmentsList[i].translate;
        break;
      }
    }
    return translate;
  }

  // создание списка фич
  function createFeatures(array) {
    var newFragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');
      featureElement.classList.add('popup__feature--' + array[i]);
      newFragment.appendChild(featureElement);
    }
    return newFragment;
  }

  // список фотографийн
  function createPhotos(array) {
    var newFragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      var featureElement = document.createElement('img');
      featureElement.classList.add('popup__photo');
      featureElement.src = array[i];
      featureElement.width = photoParameters.width;
      featureElement.height = photoParameters.height;
      newFragment.appendChild(featureElement);
    }
    return newFragment;
  }

  // создание карточки
  function renderCard(poster) {
    var cardClone = cardTemplate.cloneNode(true);
    var cardFeatures = cardClone.querySelector('.popup__features');
    var cardPhotos = cardClone.querySelector('.popup__photos');
    cardClone.querySelector('.popup__avatar').src = poster.author.avatar;
    cardClone.querySelector('.popup__title').textContent = poster.offer.title;
    cardClone.querySelector('.popup__text--address').textContent = poster.offer.address;
    cardClone.querySelector('.popup__text--price').textContent = poster.offer.price + '₽/ночь';
    cardClone.querySelector('.popup__type').textContent = findTypeOfHouse(poster.offer.type);
    cardClone.querySelector('.popup__text--capacity').textContent = poster.offer.rooms + ' комнаты для ' + poster.offer.guests + ' гостей';
    cardClone.querySelector('.popup__text--time ').textContent = 'Заезд после ' + poster.offer.checkin + ', выезд до ' + poster.offer.checkout;
    cardFeatures.innerHTML = '';
    cardFeatures.appendChild(createFeatures(poster.offer.features));
    cardPhotos.innerHTML = '';
    cardPhotos.appendChild(createPhotos(poster.offer.photos));
    cardClone.querySelector('.popup__description').textContent = poster.offer.description;
    return cardClone;
  }
  var allPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');


  var map = document.querySelector('.map');
  var mapFilter = document.querySelector('map__filters-container');

  // удаление стиля активной метки
  function remoteActivePin() {
    allPins.forEach(function (element) {
      element.classList.remove('map__pin--active');
    });
  }

  // удаление карточки
  function removeCard() {
    var cardOnMap = map.querySelector('.map__card');
    if (cardOnMap) {
      cardOnMap.remove();
      remoteActivePin();
    }
  }

  function addCardToPin(posters) {
    var cardToPin = document.createDocumentFragment();
    allPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var newPin;
    var btnClose;
    var activePin;

    function onClickCard() {
      btnClose.removeEventListener('click', onClickCard);
      newPin.remove();
      remoteActivePin();
    }

    function onKeyDownCard(evt) {

      if (evt.key === ESC_KEY) {
        document.removeEventListener('keydown', onKeyDownCard);
        newPin.remove();
        remoteActivePin();
      }
    }

    posters.forEach(function (pin, index) {
      allPins[index].addEventListener('click', function () {
        // проверка на наличие уже открытых карточек
        var cardOnMap = document.querySelector('.map__card');
        activePin = document.querySelector('.map__pin--active');

        if (cardOnMap) {
          cardOnMap.remove();
          activePin.classList.remove('map__pin--active');
        }

        allPins[index].classList.add('map__pin--active');

        newPin = cardToPin.appendChild(renderCard(pin));
        btnClose = newPin.querySelector('.popup__close');
        map.insertBefore(newPin, mapFilter);

        btnClose.addEventListener('click', onClickCard);

        document.addEventListener('keydown', onKeyDownCard);
      });
    });
  }

  // Экспорт функций модуля
  window.card = {
    apartmentsList: apartmentsList,
    addToPin: addCardToPin,
    remove: removeCard
  };
})();
