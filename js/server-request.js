'use strict';

(function () {

  var TIMEOUT = 10000;
  var METHOD_LOAD = 'GET';
  var METHOD_SAVE = 'POST';
  var SUCCESS_CODE = 200;

  var Url = {
    get: 'https://js.dump.academy/keksobooking/data',
    post: 'https://js.dump.academy/keksobooking'
  };

  var sendXMLHttpRequest = function (url, method, data, loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    var params = data ? data : new FormData();
    xhr.send(params);
  };

  function loadData(loadHandler, errorHandler) {
    sendXMLHttpRequest(Url.get, METHOD_LOAD, false, loadHandler, errorHandler);
  }

  function postData(data, loadHandler, errorHandler) {
    sendXMLHttpRequest(Url.post, METHOD_SAVE, data, loadHandler, errorHandler);
  }

  // Экспорт данных из модуля
  window.serverRequest = {
    loadData: loadData,
    postData: postData
  };
})();
