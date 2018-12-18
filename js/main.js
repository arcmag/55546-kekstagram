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

    function destroyMessageBlock() {
      messageBlockButton.removeEventListener('click', onMessageBlockClick);
      document.removeEventListener('click', onMessageBlockClick);
      document.removeEventListener('keyup', onMessageBlockKeyup);

      messageBlock.parentElement.removeChild(messageBlock);
    }

    function onMessageBlockClick(evt) {
      var elem = evt.target;

      if (elem.classList.contains('error') || elem.classList.contains('success') || elem.classList.contains(status + '__button')) {
        destroyMessageBlock();
      }
    }

    function onMessageBlockKeyup(evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        destroyMessageBlock();
      }
    }

    messageBlockButton.addEventListener('click', onMessageBlockClick);
    document.addEventListener('click', onMessageBlockClick);
    document.addEventListener('keyup', onMessageBlockKeyup);
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
