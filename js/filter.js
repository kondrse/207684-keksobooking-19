'use strict';

(function () {
  var allFilters = document.querySelector('.map__filters');

  var filterPosters = [];

  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  var rangePrice = {
    low: function (price) {
      return price < Price.MIN;
    },
    middle: function (price) {
      return price <= Price.MAX && price >= Price.MIN;
    },
    high: function (price) {
      return price > Price.MAX;
    }
  };

  // фильтрация объявлений по выбранному значению в фильтре
  function filterByValue(dataList, filter, checkValue) {
    return dataList.filter(function (data) {
      return data.offer[filter].toString() === checkValue;
    });
  }

  function filterByPrice(dataList, checkValue) {
    return dataList.filter(function (data) {
      return rangePrice[checkValue](data.offer.price);
    });
  }

  function filterByFeatures(dataList, checkValue) {
    return dataList.filter(function (data) {
      return data.offer.features.includes(checkValue);
    });
  }

  function filterByData(data) {

    var filterSelectList = document.querySelector('.map__filters').querySelectorAll('select');
    var featuresList = document.querySelector('#housing-features').querySelectorAll('input[type="checkbox"]:checked');

    filterSelectList = Array.from(filterSelectList).filter(function (item) {
      return item.value !== 'any';
    });

    filterPosters = data;
    var newFilterList = filterPosters.slice();

    filterSelectList.forEach(function (filter) {
      switch (filter.id) {
        case 'housing-type':
          newFilterList = filterByValue(newFilterList, 'type', filter.value);
          break;
        case 'housing-price':
          newFilterList = filterByPrice(newFilterList, filter.value);
          break;
        case 'housing-rooms':
          newFilterList = filterByValue(newFilterList, 'rooms', filter.value);
          break;
        case 'housing-guests':
          newFilterList = filterByValue(newFilterList, 'guests', filter.value);
          break;
      }
    });

    featuresList.forEach(function (feature) {
      newFilterList = filterByFeatures(newFilterList, feature.value);
    });


    window.pins.addPinsToDom(newFilterList.slice(0, 5));
    window.card.addCardToPin(newFilterList.slice(0, 5));

    return newFilterList;
  }

  function updateFilter() {
    window.pins.deletePins();
    window.card.removeCard();
    filterByData(filterPosters);
  }

  var updateFillterHandler = window.optimization.debaunce(updateFilter);

  allFilters.addEventListener('change', updateFillterHandler);


  // Экспорт функций модуля
  window.filter = {
    filterByData: filterByData,
    filterPosters: filterPosters
  };
})();
