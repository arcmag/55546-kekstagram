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

    function onDestroyBlock(evt) {
      var elem = evt.target;
      if (elem.classList.contains('success') || elem.classList.contains(status + '__button') || evt.keyCode === ESC_KEYCODE) {
        messageBlockButton.removeEventListener('click', onDestroyBlock);
        document.removeEventListener('click', onDestroyBlock);
        document.removeEventListener('keyup', onDestroyBlock);

        messageBlock.parentElement.removeChild(messageBlock);
      }
    }

    messageBlockButton.addEventListener('click', onDestroyBlock);
    document.addEventListener('click', onDestroyBlock);
    document.addEventListener('keyup', onDestroyBlock);
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
