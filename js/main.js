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

    function destroyBlock(evt) {
      var elem = evt.target;
      if (elem.classList.contains('success') || elem.classList.contains(status + '__button') || evt.keyCode === ESC_KEYCODE) {
        messageBlockButton.removeEventListener('click', destroyBlock);
        document.removeEventListener('click', destroyBlock);
        document.removeEventListener('keyup', destroyBlock);

        messageBlock.parentElement.removeChild(messageBlock);
      }
    }

    messageBlockButton.addEventListener('click', destroyBlock);
    document.addEventListener('click', destroyBlock);
    document.addEventListener('keyup', destroyBlock);
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
