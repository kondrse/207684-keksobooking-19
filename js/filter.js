'use strict';

(function () {

  var allFilterElement = document.querySelector('.map__filters');
  var housingType = allFilterElement.elements['housing-type'];
  var housingPrice = allFilterElement.elements['housing-price'];
  var housingRooms = allFilterElement.elements['housing-rooms'];
  var housingGuests = allFilterElement.elements['housing-guests'];
  var housingFeatures = allFilterElement.querySelector('#housing-features');

  var priceTypeToRange = {
    low: {min: 0, max: 10000},
    middle: {min: 10000, max: 50000},
    high: {min: 50000, max: Number.MAX_VALUE},
  };

  var Count = {
    MIN: 0,
    MAX: 5
  };

  function isAny(value) {
    return value === 'any';
  }

  function isEqual(data, value) {
    return data === value;
  }

  function isType(data, value) {
    return isAny(value) || isEqual(data, value);
  }

  function isNumber(data, value) {
    return isAny(value) || isEqual(data, parseInt(value, 10));
  }

  function isPrice(data, value) {
    return isAny(value) || (data >= priceTypeToRange[value].min && data < priceTypeToRange[value].max);
  }

  function isFeatures(data, features) {
    var is = true;

    for (var i = 0; i < features.length; i++) {
      var element = features[i];
      if (!element.checked) {
        continue;
      }

      is = data.some(function (feature) {
        return feature === element.value;
      });

      if (!is) {
        return false;
      }
    }

    return true;
  }

  function isOffer(data) {
    return !!data.offer;
  }

  function filter(pins) {
    window.filter.posters = pins;

    var posters = []; // в этот массив будем собирать элементы, подходящие под фильтрацию


    for (var i = Count.MIN; i < pins.length; i++) {
      var pin = pins[i];
      if (isType(pin.offer.type, housingType.value)
        && isPrice(pin.offer.price, housingPrice.value)
        && isNumber(pin.offer.rooms, housingRooms.value)
        && isNumber(pin.offer.guests, housingGuests.value)
        && isFeatures(pin.offer.features, housingFeatures.elements)
        && isOffer(pin)) {
        posters.push(pins[i]);
      }
      // если в новом массиве уже 5 элементов
      if (posters.length === Count.MAX) {
        break;
      }
    }
    window.pins.addToDom(posters);
    window.card.addToPin(posters);
    return posters;
  }

  function updateFilter() {
    window.pins.delete();
    window.card.remove();
    filter(window.filter.posters);
  }

  var changeFilter = window.optimization.debaunce(updateFilter);

  allFilterElement.addEventListener('change', changeFilter);

  window.filter = {
    update: filter
  };
})();
