'use strict';
var maxValue = 8;
var titleHouse = ['Квартира', 'Постоялый двор', 'Лачуга', 'Общежитие', 'Комуналка', 'Хостел', 'Отель', 'Часный дом'];
var typeHouse = ['palace', 'flat', 'house', 'bungalo'];
var checkInList = ['12:00', '13:00', '14:00'];
var checkOutList = ['12:00', '13:00', '14:00'];
var featuresHouse = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var descriptionHouse = ['cool', 'the best', 'so so', 'awful'];
var photosHouse = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var minValue = 0;
var maxValueX = 1200;
var maxValueY = 630;
var minValueY = 130;
var maxValue = 8;
var widthPin = 25;
var heightPin = 70;

// массив объявлений
var avatars = [];

// генерация случайного индекса (убрал + 1)
function getRandomValue(min, max) {
  var minValue = min ? min : 0;
  return minValue + Math.floor(Math.random() * (max - minValue));
}

// генерация рандомного массива (убрал - 1)
function getRandomArray(arr) {
  return arr.splice(0, getRandomValue(1, arr.length));
}

function generateNewAds() {

  for (var i = 0; i < maxValue; i++) {

    var positionX = getRandomValue(minValue, maxValueX);
    var positionY = getRandomValue(minValueY, maxValueY);

    avatars.push({
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': getRandomArray(titleHouse),
        'address': positionX.toString() + ', ' + positionY.toString(),
        'price': 5000,
        'type': typeHouse[getRandomValue(minValue, typeHouse.length)],
        'rooms': 2,
        'guests': 4,
        'checkin': checkInList[getRandomValue(minValue, checkInList.length)],
        'checkout': checkOutList[getRandomValue(minValue, checkOutList.length)],
        'features': getRandomArray(featuresHouse),
        'description': getRandomArray(descriptionHouse),
        'photos': getRandomArray(photosHouse)
      },
      'location': {
        'x': positionX,
        'y': positionY
      }});
  }
}

generateNewAds();

document.querySelector('.map').classList.remove('map--faded');

var template = document.querySelector('#pin').content.querySelector('.map__pin');

// генерируем клон из шаблона
function renderPin(pin) {
  var pinClone = template.cloneNode(true);

  pinClone.style = 'left: ' + (pin.location.x - (widthPin)) + 'px; top: ' + (pin.location.y - heightPin) + 'px;';
  pinClone.querySelector('img').src = pin.author.avatar;
  pinClone.querySelector('img').alt = pin.offer.title;
  return pinClone;
}

var mapPins = document.querySelector('.map__pins');

var fragment = document.createDocumentFragment();

// добавляем объявление в разметку
function addPinsToDOM() {
  for (var i = 0; i < avatars.length; i++) {
    fragment.appendChild(renderPin(avatars[i]));
  }
  mapPins.appendChild(fragment);
}

addPinsToDOM();
