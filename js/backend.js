'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });
    xhr.addEventListener('error', onError);
    xhr.addEventListener('readystatechange', function () {
      if (xhr.status !== 0 && xhr.status !== 200) {
        onError();
      }
    });
    xhr.open('GET', URL + '/data');

    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', onLoad);
    xhr.addEventListener('error', onError);
    xhr.addEventListener('readystatechange', function () {
      if (xhr.status !== 0 && xhr.status !== 200) {
        onError();
      }
    });

    xhr.open('POST', URL);

    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
}());
