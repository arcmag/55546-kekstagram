'use strict';

(function () {
  var uploadSubmit = document.querySelector('#upload-submit');

  uploadSubmit.addEventListener('click', function () {
    var hashList = window.main.textHashtags.value.split(' ');
    var hashListCopy = hashList.slice().map(function (elem) {
      return elem.toLowerCase();
    });

    if (hashList.length > 5) {
      window.main.textHashtags.setCustomValidity('Максимум 5 hashtag');
      return;
    }

    var textError = '';
    for (var i = 0; i < hashList.length; i++) {
      var hash = hashList[i];

      if (hash[0] !== '#') {
        textError = 'hashtag должны начинаться с символа #';
      } else if (hash.length === 1) {
        textError = 'hashtag должны быть символы кроме #';
      } else if (hash.length > 20) {
        textError = 'Максимальная длинная hashtag 20 символов';
      } else if (hashListCopy.indexOf(hash.toLowerCase(), i + 1) !== -1) {
        textError = 'Одинаковые hashtag недопустимы';
      }

      if (textError) {
        break;
      }
    }

    window.main.textHashtags.setCustomValidity(textError);
  });

}());
