'use strict';

(function () {

  var ESC_KEY = 'Escape';
  var cardPopupElement = document.querySelector('#card').content.querySelector('.popup');
  var apartmentList = [
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

  var PhotoParameters = {
    WIDTH: 45,
    HEIGHT: 40
  };

  // поиск нужного типа аппартаментов
  function findTypeOfHouse(type) {
    var translate;

    for (var i = 0; i < apartmentList.length; i++) {
      if (apartmentList[i].type === type) {
        translate = apartmentList[i].translate;
        break;
      }
    }
    return translate;
  }

  // создание списка фич
  function createFeature(array) {
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
  function createPhoto(array) {
    var newFragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      var featureElement = document.createElement('img');
      featureElement.classList.add('popup__photo');
      featureElement.src = array[i];
      featureElement.width = PhotoParameters.WIDTH;
      featureElement.height = PhotoParameters.HEIGHT;
      newFragment.appendChild(featureElement);
    }
    return newFragment;
  }

  // создание карточки
  function renderCard(poster) {
    var cardCloneElement = cardPopupElement.cloneNode(true);
    var cardFeatureElement = cardCloneElement.querySelector('.popup__features');
    var cardPhotoElement = cardCloneElement.querySelector('.popup__photos');
    cardCloneElement.querySelector('.popup__avatar').src = poster.author.avatar;
    cardCloneElement.querySelector('.popup__title').textContent = poster.offer.title;
    cardCloneElement.querySelector('.popup__text--address').textContent = poster.offer.address;
    cardCloneElement.querySelector('.popup__text--price').textContent = poster.offer.price + '₽/ночь';
    cardCloneElement.querySelector('.popup__type').textContent = findTypeOfHouse(poster.offer.type);
    cardCloneElement.querySelector('.popup__text--capacity').textContent = poster.offer.rooms + ' комнаты для ' + poster.offer.guests + ' гостей';
    cardCloneElement.querySelector('.popup__text--time ').textContent = 'Заезд после ' + poster.offer.checkin + ', выезд до ' + poster.offer.checkout;
    cardFeatureElement.innerHTML = '';
    cardFeatureElement.appendChild(createFeature(poster.offer.features));
    cardPhotoElement.innerHTML = '';
    cardPhotoElement.appendChild(createPhoto(poster.offer.photos));
    cardCloneElement.querySelector('.popup__description').textContent = poster.offer.description;
    return cardCloneElement;
  }
  var allPinElement = document.querySelectorAll('.map__pin:not(.map__pin--main)');


  var mapElement = document.querySelector('.map');
  var mapFilterElement = document.querySelector('map__filters-container');

  // удаление стиля активной метки
  function remoteActivePin() {
    allPinElement.forEach(function (element) {
      element.classList.remove('map__pin--active');
    });
  }

  // удаление карточки
  function removeCard() {
    var cardOnMapElement = mapElement.querySelector('.map__card');
    if (cardOnMapElement) {
      cardOnMapElement.remove();
      remoteActivePin();
    }
  }

  function addCardToPin(posters) {
    var cardToPin = document.createDocumentFragment();
    allPinElement = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var newPin;
    var btnClose;
    var activePin;

    function onCardClick() {
      btnClose.removeEventListener('click', onCardClick);
      newPin.remove();
      remoteActivePin();
    }

    function onCardKeyDown(evt) {

      if (evt.key === ESC_KEY) {
        document.removeEventListener('keydown', onCardKeyDown);
        newPin.remove();
        remoteActivePin();
      }
    }

    posters.forEach(function (pin, index) {
      allPinElement[index].addEventListener('click', function () {
        // проверка на наличие уже открытых карточек
        var cardOnMapElement = document.querySelector('.map__card');
        activePin = document.querySelector('.map__pin--active');

        if (cardOnMapElement) {
          cardOnMapElement.remove();
          activePin.classList.remove('map__pin--active');
        }

        allPinElement[index].classList.add('map__pin--active');

        newPin = cardToPin.appendChild(renderCard(pin));
        btnClose = newPin.querySelector('.popup__close');
        mapElement.insertBefore(newPin, mapFilterElement);

        btnClose.addEventListener('click', onCardClick);

        document.addEventListener('keydown', onCardKeyDown);
      });
    });
  }

  // Экспорт функций модуля
  window.card = {
    apartmentList: apartmentList,
    addToPin: addCardToPin,
    remove: removeCard
  };
})();
