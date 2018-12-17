'use strict';

(function () {
  var ESC_KEYCODE = 27;

  function createMessage(messageText, status) {
    var tmp = document.querySelector('#' + status);
    var messageBlock = tmp.content.querySelector('.' + status).cloneNode(true);
    var messageBlockTitle = messageBlock.querySelector('.' + status + '__title');
    var messageBlockButton = messageBlock.querySelector('.' + status + '__button');

    messageBlockTitle.textContent = messageText;
    document.querySelector('main').appendChild(messageBlock);

    function onMessageBlockDestroy(evt) {
      var elem = evt.target;
      if (elem.classList.contains('success') || elem.classList.contains(status + '__button') || evt.keyCode === ESC_KEYCODE) {
        messageBlockButton.removeEventListener('click', onMessageBlockDestroy);
        document.removeEventListener('click', onMessageBlockDestroy);
        document.removeEventListener('keyup', onMessageBlockDestroy);

        messageBlock.parentElement.removeChild(messageBlock);
      }
    }

    messageBlockButton.addEventListener('click', onMessageBlockDestroy);
    document.addEventListener('click', onMessageBlockDestroy);
    document.addEventListener('keyup', onMessageBlockDestroy);
  }

  function getRandomInt(max, min) {
    return Math.floor((Math.random()) * (max - min + 1) + min);
  }

  function compare() {
    return Math.random() - 0.5;
  }

  window.main = {
    ESC_KEYCODE: ESC_KEYCODE,
    imgUploadPreview: document.querySelector('.img-upload__preview'),
    createMessage: createMessage,
    getRandomInt: getRandomInt,
    compare: compare,
    urlPhotoNameList: []
  };

}());
