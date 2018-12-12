'use strict';

(function () {
  // контроль над окном редактирования фотографии

  var imgUploadPreview = document.querySelector('.img-upload__preview');

  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadCancel = document.querySelector('#upload-cancel');

  var textHashtags = document.querySelector('.text__hashtags');
  var commentField = document.querySelector('.text__description');

  var scaleControlValue = document.querySelector('.scale__control--value');
  var btnScaleInc = document.querySelector('.scale__control--bigger');
  var btnScaleDec = document.querySelector('.scale__control--smaller');
  var scaleImage = 100;

  btnScaleInc.addEventListener('click', setScalePhoto);
  btnScaleDec.addEventListener('click', setScalePhoto);

  function setScalePhoto(e) {
    var elem = e ? e.currentTarget : -1;
    var offsetSteep = 25;

    if (elem !== -1) {
      if (elem.classList.contains('scale__control--smaller')) {
        scaleImage -= offsetSteep;
      } else if (elem.classList.contains('scale__control--bigger')) {
        scaleImage += offsetSteep;
      }
    }

    if (scaleImage > 100) {
      scaleImage = 100;
    } else if (scaleImage < 25) {
      scaleImage = 25;
    }

    scaleControlValue.value = scaleImage + '%';
    imgUploadPreview.style.transform = 'scale(' + (scaleImage < 100 ? '0.' + scaleImage : 1) + ')';
  }

  function showEditPictureBlock() {
    scaleImage = 100;
    setScalePhoto();

    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keyup', keydownHiddenEditPictureBlock);
  }

  function hiddenEditPictureBlock() {
    imgUploadOverlay.classList.add('hidden');

    uploadFile.value = '';
    textHashtags.value = '';

    textHashtags.style.borderColor = '';
    commentField.style.borderColor = '';

    document.removeEventListener('keyup', keydownHiddenEditPictureBlock);
  }

  function keydownHiddenEditPictureBlock(e) {
    if (document.activeElement !== textHashtags && document.activeElement !== commentField && e.keyCode === window.main.ESC_KEYCODE) {
      hiddenEditPictureBlock();
    }
  }

  uploadFile.addEventListener('change', showEditPictureBlock);
  imgUploadCancel.addEventListener('click', hiddenEditPictureBlock);

  function onLoad() {
    window.main.createMessage('Данные успешно загружены на сервер.', 'success');
  }

  function onError() {
    window.main.createMessage('Ошибка: не удалось записать данные на сервер.', 'error');
  }
  // Получаем JSON данные фотографий с свервера

  // Валидация данных хештега
  var uploadSelectImage = document.querySelector('#upload-select-image');
  var uploadSubmit = document.querySelector('#upload-submit');
  uploadSubmit.addEventListener('click', function () {
    var hashList = textHashtags.value.split(' ');
    var hashListCopy = hashList.slice().map(function (elem) {
      return elem.toLowerCase();
    });

    if (hashList.length > 5) {
      textHashtags.setCustomValidity('Максимум 5 hashtag');
      return;
    }

    var textErrorHash = '';
    for (var i = 0; i < hashList.length; i++) {
      var hash = hashList[i];

      if (!hash && hashList.length === 1) {
        break;
      }

      if (hash[0] !== '#') {
        textErrorHash = 'hashtag должны начинаться с символа #';
      } else if (hash.length === 1) {
        textErrorHash = 'hashtag должны быть символы кроме #';
      } else if (hash.length > 20) {
        textErrorHash = 'Максимальная длинная hashtag 20 символов';
      } else if (hashListCopy.indexOf(hash.toLowerCase(), i + 1) !== -1) {
        textErrorHash = 'Одинаковые hashtag недопустимы';
      }

      if (textErrorHash) {
        break;
      }
    }

    var textErrorComment = '';
    if (commentField.value.length > 140) {
      textErrorComment = 'Длина комментария не может составлять больше 140 символов';
    }

    if (textErrorComment) {
      commentField.setCustomValidity(textErrorComment);
      commentField.style.border = 'solid 2px red';
    } else if (textErrorHash) {
      textHashtags.setCustomValidity(textErrorHash);
      textHashtags.style.border = 'solid 2px red';
    } else {
      window.backend.save(new FormData(uploadSelectImage), onLoad, onError);
      hiddenEditPictureBlock();
    }
  });

}());
