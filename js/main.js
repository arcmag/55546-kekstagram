'use strict';

(function () {
  function getRandomInt(max, min) {
    return Math.floor((Math.random()) * (max - min + 1) + min);
  }

  function compare() {
    return Math.random() - 0.5;
  }

  window.main = {
    ESC_KEYCODE: 27,
    imgUploadPreview: document.querySelector('.img-upload__preview'),
    textHashtags: document.querySelector('.text__hashtags'),
    getRandomInt: getRandomInt,
    compare: compare,
    photosList: [],
    urlPhotoNameList: []
  };

}());
